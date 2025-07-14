import { StyleSheet, Text, View, TouchableOpacity, Platform, Alert } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useGoogleAuthMutation } from "@/redux/api/endpoints/authApiSlice";
import { useRouter } from "expo-router";

const clientId = "1076868398534-5j60979vc3md1hsqo0511pa75qm2eij6.apps.googleusercontent.com";
const iosClientId = "1076868398534-5j60979vc3md1hsqo0511pa75qm2eij6.apps.googleusercontent.com";
const webClientId = "1076868398534-162b2goa1od6nbag2f82kl9vh1891ugn.apps.googleusercontent.com";

WebBrowser.maybeCompleteAuthSession();

const LogRegOptions = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [googleAuth, { isLoading }] = useGoogleAuthMutation();

  const config = {
    clientId,
    iosClientId,
    webClientId,
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const handleGoogleAuth = async () => {
    if (response?.type === "success") {
      const { authentication } = response;
      const accessToken = authentication?.accessToken;
      
      if (accessToken) {
        try {
          console.log("Sending access token to server:", accessToken);
          const result = await googleAuth({ accessToken }).unwrap();
          console.log("Google auth result:", result);
          
          Alert.alert(
            "Успех!",
            "Вы успешно авторизовались через Google",
            [
              {
                text: "OK",
                onPress: () => {
                  // Перенаправляем на главную страницу
                  router.replace("/(tabs)");
                }
              }
            ]
          );
        } catch (error: any) {
          console.error("Google auth error:", error);
          Alert.alert(
            "Ошибка",
            error?.data?.message || "Произошла ошибка при авторизации через Google"
          );
        }
      }
    } else if (response?.type === "error") {
      console.error("Google auth error:", response.error);
      Alert.alert("Ошибка", "Не удалось авторизоваться через Google");
    }
  };

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
          style={[
            styles.button, 
            { backgroundColor: colors.darkBackground },
            isLoading && styles.buttonDisabled
          ]} 
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Ionicons name="logo-google" size={20} color="#3596ea" />
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {isLoading ? "Загрузка..." : "Google"}
          </Text>
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.darkBackground }]} activeOpacity={0.8}>
            <Ionicons name="logo-apple" size={20} color="white" />
            <Text style={[styles.buttonText, { color: colors.text }]}>Apple</Text>
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
