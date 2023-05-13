import { Station, StopTime, Trip } from "./types";
interface IProps {
  trip: Trip;
  stopTimes: StopTime[];
  userStation?: Station
}
//todo need to collapse Stops into stations to deal with parent id?
//or do I not de-dup stops?, go for closest stops

export default function StopTimes({ trip, stopTimes, userStation }: IProps) {
  return (
    <div>
      {trip.route_id} {trip.trip_id} {stopTimes.length}
      <table>
        <thead>
          <tr>
            <td>id</td>
            <td>trip id</td>
            <td>arrival time</td>
            <td>stop id</td>
            <td>direction id</td>
            <td>user stop ids</td>
          </tr>
        </thead>
        <tbody>
          {stopTimes.map(({ id, trip_id, arrival_time, stop_id }) => {
            const same = userStation?.stop_ids?.includes(stop_id)
            return (
              <tr key={id} style={{ fontWeight: same ? 'bold' : undefined }}>
                <td>{id}</td>
                <td>{trip_id}</td>
                <td>{arrival_time}</td>
                <td>{stop_id}</td>
                <td>{trip.direction_id}</td>
                <td>{userStation?.stop_ids?.join(',')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
