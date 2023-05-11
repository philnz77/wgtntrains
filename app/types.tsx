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

export interface Position {
  latitude: number;
  longitude: number;
}

export interface Trip {
  trip_id: string;
  route_id: number;
  shape_id: string;
  direction_id: number;
}
