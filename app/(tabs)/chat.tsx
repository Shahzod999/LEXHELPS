import Header from "@/components/Card/Header";
import ChatHistoryMenu from "@/components/ChatHistoryMenu";
import { useChat, useChatById } from "@/context/ChatContext";
import { useTheme } from "@/context/ThemeContext";
import { useGetUserOneChatQuery } from "@/redux/api/endpoints/chatApiSlice";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

// Interface for UI messages that includes all possible fields
interface UIMessage {
  _id?: string;
  messageId?: string;
  content: string;
  role: "user" | "assistant";
  createdAt?: string;
  timestamp?: Date;
  isTyping?: boolean;
}

const ChatScreen = () => {
  const { colors } = useTheme();
  const [inputText, setInputText] = useState("");
  const [chatHistoryVisible, setChatHistoryVisible] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string>("");

  const { data: currentChatData, isLoading: isLoadingChat } = useGetUserOneChatQuery(selectedChatId || "", {
    refetchOnMountOrArgChange: true,
  });

  const { isConnected, isConnecting } = useChat();
  const selectedChat = useChatById(selectedChatId);

  useEffect(() => {
    if (isConnected && currentChatData?._id && !selectedChatId) {
      setSelectedChatId(currentChatData._id);
    }
  }, [isConnected, currentChatData?._id, selectedChatId]);

  useEffect(() => {
    if (selectedChatId && isConnected && !selectedChat.isSubscribed) {
      selectedChat.subscribeToChat();
    }
  }, [selectedChatId, isConnected, selectedChat.isSubscribed, selectedChat]);

  const getDisplayMessages = (): UIMessage[] => {
    if (selectedChat.chatState && selectedChat.chatState.chatId === selectedChatId) {
      return selectedChat.messages.map((msg) => ({
        messageId: msg.messageId,
        content: msg.content,
        role: msg.role,
        timestamp: msg.timestamp,
      }));
    }

    if (currentChatData?.messages && currentChatData._id === selectedChatId) {
      return currentChatData.messages.map((msg) => ({
        _id: msg._id,
        content: msg.content,
        role: msg.role as "user" | "assistant",
        createdAt: msg.createdAt,
      }));
    }

    return [];
  };

  const displayMessages = getDisplayMessages();

  const handleSendMessage = () => {
    if (inputText.trim() === "" || !isConnected || !selectedChatId || !selectedChat.isSubscribed) return;

    selectedChat.sendMessage(inputText);
    setInputText("");
  };

  const handleSwipeGesture = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      if (translationX > 50 && velocityX > 0) {
        setChatHistoryVisible(true);
      }
    }
  };

  const handleChatHistoryToggle = () => {
    setChatHistoryVisible(!chatHistoryVisible);
  };

  const handleSelectChat = (chatId: string) => {
    if (isConnected && chatId) {
      setSelectedChatId(chatId);
    }
  };

  const getConnectionStatus = () => {
    if (isConnecting) return "Connecting...";
    if (!isConnected) return "Disconnected";
    if (!selectedChatId) return "Ready to chat...";
    if (!selectedChat.isSubscribed) return "Subscribing to chat...";
    return "Connected";
  };

  const getConnectionColor = () => {
    if (isConnecting) return "#ffaa00";
    if (!isConnected) return "#ff4444";
    if (!selectedChat.isSubscribed) return "#ffaa00";
    return "#44ff44";
  };

  const finalMessages: UIMessage[] = [...displayMessages];

  if (finalMessages.length === 0) {
    finalMessages.push({
      _id: "welcome",
      content: "Hello! I'm your AI legal companion. How can I help you today with visa or migration questions?",
      role: "assistant",
      createdAt: new Date().toISOString(),
    });
  }

  if (selectedChat.isTyping && selectedChat.streamingMessage) {
    finalMessages.push({
      _id: "typing",
      content: selectedChat.streamingMessage,
      role: "assistant",
      createdAt: new Date().toISOString(),
      isTyping: true,
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <PanGestureHandler onHandlerStateChange={handleSwipeGesture}>
          <ScrollView contentContainerStyle={styles.chatContent}>
            <Header
              title="Ask Lex - Your Legal Companion"
              subtitle="Get clear, calm answers to your legal questions"
              secondIcon="chatbubbles"
              secondIconFunction={handleChatHistoryToggle}
            />

            {/* Connection Status Indicator */}
            <View style={styles.statusContainer}>
              <View style={[styles.statusIndicator, { backgroundColor: getConnectionColor() }]} />
              <Text style={[styles.statusText, { color: colors.text }]}>{getConnectionStatus()}</Text>
              {selectedChatId && <Text style={[styles.statusText, { color: colors.text, marginLeft: 8 }]}>• Chat: {selectedChatId.slice(-6)}</Text>}
            </View>

            <View style={styles.chatContainer}>
              {isLoadingChat ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                finalMessages.map((message, index) => (
                  <View
                    key={message._id || message.messageId || index}
                    style={[styles.messageWrapper, message.role === "user" && styles.userMessageWrapper]}
                  >
                    <View
                      style={[
                        styles.messageBubble,
                        { backgroundColor: colors.card },
                        message.role === "user" && {
                          backgroundColor: colors.userAccent,
                        },
                        message.isTyping && { opacity: 0.7 },
                      ]}
                    >
                      <Text style={[styles.messageText, { color: colors.text }]}>{message.content}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </PanGestureHandler>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Your conversations are confidential and protected"
              placeholderTextColor={colors.hint}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={inputText.trim() === "" || !isConnected || !selectedChatId || !selectedChat.isSubscribed}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() && isConnected && selectedChatId && selectedChat.isSubscribed ? colors.accent : colors.hint}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <ChatHistoryMenu visible={chatHistoryVisible} onClose={() => setChatHistoryVisible(false)} onSelectChat={handleSelectChat} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    opacity: 0.7,
  },
  chatContainer: {
    flex: 1,
    borderRadius: 10,
    marginVertical: 16,
  },
  chatContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "95%",
    borderRadius: 16,
    padding: 16,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  sendButton: {
    paddingLeft: 10,
    paddingBottom: 12,
  },
});

export default ChatScreen;
