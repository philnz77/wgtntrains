import { Trip } from "./types";
interface IProps {
  trips: Trip[];
}

export default function Trips({ trips }: IProps) {
  return (
    <table>
      <thead>
        <tr>
          <td>trip id</td>
          <td>route id</td>
          <td>shape id</td>
          <td>direction id</td>
        </tr>
      </thead>
      <tbody>
        {trips.map(({ trip_id, route_id, shape_id, direction_id }) => {
          return (
            <tr key={trip_id}>
              <td>{trip_id}</td>
              <td>{route_id}</td>
              <td>{shape_id}</td>
              <td>{direction_id}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
