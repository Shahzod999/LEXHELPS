import ThemedButton from "@/components/ThemedButton";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Title from "./Title";

interface RegistrationFormProps {
  onSubmit: (data: {
    dateOfBirth: string;
    phoneNumber: string;
    nationality: string;
    name: string;
    email: string;
    password: string;
    bio: string;
  }) => void;
  setStep: (step: number) => void;
  step: number;
  isLoading: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, setStep, step, isLoading }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [nationality, setNationality] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      dateOfBirth: new Date().toLocaleDateString("en-US"),
      phoneNumber: "",
      nationality,
      name,
      email,
      password,
      bio,
    });
  };

  const isStep2Valid = name && email && password;

  const renderStep1 = () => (
    <>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>{t("nationality")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder={t("enterNationality")}
          placeholderTextColor={colors.hint}
          value={nationality}
          onChangeText={setNationality}
        />
        <Text style={[styles.label, { color: colors.hint, fontSize: 12, marginTop: 5 }]}>{t("nationalityHint")}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <ThemedButton title={t("back")} onPress={() => setStep(0)} variant="secondary" />
        <ThemedButton title={t("nextStep")} onPress={() => setStep(2)} style={styles.button} />
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>{t("fullName")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder={t("enterFullName")}
          placeholderTextColor={colors.hint}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>{t("email")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder={t("enterEmail")}
          placeholderTextColor={colors.hint}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>{t("password")}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput, { backgroundColor: colors.card, color: colors.text }]}
            placeholder={t("createPassword")}
            placeholderTextColor={colors.hint}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>{t("aboutMe")}</Text>
        <TextInput
          style={[styles.input, styles.bioInput, { backgroundColor: colors.card, color: colors.text }]}
          placeholder={t("aboutMePlaceholder")}
          placeholderTextColor={colors.hint}
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          returnKeyType="done"
        />
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton title={t("back")} onPress={() => setStep(1)} variant="secondary" />
        <ThemedButton title={t("completeRegistration")} onPress={handleSubmit} disabled={!isStep2Valid} style={styles.button} loading={isLoading} />
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Title
        title={step === 1 ? t("personalInformation") : t("accountDetails")}
        subtitle={step === 1 ? t("personalInfoSubtitle") : t("accountDetailsSubtitle")}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    flex: 1,
  },
  datePicker: {
    height: 200,
  },
  bioInput: {
    height: 100,
    paddingTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },

  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 13,
  },
});

export default RegistrationForm;
