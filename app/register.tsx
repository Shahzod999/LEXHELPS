import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ThemedScreen from "@/components/ThemedScreen";
import LanguagePicker from "@/components/Register/LanguagePicker";
import RegistrationForm from "@/components/Register/RegistrationForm";
import ThemedButton from "@/components/ThemedButton";
import { Link, router } from "expo-router";
import { useRegisterMutation } from "@/redux/api/endpoints/authApiSlice";

const RegisterScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>();
  const [step, setStep] = useState<number>(0);
  const [registrationData, setRegistrationData] = useState<{
    dateOfBirth: string;
    phoneNumber: string;
    nationality: string;
    name: string;
    email: string;
    password: string;
    bio: string;
  } | null>(null);

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
    setRegistrationData(data);

    try {
      console.log("Registration data:", {
        language: selectedLanguage,
        ...data,
      });

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
            <ThemedButton title="Login" onPress={() => router.push("/login")} />
            <ThemedButton title="Continue" onPress={handleContinue} disabled={!selectedLanguage} style={styles.button} />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <RegistrationForm onSubmit={handleRegistrationSubmit} setStep={setStep} step={step} isLoading={isLoading} />
        </View>
      )}

      <View style={styles.linkContainer}>
        <Text style={styles.disclaimerText}>Нажимая &quot;Продолжить&quot;, вы подтверждаете, что ознакомились и согласны с:</Text>
        <View style={styles.linksRow}>
          <Link href="https://www.lexhelps.com/privacy" style={styles.link}>
            Политикой конфиденциальности
          </Link>
          <Text style={styles.andText}> и </Text>
          <Link href="https://www.lexhelps.com/terms-of-use" style={styles.link}>
            Условиями использования
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
    marginVertical: 10,
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
