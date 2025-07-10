import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

const LogRegOptions = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.darkBackground }]} activeOpacity={0.8}>
          <Ionicons name="logo-google" size={20} color="#3596ea" />
          <Text style={[styles.buttonText, { color: colors.text }]}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.darkBackground }]} activeOpacity={0.8}>
          <Ionicons name="logo-apple" size={20} color="white" />
          <Text style={[styles.buttonText, { color: colors.text }]}>Apple</Text>
        </TouchableOpacity>
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
