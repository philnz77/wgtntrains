import { Station, StopTime, Trip } from "./types";
interface IProps {
  trip: Trip;
  stopTimes: StopTime[];
  userStation?: Station
}
//todo need to collapse Stops into stations to deal with parent id?
//or do I not de-dup stops?, go for closest stops

export default function StopTimes({ stopTimes, userStation }: IProps) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>arrival time</td>
            <td>stop id</td>
          </tr>
        </thead>
        <tbody>
          {stopTimes.map(({ id, arrival_time, stop_id }) => {
            const same = userStation?.stop_ids?.includes(stop_id)
            return (
              <tr key={id} style={{ fontWeight: same ? 'bold' : undefined }}>
                <td>{arrival_time}</td>
                <td>{stop_id}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
