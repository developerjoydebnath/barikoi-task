import { Place } from "@/shared/types/types";
import { apiSlice } from "../api/apiSlice";

export const locationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<{ places: Place[] }, string>({
      query: (search: string) => `/map/autocomplete?q=${search}`
    }),
    getReverseGeocode: builder.query<{ place: Place }, { lat: string, lng: string }>({
      query: ({ lat, lng }) => `/map/reverse-geocode?latitude=${lat}&longitude=${lng}`
    })
  })
})

export const { useGetLocationsQuery, useGetReverseGeocodeQuery } = locationApi;