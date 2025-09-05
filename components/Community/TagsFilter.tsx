import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

interface PopularTag {
  tag: string;
  count: number;
}

interface TagsFilterProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  popularTags: PopularTag[];
  isLoading?: boolean;
}

export default function TagsFilter({ selectedTags, onTagSelect, popularTags, isLoading = false }: TagsFilterProps) {
  const { colors } = useTheme();

  const renderTag = ({ item }: { item: PopularTag }) => {
    const isSelected = selectedTags.includes(item.tag);

    return (
      <TouchableOpacity
        style={[styles.tag, { backgroundColor: colors.card, borderColor: colors.border }, isSelected && { backgroundColor: colors.accent }]}
        onPress={() => onTagSelect(item.tag)}
      >
        <Text style={[styles.tagText, { color: colors.text }, isSelected && { color: "#fff", fontWeight: "600" }]}>#{item.tag}</Text>
        <Text style={[styles.tagCount, { color: colors.hint }, isSelected && { color: "#fff", opacity: 0.8 }]}>{item.count}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.hint }]}>Загрузка тегов...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {popularTags.length > 0 ? (
        <FlatList
          data={popularTags}
          renderItem={renderTag}
          keyExtractor={(item) => item.tag}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContainer}
          ItemSeparatorComponent={() => <View style={styles.tagSeparator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.hint }]}>Нет доступных тегов</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  tagsContainer: {
    paddingHorizontal: 16,
  },
  tagSeparator: {
    width: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    minHeight: 36,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 6,
  },
  tagCount: {
    fontSize: 12,
    fontWeight: "400",
    opacity: 0.7,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
