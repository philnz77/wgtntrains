import { Station, StopTime, Trip } from "./types";
import { formatInNZTimezone, isSameNzDay } from "./utils";
interface IProps {
  trip: Trip;
  stopTimes: StopTime[];
  userStation?: Station
}
//todo need to collapse Stops into stations to deal with parent id?
//or do I not de-dup stops?, go for closest stops

export default function StopTimes({ stopTimes, userStation }: IProps) {
  const now = new Date();
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>arrival</td>
            <td>stop id</td>
          </tr>
        </thead>
        <tbody>
          {stopTimes.map(({ id, stop_id, dateTime }) => {
            const same = userStation?.stop_ids?.includes(stop_id)
            const dateTimeFmt = isSameNzDay(dateTime, now) ? `HH:mm` : `E do LLL HH:mm`;
            
            return (
              <tr key={id} style={{ fontWeight: same ? 'bold' : undefined }}>
                <td>{formatInNZTimezone(dateTime, dateTimeFmt)}</td>
                <td>{stop_id}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
