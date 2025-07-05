import { useResetPasswordMutation } from "@/redux/api/endpoints/authApiSlice";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedButton from "../components/ThemedButton";
import { useTheme } from "../context/ThemeContext";

export default function ResetPasswordScreen() {
  const { t } = useTranslation("auth");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isDarkMode, colors } = useTheme();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError(t("fillAllFields"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    if (!token) {
      setError(t("passwordResetError"));
      return;
    }

    try {
      setError("");
      setSuccess("");
      await resetPassword({ token, password }).unwrap();
      setSuccess(t("passwordResetSuccess"));
      // Navigate to login after 2 seconds
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      setError(t("passwordResetError"));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: "90%" }}>
        <View style={[styles.resetPasswordContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.accent + "20" }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.accent} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.text }]}>{t("resetPasswordTitle")}</Text>
          <Text style={[styles.subtitle, { color: colors.hint }]}>{t("resetPasswordSubtitle")}</Text>

          {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}

          {success && <Text style={[styles.successText, { color: colors.success }]}>{success}</Text>}

          <TextInput
            style={[
              styles.input,
              {
                borderColor: isDarkMode ? "#4A4A4A" : "#ddd",
                color: colors.text,
                backgroundColor: isDarkMode ? "#2A2E38" : "white",
              },
            ]}
            placeholder={t("newPassword")}
            placeholderTextColor={isDarkMode ? "#AAAAAA" : "#999999"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={[
              styles.input,
              {
                borderColor: isDarkMode ? "#4A4A4A" : "#ddd",
                color: colors.text,
                backgroundColor: isDarkMode ? "#2A2E38" : "white",
              },
            ]}
            placeholder={t("confirmPassword")}
            placeholderTextColor={isDarkMode ? "#AAAAAA" : "#999999"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <ThemedButton
            title={t("resetPassword")}
            onPress={handleResetPassword}
            loading={isLoading}
            icon="lock-closed-outline"
            iconPosition="right"
            style={{ marginTop: 15 }}
          />

          <TouchableOpacity style={styles.backToLoginButton} onPress={() => router.push("/login")}>
            <Text style={[styles.backToLoginText, { color: colors.accent }]}>{t("backToLogin")}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resetPasswordContainer: {
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  successText: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  backToLoginButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
