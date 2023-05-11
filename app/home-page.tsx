"use client";
import { useCallback, useState } from "react";
import { Route, Stop, Trip } from "./types";
import TrainRoutes from "./train-routes";
import {
  createPositionFromStrings,
  filterCloseStops,
  getStopsDistances,
  removeDuplicateStops,
} from "./utils";
import Stops from "./stops";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Trips from "./trips";

interface IProps {
  routes: Route[];
  stops: Stop[];
  trainRoutes: { route: Route; stops: Stop[] }[];
  trips: Trip[];
}

function getParam(searchParams: ReadonlyURLSearchParams, key: string) {
  const result = searchParams.get(key);
  if (result) {
    return result;
  }
}
export default function HomePage({
  routes,
  stops,
  trainRoutes,
  trips,
}: IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userRoute = getParam(searchParams, "route");
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
          const params = new URLSearchParams(window.location.search);
          params.set("lat", String(coords.latitude));
          params.set("lon", String(coords.longitude));
          router.push(`${window.location.pathname}?${params}`);
        },
        () => setLocationStatus("error")
      );
    }
  }, [router]);
  const routesReport = `routes len: ${routes.length}`;

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
            <Stops
              stopsDistances={getStopsDistances(
                userCoords,
                filterCloseStops(userCoords, removeDuplicateStops(stops), 5)
              )}
            />
          )}
        </div>
        <TrainRoutes
          trainRoutes={trainRoutes}
          userCoords={userCoords}
          userRoute={userRoute}
        />
      </div>
      <Trips trips={trips} />
    </main>
  );
}
