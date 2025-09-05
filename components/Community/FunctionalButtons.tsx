import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const FunctionalButtons = ({
  isSpam,
  isOwner,
  onEdit,
  onDelete,
  handleSpam,
}: {
  isSpam: boolean;
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  handleSpam: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.extendedActions}>
      {isOwner && (
        <>
          <TouchableOpacity style={styles.extendedActionButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={16} color={colors.hint} />
            <Text style={styles.extendedActionText}>Редактировать</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.extendedActionButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={16} color={colors.error} />
            <Text style={[styles.extendedActionText, styles.deleteActionText]}>Удалить</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.extendedActionButton} onPress={handleSpam}>
        <Ionicons name={isSpam ? "flag" : "flag-outline"} size={16} color={isSpam ? colors.accent : colors.hint} />
        <Text style={styles.extendedActionText}>Пожаловаться</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FunctionalButtons;

const styles = StyleSheet.create({
  extendedActions: {
    marginTop: 8,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  extendedActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  extendedActionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  deleteActionText: {
    color: "#d32f2f",
  },
});
