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
            <td>trip id</td>
            <td>arrival time</td>
            <td>stop id</td>
          </tr>
        </thead>
        <tbody>
          {stopTimes.map(
            ({ trip_id, arrival_time, stop_id }) => {
              return (
                <tr key={trip_id}>
                  <td>{trip_id}</td>
                  <td>{arrival_time}</td>
                  <td>{stop_id}</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}
