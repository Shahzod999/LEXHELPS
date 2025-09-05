import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Comment } from "@/types/comments";
import { useGetRepliesQuery, useSetCommentSpamMutation, useToggleLikeCommentMutation } from "@/redux/api/endpoints/comments";
import { useTheme } from "@/context/ThemeContext";
import { formatNumber, formatTimeAgo } from "@/utils/formatDate";
import { useToast } from "@/context/ToastContext";
import { handleHapticPress } from "@/utils/haptic";
import FunctionalButtons from "./FunctionalButtons";

interface CommentCardProps {
  comment: Comment;
  onLike?: (id: string) => void;
  onReply?: (commentId: string, text: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onLoadReplies?: () => void;
  currentUserId?: string;
  depth?: number;
  maxDepth?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onScrollToComment?: (commentId: string) => void;
}

export default function CommentCard({
  comment,
  onReply,
  onLike,
  onEdit,
  onDelete,
  onLoadReplies,
  currentUserId,
  depth = 0,
  maxDepth = 5,
  isExpanded = false,
  onToggleExpand,
  onScrollToComment,
}: CommentCardProps) {
  const { colors } = useTheme();
  const [showActions, setShowActions] = useState(false);

  const { data: repliesData, isLoading: repliesLoading } = useGetRepliesQuery({ commentId: comment._id }, { skip: !comment._id || !isExpanded });

  const [isLiked, setIsLiked] = useState(false);
  const [setCommentSpam, { isLoading: isSettingSpam }] = useSetCommentSpamMutation();
  const [isSpam, setIsSpam] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleLikeComment = () => {
    onLike?.(comment._id);
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    setIsLiked(comment.likes?.includes(currentUserId || ""));
    setIsSpam(comment.spamCount?.includes(currentUserId || ""));
  }, [comment.likes, currentUserId]);

  const isOwner = currentUserId === comment.userId._id;
  const hasReplies = comment?.replies?.length > 0;
  const isNestedComment = depth > 0;
  const canNest = depth < maxDepth;

  const renderReply = ({ item }: { item: Comment }) => {
    return (
      <CommentCard
        comment={item}
        onLike={() => console.log("Like reply:", item._id)}
        onReply={(commentId, text) => onReply?.(commentId, text)}
        currentUserId={currentUserId}
        depth={depth + 1}
        maxDepth={maxDepth}
      />
    );
  };

  const handleSpam = () => {
    setCommentSpam(comment._id);
    showSuccess("Пожаловаться на комментарий");
    handleHapticPress();
  };

  return (
    <View
      id={comment._id}
      style={[styles.container, isNestedComment && styles.nestedContainer, isNestedComment && { marginLeft: Math.min(depth * 16, 64) }]}
    >
      {/* Connection Line for Nested Comments */}
      {isNestedComment && <View style={[styles.connectionLine, { left: -Math.min(depth * 16, 64) + 8 }]} />}

      {/* Main Comment */}
      <View style={styles.commentContent}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri: comment.userId.profilePicture || "https://via.placeholder.com/32",
            }}
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <Text style={styles.username}>{comment.userId.name}</Text>
            <Text style={styles.timestamp}>{formatTimeAgo(comment.createdAt)}</Text>
          </View>

          <TouchableOpacity style={styles.moreButton} onPress={() => setShowActions(!showActions)}>
            <Ionicons name="ellipsis-horizontal" size={16} color="#666" />
          </TouchableOpacity>
        </View>
        {comment?.parentId?._id && (
          <TouchableOpacity
            style={[styles.parentCommentText, { backgroundColor: colors.card }]}
            onPress={() => onScrollToComment?.(comment?.parentId?._id || "")}
          >
            <Text style={[styles.commentText, { color: colors.text }]}>"{comment.parentId?.commentText}"</Text>
          </TouchableOpacity>
        )}
        {/* Comment Text */}
        <Text style={styles.commentText} selectable>
          {comment.commentText}
        </Text>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, isLiked && styles.actionButtonActive]} onPress={handleLikeComment}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={16} color={isLiked ? colors.accent : colors.hint} />
            <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>{formatNumber(comment?.likes?.length)}</Text>
          </TouchableOpacity>

          {canNest && (
            <TouchableOpacity style={styles.actionButton} onPress={() => onReply?.(comment._id, comment.commentText)}>
              <Ionicons name="arrow-undo-outline" size={16} color={colors.hint} />
              <Text style={styles.actionText}>Ответить</Text>
            </TouchableOpacity>
          )}

          {hasReplies && (
            <TouchableOpacity style={styles.actionButton} onPress={onToggleExpand}>
              <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color={colors.hint} />
              <Text style={styles.actionText}>{comment.replies?.length} ответов</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Extended Actions Menu */}
        {showActions && (
          <FunctionalButtons
            isSpam={isSpam}
            isOwner={isOwner}
            onEdit={() => onEdit?.(comment._id)}
            onDelete={() => onDelete?.(comment._id)}
            handleSpam={handleSpam}
          />
        )}
      </View>

      {/* Replies */}
      {isExpanded && repliesData?.data && repliesData.data.length > 0 && (
        <View style={styles.repliesContainer}>
          {repliesLoading ? (
            <Text style={styles.loadingText}>Загрузка ответов...</Text>
          ) : (
            <FlatList data={repliesData.data} renderItem={renderReply} keyExtractor={(item) => item._id} scrollEnabled={false} />
          )}
        </View>
      )}

      {/* Load More Replies Button */}
      {isExpanded && repliesData?.pagination && repliesData.pagination.hasNext && (
        <TouchableOpacity style={styles.loadMoreReplies} onPress={onLoadReplies}>
          <Ionicons name="add" size={16} color={colors.accent} />
          <Text style={styles.loadMoreText}>Загрузить еще ответы</Text>
        </TouchableOpacity>
      )}

      {/* Max Depth Indicator */}
      {!canNest && hasReplies && (
        <TouchableOpacity style={styles.continueThreadButton}>
          <Text style={styles.continueThreadText}>Продолжить в отдельной ветке →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  nestedContainer: {
    borderLeftWidth: 2,
    borderLeftColor: "#e1e1e1",
    paddingLeft: 12,
  },
  connectionLine: {
    position: "absolute",
    top: 40,
    width: 16,
    height: 2,
    backgroundColor: "#e1e1e1",
  },
  parentCommentText: {
    opacity: 0.8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 20,
    marginBottom: 8,
  },
  commentContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    marginRight: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e1e1e1",
  },
  userInfo: {
    flex: 1,
    marginLeft: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 1,
  },
  moreButton: {
    padding: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    paddingVertical: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  actionButtonActive: {
    backgroundColor: "#fff3e0",
  },
  actionText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
  actionTextActive: {
    color: "#FF6B35",
  },
  extendedActions: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  extendedActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  extendedActionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  deleteActionText: {
    color: "#d32f2f",
  },
  repliesContainer: {
    marginTop: 4,
  },
  loadMoreReplies: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 16,
    marginTop: 4,
  },
  loadMoreText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "500",
    marginLeft: 4,
  },
  continueThreadButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 16,
    marginTop: 4,
  },
  continueThreadText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  loadingText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    paddingVertical: 8,
    fontStyle: "italic",
  },
});
