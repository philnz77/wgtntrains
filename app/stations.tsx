import { Station } from "./types";

interface IProps {
  stationsDistances: {
    station: Station;
    distanceKm: number;
  }[];
}

export default function Stations({ stationsDistances }: IProps) {
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
        {stationsDistances.map(({ station, distanceKm }) => (
          <tr key={station.code}>
            <td>{station.name}</td>
            <td>{distanceKm}</td>
            <td>{station.stop_ids.join(',')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
