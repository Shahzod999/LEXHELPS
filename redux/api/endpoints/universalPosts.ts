import { CategoriesResponse, RecommendedPostsParams, RecommendedPostsResponse } from "@/types/category";
import { apiSlice } from "../apiSlice";

export const universalPostsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendedPosts: builder.query<RecommendedPostsResponse, RecommendedPostsParams>({
      query: (params) => ({
        url: "/universal-posts/recommended",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }),
      providesTags: ["Post"],
    }),
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: "/postCategories",
      }),
      providesTags: ["Post"],
    }),
  }),
});

export const { useGetRecommendedPostsQuery, useGetCategoriesQuery } = universalPostsApiSlice;
