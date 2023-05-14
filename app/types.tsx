export interface Route {
  id: number;
  route_id: string;
  route_type: number;
  route_short_name: string;
  route_long_name: string;
  route_color: string;
  route_text_color: string;
}

export interface Stop {
  id: number;
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_desc: string;
  zone_id: string;
  stop_lat: number;
  stop_lon: number;
  location_type: number;
  parent_station: string;
}

export interface Station {
  id: number;
  code: string;
  stop_ids: string[];
  name: string;
  zone_id: string;
  position: Position
}

export interface Position {
  latitude: number;
  longitude: number;
}

export interface Trip {
  trip_id: string;
  route_id: number;
  shape_id: string;
  direction_id: number;
  date: string
}

export interface StopTime {
  id: number;
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: number;
  shape_dist_traveled: number;
  stop_headsign: string;
  pickup_type: number;
  drop_off_type: number;
  timepoint: string;
  dateTime: Date
}
