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