// Import your Client Component
import HomePage from "./home-page";
import { Position, Route, Stop } from "./types";
import { toNumber } from "./utils";

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
    `https://api.opendata.metlink.org.nz/v1/gtfs/stops?route_id=${routeId}`,
    { headers: getMetlinkHeaders() }
  );
  const routes = await res.json();
  return routes;
}

async function getRouteStops(
  route: Route
): Promise<{ route: Route; stops: Stop[] }> {
  const stops = await getStopsForRoute(route.route_id);
  return { route, stops };
}

// 1 are they closest to wellington station?
// 1.1 yes
// if they want trains, show wgtn obviously!!
// 1.2 no
interface SearchParams {
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

function getPositionFromSearchParams(
  searchParams: SearchParams
): Position | undefined {
  const latitude = toNumber(getStringParam(searchParams, "lat"));
  const longitude = toNumber(getStringParam(searchParams, "lon"));
  if (latitude !== undefined && longitude !== undefined) {
    return {
      latitude,
      longitude,
    };
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Fetch data directly in a Server Component
  const routesPromise = getRoutes();
  const stopsPromise = getStops();
  const routes = await routesPromise;
  const trainRoutes = routes.filter((route) => route.route_type === 2);
  const trainRoutesStops = await Promise.all(trainRoutes.map(getRouteStops));
  const stops = await stopsPromise;
  // const route = getStringParam(searchParams, "route");
  // const position = getPositionFromSearchParams(searchParams);

  return (
    <HomePage
      routes={routes}
      stops={stops}
      trainRoutes={trainRoutesStops}
    />
  );
}
