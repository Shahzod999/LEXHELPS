import Header from "@/components/Card/Header";
import ThemedScreen from "@/components/ThemedScreen";
import ToggleTabsRN from "@/components/ToggleTabs/ToggleTabsRN";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import DocumnetsList from "@/components/Activity/Documents/DocumnetsList";
import NewsList from "@/components/Activity/News/NewsList";
import ReindersList from "@/components/Activity/Reminders/ReindersList";

export default function ActivityScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("1");

  const tabs = [
    { id: "1", label: t("documentsTab"), type: "documents" },
    { id: "2", label: t("newsTab"), type: "news" },
    { id: "3", label: t("remindersTab"), type: "reminders" },
  ];

  return (
    <ThemedScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Header title={t("yourActivity")} subtitle={t("yourFilesNewsReminders")} />
        <View style={styles.tabsContainer}>
          <ToggleTabsRN tabs={tabs} onTabChange={setActiveTab} />
        </View>

        <View>
          {activeTab === "1" && <DocumnetsList />}
          {activeTab === "2" && <NewsList />}
          {activeTab === "3" && <ReindersList />}
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  tabsContainer: {
    marginVertical: 16,
  },
});
