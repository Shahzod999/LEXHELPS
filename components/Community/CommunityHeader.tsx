import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import ToggleTabsRN from "../ToggleTabs/ToggleTabsRN";
import { useGetCategoriesQuery } from "@/redux/api/endpoints/universalPosts";

interface CommunityHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onNotificationsPress?: () => void;
  onFilterPress?: () => void;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ searchQuery, onSearchChange, onNotificationsPress, onFilterPress }) => {
  const { colors } = useTheme();
  const { data: categories } = useGetCategoriesQuery();
  const [activeTab, setActiveTab] = useState<string>("1");

  const tabs = categories?.data.map((category) => ({ id: category._id, label: category.name, type: category.name })) || [];

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
      {/* Search Row */}
      <View style={styles.searchRow}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.hint} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Lex Community..."
            placeholderTextColor={colors.hint}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange("")}>
              <Ionicons name="close-circle" size={20} color={colors.hint} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={[styles.notificationButton, { backgroundColor: colors.card }]} onPress={onNotificationsPress}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <View style={[styles.notificationBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onFilterPress}>
          <Ionicons name="options-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <ToggleTabsRN tabs={tabs} onTabChange={setActiveTab} />
      </View>
    </View>
  );
};

export default CommunityHeader;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 18,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    outline: "none",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabsContainer: {
    marginVertical: 8,
  },
});
