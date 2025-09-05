# Руководство по обновлению клиента для новой системы тегов

## Обзор изменений

Клиент был полностью обновлен для работы с новой серверной системой тегов. Теги теперь являются отдельными сущностями с полной информацией, а не просто строками.

## Ключевые изменения

### 1. Обновленные интерфейсы

#### Старый формат (posts.ts):
```typescript
interface Post {
  tags?: string[]; // Массив строк
}
```

#### Новый формат:
```typescript
interface Tag {
  _id: string;
  name: string;
  color: string;
  isOfficial: boolean;
}

interface Post {
  tags?: Tag[]; // Массив объектов тегов
}
```

### 2. Новый API slice для тегов

Создан `/redux/api/endpoints/tags.ts` с полным набором операций:

- `useGetTagsQuery` - получение всех тегов с фильтрацией
- `useGetPopularTagsQuery` - популярные теги
- `useSearchTagsQuery` - поиск тегов
- `useGetTagByNameQuery` - тег по имени с постами
- `useCreateTagMutation` - создание тега
- `useUpdateTagMutation` - обновление тега
- `useDeleteTagMutation` - удаление тега

### 3. Управление состоянием через RTK Query

Вместо отдельного Redux slice используется встроенное кэширование RTK Query:

- Автоматическое кэширование запросов
- Инвалидация кэша при изменениях
- Оптимистичные обновления
- Локальное состояние в компонентах

### 4. Обновленные типы

В `/types/posts.ts` добавлены:

```typescript
// Полный тег в посте
interface PostTag {
  _id: string;
  name: string;
  description?: string;
  color: string;
  usageCount: number;
  isOfficial: boolean;
  isActive: boolean;
}

// Результат поиска
interface TagSearchResult {
  tag: string;
  count: number;
  color: string;
  isOfficial: boolean;
}

// Управление тегами
interface TagManagement {
  _id: string;
  name: string;
  description?: string;
  color: string;
  posts: string[];
  createdBy: {
    _id: string;
    username: string;
    avatar?: string;
  };
  usageCount: number;
  isOfficial: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 5. Новые утилитарные функции

```typescript
// Извлечение имен тегов
export const extractTagNames = (tags: PostTag[]): string[] => {
  return tags.map(tag => tag.name);
};

// Поиск тега по имени
export const findTagByName = (tags: PostTag[], name: string): PostTag | undefined => {
  return tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
};

// Форматирование для отображения
export const formatTagForDisplay = (tag: PostTag): string => {
  return `#${tag.name}`;
};

// Сортировка по использованию
export const sortTagsByUsage = (tags: PostTag[]): PostTag[] => {
  return [...tags].sort((a, b) => b.usageCount - a.usageCount);
};

// Фильтрация официальных тегов
export const filterOfficialTags = (tags: PostTag[]): PostTag[] => {
  return tags.filter(tag => tag.isOfficial);
};
```

## Обновленные хуки

### Новые хуки в `/hooks/useTags.ts`:

#### 1. Основные операции с тегами
```typescript
// Получение популярных тегов
const { data, isLoading, error } = usePopularTags(50);

// Получение всех тегов с фильтрацией
const { data, isLoading } = useAllTags({
  search: 'react',
  isOfficial: true,
  sortBy: 'usageCount',
  sortOrder: 'desc'
});

// Поиск тегов
const { data, isLoading } = useTagSearch('javascript', 20);
```

#### 2. Работа с выбранными тегами (локальное состояние)
```typescript
const {
  selectedTags,    // string[]
  addTag,         // (tag: string) => void
  removeTag,      // (tag: string) => void
  toggleTag,      // (tag: string) => void
  setTags,        // (tags: string[]) => void
  clearTags       // () => void
} = useSelectedTags(['initial', 'tags']); // можно передать начальные теги
```

#### 3. Создание и управление тегами
```typescript
// Создание тега
const { createNewTag, isLoading, error } = useCreateTag();
const result = await createNewTag({
  name: 'react',
  description: 'React JavaScript library',
  color: '#61DAFB'
});

