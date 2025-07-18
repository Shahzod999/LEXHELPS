import Header from "@/components/Card/Header";
import HomeCard from "@/components/Card/HomeCard";
import Emergency from "@/components/Home/Emergency";
import Quotes from "@/components/Quotes";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text } from "react-native";
import ThemedScreen from "../../components/ThemedScreen";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <ThemedScreen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header title={t("welcomeToLex")} subtitle={t("notAloneJourney")} />
        <Quotes />

        <Text style={[styles.title, { color: colors.text }]}>{t("howCanWeHelp")}</Text>

        <HomeCard
          title={t("uploadDocuments")}
          description={t("uploadDocumentsDesc")}
          icon="cloud-upload-outline"
          color={colors.accent}
          onPress={() => {
            router.push("/scan");
          }}
        />
        <HomeCard
          title={t("immigrationHelp")}
          description={t("immigrationHelpDesc")}
          icon="document-text"
          color={colors.accent}
          onPress={() => {
            router.push("/immigration");
          }}
        />
        <HomeCard
          title={t("askQuestion")}
          description={t("askQuestionDesc")}
          icon="chatbubble-outline"
          color={colors.success}
          onPress={() => {
            router.push("/chat");
          }}
        />
        <HomeCard
          title={t("findResources")}
          description={t("findResourcesDesc")}
          icon="location-outline"
          color={colors.warning}
          onPress={() => {
            router.push("/resources");
          }}
        />
      </ScrollView>
      {/* <Emergency /> */}
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },

  content: {
    paddingVertical: 16,
  },
});
