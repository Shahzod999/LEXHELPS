import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

interface Notification {
  _id: string;
  type: "like" | "comment" | "follow" | "mention" | "system";
  title: string;
  message: string;
  avatar?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  notifications?: Notification[];
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ visible, onClose, notifications = [] }) => {
  const { colors } = useTheme();

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) return "только что";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}мин`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}ч`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}д`;
    return notificationDate.toLocaleDateString("ru-RU");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return "thumbs-up";
      case "comment":
        return "chatbubble";
      case "follow":
        return "person-add";
      case "mention":
        return "at";
      case "system":
        return "notifications";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "like":
        return "#4CAF50";
      case "comment":
        return "#2196F3";
      case "follow":
        return "#FF9800";
      case "mention":
        return "#9C27B0";
      case "system":
        return colors.accent;
      default:
        return colors.hint;
    }
  };

  // Mock data for demonstration
  const mockNotifications: Notification[] = [
    {
      _id: "1",
      type: "like",
      title: "Новый лайк",
      message: "user123 отметил ваш пост как полезный",
      avatar: "https://via.placeholder.com/40",
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      _id: "2",
      type: "comment",
      title: "Новый комментарий",
      message: "jane_doe прокомментировала ваш пост: 'Очень полезная информация!'",
      avatar: "https://via.placeholder.com/40",
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      _id: "3",
      type: "follow",
      title: "Новый подписчик",
      message: "alex_user начал подписываться на вас",
      avatar: "https://via.placeholder.com/40",
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "4",
      type: "system",
      title: "Добро пожаловать!",
      message: "Добро пожаловать в LexHelps Community! Начните создавать посты и помогать другим.",
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, { backgroundColor: colors.card }, !item.isRead && { backgroundColor: colors.darkBackground }]}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={styles.iconContainer}>
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.notificationAvatar} />
            ) : (
              <View style={[styles.iconBackground, { backgroundColor: getNotificationColor(item.type) }]}>
                <Ionicons name={getNotificationIcon(item.type)} size={16} color="#fff" />
              </View>
            )}
          </View>

          <View style={styles.notificationText}>
            <Text style={[styles.notificationTitle, { color: colors.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.notificationMessage, { color: colors.hint }]} numberOfLines={2}>
              {item.message}
            </Text>
            <Text style={[styles.notificationTime, { color: colors.hint }]}>{formatTimeAgo(item.createdAt)}</Text>
          </View>

          {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
            <Ionicons name="close" size={24} color={colors.hint} />
          </TouchableOpacity>

          <Text style={[styles.modalTitle, { color: colors.text }]}>Уведомления</Text>

          <TouchableOpacity hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
            <Text style={[styles.markAllRead, { color: colors.accent }]}>Прочитать все</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <FlatList
          data={displayNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.notificationsList}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-outline" size={64} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.hint }]}>Нет уведомлений</Text>
              <Text style={[styles.emptySubtext, { color: colors.hint }]}>Здесь будут отображаться ваши уведомления</Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
};

export default NotificationsModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  markAllRead: {
    fontSize: 14,
    fontWeight: "600",
  },
  notificationsList: {
    paddingVertical: 8,
  },
  notificationItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    marginRight: 12,
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: "500",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 6,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
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
});
