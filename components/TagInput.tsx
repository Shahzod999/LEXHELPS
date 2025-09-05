import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useTagInput } from "../hooks/useTags";
import { validateTag, TAG_CONSTRAINTS } from "../types/posts";

interface TagInputProps {
  initialTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  showSuggestions?: boolean;
  disabled?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
  initialTags = [],
  onTagsChange,
  placeholder = "Добавить тег...",
  maxTags = TAG_CONSTRAINTS.MAX_TAGS_PER_POST,
  showSuggestions = true,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const { tags, addTag, removeTag } = useTagInput(initialTags);

  const hasTag = (tag: string) => tags.includes(tag);

  // Уведомляем родительский компонент об изменениях
  React.useEffect(() => {
    onTagsChange?.(tags);
  }, [tags, onTagsChange]);

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && validateTag(trimmedValue) && tags.length < maxTags) {
      addTag(trimmedValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === "Enter" || event.nativeEvent.key === ",") {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleSuggestionPress = (tag: string) => {
    if (!hasTag(tag) && tags.length < maxTags) {
      addTag(tag);
    }
  };

  const renderTag = ({ item: tag }: { item: string }) => (
    <View style={[styles.tag, { backgroundColor: colors.userAccent }]}>
      <Text style={[styles.tagText, { color: colors.accent }]}>{tag}</Text>
      {!disabled && (
        <TouchableOpacity onPress={() => removeTag(tag)} style={styles.removeButton}>
          <Text style={[styles.removeButtonText, { color: colors.accent }]}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Выбранные теги */}
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <FlatList
            data={tags}
            renderItem={renderTag}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsList}
          />
        </View>
      )}

      {/* Поле ввода */}
      {!disabled && tags.length < maxTags && (
        <View style={[styles.inputContainer, { borderColor: colors.card }]}>
          <TextInput
            style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={placeholder}
            placeholderTextColor={colors.hint}
            onKeyPress={handleKeyPress}
            onBlur={handleAddTag}
            maxLength={TAG_CONSTRAINTS.MAX_TAG_LENGTH}
          />
          {inputValue.length > 0 && (
            <TouchableOpacity onPress={handleAddTag} style={styles.addButton}>
              <Text style={[styles.addButtonText, { color: colors.accent }]}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Счетчик тегов */}
      <Text style={[styles.counter, { color: colors.hint }]}>
        {tags.length}/{maxTags} тегов
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  tagsContainer: {
    marginBottom: 8,
  },
  tagsList: {
    flexGrow: 0,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
  },
  removeButton: {
    marginLeft: 4,
    padding: 2,
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 4,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    padding: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  counter: {
    fontSize: 12,
    textAlign: "right",
    marginBottom: 8,
  },
});
