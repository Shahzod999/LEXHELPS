import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import ThemedButton from "../../components/ThemedButton";
import ThemedCard from "../../components/ThemedCard";
import ThemedScreen from "../../components/ThemedScreen";
import { useTheme } from "../../context/ThemeContext";

export default function HelpCenterScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <ThemedScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: "100%" }}>
        <ThemedCard title={t('frequentlyAskedQuestions')}>
          <Text style={{ color: colors.text, marginBottom: 15 }}>
            {t('faqDescription')}
          </Text>
          <ThemedButton
            title={t('viewFaqs')}
            onPress={() => console.log("FAQs pressed")}
            variant="outline"
            icon="help-circle-outline"
          />
        </ThemedCard>

        <ThemedCard title={t('contactSupport')}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}>
            <Ionicons name="mail-outline" size={20} color={colors.text} />
            <Text style={{ color: colors.text, marginLeft: 10 }}>
              support@example.com
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}>
            <Ionicons name="call-outline" size={20} color={colors.text} />
            <Text style={{ color: colors.text, marginLeft: 10 }}>
              +1 (555) 123-4567
            </Text>
          </View>
          <ThemedButton
            title={t('sendMessage')}
            onPress={() => console.log("Send message pressed")}
            variant="primary"
            icon="paper-plane-outline"
          />
        </ThemedCard>

        <ThemedCard title={t('tutorials')}>
          <Text style={{ color: colors.text, marginBottom: 15 }}>
            {t('tutorialsDescription')}
          </Text>
          <ThemedButton
            title={t('viewTutorials')}
            onPress={() => console.log("Tutorials pressed")}
            variant="secondary"
            icon="videocam-outline"
          />
        </ThemedCard>
      </ScrollView>
    </ThemedScreen>
  );
}
