import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
const Header = ({
  title,
  subtitle,
  secondIcon,
  secondIconFunction,
}: {
  title: string;
  subtitle: string;
  secondIcon?: any;
  secondIconFunction?: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <View>
      <View style={styles.iconContainer}>
        <Image source={require("@/assets/images/icon.png")} style={styles.imageIcon} />
        <Text style={[styles.iconText, { color: colors.text }]}>Lex</Text>

        {secondIcon && (
          <TouchableOpacity style={[styles.historyButton, { backgroundColor: colors.card }]} onPress={secondIconFunction}>
            <Ionicons name={secondIcon} size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.hint }]}>{subtitle}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  imageIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
  },
  iconText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
  },
  historyButton: {
    padding: 8,
    borderRadius: 8,
    textAlign: "right",
    marginLeft: "auto",
  },
});
