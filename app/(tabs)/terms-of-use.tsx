import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import ThemedScreen from "@/components/ThemedScreen";
import ThemedCard from "@/components/ThemedCard";
import { useTheme } from "@/context/ThemeContext";

export default function TermsOfUseScreen() {
  const { colors } = useTheme();

  const downloadPDF = async () => {
    try {
      Alert.alert("Downloading", "Preparing file for download...");

      const asset = Asset.fromModule(require("../../assets/docs/TermsOfUseLex.pdf"));
      await asset.downloadAsync();

      if (!asset.localUri) {
        throw new Error("Could not find file");
      }

      const fileUri = FileSystem.documentDirectory + "TermsOfUseLex.pdf";

      await FileSystem.copyAsync({
        from: asset.localUri,
        to: fileUri,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/pdf",
          dialogTitle: "Save Terms of Use",
        });
      } else {
        Alert.alert("Success", `File saved at: ${fileUri}`);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      Alert.alert("Error", "Could not download file. Please try again.");
    }
  };

  return (
    <ThemedScreen>
      {/* Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ThemedCard style={styles.header}>
          <Ionicons name="document-text-outline" size={32} color={colors.accent} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Terms of Use</Text>
          <Text style={[styles.headerSubtitle, { color: colors.hint }]}>LEX - AI Legal Assistant</Text>
        </ThemedCard>
        <View style={styles.contentContainer}>
          <Text style={[styles.lastUpdated, { color: colors.hint }]}>Last Updated: June 10th, 2025</Text>
          <Text style={[styles.company, { color: colors.hint }]}>Operated by: CDL Carolinas LLC, Colorado, USA</Text>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>1. Acceptance of Terms</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              By accessing or using the Lex platform (&quot;Lex,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be legally bound by these Terms of Use (&quot;Terms&quot;).
              These Terms govern your use of our website, mobile applications, services, tools, and any other platform functionality (collectively,
              the &quot;Services&quot;). If you do not agree with any part of these Terms, you must not access or use the Services. These Terms apply to all
              visitors, users, and others who access or use the Services, and form a legally binding agreement between you and CDL Carolinas LLC.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>2. Description of Services</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Lex offers AI-powered tools designed to simplify legal language, provide immigration-related information, and assist users in navigating
              legal procedures. The Services are for informational purposes only and are not intended to replace legal counsel. Lex does not practice
              law, provide legal advice, or form attorney-client relationships. Any actions you take based on information provided by Lex are your own
              responsibility. You should always seek the advice of a licensed attorney in your jurisdiction for any legal matters.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>3. Eligibility</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              To use Lex, you must be at least 13 years old. If you are under the age of 18 (or the age of legal majority in your country or state),
              you may only use Lex with the supervision and consent of a parent or legal guardian. By using the Services, you represent and warrant
              that you meet these eligibility requirements and that you have the legal capacity to enter into these Terms.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>4. User Responsibilities</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              You agree to use the Services in compliance with all applicable laws and these Terms. You must not use the Services to engage in any
              unlawful, misleading, or harmful activity, including attempting to extract, reverse-engineer, or interfere with our software or systems.
              You are responsible for the accuracy of the information you provide, the integrity of your account (if applicable), and the results of
              any actions taken using the Services.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>5. No Legal Advice or Representation</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Lex is not a law firm and does not provide legal representation. The content, responses, and documents generated through Lex AI
              systems are not legal advice and should not be relied upon as such. We do not guarantee the accuracy, completeness, or currentness of
              any legal information. The Services do not replace the need for professional legal consultation, and use of Lex does not create an
              attorney-client relationship.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>6. Account Security</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              If you create an account on Lex, you are responsible for maintaining the confidentiality of your login credentials. You agree to notify
              us immediately of any unauthorized access or use of your account. We reserve the right to suspend or terminate your access if we suspect
              misuse or if your account security has been compromised. Lex is not liable for any losses or damages resulting from unauthorized account
              access due to your actions or negligence.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>7. Intellectual Property Rights</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              All content, technology, software, visual design, logos, trademarks, and other intellectual property displayed or made available through
              the Services are the exclusive property of Lex or its licensors. You may not reproduce, copy, sell, distribute, or create derivative
              works based on our intellectual property without our express written consent. All rights not expressly granted are reserved by us.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>8. Privacy and Data Use</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Your use of the Services is subject to our Privacy Policy, which explains how we collect, use, and safeguard your personal information.
              By using the Services, you acknowledge and agree to the practices outlined in the Privacy Policy, including the use of AI tools to
              process your data. Use of the Services indicates your informed consent to data collection and processing as described.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>9. Termination</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              We reserve the right to terminate or suspend your access to the Services at any time, with or without notice, if we reasonably believe
              that you have violated these Terms, abused the Services, or created a risk of harm to others or to Lex. You may also stop using the
              Services at any time. Termination does not affect any provisions of these Terms that are intended to survive termination.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>10. Disclaimer of Warranties</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              The Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, express or implied. We do not warrant
              that the Services will be accurate, complete, error-free, secure, or uninterrupted. To the fullest extent permitted by law, we disclaim
              all warranties, including any implied warranties of merchantability, fitness for a particular purpose, or non-infringement. Your use of
              the Services is at your own risk.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>11. Limitation of Liability</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              To the maximum extent allowed by law, Lex and its affiliates, officers, employees, and agents will not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from or related to your use of the Services. This includes, but is not
              limited to, loss of data, profits, or reputation. Our total liability for any claim under these Terms shall not exceed the amount you
              paid to use the Services, if any, in the 12 months preceding the claim.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>12. Modifications to Terms</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              We reserve the right to update or modify these Terms at any time. If changes are material, we will notify you through email, in-app
              messaging, or by posting an updated version on our website. Your continued use of the Services after such modifications constitutes your
              acceptance of the updated Terms.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>13. Governing Law and Dispute Resolution</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              These Terms are governed by the laws of the State of Colorado, without regard to its conflict of law principles. Any legal action or
              proceeding arising from or related to these Terms shall be brought exclusively in the state or federal courts located in Colorado. You
              agree to submit to the personal jurisdiction of these courts and waive any objections to venue.
            </Text>
          </ThemedCard>

          <ThemedCard>
            <Text style={[styles.contactTitle, { color: colors.accent }]}>14. Contact Information</Text>
            <Text style={[styles.contactText, { color: colors.text }]}>
              For questions or concerns regarding these Terms or your use of the Services, please contact:
            </Text>
            <Text style={[styles.contactInfo, { color: colors.accent }]}>
              Lex / CDL Carolinas LLC{"\n"}
              📍 Colorado, USA{"\n"}
              <Text onPress={() => Linking.openURL("mailto:support@lexhelps.com")}>📩 support@lexhelps.com</Text>
            </Text>
          </ThemedCard>
        </View>
      </ScrollView>

      {/* Download Button */}
      <ThemedCard>
        <TouchableOpacity style={[styles.downloadButton, { backgroundColor: colors.accent }]} onPress={downloadPDF}>
          <Ionicons name="download-outline" size={20} color="white" style={styles.downloadIcon} />
          <Text style={styles.downloadButtonText}>Download PDF Document</Text>
        </TouchableOpacity>
      </ThemedCard>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  lastUpdated: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
    fontStyle: "italic",
  },
  company: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
  },
  section: {
    marginBottom: 20,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 24,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "justify",
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  contactInfo: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  downloadIcon: {
    marginRight: 8,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
