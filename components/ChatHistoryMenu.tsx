import { useTheme } from "@/context/ThemeContext";
import { useCreateNewChatMutation, useDeleteChatMutation, useGetUserChatsQuery } from "@/redux/api/endpoints/chatApiSlice";
import { ChatHistoryType } from "@/types/chat";
import { formatDate } from "@/utils/formatDate";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Loading } from "./common/LoadingScreen";
import SwipeDelete from "./common/SwipeDelete";

const { width: screenWidth } = Dimensions.get("window");

interface ChatHistoryMenuProps {
  visible: boolean;
  onClose: () => void;
  onSelectChat?: (chatId: string) => void;
}

export default function ChatHistoryMenu({ visible, onClose, onSelectChat }: ChatHistoryMenuProps) {
  const { colors } = useTheme();

  const menuWidth = screenWidth * 0.85;
  const slideAnim = useRef(new Animated.Value(-menuWidth)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { data: chatHistory, isLoading } = useGetUserChatsQuery();
  const [deleteChat, { isLoading: isDeleting }] = useDeleteChatMutation();
  const [createNewChat, { isLoading: isCreating }] = useCreateNewChatMutation();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, menuWidth]);

  const handleSelectChat = (chatId: string) => {
    onSelectChat?.(chatId);
    onClose();
  };

  const handleCreateNewChat = async () => {
    try {
      const res = await createNewChat().unwrap();
      onSelectChat?.(res._id);
      onClose();
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const res = await deleteChat(chatId).unwrap();

      if (res.nextChatId) {
        onSelectChat?.(res.nextChatId);
      } else {
        handleCreateNewChat();
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const renderChatItem = ({ item }: { item: ChatHistoryType }) => (
    <SwipeDelete handleDelete={() => handleDeleteChat(item._id)}>
      <TouchableOpacity style={[styles.chatItem, { backgroundColor: colors.card }]} onPress={() => handleSelectChat(item._id)} activeOpacity={0.7}>
        <View style={[styles.chatItemIcon, { backgroundColor: colors.accent + "20" }]}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.accent} />
        </View>
        <View style={styles.chatItemContent}>
          <Text style={[styles.chatTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.lastMessage, { color: colors.hint }]} numberOfLines={2}>
            {item?.messages[item?.messages?.length - 1]?.content}
          </Text>
          <Text style={[styles.timestamp, { color: colors.hint }]}>{formatDate(item.createdAt, "ru-RU")}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.hint} />
      </TouchableOpacity>
    </SwipeDelete>
  );

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {(isLoading || isDeleting || isCreating) && <Loading />}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: fadeAnim,
                backgroundColor: colors.background,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sidebar,
            {
              width: menuWidth,
              transform: [{ translateX: slideAnim }],
              backgroundColor: colors.background,
              shadowColor: colors.card,
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.headerContent}>
                <View style={[styles.headerIcon, { backgroundColor: colors.accent + "20" }]}>
                  <Ionicons name="time-outline" size={24} color={colors.accent} />
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={[styles.headerTitle, { color: colors.text }]}>Chat History</Text>
                  <Text style={[styles.headerSubtitle, { color: colors.hint }]}>{chatHistory?.length} conversations</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.card }]} onPress={onClose}>
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* New Chat Button */}
            <TouchableOpacity style={[styles.newChatButton, { backgroundColor: colors.accent }]} onPress={handleCreateNewChat} activeOpacity={0.8}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.newChatText}>New Conversation</Text>
            </TouchableOpacity>

            {/* Chat History List */}
            <FlatList
              data={chatHistory}
              renderItem={renderChatItem}
              keyExtractor={(item) => item._id}
              style={styles.chatList}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
            />
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sidebar: {
    height: "100%",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    paddingVertical: 14,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  newChatText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  chatList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 8,
    borderRadius: 12,
    marginVertical: 4,
  },
  chatItemIcon: {
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  chatItemContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: "500",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
});
