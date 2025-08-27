import { UploadResponseTypes } from "@/types/uploadTypes";
import { apiSlice } from "../apiSlice";
import { QuoteRequest } from "@/types/quotes";

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadResponseTypes, FormData>({
      query: (formData) => ({
        url: "upload",
        method: "POST",
        body: formData,
      }),
    }),
    getQuotes: builder.query<QuoteRequest[], void>({
      query: () => ({
        url: "/settings/quote",
        method: "GET",
      }),
    }),
  }),
});

export const { useUploadImageMutation, useGetQuotesQuery } = uploadApiSlice;
