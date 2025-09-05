import { apiSlice } from "../apiSlice";

// Основные интерфейсы
interface Tag {
  _id: string;
  name: string;
  description?: string;
  color: string;
  posts: string[];
  createdBy: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  usageCount: number;
  isOfficial: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateTagRequest {
  name: string;
  description?: string;
  color?: string;
}

interface UpdateTagRequest {
  name?: string;
  description?: string;
  color?: string;
  isOfficial?: boolean;
}

interface TagsParams {
  page?: number;
  limit?: number;
  search?: string;
  isOfficial?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface SearchTagsParams {
  query: string;
  limit?: number;
}

interface TagPostsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Ответы API
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

interface SingleTagResponse {
  status: "success";
  data: Tag;
}

interface TagsResponse extends PaginationResult<Tag> {}

interface PopularTag {
  tag: string;
  count: number;
  color: string;
  isOfficial: boolean;
}

interface PopularTagsResponse {
  status: "success";
  data: {
    popularTags: PopularTag[];
    total: number;
  };
}

interface SearchTagsResponse {
  status: "success";
  data: {
    tags: PopularTag[];
    query: string;
    total: number;
  };
}

interface TagWithPostsResponse {
  status: "success";
  data: {
    tag: {
      _id: string;
      name: string;
      description?: string;
      color: string;
      usageCount: number;
      isOfficial: boolean;
      createdAt: string;
    };
    posts: PaginationResult<any>;
  };
}

interface MessageResponse {
  status: "success";
  message: string;
  data?: Tag;
}

export const tagsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Создать тег
    createTag: builder.mutation<SingleTagResponse, CreateTagRequest>({
      query: (tagData) => ({
        url: "/tags",
        method: "POST",
        body: tagData,
      }),
      invalidatesTags: ["Tag"],
    }),

    // Получить все теги с фильтрацией
    getTags: builder.query<TagsResponse, TagsParams>({
      query: (params) => ({
        url: "/tags",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.search && { search: params.search }),
          ...(params.isOfficial !== undefined && { isOfficial: params.isOfficial }),
          ...(params.isActive !== undefined && { isActive: params.isActive }),
          ...(params.sortBy && { sortBy: params.sortBy }),
          ...(params.sortOrder && { sortOrder: params.sortOrder }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Tag" as const, id: _id })),
              { type: "Tag", id: "LIST" },
            ]
          : [{ type: "Tag", id: "LIST" }],
    }),

    // Получить популярные теги
    getPopularTags: builder.query<PopularTagsResponse, { limit?: number }>({
      query: (params = {}) => ({
        url: "/tags/popular",
        method: "GET",
        params: {
          limit: params.limit || 50,
        },
      }),
      providesTags: [{ type: "Tag", id: "POPULAR" }],
    }),

    // Поиск тегов
    searchTags: builder.query<SearchTagsResponse, SearchTagsParams>({
      query: (params) => ({
        url: "/tags/search",
        method: "GET",
        params: {
          query: params.query,
          limit: params.limit || 20,
        },
      }),
      providesTags: [{ type: "Tag", id: "SEARCH" }],
    }),

    // Получить тег по ID
    getTag: builder.query<SingleTagResponse, string>({
      query: (tagId) => ({
        url: `/tags/${tagId}`,
        method: "GET",
      }),
      providesTags: (result, error, tagId) => [{ type: "Tag", id: tagId }],
    }),

    // Получить тег по имени
    getTagByName: builder.query<TagWithPostsResponse, { tagName: string; params?: TagPostsParams }>({
      query: ({ tagName, params = {} }) => ({
        url: `/tags/name/${tagName}`,
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.sortBy && { sortBy: params.sortBy }),
          ...(params.sortOrder && { sortOrder: params.sortOrder }),
        },
      }),
      providesTags: (result, error, { tagName }) => [{ type: "Tag", id: tagName }],
    }),

    // Получить посты по тегу
    getPostsByTag: builder.query<PaginationResult<any>, { tagName: string; params?: TagPostsParams }>({
      query: ({ tagName, params = {} }) => ({
        url: `/tags/name/${tagName}/posts`,
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.sortBy && { sortBy: params.sortBy }),
          ...(params.sortOrder && { sortOrder: params.sortOrder }),
        },
      }),
      providesTags: (result, error, { tagName }) => [
        { type: "Post", id: `TAG_${tagName}` },
        { type: "Tag", id: tagName },
      ],
    }),

    // Обновить тег
    updateTag: builder.mutation<SingleTagResponse, { tagId: string; tagData: UpdateTagRequest }>({
      query: ({ tagId, tagData }) => ({
        url: `/tags/${tagId}`,
        method: "PUT",
        body: tagData,
      }),
      invalidatesTags: (result, error, { tagId }) => [
        { type: "Tag", id: tagId },
        { type: "Tag", id: "LIST" },
        { type: "Tag", id: "POPULAR" },
      ],
    }),

    // Удалить тег
    deleteTag: builder.mutation<MessageResponse, string>({
      query: (tagId) => ({
        url: `/tags/${tagId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, tagId) => [
        { type: "Tag", id: tagId },
        { type: "Tag", id: "LIST" },
        { type: "Tag", id: "POPULAR" },
      ],
    }),

    // Переключить статус тега (только админы)
    toggleTagStatus: builder.mutation<MessageResponse, string>({
      query: (tagId) => ({
        url: `/tags/${tagId}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, tagId) => [
        { type: "Tag", id: tagId },
        { type: "Tag", id: "LIST" },
        { type: "Tag", id: "POPULAR" },
      ],
    }),
  }),
});

export const {
  useCreateTagMutation,
  useGetTagsQuery,
  useGetPopularTagsQuery,
  useSearchTagsQuery,
  useGetTagQuery,
  useGetTagByNameQuery,
  useGetPostsByTagQuery,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useToggleTagStatusMutation,
} = tagsApiSlice;
