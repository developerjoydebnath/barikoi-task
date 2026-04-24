import { appConfig } from "@/shared/configs/app.config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${appConfig.APP_URL}${appConfig.API_PREFIX}`,
  }),
  tagTypes: [],
  endpoints: (builder) => ({}),
})