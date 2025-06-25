import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import { ThemedScreen } from "@/components/ThemedScreen";
import { ThemedCard } from "@/components/ThemedCard";
import { useTheme } from "@/context/ThemeContext";

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();

  const downloadPDF = async () => {
    try {
      // Show loading indicator
      Alert.alert("Downloading", "Preparing file for download...");

      // Load PDF file as asset
      const asset = Asset.fromModule(require("../../assets/docs/LEXPRIVACYPOLICY.pdf"));
      await asset.downloadAsync();

      if (!asset.localUri) {
        throw new Error("Could not find file");
      }

      const fileUri = FileSystem.documentDirectory + "LEXPRIVACYPOLICY.pdf";

      // Copy file to documents
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: fileUri,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/pdf",
          dialogTitle: "Save Privacy Policy",
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
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ThemedCard style={styles.header}>
          <Ionicons name="shield-checkmark-outline" size={32} color={colors.accent} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Lex Privacy Policy</Text>
          <Text style={[styles.headerSubtitle, { color: colors.hint }]}>LEX - AI Legal Assistant</Text>
        </ThemedCard>
        <View style={styles.contentContainer}>
          <Text style={[styles.lastUpdated, { color: colors.hint }]}>Last Updated: June 10, 2025</Text>
          <Text style={[styles.company, { color: colors.hint }]}>CDL Carolinas LLC</Text>

          <ThemedCard style={styles.summaryCard}>
            <Text style={[styles.summaryText, { color: colors.text }]}>
              This policy explains how we protect your data, how we use AI, and your rights. We never sell your data. We use your documents to help
              you — not to track, advertise, or profile you.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>1. Introduction</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Welcome to Lex. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile
              application and related services (collectively, the &quot;Service&quot;). Please read this privacy policy carefully. If you do not agree with the terms
              of this privacy policy, please do not access the Service.
            </Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by
              updating the &quot;Last updated&quot; date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed
              of updates.
            </Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              You will be deemed to have been made aware of, will be subject to, and will be deemed to have accepted the changes in any revised
              Privacy Policy by your continued use of the Service after the date such revised Privacy Policy is posted.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>2. Information We Collect</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              To provide our legal and immigration assistance services, Lex collects and processes specific categories of personal and technical
              information:
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>a. Identity & Contact Information</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              We collect your full name, email address, country of residence, and preferred language to personalize your experience and ensure
              accurate jurisdiction-based support.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>b. Uploaded Documents & Scanned Media</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Documents you upload or scan (e.g., PDFs, images) are securely processed to extract relevant legal information. These files are used
              solely for generating context-specific responses and are not reused for unrelated purposes.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>c. Geolocation & IP Data</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Lex may access your IP address or device-based location data to determine your jurisdiction, present relevant legal information, and
              display local resources. Location data is never used for advertising or behavioral tracking.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>d. Device & Technical Information</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              We collect standard technical details, including browser type, OS version, IP address, session time, and app usage data, to ensure
              platform security and performance.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>e. AI Interaction Logs</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              User inputs and AI-generated responses are logged to improve system accuracy, ensure responsible usage, and support safety monitoring.
              These logs are never used for profiling or marketing.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>f. Feature Usage Data</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Lex monitors which tools you use (e.g., SOS help, document analysis, chat) to enhance product development and user experience.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>g. Camera Access</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              When scanning documents, camera access is requested strictly for capturing document images. No facial data or background visuals are
              stored or analyzed.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>h. Translation Logs</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              When using Lex&apos;s translation feature, your text is temporarily processed to complete translation requests. These logs are securely
              discarded after the session.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>3. How We Use Your Information</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Lex processes your information solely to deliver, enhance, and secure the services we provide. Our use of your data aligns strictly with
              the platform&apos;s core legal support functions.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>a. Service Delivery & Personalization</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              We use your documents, location, and language preferences to generate accurate AI-powered responses, provide jurisdiction-specific legal
              support, and translate materials as needed.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>b. Platform Performance & Reliability</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Technical and usage data helps us ensure stability, resolve system issues, and improve functionality based on real-world usage.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>c. Support & Communications</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Your contact details are used to provide user support, respond to inquiries, and send important updates. We do not send promotional
              materials unless you opt in.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>d. Legal & Regulatory Compliance</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              We process data as required by applicable laws, including consumer protection, digital services regulations, and lawful disclosure
              obligations.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>e. Security & Abuse Prevention</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Lex monitors usage patterns to detect and prevent misuse, enforce platform integrity, and respond to suspicious activity or abuse.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>f. AI Quality & Fairness</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              AI interaction logs are reviewed (in pseudonymized form) to improve accuracy, reduce bias, and enhance model performance. We do not use
              identifiable data for AI training without explicit consent.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>g. Emergency Support Functionality</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              For users activating the SOS feature, location and session data is used to display local legal resources and assist in urgent
              situations—handled with the highest confidentiality.
            </Text>
          </ThemedCard>

          <ThemedCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>4. Legal Basis for Processing Personal Data</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Lex is committed to full compliance with applicable international data protection laws, including but not limited to the General Data
              Protection Regulation (GDPR) in the European Economic Area (EEA), the UK GDPR, and the California Consumer Privacy Act (CCPA), among
              others.
            </Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              We process your personal data only when there is a valid legal basis to do so. The specific legal bases under which we process personal
              information are as follows:
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>a. Contractual Necessity</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              We process certain personal information to fulfill our contractual obligations to you. This includes enabling you to:
            </Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              • Upload, scan, and receive legal document analysis{"\n"}• Access translated legal assistance based on your country of residence{"\n"}•
              Use location-based features and SOS services{"\n"}• Interact with the AI assistant for real-time legal guidance
            </Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Where you use Lex in reliance on our Terms of Use, this processing is essential to deliver the agreed-upon services.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>b. Legitimate Interests</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              In certain cases, we process your data to pursue our legitimate business interests, provided those interests do not override your rights
              and freedoms. These interests include:
            </Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              • Improving platform performance and reliability{"\n"}• Securing the application against fraud, misuse, or legal liability{"\n"}•
              Monitoring AI interactions to ensure safety, accuracy, and fairness{"\n"}• Facilitating internal analytics and service innovation
            </Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              We conduct careful balancing assessments to ensure that our interests do not compromise your privacy or data protection rights.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>c. Legal Obligations</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              We may process or retain your data when we are legally required to do so. This includes obligations under:
            </Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              • Civil, consumer protection, or digital services regulations{"\n"}• Tax, anti-fraud, or anti-money laundering laws{"\n"}• Mandatory
              reporting obligations for certain jurisdictions
            </Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              When we are compelled by law, we ensure the minimum amount of personal data is disclosed and that appropriate safeguards are in place.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>d. Consent</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              Where your explicit consent is required for certain processing activities—such as receiving marketing communications or enabling
              optional feature tracking—we obtain this consent clearly and transparently. You may withdraw your consent at any time by contacting us
              at support@lexhelps.com or adjusting your in-app settings. Withdrawal of consent will not affect the lawfulness of any processing
              carried out prior to such withdrawal.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.accent }]}>e. Public Interest and Vital Interest (where applicable)</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              In rare circumstances, we may process personal data where it is necessary for the performance of a task carried out in the public
              interest or in the exercise of official authority, or where it is necessary to protect the vital interests of individuals.
            </Text>
          </ThemedCard>

          <ThemedCard>
            <Text style={[styles.contactTitle, { color: colors.accent }]}>Contact Information</Text>
            <Text style={[styles.contactText, { color: colors.text }]}>
              For questions or concerns regarding this Privacy Policy or to exercise your rights, please contact us:
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
  summaryCard: {
    marginBottom: 20,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#785ff7",
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    lineHeight: 24,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    lineHeight: 20,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "justify",
    marginBottom: 8,
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
