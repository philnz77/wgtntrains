import Stops from "./stops";
import { Position, Route, Stop } from "./types";
import { getStopsDistances } from "./utils";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
interface IProps {
  trainRoutes: { route: Route; stops: Stop[] }[];
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
  const trainRoutesStopsDistances = trainRoutes.map((trainRoute) => {
    const stopsDistances =
      userCoords && getStopsDistances(userCoords, trainRoute.stops);
    const closest = stopsDistances
      ?.map(({ distanceKm }) => distanceKm)
      .sort()[0];
    return {
      trainRoute,
      stopsDistances,
      closest,
    };
  });
  const distanceToClosestStop = trainRoutesStopsDistances
    .map(({ closest }) => closest)
    .sort()[0];
  const limitKm = distanceToClosestStop && distanceToClosestStop + 1;
  const trainRoutesClose = trainRoutesStopsDistances.map(
    ({ trainRoute, stopsDistances }) => ({
      trainRoute,
      stopsDistances: stopsDistances?.filter(
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
        {trainRoutesClose.map(({ trainRoute: { route }, stopsDistances }) => {
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
                {stopsDistances && stopsDistances.length > 0 && (
                  <Stops stopsDistances={stopsDistances} />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
