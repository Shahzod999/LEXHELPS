import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useSearchByTags, usePopularTags } from '../hooks/useTags';
import { PostSearchParams } from '../types/posts';

interface TagSearchProps {
  onResultsChange?: (results: any) => void;
  initialTags?: string[];
  initialSearchQuery?: string;
  placeholder?: string;
  showPopularTags?: boolean;
}

export const TagSearch: React.FC<TagSearchProps> = ({
  onResultsChange,
  initialTags = [],
  initialSearchQuery = '',
  placeholder = "Поиск по тегам или тексту...",
  showPopularTags = true
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [page, setPage] = useState(1);

  const { data: popularTagsData } = usePopularTags();

  const searchParams: PostSearchParams = useMemo(() => ({
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    searchQuery: searchQuery.trim() || undefined,
    page,
    limit: 20
  }), [selectedTags, searchQuery, page]);

  const { data: searchResults, isLoading, error } = useSearchByTags(searchParams);

  // Уведомляем родительский компонент о результатах
  React.useEffect(() => {
    onResultsChange?.(searchResults);
  }, [searchResults, onResultsChange]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      const isSelected = prev.includes(tag);
      if (isSelected) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
    setPage(1); // Сброс пагинации при изменении фильтров
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (searchResults?.pagination.hasNext) {
      setPage(prev => prev + 1);
    }
  };

  const renderPopularTag = ({ item }: { item: { tag: string; count: number } }) => {
    const isSelected = selectedTags.includes(item.tag);
    
    return (
      <TouchableOpacity
        style={[styles.popularTag, isSelected && styles.popularTagSelected]}
        onPress={() => handleTagToggle(item.tag)}
      >
        <Text style={[styles.popularTagText, isSelected && styles.popularTagTextSelected]}>
          {item.tag} ({item.count})
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSelectedTag = ({ item }: { item: string }) => (
    <View style={styles.selectedTag}>
      <Text style={styles.selectedTagText}>{item}</Text>
      <TouchableOpacity onPress={() => handleTagToggle(item)} style={styles.removeTagButton}>
        <Text style={styles.removeTagButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Поле поиска */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={placeholder}
          placeholderTextColor="#666"
        />
        {(searchQuery.length > 0 || selectedTags.length > 0) && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Очистить</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Выбранные теги */}
      {selectedTags.length > 0 && (
        <View style={styles.selectedTagsContainer}>
          <Text style={styles.sectionTitle}>Выбранные теги:</Text>
          <FlatList
            data={selectedTags}
            renderItem={renderSelectedTag}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.selectedTagsList}
          />
        </View>
      )}

      {/* Популярные теги */}
      {showPopularTags && popularTagsData?.data.popularTags && (
        <View style={styles.popularTagsContainer}>
          <Text style={styles.sectionTitle}>Популярные теги:</Text>
          <FlatList
            data={popularTagsData.data.popularTags.slice(0, 20)}
            renderItem={renderPopularTag}
            keyExtractor={(item) => item.tag}
            numColumns={2}
            style={styles.popularTagsList}
          />
        </View>
      )}

      {/* Результаты поиска */}
      <View style={styles.resultsContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1976d2" />
            <Text style={styles.loadingText}>Поиск постов...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Ошибка при поиске постов</Text>
          </View>
        )}

        {searchResults && (
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsText}>
              Найдено {searchResults.pagination.totalItems} постов
            </Text>
            {searchResults.meta.tags && (
              <Text style={styles.metaText}>
                Теги: {searchResults.meta.tags.join(', ')}
              </Text>
            )}
            {searchResults.meta.searchQuery && (
              <Text style={styles.metaText}>
                Поиск: "{searchResults.meta.searchQuery}"
              </Text>
            )}
          </View>
        )}

        {/* Кнопка "Загрузить еще" */}
        {searchResults?.pagination.hasNext && (
          <TouchableOpacity onPress={handleLoadMore} style={styles.loadMoreButton}>
            <Text style={styles.loadMoreButtonText}>Загрузить еще</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  clearButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
  },
  selectedTagsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectedTagsList: {
    flexGrow: 0,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  selectedTagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  removeTagButton: {
    marginLeft: 4,
    padding: 2,
  },
  removeTagButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popularTagsContainer: {
    marginBottom: 16,
  },
  popularTagsList: {
    flexGrow: 0,
  },
  popularTag: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    alignItems: 'center',
  },
  popularTagSelected: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#1976d2',
  },
  popularTagText: {
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
  },
  popularTagTextSelected: {
    color: '#1976d2',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  resultsInfo: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  loadMoreButton: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  loadMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
