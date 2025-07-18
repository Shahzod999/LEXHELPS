import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import { useGoogleAuthMutation, useAppleAuthMutation } from "@/redux/api/endpoints/authApiSlice";
import { useRouter } from "expo-router";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";

const clientId = "1076868398534-5j60979vc3md1hsqo0511pa75qm2eij6.apps.googleusercontent.com";
const iosClientId = "1076868398534-5j60979vc3md1hsqo0511pa75qm2eij6.apps.googleusercontent.com";
const webClientId = "1076868398534-162b2goa1od6nbag2f82kl9vh1891ugn.apps.googleusercontent.com";

WebBrowser.maybeCompleteAuthSession();

const LogRegOptions = () => {
  const { colors } = useTheme();
  const router = useRouter();
  // тут мы конфигурируем Google аутентификацию
  const [googleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();
  // тут мы конфигурируем Apple аутентификацию
  const [appleAuth, { isLoading: isAppleLoading }] = useAppleAuthMutation();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  // Проверяем доступность Apple аутентификации
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);

  // тут мы проверяем доступность Apple аутентификации
  useEffect(() => {
    const checkAppleAuthAvailability = async () => {
      const available = await AppleAuthentication.isAvailableAsync();
      setIsAppleAuthAvailable(available);
    };
    checkAppleAuthAvailability();
  }, []);

  // тут мы конфигурируем Google аутентификацию
  const config = {
    clientId,
    iosClientId,
    webClientId,
  };

  // тут мы конфигурируем Google аутентификацию
  const [request, response, promptAsync] = Google.useAuthRequest(config);

  // тут мы обрабатываем Google аутентификацию
  const handleGoogleAuth = async () => {
    if (response?.type === "success") {
      const { authentication } = response;
      const accessToken = authentication?.accessToken;

      if (accessToken) {
        try {
          console.log("Sending access token to server:", accessToken);
          const result = await googleAuth({ accessToken }).unwrap();
          console.log("Google auth result:", result);

          showSuccess(t("googleAuthSuccess", { ns: "auth" }));
          router.replace("/(tabs)");
        } catch (error: any) {
          console.error("Google auth error:", error);
          showError(error?.data?.message || t("googleAuthError", { ns: "auth" }));
        }
      }
    } else if (response?.type === "error") {
      console.error("Google auth error:", response.error);
      showError(t("googleAuthLoginError", { ns: "auth" }));
    }
  };

  // тут мы обрабатываем Apple аутентификацию
  const handleAppleAuth = async () => {
    try {
      // тут мы вызываем Apple аутентификацию
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });

      // тут мы отправляем токены на сервер
      if (credential.identityToken && credential.authorizationCode) {
        const result = await appleAuth({
          identityToken: credential.identityToken,
          authorizationCode: credential.authorizationCode,
          user: credential.fullName
            ? {
                name: {
                  firstName: credential.fullName.givenName || undefined,
                  lastName: credential.fullName.familyName || undefined,
                },
              }
            : undefined,
        }).unwrap();

        console.log("Apple auth result:", result);
        showSuccess(t("appleAuthSuccess", { ns: "auth" }));
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error("Apple auth error:", error);
      if (error.code === "ERR_CANCELED") {
        // Пользователь отменил аутентификацию
        return;
      }
      showError(error?.data?.message || t("appleAuthError", { ns: "auth" }));
    }
  };

  // тут мы обрабатываем Google аутентификацию
  useEffect(() => {
    if (response) {
      handleGoogleAuth();
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => promptAsync()}
          style={[styles.button, { backgroundColor: colors.darkBackground }, isGoogleLoading && styles.buttonDisabled]}
          activeOpacity={0.8}
          disabled={isGoogleLoading}
        >
          <Ionicons name="logo-google" size={20} color="#3596ea" />
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {isGoogleLoading ? t("loading", { ns: "auth" }) : t("google", { ns: "auth" })}
          </Text>
        </TouchableOpacity>
        {Platform.OS === "ios" && isAppleAuthAvailable && (
          <TouchableOpacity
            onPress={() => handleAppleAuth()}
            style={[styles.button, { backgroundColor: colors.darkBackground }, isAppleLoading && styles.buttonDisabled]}
            activeOpacity={0.8}
            disabled={isAppleLoading}
          >
            <Ionicons name="logo-apple" size={20} color="#3596ea" />
            <Text style={[styles.buttonText, { color: colors.text }]}>
              {isAppleLoading ? t("loading", { ns: "auth" }) : t("apple", { ns: "auth" })}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default LogRegOptions;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
    letterSpacing: 0.3,
  },
});
