// Общие типы для постов и тегов

export interface SinglePostResponse {
  status: "success";
  data: Post;
}
export interface Tag {
  _id: string;
  name: string;
  color: string;
  isOfficial: boolean;
}

export interface Post {
  _id: string;
  userId: UserId;
  images: string[];
  videos: string[];
  category: Category;
  status: string;
  verified: boolean;
  userNationality: string;
  postedPlace: string;
  userAge: any;
  description: string;
  tags: Tag[];
  aiSummary: string;
  comments: string[];
  likes: string[];
  dislikes: string[];
  spamCount: string[];
  saved: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface UserId {
  _id: string;
  name: string;
  profilePicture: string;
}
export interface Category {
  _id: string;
  name: string;
  description: string;
}
//

export interface CreatePostRequest {
  description: string;
  images?: string[];
  videos?: string[];
  userNationality?: string;
  postedPlace?: string;
  userAge?: number;
  tags?: string[];
}

export interface UpdatePostRequest {
  description?: string;
  images?: string[];
  videos?: string[];
  userNationality?: string;
  postedPlace?: string;
  userAge?: number;
  tags?: string[];
  status?: string;
}

export interface PostsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  categories?: string | string[];
  status?: string | string[];
  tags?: string | string[];
  verified?: boolean;
  userNationality?: string;
  postedPlace?: string;
  textSearch?: string;
}

export interface PopularTag {
  tag: string;
  count: number;
  color: string;
  isOfficial: boolean;
}

export interface PopularTagsResponse {
  status: "success";
  data: {
    popularTags: PopularTag[];
    total: number;
  };
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters?: {
    categories?: string | string[] | null;
    status?: string | string[] | null;
    tags?: string | string[] | null;
    verified?: boolean | null;
    userNationality?: string | null;
    postedPlace?: string | null;
    textSearch?: string | null;
  };
}

export interface MessageResponse {
  status: "success";
  message: string;
}

// Интерфейс для тега в посте (полный объект из новой системы)
export interface PostTag {
  _id: string;
  name: string;
  description?: string;
  color: string;
  usageCount: number;
  isOfficial: boolean;
  isActive: boolean;
}

// Интерфейс для поиска тегов (упрощенный)
export interface TagSearchResult {
  tag: string;
  count: number;
  color: string;
  isOfficial: boolean;
}

// Интерфейс для управления тегами (полная информация)
export interface TagManagement {
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

export interface PostFilters {
  userNationality?: string;
  postedPlace?: string;
  userAge?: number;
  tags?: string[];
  searchQuery?: string;
}

export interface PostSorting {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PostPagination {
  page?: number;
  limit?: number;
}

export interface PostSearchParams extends PostPagination, PostSorting {
  tags?: string[];
  searchQuery?: string;
}

export interface UniversalPostFilters extends PostFilters {
  algorithm?: "hot" | "new" | "top" | "controversial" | "rising";
  timePeriod?: "day" | "week" | "month" | "year" | "all";
  autoDetect?: boolean;
}

export interface PostMeta {
  searchType?: "tags" | "universal";
  tags?: string[];
  searchQuery?: string;
  hasTextSearch?: boolean;
  algorithm?: string;
  timePeriod?: string;
  autoDetected?: {
    userNationality?: string;
    postedPlace?: string;
  } | null;
}

// Утилитарные функции для работы с тегами
export const normalizeTag = (tag: string): string => {
  return tag.toLowerCase().trim();
};

export const normalizeTags = (tags: string[]): string[] => {
  return tags.map(normalizeTag).filter((tag) => tag.length > 0);
};

export const formatTagsForRequest = (tags: string[] | string): string => {
  if (Array.isArray(tags)) {
    return tags.join(",");
  }
  return tags;
};

export const parseTagsFromString = (tagsString: string): string[] => {
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
};

// Константы для тегов
export const TAG_CONSTRAINTS = {
  MAX_TAGS_PER_POST: 10,
  MAX_TAG_LENGTH: 50,
  MIN_TAG_LENGTH: 2,
} as const;

// Валидация тегов
export const validateTag = (tag: string): boolean => {
  const normalized = normalizeTag(tag);
  return normalized.length >= TAG_CONSTRAINTS.MIN_TAG_LENGTH && normalized.length <= TAG_CONSTRAINTS.MAX_TAG_LENGTH;
};

export const validateTags = (tags: string[]): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];

  tags.forEach((tag) => {
    if (validateTag(tag)) {
      valid.push(normalizeTag(tag));
    } else {
      invalid.push(tag);
    }
  });

  return { valid, invalid };
};

// Утилиты для новой системы тегов
export const extractTagNames = (tags: PostTag[]): string[] => {
  return tags.map((tag) => tag.name);
};

export const findTagByName = (tags: PostTag[], name: string): PostTag | undefined => {
  return tags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
};

export const formatTagForDisplay = (tag: PostTag): string => {
  return `#${tag.name}`;
};

export const sortTagsByUsage = (tags: PostTag[]): PostTag[] => {
  return [...tags].sort((a, b) => b.usageCount - a.usageCount);
};

export const sortTagsByName = (tags: PostTag[]): PostTag[] => {
  return [...tags].sort((a, b) => a.name.localeCompare(b.name));
};

export const filterOfficialTags = (tags: PostTag[]): PostTag[] => {
  return tags.filter((tag) => tag.isOfficial);
};

export const filterActiveTags = (tags: PostTag[]): PostTag[] => {
  return tags.filter((tag) => tag.isActive);
};
