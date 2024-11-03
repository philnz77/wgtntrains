import HomePage from "./home-page";
import { Route, Station, Stop, StopTime, Trip } from "./types";
import { addHours, subHours } from "date-fns";
import { defaultDirection, formatInNzIso, getTripStopTimeDate, toNumber, toStations } from "./utils";
import pLimit from 'p-limit';
import { last } from "./lang-util";
function getMetlinkApiKey(): string {
  const apiKey = process.env.METLINK_API_KEY;
  if (apiKey) {
    return apiKey;
  }
  throw "no METLINK_API_KEY env var";
}

function getMetlinkHeaders() {
  return {
    "x-api-key": getMetlinkApiKey(),
  };
}

async function getRoutes(): Promise<Route[]> {
  const res = await fetch(
    "https://api.opendata.metlink.org.nz/v1/gtfs/routes",
    { headers: getMetlinkHeaders() }
  );
  const routes = await res.json();
  return routes;
}

async function getStops(): Promise<Stop[]> {
  const res = await fetch("https://api.opendata.metlink.org.nz/v1/gtfs/stops", {
    headers: getMetlinkHeaders(),
  });
  const routes = await res.json();
  return routes;
}

async function getStopsForRoute(routeId: string): Promise<Stop[]> {
  const res = await fetch(
    `https://api.opendata.metlink.org.nz/v1/gtfs/stops?route_id=${encodeURIComponent(routeId)}`,
    { headers: getMetlinkHeaders() }
  );
  const routes = await res.json();
  return routes;
}

async function getRouteStops(
  route: Route
): Promise<{ route: Route; stations: Station[] }> {
  const stops = await getStopsForRoute(route.route_id);
  return { route, stations: toStations(stops) };
}

export interface StopTimeRaw {
  id: number;
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: number;
  shape_dist_traveled: number;
  stop_headsign: string;
  pickup_type: number;
  drop_off_type: number;
  timepoint: string;
}


async function getStopsTimesForTrip(tripId: string): Promise<StopTimeRaw[]> {
  const res = await fetch(
    `https://api.opendata.metlink.org.nz/v1/gtfs/stop_times?trip_id=${encodeURIComponent(tripId)}`,
    { headers: getMetlinkHeaders() }
  );
  const stopTimes = await res.json();
  return stopTimes;
}

// 1 are they closest to wellington station?
// 1.1 yes
// if they want trains, show wgtn obviously!!
// 1.2 no
type SearchParams = {
  [key: string]: string | string[] | undefined;
}

function getStringParam(
  searchParams: SearchParams,
  key: string
): string | undefined {
  const val = searchParams[key];
  if (typeof val === "string") {
    return val;
  }
}

// function getPositionFromSearchParams(
//   searchParams: SearchParams
// ): Position | undefined {
//   const latitude = toNumber(getStringParam(searchParams, "lat"));
//   const longitude = toNumber(getStringParam(searchParams, "lon"));
//   if (latitude !== undefined && longitude !== undefined) {
//     return {
//       latitude,
//       longitude,
//     };
//   }
// }

async function getTrips(routeId: string, earlier: Date, later: Date): Promise<Trip[]> {
  const tripsUrl = `https://api.opendata.metlink.org.nz/v1/gtfs/trips?route_id=${encodeURIComponent(routeId)}&start=${formatInNzIso(
    earlier
  )}&end=${formatInNzIso(later)}`;

  const res = await fetch(tripsUrl, { headers: getMetlinkHeaders() });
  const trips = await res.json();
  return trips;
}

function toStopTime(trip: Trip, raw: StopTimeRaw): StopTime {
  const dateTime = getTripStopTimeDate(trip.date, raw.arrival_time)

  return {
    ...raw, 
    dateTime
  }
}

async function getStopTimes(
  trip: Trip,
): Promise<{ trip: Trip; stopTimes: StopTime[] }> {
  const stopTimesRaw = await getStopsTimesForTrip(trip.trip_id);
  return { trip, stopTimes: stopTimesRaw.map(raw => toStopTime(trip, raw)) };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  try{
    const _searchParams = await searchParams
    const limit = pLimit(5);
    const routesPromise = getRoutes();
    const stopsPromise = getStops();
    const routes = await routesPromise;
    const trainRoutes = routes.filter((route) => route.route_type === 2);
    const trainRoutesStops = await Promise.all(trainRoutes.map(trainRoute => limit(() => getRouteStops(trainRoute))));
    const stops = await stopsPromise;
    const route = getStringParam(_searchParams, "route");
    const userDirection = toNumber(getStringParam(_searchParams, "direction")) || defaultDirection;
    const routeId =
      route && routes.find((r) => r.route_short_name === route)?.route_id;
    //const position = getPositionFromSearchParams(searchParams);
    const now = new Date();
    const earlier = subHours(now, 3);
    const later = addHours(now, 1);
    const tripsAll = routeId ? await getTrips(routeId, earlier, later) : [];
    const trips = tripsAll.filter(trip => trip.direction_id === userDirection)
    const tripStopTimesAll = await Promise.all(trips.map(trip => limit(() => getStopTimes(trip))));
    const tripStopTimes = tripStopTimesAll.filter(({stopTimes}) => last(stopTimes).dateTime > now)
    const stations = toStations(stops)
    return (
      <HomePage
        routes={routes}
        stations={stations}
        trainRoutes={trainRoutesStops}
        trips={trips}
        tripStopTimes={tripStopTimes}
      />
    );  
  } catch (err) {
    console.log(err);
    throw err;
  }
}

