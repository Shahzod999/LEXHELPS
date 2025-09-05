import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const Keyboard = ({
  placeholder,
  value,
  onChange,
  onSend,
  isConnected,
  isSubscribed,
  documentChatId,
}: {
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  isConnected: boolean;
  isSubscribed: boolean;
  documentChatId: string;
}) => {
  const { colors } = useTheme();
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
      <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.hint}
          value={value}
          onChangeText={onChange}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={onSend}
          disabled={value.trim() === "" || !isConnected || !isSubscribed || !documentChatId}
        >
          <Ionicons name="send" size={20} color={value.trim() && isConnected && isSubscribed && documentChatId ? colors.accent : colors.hint} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Keyboard;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
  },
});
