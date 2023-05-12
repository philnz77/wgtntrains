import { removeDuplicatesBy } from "./lang-utils";
import { Position, Route, Stop } from "./types";

export function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function extendStop(
  stop: Stop,
  userCoords: Position
): {
  stop: Stop;
  distanceToUserSquared: number;
} {
  return {
    stop,
    distanceToUserSquared:
      Math.pow(stop.stop_lat - userCoords.latitude, 2) +
      Math.pow(stop.stop_lon - userCoords.longitude, 2),
  };
}

export function filterCloseStops(
  userCoords: Position,
  stops: Stop[],
  limit: number
): Stop[] {
  const stopsExt = stops.map((stop) => extendStop(stop, userCoords));
  stopsExt.sort((a, b) => a.distanceToUserSquared - b.distanceToUserSquared);
  return stopsExt.slice(0, limit).map((ext) => ext.stop);
}

export const removeDuplicateStops = (stops: Stop[]) =>
  removeDuplicatesBy(stops, (stop) => stop.parent_station || stop.stop_code);

export function getDistanceToStopInKm(
  userCoords: Position,
  stop: Stop
): number {
  return getDistanceFromLatLonInKm(
    userCoords.latitude,
    userCoords.longitude,
    stop.stop_lat,
    stop.stop_lon
  );
}

export function getStopsDistances(
  userCoords: Position,
  stops: Stop[]
): { stop: Stop; distanceKm: number }[] {
  return removeDuplicateStops(stops)
    .map((stop) => ({
      stop,
      distanceKm: getDistanceToStopInKm(userCoords, stop),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function toNumber(str?: string | null): number | undefined {
  if (str) {
    const num = Number.parseFloat(str);
    if (!Number.isNaN(num)) {
      return num;
    }
  }
}

export function createPositionFromStrings(
  lat?: string | null,
  lon?: string | null
): Position | undefined {
  const latitude = toNumber(lat);
  const longitude = toNumber(lon);
  if (latitude !== undefined && longitude !== undefined) {
    return {
      latitude,
      longitude,
    };
  }
}

export function getClosestStopOnRoute(
  trainRoutes: { route: Route; stops: Stop[] }[],
  userCoords?: Position,
  userRoute?: string,
) : { stop: Stop; distanceKm: number } | undefined {
  if(userRoute && userCoords) {
    const trainRoute = trainRoutes.find(({route}) => route.route_short_name === userRoute)
    if (trainRoute) {
      const stopsDistances = getStopsDistances(userCoords, trainRoute.stops);
      const closest = stopsDistances
        ?.sort(({ distanceKm }) => distanceKm)[0];
      return closest
    }
  }
}