import {
  CreatePostRequest,
  MessageResponse,
  PaginationResult,
  PopularTagsResponse,
  Post,
  PostsParams,
  SinglePostResponse,
  UpdatePostRequest,
} from "@/types/posts";
import { apiSlice } from "../apiSlice";

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation<SinglePostResponse, CreatePostRequest>({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),

    getPosts: builder.query<PaginationResult<Post>, PostsParams>({
      query: (params) => ({
        url: "/posts",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.sortBy && { sortBy: params.sortBy }),
          ...(params.sortOrder && { sortOrder: params.sortOrder }),
          ...(params.categories && {
            categories: Array.isArray(params.categories) ? params.categories.join(",") : params.categories,
          }),
          ...(params.status && {
            status: Array.isArray(params.status) ? params.status.join(",") : params.status,
          }),
          ...(params.tags && {
            tags: Array.isArray(params.tags) ? params.tags.join(",") : params.tags,
          }),
          ...(params.verified !== undefined && { verified: params.verified }),
          ...(params.userNationality && { userNationality: params.userNationality }),
          ...(params.postedPlace && { postedPlace: params.postedPlace }),
          ...(params.textSearch && { textSearch: params.textSearch }),
        },
      }),
      providesTags: ["Post"],
    }),

    getMyPosts: builder.query<PaginationResult<Post>, PostsParams>({
      query: (params) => ({
        url: "/posts/myPosts",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.sortBy && { sortBy: params.sortBy }),
          ...(params.sortOrder && { sortOrder: params.sortOrder }),
        },
      }),
      providesTags: ["Post"],
    }),

    getPost: builder.query<SinglePostResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "GET",
      }),
      providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
    }),

    updatePost: builder.mutation<SinglePostResponse, { postId: string; postData: UpdatePostRequest }>({
      query: ({ postId, postData }) => ({
        url: `/posts/${postId}`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "Post", id: postId }, "Post"],
    }),

    deletePost: builder.mutation<MessageResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),

    toggleLikePost: builder.mutation<MessageResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/toggleLike`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [{ type: "Post", id: postId }, "Post"],
    }),
    toggleSavePost: builder.mutation<MessageResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/toggleSave`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [{ type: "Post", id: postId }, "Post"],
    }),

    getPopularTags: builder.query<PopularTagsResponse, { limit?: number }>({
      query: (params = {}) => ({
        url: "/tags/popular",
        method: "GET",
        params: {
          limit: params.limit || 50,
        },
      }),
      providesTags: ["Tag"],
    }),
    setPostSpam: builder.mutation<MessageResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/spam`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetMyPostsQuery,
  useGetPostQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useToggleLikePostMutation,
  useToggleSavePostMutation,
  useGetPopularTagsQuery,
  useSetPostSpamMutation,
} = postsApiSlice;
