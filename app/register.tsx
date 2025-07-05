import LanguagePicker from "@/components/Register/LanguagePicker";
import RegistrationForm from "@/components/Register/RegistrationForm";
import ThemedButton from "@/components/ThemedButton";
import ThemedScreen from "@/components/ThemedScreen";
import { useToast } from "@/context/ToastContext";
import { useRegisterMutation } from "@/redux/api/endpoints/authApiSlice";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

const RegisterScreen = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>();
  const [step, setStep] = useState<number>(0);

  const { showToast } = useToast();

  const [register, { isLoading }] = useRegisterMutation();

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      setStep(1);
    }
  };

  const handleRegistrationSubmit = async (data: {
    dateOfBirth: string;
    phoneNumber: string;
    nationality: string;
    name: string;
    email: string;
    password: string;
    bio: string;
  }) => {
    try {
      console.log("Registration data:", {
        language: selectedLanguage,
        ...data,
      });

      if (!data.email.includes("@")) {
        showToast(t("invalidEmail"), "error");
        return;
      }

      await register({
        language: selectedLanguage,
        ...data,
      }).unwrap();

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <ThemedScreen>
      {step === 0 ? (
        <View style={styles.container}>
          <LanguagePicker selectedLanguage={selectedLanguage} onLanguageSelect={handleLanguageSelect} />
          <View style={styles.buttonContainer}>
            <ThemedButton title={"Login"} onPress={() => router.push("/login")} />
            <ThemedButton title={t("continue")} onPress={handleContinue} disabled={!selectedLanguage} style={styles.button} />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <RegistrationForm onSubmit={handleRegistrationSubmit} setStep={setStep} step={step} isLoading={isLoading} />
        </View>
      )}

      <View style={styles.linkContainer}>
        <Text style={styles.disclaimerText}>{t("privacyPolicyDisclaimer")}</Text>
        <View style={styles.linksRow}>
          <Link href="https://www.lexhelps.com/privacy" style={styles.link}>
            {t("privacyPolicy")}
          </Link>
          <Text style={styles.andText}> {t("and")} </Text>
          <Link href="https://www.lexhelps.com/terms-of-use" style={styles.link}>
            {t("termsOfUse")}
          </Link>
        </View>
      </View>
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
  linkContainer: {
    alignItems: "center",
  },
  disclaimerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  linksRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  andText: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 5,
    marginVertical: 10,
  },
});

export default RegisterScreen;
