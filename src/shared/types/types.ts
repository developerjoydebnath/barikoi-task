import { MapLayerMouseEvent } from "react-bkoi-gl";

// map component props type
export type MapComponentProps = {
  zoom?: number;
  center?: [number, number];
  onClick?: (e: MapLayerMouseEvent) => void;
}

// barikoi place type
export interface Place {
  id?: number;
  longitude?: string | number;
  latitude?: string | number;
  address?: string;
  address_bn?: string;
  city?: string;
  city_bn?: string;
  area?: string;
  area_bn?: string;
  postCode?: string | number;
  pType?: string;
  uCode?: string;
}

export interface LineStringGeometry {
  type: "LineString";
  coordinates: [number, number][];
}

// barikoi route overview type
export interface Route {
  geometry?: string | LineStringGeometry;
  legs?: Array<{
    steps?: Array<unknown>;
    distance?: number;
    duration?: number;
    summary?: string;
    weight?: number;
  }>;
  distance?: number;
  duration?: number;
  weight_name?: string;
  weight?: number;
};

export type Waypoint = {
  hint?: string;
  distance?: number;
  name?: string | null;
  location?: [number, number];
}