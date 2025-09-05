import { useMemo, useState } from 'react';
import {
  useSearchPostsByTagsQuery,
  useGetPopularTagsQuery
} from '../redux/api/endpoints/posts';
import {
  useGetUniversalPostsQuery,
  useGetPopularFiltersQuery
} from '../redux/api/endpoints/universalPosts';
import {
  useGetTagsQuery,
  useSearchTagsQuery,
  useGetTagByNameQuery,
  useGetPostsByTagQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from '../redux/api/endpoints/tags';
import { PostSearchParams, UniversalPostFilters, normalizeTag, normalizeTags } from '../types/posts';

// Хук для поиска постов по тегам
export const useSearchByTags = (params: PostSearchParams) => {
  const normalizedParams = useMemo(() => ({
    ...params,
    tags: params.tags ? normalizeTags(params.tags) : undefined
  }), [params]);

  return useSearchPostsByTagsQuery(normalizedParams);
};

// Хук для получения популярных тегов (обновлен для новой системы)
export const usePopularTags = (limit = 50) => {
  return useGetPopularTagsQuery({ limit });
};

// Хук для получения всех тегов с фильтрацией
export const useAllTags = (params: {
  page?: number;
  limit?: number;
  search?: string;
  isOfficial?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} = {}) => {
  return useGetTagsQuery(params);
};

// Хук для поиска тегов
export const useTagSearch = (query: string, limit = 20) => {
  return useSearchTagsQuery(
    { query, limit },
    { skip: !query || query.length < 2 }
  );
};

// Хук для получения тега по имени с постами
export const useTagByName = (tagName: string, params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useGetTagByNameQuery(
    { tagName, params },
    { skip: !tagName }
  );
};

// Хук для получения постов по тегу
export const usePostsByTag = (tagName: string, params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useGetPostsByTagQuery(
    { tagName, params },
    { skip: !tagName }
  );
};

// Хук для работы с выбранными тегами (локальное состояние)
export const useSelectedTags = (initialTags: string[] = []) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  const addTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev : [...prev, tag]
    );
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const setTags = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  return {
    selectedTags,
    addTag,
    removeTag,
    toggleTag,
    setTags,
    clearTags,
  };
};

// Хук для создания тегов
export const useCreateTag = () => {
  const [createTag, { isLoading, error }] = useCreateTagMutation();

  const createNewTag = async (tagData: {
    name: string;
    description?: string;
    color?: string;
  }) => {
    try {
      const result = await createTag(tagData).unwrap();
      return { success: true, data: result.data };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    createNewTag,
    isLoading,
    error,
  };
};

// Хук для управления тегом
export const useTagManagement = (tagId: string) => {
  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();
  const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();

  const updateTagData = async (tagData: {
    name?: string;
    description?: string;
    color?: string;
    isOfficial?: boolean;
  }) => {
    try {
      const result = await updateTag({ tagId, tagData }).unwrap();
      return { success: true, data: result.data };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const deleteTagData = async () => {
    try {
      await deleteTag(tagId).unwrap();
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    updateTag: updateTagData,
    deleteTag: deleteTagData,
    isUpdating,
    isDeleting,
  };
};

// Хук для работы с тегами в форме создания/редактирования поста
export const useTagInput = (initialTags: string[] = []) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Используем поиск тегов для автодополнения
  const { data: searchResults } = useTagSearch(inputValue);

  const addTag = (tag: string) => {
    const normalizedTag = normalizeTag(tag);
    
    if (!normalizedTag) {
      setError('Тег не может быть пустым');
      return false;
    }
    
    if (tags.includes(normalizedTag)) {
      setError('Этот тег уже добавлен');
      return false;
    }
    
    if (tags.length >= 10) {
      setError('Максимум 10 тегов');
      return false;
    }
    
    setTags(prev => [...prev, normalizedTag]);
    setInputValue('');
    setError(null);
    return true;
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
    setError(null);
  };

  const clearTags = () => {
    setTags([]);
    setInputValue('');
    setError(null);
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      addTag(inputValue.trim());
    }
  };

  // Предложения для автодополнения
  const suggestions = useMemo(() => {
    if (!inputValue || inputValue.length < 2) return [];
    return searchResults?.data?.tags?.map(t => t.tag).slice(0, 5) || [];
  }, [inputValue, searchResults]);

  return {
    tags,
    inputValue,
    error,
    suggestions,
    setInputValue,
    addTag,
    removeTag,
    clearTags,
    handleInputSubmit,
    setTags,
  };
};

// Хук для получения популярных фильтров (включая теги)
export const usePopularFilters = () => {
  return useGetPopularFiltersQuery();
};

// Хук для универсального поиска с тегами
export const useUniversalPostsWithTags = (params: UniversalPostFilters & { page?: number; limit?: number }) => {
  const normalizedParams = useMemo(() => ({
    ...params,
    tags: params.tags ? normalizeTags(params.tags) : undefined
  }), [params]);

  return useGetUniversalPostsQuery(normalizedParams);
};

// Хук для получения рекомендованных тегов
export const useRecommendedTags = () => {
  const { data: popularTagsData, isLoading, error } = useGetPopularTagsQuery({ limit: 20 });

  return {
    recommendedTags: popularTagsData?.data?.popularTags || [],
    isLoading,
    error
  };
};