import { Place, Route, Waypoint } from "@/shared/types/types";
import { apiSlice } from "../api/apiSlice";

export const locationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<{ places: Place[] }, string>({
      query: (search: string) => `/map/autocomplete?q=${search}`
    }),
    getReverseGeocode: builder.query<{ place: Place }, { lat: string, lng: string }>({
      query: ({ lat, lng }) => `/map/reverse-geocode?latitude=${lat}&longitude=${lng}`
    }),
    getRouteOverview: builder.query<{ routes: Route[], waypoints: Waypoint[] }, { start: string, end: string, profile: string, geometries: string }>({
      query: ({ start, end, profile, geometries }) => `/map/route-overview?start=${start}&end=${end}&profile=${profile}&geometries=${geometries}`
    })
  })
})

export const { useGetLocationsQuery, useGetReverseGeocodeQuery, useLazyGetReverseGeocodeQuery, useLazyGetRouteOverviewQuery, useGetRouteOverviewQuery } = locationApi;