export interface CommentsResponse {
  data: Comment[];
  pagination: Pagination;
}

export interface Comment {
  _id: string;
  postId: string;
  userId: UserId;
  commentText: string;
  likes: string[];
  parentId: null | ParentId;
  replies: string[];
  spamCount: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ParentId {
  _id: string;
  commentText: string;
}

export interface UserId {
  _id: string;
  name: string;
  profilePicture: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
