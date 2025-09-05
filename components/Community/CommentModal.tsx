import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, FlatList } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useCreateReplyMutation,
  useToggleLikeCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "../../redux/api/endpoints/comments";
import CommentCard from "../../components/Community/CommentCard";
import LoadingScreen, { Loading } from "@/components/common/LoadingScreen";
import { useTheme } from "@/context/ThemeContext";
import Keyboard from "../Keyboard";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectUser } from "@/redux/features/userSlice";
import { useToast } from "@/context/ToastContext";

type CommentSort = "new" | "top" | "controversial";

export default function CommentModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { colors } = useTheme();
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentSort, setCommentSort] = useState<CommentSort>("top");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const user = useAppSelector(selectUser);
  const commentInputRef = useRef<TextInput>(null);

  const [toggleLikeComment, { isLoading: isLikingComment }] = useToggleLikeCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();
  const [updateComment, { isLoading: isUpdatingComment }] = useUpdateCommentMutation();

  const { showSuccess, showError } = useToast();

  const { data: commentsData, isLoading: isCommentsLoading } = useGetCommentsQuery(
    {
      postId: id || "",
      params: {
        sortBy: commentSort === "new" ? "createdAt" : "likes",
        sortOrder: "desc",
        limit: 50,
      },
    },
    { skip: !id }
  );

  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  const [createReply, { isLoading: isCreatingReply }] = useCreateReplyMutation();

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !id) return;

    try {
      if (replyingTo) {
        await createReply({ commentId: replyingTo, replyData: { replyText: commentText.trim() } }).unwrap();
      } else {
        await createComment({
          postId: id,
          commentData: { commentText: commentText.trim() },
        }).unwrap();
      }

      setCommentText("");
      setReplyingTo(null);

      showSuccess("Комментарий добавлен");
    } catch (error) {
      showError("Не удалось добавить комментарий");
    }
  };

  const toggleCommentExpansion = (commentId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleReplyToComment = (commentId: string, text: string) => {
    console.log(commentId, text);

    setReplyingTo(commentId);
    setCommentText(text);
    commentInputRef.current?.focus();
  };

  const sortComments = (comments: any[]) => {
    return [...comments].sort((a, b) => {
      switch (commentSort) {
        case "new":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "top":
          return b.likes.length - a.likes.length;
        case "controversial":
          // Simple controversial score based on engagement
          const aEngagement = a.likes.length + (a.repliesCount || 0);
          const bEngagement = b.likes.length + (b.repliesCount || 0);
          return bEngagement - aEngagement;
        default:
          return 0;
      }
    });
  };

  const flatListRef = useRef<FlatList>(null);

  const scrollToComment = (commentId: string) => {
    const index = sortedComments.findIndex((c) => c._id === commentId);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.3,
      });
    }
  };

  const handleLikeComment = async (id: string) => {
    try {
      await toggleLikeComment(id).unwrap();
    } catch (error) {
      showError("Не удалось поставить лайк");
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await deleteComment(id).unwrap();
      showSuccess("Комментарий удален");
    } catch (error) {
      showError("Не удалось удалить комментарий");
    }
  };

  const handleEditComment = async (id: string, commentText: string) => {
    try {
      await updateComment({ commentId: id, commentData: { commentText: commentText } }).unwrap();
      showSuccess("Комментарий отредактирован");
    } catch (error) {
      showError("Не удалось отредактировать комментарий");
    }
  };

  const comments = commentsData?.data || [];
  const sortedComments = sortComments(comments);

  return (
    <Modal visible={Boolean(id)} animationType="slide" transparent={true} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Modal Handle */}
          <View style={styles.modalHandle}>
            <View style={styles.handle} />
          </View>

          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity style={styles.headerButton} onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: colors.text }]}>Пост</Text>

            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Post */}

            {/* Comments Section */}
            <View style={[styles.commentsSection, { backgroundColor: colors.card }]}>
              <View style={[styles.commentsHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.commentsTitle, { color: colors.text }]}>Комментарии ({comments.length})</Text>

                {/* Comment Sort Options */}
                <View style={styles.commentSortContainer}>
                  {(["top", "new", "controversial"] as CommentSort[]).map((sort) => (
                    <TouchableOpacity
                      key={sort}
                      style={[styles.sortTab, commentSort === sort && styles.sortTabActive]}
                      onPress={() => setCommentSort(sort)}
                    >
                      <Text style={[styles.sortTabText, commentSort === sort && styles.sortTabTextActive]}>
                        {sort === "top" ? "Лучшие" : sort === "new" ? "Новые" : "Спорные"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {isCommentsLoading ? (
                <View style={styles.noCommentsContainer}>
                  <Loading />
                </View>
              ) : sortedComments.length > 0 ? (
                <FlatList
                  ref={flatListRef}
                  data={sortedComments}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <CommentCard
                      comment={item}
                      onReply={handleReplyToComment}
                      isExpanded={expandedComments.has(item._id)}
                      onToggleExpand={() => toggleCommentExpansion(item._id)}
                      currentUserId={user?._id}
                      onScrollToComment={scrollToComment}
                      onLike={handleLikeComment}
                      onDelete={handleDeleteComment}
                      onEdit={(id) => handleEditComment(id, item.commentText)}
                    />
                  )}
                />
              ) : (
                <View style={styles.noCommentsContainer}>
                  <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
                  <Text style={[styles.noCommentsText, { color: colors.text }]}>Пока нет комментариев</Text>
                  <Text style={[styles.noCommentsSubtext, { color: colors.hint }]}>Будьте первым, кто оставит комментарий</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Comment Input */}
          <View style={[styles.commentInputContainer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
            <Keyboard
              placeholder="Добавить комментарий..."
              value={commentText}
              onChange={setCommentText}
              onSend={handleSubmitComment}
              isConnected={true}
              isSubscribed={true}
              documentChatId={"1"}
            />
            <Text style={styles.characterCount}>{commentText.length}/1000</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHandle: {
    alignItems: "center",
    paddingVertical: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  commentsSection: {
    marginTop: 8,
    paddingBottom: 16,
  },
  commentsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  commentSortContainer: {
    flexDirection: "row",
  },
  sortTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
  },
  sortTabActive: {
    backgroundColor: "#FF6B35",
  },
  sortTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  sortTabTextActive: {
    color: "#fff",
  },

  noCommentsContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noCommentsText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  noCommentsSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  commentInputContainer: {
    paddingTop: 12,
  },

  characterCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
});
