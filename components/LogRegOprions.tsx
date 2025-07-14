import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";

const LogRegOptions = () => {
  const { colors } = useTheme();

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: "1076868398534-5j60979vc3md1hsqo0511pa75qm2eij6.apps.googleusercontent.com",
      webClientId: "1076868398534-162b2goa1od6nbag2f82kl9vh1891ugn.apps.googleusercontent.com",
      profileImageSize: 150,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        const { name, email, photo } = user;
        console.log(name, email, photo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.darkBackground }]} activeOpacity={0.8} onPress={handleGoogleSignIn}>
          <Ionicons name="logo-google" size={20} color="#3596ea" />
          <Text style={[styles.buttonText, { color: colors.text }]}>Google</Text>
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
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
    letterSpacing: 0.3,
  },
});
