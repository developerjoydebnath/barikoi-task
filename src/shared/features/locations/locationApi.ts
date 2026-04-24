import { apiSlice } from "../api/apiSlice";


export const locationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<{ places: unknown[] }, string>({
      query: (search: string) => `/map/autocomplete?q=${search}`
    })
  })
})

export const { useGetLocationsQuery } = locationApi;