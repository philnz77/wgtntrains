import { Stop } from "./types";

interface IProps {
  stopsDistances: {
    stop: Stop;
    distanceKm: number;
  }[];
}

export default function Stops({ stopsDistances }: IProps) {
  return (
    <table>
      <thead>
        <tr>
          <td>stop</td>
          <td>distance</td>
          <td>stop id</td>
        </tr>
      </thead>
      <tbody>
        {stopsDistances.map(({ stop, distanceKm }) => (
          <tr key={stop.stop_id}>
            <td>{stop.stop_name}</td>
            <td>{distanceKm}</td>
            <td>{stop.stop_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
