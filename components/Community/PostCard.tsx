import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { getValidatedUrlPublic } from "@/utils/ValidateImg";
import { Post, Tag } from "@/types/posts";
import FunctionalButtons from "./FunctionalButtons";
import { formatNumber, formatTimeAgo } from "@/utils/formatDate";
import { handleHapticPress } from "@/utils/haptic";
import { useToast } from "@/context/ToastContext";

interface PostCardProps {
  post: Post;
  onPress: () => void;
  onLike?: (id: string) => void;
  onComment: (id: string) => void;
  onSave?: (id: string) => void;
  onShare?: () => void;
  onDelete?: (id: string) => void;
  onSpam?: (id: string) => void;
  onEdit?: (id: string) => void;
  currentUserId: string;
}

export default function PostCard({ post, onPress, onLike, onComment, onSave, onShare, onDelete, onSpam, onEdit, currentUserId }: PostCardProps) {
  const { showSuccess } = useToast();
  const { colors } = useTheme();
  const [isLiked, setIsLiked] = useState(currentUserId ? post.likes.includes(currentUserId) : false);
  const [isSaved, setIsSaved] = useState(currentUserId ? post.saved.includes(currentUserId) : false);
  const [isSpam, setIsSpam] = useState(currentUserId ? post.spamCount?.includes(currentUserId) : false);
  const [isOwner, setIsOwner] = useState(currentUserId === post.userId._id);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    setIsLiked(currentUserId ? post.likes.includes(currentUserId) : false);
    setIsSaved(currentUserId ? post.saved.includes(currentUserId) : false);
    setIsSpam(currentUserId ? post.spamCount?.includes(currentUserId) : false);
    setIsOwner(currentUserId === post.userId._id);
  }, [currentUserId, post.likes, post.saved, post.spamCount]);

  const handleSpam = () => {
    onSpam?.(post._id);
    showSuccess("Пожаловаться на пост");
    handleHapticPress();
  };
  const handleEdit = () => {
    alert("Edit");
  };

  const handleLike = async () => {
    onLike?.(post._id);
    setIsLiked(!isLiked);
  };
  const handleSave = async () => {
    onSave?.(post._id);
    setIsSaved(!isSaved);
  };

  const renderMedia = () => {
    if (!post.images || post.images.length === 0) return null;
    const imageCount = post.images.length;
    const firstImage = post.images[0];

    return (
      <View style={styles.mediaContainer}>
        <Image source={{ uri: getValidatedUrlPublic(firstImage) }} style={styles.postImage} />
        {imageCount > 1 && (
          <View style={styles.imageCountOverlay}>
            <Text style={styles.imageCountText}>+{imageCount - 1}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTags = () => {
    if (!post.tags || post.tags.length === 0) return null;

    return (
      <View style={styles.tagsContainer}>
        {post.tags.slice(0, 3).map((tag: Tag) => (
          <View key={tag._id} style={[styles.tag, { backgroundColor: tag.color + "20" }]}>
            <Text style={[styles.tagText, { color: tag.color || colors.hint }]}>
              {tag.isOfficial && "⭐ "}#{tag.name}
            </Text>
          </View>
        ))}
        {post.tags.length > 3 && <Text style={[styles.moreTagsText, { color: colors.hint }]}>+{post.tags.length - 3}</Text>}
      </View>
    );
  };

  const renderPostInfo = () => {
    const info = [];
    if (post.category) {
      info.push(`📂 ${post.category.name}`);
    }
    if (post.userNationality) {
      info.push(`🌍 ${post.userNationality}`);
    }
    if (post.postedPlace) {
      info.push(`📍 ${post.postedPlace}`);
    }
    if (post.userAge) {
      info.push(`👤 ${post.userAge} лет`);
    }

    if (info.length === 0) return null;

    return (
      <View style={styles.postInfoContainer}>
        <Text style={[styles.postInfoText, { color: colors.hint }]}>{info.join(" • ")}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: post.userId.profilePicture || "https://via.placeholder.com/40",
            }}
            style={[styles.avatar, { backgroundColor: colors.border }]}
          />
          <View style={styles.userDetails}>
            <Text style={[styles.username, { color: colors.text }]}>{post.userId.name || "Anonymous"}</Text>
            <Text style={[styles.timestamp, { color: colors.hint }]}>{formatTimeAgo(post.createdAt)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton} onPress={() => setShowActions(!showActions)}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.hint} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={[styles.description, { color: colors.text }]} numberOfLines={8} onPress={onPress}>
        {post.description}
      </Text>

      {/* Post Info */}
      {renderPostInfo()}

      {/* Tags */}
      {renderTags()}

      {/* Media */}
      {renderMedia()}

      {/* Actions */}
      <View style={[styles.actionsContainer, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.actionButton, isLiked && { backgroundColor: colors.userAccent }]} onPress={handleLike}>
          <Text style={[styles.helpfulText, { color: isLiked ? "white" : colors.hint }]}>Helpful</Text>
          <Text style={[styles.helpfulCount, { color: isLiked ? "white" : colors.hint }]}>{formatNumber(post?.likes?.length)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onComment(post._id)}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.hint} />
          <Text style={[styles.commentsCount, { color: colors.hint }]}>{formatNumber(post?.comments?.length)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={18} color={colors.hint} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
          <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={18} color={isSaved ? colors.accent : colors.hint} />
        </TouchableOpacity>
      </View>

      {showActions && (
        <FunctionalButtons isSpam={isSpam} isOwner={isOwner} onEdit={handleEdit} onDelete={() => onDelete?.(post._id)} handleSpam={handleSpam} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  helpfulText: {
    fontSize: 12,
    fontWeight: "600",
  },
  helpfulCount: {
    fontSize: 11,
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userDetails: {
    marginLeft: 8,
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 1,
  },
  moreButton: {
    padding: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  moreTagsText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  postInfoContainer: {
    marginBottom: 8,
  },
  postInfoText: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },

  commentsCount: {
    fontSize: 13,
    fontWeight: "500",
  },
  mediaContainer: {
    position: "relative",
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
  },
  imageCountOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 5,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  saveButton: {
    paddingHorizontal: 12,
  },
});
