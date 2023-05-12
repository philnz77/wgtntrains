import { StopTime, Trip } from "./types";
interface IProps {
  trip: Trip;
  stopTimes: StopTime[];
}

export default function StopTimes({ trip, stopTimes }: IProps) {
  return (
    <div>
      {trip.route_id} {trip.trip_id}
      <table>
        <thead>
          <tr>
            <td>id</td>
            <td>trip id</td>
            <td>arrival time</td>
            <td>stop id</td>
            <td>direction id</td>
          </tr>
        </thead>
        <tbody>
          {stopTimes.map(({ id, trip_id, arrival_time, stop_id }) => {
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{trip_id}</td>
                <td>{arrival_time}</td>
                <td>{stop_id}</td>
                <td>{trip.direction_id}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
