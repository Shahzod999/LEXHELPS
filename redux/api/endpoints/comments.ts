import { Comment } from "@/types/comments";
import { apiSlice } from "../apiSlice";

interface CreateCommentRequest {
  commentText: string;
}

interface CreateReplyRequest {
  replyText: string;
}

interface UpdateCommentRequest {
  commentText: string;
}

interface CommentsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface PaginationResult<T> {
  status: "success";
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
}

interface SingleCommentResponse {
  status: "success";
  data: Comment;
}

interface MessageResponse {
  status: "success";
  message: string;
}

interface ToggleLikeResponse {
  status: "success";
  message: string;
  isLiked: boolean;
  likesCount: number;
}

export const commentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation<SingleCommentResponse, { postId: string; commentData: CreateCommentRequest }>({
      query: ({ postId, commentData }) => ({
        url: `/comments/${postId}/comments`,
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: ["Comment", "Post"],
    }),

    getComments: builder.query<PaginationResult<Comment>, { postId: string; params?: CommentsParams }>({
      query: ({ postId, params }) => ({
        url: `/comments/${postId}/comments`,
        method: "GET",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          ...(params?.sortBy && { sortBy: params.sortBy }),
          ...(params?.sortOrder && { sortOrder: params.sortOrder }),
        },
      }),
      providesTags: ["Comment", "Post", "Reply"],
    }),

    getComment: builder.query<SingleCommentResponse, string>({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: "GET",
      }),
      providesTags: ["Comment", "Post", "Reply"],
    }),

    deleteComment: builder.mutation<MessageResponse, string>({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment", "Post", "Reply"],
    }),

    toggleLikeComment: builder.mutation<ToggleLikeResponse, string>({
      query: (commentId) => ({
        url: `/comments/${commentId}/toggle-like`,
        method: "POST",
      }),
      invalidatesTags: ["Comment"],
    }),

    createReply: builder.mutation<SingleCommentResponse, { commentId: string; replyData: CreateReplyRequest }>({
      query: ({ commentId, replyData }) => ({
        url: `/comments/${commentId}/replies`,
        method: "POST",
        body: replyData,
      }),
      invalidatesTags: ["Comment", "Reply", "Post"],
    }),

    getReplies: builder.query<PaginationResult<Comment>, { commentId: string; params?: CommentsParams }>({
      query: ({ commentId, params }) => ({
        url: `/comments/${commentId}/replies`,
        method: "GET",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          ...(params?.sortBy && { sortBy: params.sortBy }),
          ...(params?.sortOrder && { sortOrder: params.sortOrder }),
        },
      }),
      providesTags: ["Reply", "Comment", "Post"],
    }),
    setCommentSpam: builder.mutation<MessageResponse, string>({
      query: (commentId) => ({
        url: `/comments/${commentId}/spam`,
        method: "POST",
      }),
      invalidatesTags: ["Comment", "Post"],
    }),

    updateComment: builder.mutation<SingleCommentResponse, { commentId: string; commentData: UpdateCommentRequest }>({
      query: ({ commentId, commentData }) => ({
        url: `/comments/${commentId}`,
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: ["Comment", "Post", "Reply"],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentsQuery,
  useGetCommentQuery,
  useDeleteCommentMutation,
  useToggleLikeCommentMutation,
  useCreateReplyMutation,
  useGetRepliesQuery,
  useSetCommentSpamMutation,
  useUpdateCommentMutation,
} = commentsApiSlice;
