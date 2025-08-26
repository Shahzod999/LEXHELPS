import { Platform, StyleSheet, Text, Vibration, View, ViewStyle } from "react-native";
import React from "react";
import { ThemedCard } from "../ThemedCard";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const HomeCard = ({
  title,
  description,
  icon,
  color,
  onPress,
}: {
  title: string;
  description: string;
  icon: any;
  color?: string;
  onPress?: () => void;
}) => {
  const { colors } = useTheme();

  const handlePress = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Vibration.vibrate(50);
    }
    onPress?.();
  };

  return (
    <ThemedCard onPress={handlePress} style={styles.shadow}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={30} color={color} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.description, { color: colors.hint }]}>{description}</Text>
      </View>
    </ThemedCard>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
});
