"use client";
import { useCallback, useState } from "react";
import { Route, Station, StopTime, Trip } from "./types";
import TrainRoutes from "./train-routes";
import StopTimes from "./stop-times";
import {
  createPositionFromStrings,
  defaultDirection,
  getClosestStationOnRoute,
  getStationsDistances,
  toNumber,
} from "./utils";
import LinkToggle from "./link-toggle";
import Stations from "./stations";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Trips from "./trips";
import { urlWithOverriddenQueryParams } from "./browser-utils";

interface IProps {
  routes: Route[];
  stations: Station[];
  trainRoutes: { route: Route; stations: Station[] }[];
  trips: Trip[];
  tripStopTimes: { trip: Trip; stopTimes: StopTime[] }[];
}

function getParam(searchParams: ReadonlyURLSearchParams, key: string) {
  const result = searchParams.get(key);
  if (result) {
    return result;
  }
}

export default function HomePage({
  routes,
  stations,
  trainRoutes,
  trips,
  tripStopTimes,
}: IProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userRoute = getParam(searchParams, "route");
  const userDirection = toNumber(getParam(searchParams, "direction")) || defaultDirection;
  const userCoords = createPositionFromStrings(
    getParam(searchParams, "lat"),
    getParam(searchParams, "lon")
  );
  const [locationStatus, setLocationStatus] = useState<string>(
    userCoords ? "ok" : "init"
  );
  const onUpdateLocationClicked = useCallback(() => {
    setLocationStatus("loading");
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { coords } = position;
          setLocationStatus("ok");
          router.push(
            urlWithOverriddenQueryParams({
              lat: coords.latitude,
              lon: coords.longitude,
            })
          );
        },
        () => setLocationStatus("error")
      );
    }
  }, [router]);
  const routesReport = `routes len: ${routes.length}`;

  const closestStationOnRoute = getClosestStationOnRoute(trainRoutes, userCoords, userRoute)
  function toHref(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    return `${pathname}?${params}`;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center">
        <p className={`m-0 max-w-[30ch] text-sm opacity-90`}>
          {routesReport} <br />
          my location {locationStatus} <br />
          Lets go <br />
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          onClick={onUpdateLocationClicked}
        >
          get location
        </button>
        <div>
          <p className={`m-0 max-w-[30ch] text-sm opacity-90`}>
            Latitude: {userCoords?.latitude} °, Longitude:{" "}
            {userCoords?.longitude} °
          </p>
          {userCoords && (
            <Stations
              stationsDistances={getStationsDistances(
                userCoords,
                stations
              ).slice(0,5)}
            />
          )}
        </div>
        <TrainRoutes
          trainRoutes={trainRoutes}
          userCoords={userCoords}
          userRoute={userRoute}
        />
      </div>
      {(closestStationOnRoute) && <div>
        Closest stop is {closestStationOnRoute.station.name}, is {closestStationOnRoute.distanceKm} away
      </div>}
      <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <LinkToggle href={toHref("direction", "0")} last={false} selected={userDirection === 0}>Outbound</LinkToggle>
        <LinkToggle href={toHref("direction", "1")} last={true} selected={userDirection === 1}>Inbound</LinkToggle>
      </ul>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">trips</h1>
      <Trips trips={trips} />
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">stop times</h1>
      {tripStopTimes.map(({ trip, stopTimes }) => (
        <StopTimes key={trip.trip_id} trip={trip} stopTimes={stopTimes} userStation={closestStationOnRoute?.station}/>
      ))}
    </main>
  );
}
