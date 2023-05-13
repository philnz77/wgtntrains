import { Position, Route, Station, Stop } from "./types";

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

export const getStationCode = (stop: Stop) => stop.parent_station || stop.stop_code;
export const maybeGetStationCode = (stop?: Stop) => stop && getStationCode(stop);

export function toStations(stops: Stop[]) : Station[]{
  const stations: Station[] = [];
  const parentToStation = new Map<string, Station>()
  stops.forEach((stop) => {
    const {parent_station} = stop
    let station = parent_station && parentToStation.get(parent_station);
    if (station) {
      station.stop_ids.push(stop.stop_id) 
    } else {
      station = {
        id: stop.id,
        code: getStationCode(stop),
        stop_ids: [stop.stop_id],
        name: stop.stop_name,
        zone_id: stop.zone_id,
        position: {
          latitude: stop.stop_lat,
          longitude: stop.stop_lon  
        }
      }
      if(parent_station) {
        parentToStation.set(parent_station, station)
      }
      stations.push(station);
    }
  })
  return stations;
}  

export function getDistanceToStopInKm(
  userCoords: Position,
  station: Station
): number {
  return getDistanceFromLatLonInKm(
    userCoords.latitude,
    userCoords.longitude,
    station.position.latitude,
    station.position.longitude
  );
}

export function getStationsDistances(
  userCoords: Position,
  stations: Station[]
): { station: Station; distanceKm: number }[] {
  return stations.map((station) => ({
      station,
      distanceKm: getDistanceToStopInKm(userCoords, station),
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

export function getClosestStationOnRoute(
  trainRoutes: { route: Route; stations: Station[] }[],
  userCoords?: Position,
  userRoute?: string,
) : { station: Station; distanceKm: number } | undefined {
  if(userRoute && userCoords) {
    const trainRoute = trainRoutes.find(({route}) => route.route_short_name === userRoute)
    if (trainRoute) {
      const stationsDistances = getStationsDistances(userCoords, trainRoute.stations);
      const closest = stationsDistances
        ?.sort(({ distanceKm }) => distanceKm)[0];
      return closest
    }
  }
}

export const defaultDirection = 0;