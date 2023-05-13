import Stations from "./stations";
import { Position, Route, Station } from "./types";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { getStationsDistances } from "./utils";
interface IProps {
  trainRoutes: { route: Route; stations: Station[] }[];
  userCoords?: Position;
  userRoute?: string;
}

export default function TrainRoutes({
  trainRoutes,
  userCoords,
  userRoute,
}: IProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const trainRoutesStationsDistances = trainRoutes.map((trainRoute) => {
    const stationsDistances =
      userCoords && getStationsDistances(userCoords, trainRoute.stations);
    const closest = stationsDistances
      ?.map(({ distanceKm }) => distanceKm)
      .sort()[0];
    return {
      trainRoute,
      stationsDistances: stationsDistances,
      closest,
    };
  });
  const distanceToClosestStop = trainRoutesStationsDistances
    .map(({ closest }) => closest)
    .sort()[0];
  const limitKm = distanceToClosestStop && distanceToClosestStop + 1;
  const trainRoutesClose = trainRoutesStationsDistances.map(
    ({ trainRoute, stationsDistances }) => ({
      trainRoute,
      stationsDistances: stationsDistances?.filter(
        ({ distanceKm }) => limitKm && distanceKm < limitKm
      ),
    })
  );
  function toHref(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    return `${pathname}?${params}`;
  }

  return (
    <div>
      <div>Limit km {limitKm}</div>
    <table>
      <thead>
        <tr>
          <td>short name</td>
          <td>long name</td>
          <td>route id</td>
          <td>close stops</td>
        </tr>
      </thead>
      <tbody>
        {trainRoutesClose.map(({ trainRoute: { route }, stationsDistances }) => {
          return (
            <tr
              key={route.id}
              style={{
                color: `#${route.route_color}`,
                backgroundColor: `#${route.route_text_color}${
                  userRoute === route.route_short_name ? "80" : "FF"
                }`,
              }}
            >
              <td>
                <Link href={toHref("route", route.route_short_name)}>
                  {route.route_short_name}
                </Link>
              </td>
              <td>{route.route_long_name}</td>
              <td>{route.route_id}</td>
              <td>
                {stationsDistances && stationsDistances.length > 0 && (
                  <Stations stationsDistances={stationsDistances} />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
}
