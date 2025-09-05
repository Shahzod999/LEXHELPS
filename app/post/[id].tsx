import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGetPostQuery } from "../../redux/api/endpoints/posts";
import { useGetCommentsQuery, useCreateCommentMutation } from "../../redux/api/endpoints/comments";
import PostCard from "../../components/Community/PostCard";
import CommentCard from "../../components/Community/CommentCard";
import LoadingScreen, { Loading } from "@/components/common/LoadingScreen";
import ThemedScreen from "@/components/ThemedScreen";
import { useTheme } from "@/context/ThemeContext";

type CommentSort = "new" | "top" | "controversial";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentSort, setCommentSort] = useState<CommentSort>("top");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const commentInputRef = useRef<TextInput>(null);

  const { data: postData, isLoading: isPostLoading } = useGetPostQuery(id!);
  const { data: commentsData, isLoading: isCommentsLoading } = useGetCommentsQuery({
    postId: id!,
    params: {
      sortBy: commentSort === "new" ? "createdAt" : "likes",
      sortOrder: "desc",
      limit: 50,
    },
  });

  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    try {
      await createComment({
        postId: id!,
        commentData: { commentText: commentText.trim() },
      }).unwrap();

      setCommentText("");
      setReplyingTo(null);

      Alert.alert("Успех", "Комментарий добавлен");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось добавить комментарий");
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

  const handleReplyToComment = (commentId: string, username: string) => {
    setReplyingTo(commentId);
    setCommentText(`@${username} `);
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

  if (isPostLoading) {
    return <LoadingScreen />;
  }

  if (!postData?.data) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>Пост не найден</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const post = postData.data;
  const comments = commentsData?.data || [];
  const sortedComments = sortComments(comments);

  return (
    <ThemedScreen>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/community")}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>Пост</Text>

          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Post */}
          <PostCard post={post} onPress={() => {}} onComment={() => {}} />

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

            {/* Comments List */}
            {isCommentsLoading ? (
              <Loading />
            ) : sortedComments.length > 0 ? (
              <View style={styles.commentsList}>
                {sortedComments.map((comment) => (
                  <CommentCard
                    key={comment._id}
                    comment={comment}
                    onLike={() => console.log("Like comment:", comment._id)}
                    onReply={() => handleReplyToComment(comment._id, comment.userId.username)}
                    isExpanded={expandedComments.has(comment._id)}
                    onToggleExpand={() => toggleCommentExpansion(comment._id)}
                    currentUserId="current-user-id" // Replace with actual user ID
                  />
                ))}
              </View>
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
          {replyingTo && (
            <View style={styles.replyingToContainer}>
              <Text style={styles.replyingToText}>Отвечаете на комментарий</Text>
              <TouchableOpacity
                onPress={() => {
                  setReplyingTo(null);
                  setCommentText("");
                }}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputRow}>
            <TextInput
              ref={commentInputRef}
              style={styles.commentInput}
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Добавить комментарий..."
              placeholderTextColor="#999"
              multiline
              maxLength={1000}
            />

            <TouchableOpacity
              style={[styles.sendButton, commentText.trim() && styles.sendButtonActive]}
              onPress={handleSubmitComment}
              disabled={!commentText.trim() || isCreatingComment}
            >
              {isCreatingComment ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={20} color={commentText.trim() ? "#fff" : "#ccc"} />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.characterCount}>{commentText.length}/1000</Text>
        </View>
      </KeyboardAvoidingView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  commentsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
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
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  replyingToContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  replyingToText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e1e1e1",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: "#FF6B35",
  },
  characterCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