// Управление тегом
const { updateTag, deleteTag, isUpdating, isDeleting } = useTagManagement(tagId);
```

#### 4. Ввод тегов с автодополнением
```typescript
const {
  tags,           // string[]
  inputValue,     // string
  error,          // string | null
  suggestions,    // string[] - автодополнение
  setInputValue,  // (value: string) => void
  addTag,         // (tag: string) => boolean
  removeTag,      // (tag: string) => void
  clearTags,      // () => void
  handleInputSubmit // () => void
} = useTagInput(['initial', 'tags']);
```

## Миграция существующего кода

### 1. Обновление компонентов постов

**Старый код:**
```typescript
const renderTags = (tags: string[]) => {
  return tags.map(tag => (
    <Text key={tag}>#{tag}</Text>
  ));
};
```

**Новый код:**
```typescript
const renderTags = (tags: Tag[]) => {
  return tags.map(tag => (
    <Text key={tag._id} style={{ color: tag.color }}>
      #{tag.name}
    </Text>
  ));
};
```

### 2. Обновление фильтрации

**Старый код:**
```typescript
const { data } = useSearchPostsByTagsQuery({
  tags: ['react', 'javascript']
});
```

**Новый код остается прежним (API автоматически обрабатывает):**
```typescript
const { data } = useSearchPostsByTagsQuery({
  tags: ['react', 'javascript'] // Сервер найдет теги по именам
});
```

### 3. Обновление создания постов

Создание постов остается прежним - сервер автоматически создает теги:

```typescript
const { data } = useCreatePostMutation({
  description: 'My post',
  tags: ['react', 'javascript'] // Автоматически создадутся теги
});
```

## Новые возможности

### 1. Продвинутый поиск тегов
```typescript
const TagSearchExample = () => {
  const [query, setQuery] = useState('');
  const { data: searchResults } = useTagSearch(query);
  
  return (
    <View>
      <TextInput value={query} onChangeText={setQuery} />
      {searchResults?.data?.tags?.map(tag => (
        <TouchableOpacity key={tag.tag}>
          <Text style={{ color: tag.color }}>
            #{tag.tag} ({tag.count} использований)
            {tag.isOfficial && ' ⭐'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

### 2. Управление тегами (для админов)
```typescript
const TagManagementExample = () => {
  const { data: tags } = useAllTags({ isOfficial: false });
  const { updateTag } = useTagManagement(tagId);
  
  const makeOfficial = async (tagId: string) => {
    await updateTag({ isOfficial: true });
  };
  
  return (
    <FlatList
      data={tags?.data}
      renderItem={({ item: tag }) => (
        <View>
          <Text>{tag.name} ({tag.usageCount})</Text>
          <Button title="Сделать официальным" onPress={() => makeOfficial(tag._id)} />
        </View>
      )}
    />
  );
};
```

### 3. Цветные теги
```typescript
const ColoredTag = ({ tag }: { tag: Tag }) => (
  <View style={[styles.tag, { backgroundColor: tag.color }]}>
    <Text style={styles.tagText}>#{tag.name}</Text>
    {tag.isOfficial && <Text>⭐</Text>}
  </View>
);
```

## Управление состоянием

### RTK Query кэширование
Все состояние тегов управляется автоматически через RTK Query:

```typescript
// Данные автоматически кэшируются
const { data: tags, isLoading } = useGetPopularTagsQuery({ limit: 50 });

// Кэш автоматически инвалидируется при изменениях
const [createTag] = useCreateTagMutation(); // Очистит кэш популярных тегов

// Локальное состояние для UI
const { selectedTags, addTag, removeTag } = useSelectedTags();
```

## Обратная совместимость

Все существующие API endpoints продолжают работать:
- `useSearchPostsByTagsQuery` - принимает массив строк
- `useGetUniversalPostsQuery` - принимает массив строк в параметре tags
- Создание постов - принимает массив строк в поле tags

Сервер автоматически обрабатывает строки и создает/находит соответствующие теги.

## Что нужно обновить

1. ✅ Обновить интерфейсы для отображения тегов с цветами
2. ✅ Использовать новые хуки для автодополнения
3. ✅ Добавить поддержку официальных тегов (звездочки/значки)
4. ✅ Обновить компоненты для работы с объектами тегов вместо строк
5. ✅ Добавить админские функции управления тегами (если нужно)
6. ✅ Использовать локальное состояние вместо Redux slice

## Примеры компонентов

Все существующие компоненты `TagInput.tsx` и `TagSearch.tsx` автоматически получат новые возможности через обновленные хуки.
