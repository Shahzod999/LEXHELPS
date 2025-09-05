import { PaginationResult, Post } from "./posts";

export interface CategoriesResponse {
  status: "success";
  data: Category[];
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

//

export interface RecommendedPostsParams {
  page?: number;
  limit?: number;
}

export interface RecommendedPostsResponse extends PaginationResult<Post> {
  meta: {
    recommendationType: "mixed";
    userFilter: Record<string, any>;
    algorithms: Array<{
      algorithm: string;
      weight: number;
      timePeriod: string;
    }>;
  };
}
