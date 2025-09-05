import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { usePopularTags } from "../../hooks/useTags";
import PostCard from "../../components/Community/PostCard";
import TagsFilter from "../../components/Community/TagsFilter";
import CommunityHeader from "../../components/Community/CommunityHeader";
import NotificationsModal from "../../components/Community/NotificationsModal";
import ThemedScreen from "@/components/ThemedScreen";
import {
  useDeletePostMutation,
  useGetPostsQuery,
  useSetPostSpamMutation,
  useToggleLikePostMutation,
  useToggleSavePostMutation,
  useUpdatePostMutation,
} from "@/redux/api/endpoints/posts";
import CommentModal from "@/components/Community/CommentModal";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectUser } from "@/redux/features/userSlice";
import { useToast } from "@/context/ToastContext";

const Community = () => {
  const [setPostSpam, { isLoading: isSettingSpam }] = useSetPostSpamMutation();
  const [deletePost, { isLoading: isDeletingPost }] = useDeletePostMutation();
  const [toggleSavePost, { isLoading: isSavingPost }] = useToggleSavePostMutation();
  const [toggleLikePost, { isLoading: isTogglingLikePost }] = useToggleLikePostMutation();
  const [updatePost, { isLoading: isUpdatingPost }] = useUpdatePostMutation();
  const user = useAppSelector(selectUser);

  const { colors } = useTheme();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommentId, setShowCommentId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { showSuccess, showError } = useToast();

  const {
    data: postsData,
    isLoading,
    refetch,
  } = useGetPostsQuery({
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    textSearch: searchQuery.trim() || undefined,
    page,
    limit: 20,
  });

  const { data: popularTagsData } = usePopularTags();

  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  const handleSearchChange = (text: string) => {
    // setSearchQuery(text);
  };

  const handleLoadMore = () => {
    if (postsData?.pagination.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) => {
      const isSelected = prev.includes(tag);
      if (isSelected) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
    setPage(1);
  };

  const handleNotificationsPress = () => {
    setShowNotifications(true);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleCommentPress = (id: string) => {
    setShowCommentId(id);
  };

  const handleCloseCommentModal = () => {
    setShowCommentId(null);
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  // ActionButtons

  const handleSpam = async (id: string) => {
    try {
      await setPostSpam(id).unwrap();
      showSuccess("Пожаловаться на пост");
    } catch (error) {
      showError("Не удалось пожаловаться на пост");
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await deletePost(id).unwrap();
      showSuccess("Пост удален");
    } catch (error) {
      showError("Не удалось удалить пост");
    }
  };
  const handleSave = async (id: string) => {
    try {
      await toggleSavePost(id).unwrap();
      showSuccess("Пост сохранен");
    } catch (error) {
      showError("Не удалось сохранить пост");
      console.log(error);
    }
  };
  const handleLike = async (id: string) => {
    try {
      await toggleLikePost(id).unwrap();
      showSuccess("Пост лайкнут");
    } catch (error) {
      showError("Не удалось лайкнуть пост");
    }
  };

  const handleEditPost = async (id: string) => {
    try {
      await updatePost({ postId: id, postData: { status: "pending" } }).unwrap();
      showSuccess("Пост отредактирован");
    } catch (error) {
      showError("Не удалось отредактировать пост");
    }
  };

  const renderPost = ({ item }: { item: any }) => (
    <PostCard
      currentUserId={user?._id || ""}
      post={item}
      onPress={() => {
        router.push(`/post/${item._id}`);
      }}
      onSpam={handleSpam}
      onDelete={handleDelete}
      onSave={handleSave}
      onLike={handleLike}
      onComment={handleCommentPress}
      onEdit={handleEditPost}
    />
  );

  const renderFooter = () => {
    if (!postsData?.pagination.hasNextPage) return null;
    return (
      <TouchableOpacity style={[styles.loadMore, { backgroundColor: colors.card }]} onPress={handleLoadMore}>
        <Text style={[styles.loadMoreText, { color: colors.hint }]}>Загрузить еще</Text>
        <Ionicons name="chevron-down" size={16} color={colors.hint} />
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.hint }]}>Загрузка постов...</Text>
      </View>
    );
  }

  return (
    <ThemedScreen>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Community Header */}
        <CommunityHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onNotificationsPress={handleNotificationsPress}
          onFilterPress={handleFilterToggle}
        />

        {showFilters && (
          <TagsFilter selectedTags={selectedTags} onTagSelect={handleTagSelect} popularTags={popularTagsData?.data.popularTags || []} />
        )}

        {(selectedTags.length > 0 || searchQuery.trim()) && (
          <View style={styles.activeFilters}>
            {searchQuery.trim() && (
              <View style={[styles.activeFilter, { backgroundColor: colors.userAccent, borderColor: colors.accent }]}>
                <Text style={[styles.activeFilterText, { color: colors.accent }]}>"{searchQuery}"</Text>
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close" size={16} color={colors.accent} />
                </TouchableOpacity>
              </View>
            )}
            {selectedTags.map((tag) => (
              <View key={tag} style={[styles.activeFilter, { backgroundColor: colors.userAccent, borderColor: colors.accent }]}>
                <Text style={[styles.activeFilterText, { color: colors.accent }]}>#{tag}</Text>
                <TouchableOpacity onPress={() => handleTagSelect(tag)}>
                  <Ionicons name="close" size={16} color={colors.accent} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Posts List */}
        <FlatList
          data={postsData?.data || []}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
          style={styles.postsList}
          refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.postsContainer}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubbles-outline" size={64} color={colors.border} />
                <Text style={[styles.emptyText, { color: colors.hint }]}>Пока нет постов</Text>
                <Text style={[styles.emptySubtext, { color: colors.hint }]}>Попробуйте изменить фильтры или создайте первый пост</Text>
              </View>
            ) : null
          }
        />

        {/* Create Post Button */}
        <TouchableOpacity style={[styles.createButton, { backgroundColor: colors.accent }]} onPress={() => router.push("/create-post")}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Notifications Modal */}
        <NotificationsModal visible={showNotifications} onClose={handleCloseNotifications} />

        {/* Comment Modal */}
        <CommentModal id={showCommentId} onClose={handleCloseCommentModal} />
      </View>
    </ThemedScreen>
  );
};

export default Community;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  activeFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  activeFilter: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
  },
  activeFilterText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  postsList: {
    flex: 1,
  },
  postsContainer: {
    paddingBottom: 80,
  },
  loadMore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  loadMoreText: {
    fontSize: 16,
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  createButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});
