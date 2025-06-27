import ThemedButton from "@/components/ThemedButton";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BottomModal from "../Modal/BottomModal";
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
  const { colors } = useTheme();
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      dateOfBirth: dateOfBirth.toLocaleDateString("en-US"),
      phoneNumber,
      nationality,
      name,
      email,
      password,
      bio,
    });
  };

  const onDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (selectedDate) {
        setDateOfBirth(selectedDate);
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirmDate = () => {
    setDateOfBirth(tempDate);
    setShowDatePicker(false);
  };

  const handleCancelDate = () => {
    setTempDate(dateOfBirth);
    setShowDatePicker(false);
  };

  const isStep2Valid = name && email && password;

  const renderStep1 = () => (
    <>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Date of Birth</Text>
        <TouchableOpacity
          style={[styles.input, styles.dateInput, { backgroundColor: colors.card }]}
          onPress={() => {
            setTempDate(dateOfBirth);
            setShowDatePicker(true);
          }}
        >
          <Text style={{ color: colors.text }}>{dateOfBirth.toLocaleDateString("en-US")}</Text>
        </TouchableOpacity>

        {Platform.OS === "ios" ? (
          <BottomModal visible={showDatePicker} onClose={handleCancelDate} onConfirm={handleConfirmDate} title="Select Date">
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={onDateChange}
              maximumDate={new Date()}
              style={styles.datePicker}
            />
          </BottomModal>
        ) : (
          showDatePicker && <DateTimePicker value={dateOfBirth} mode="date" display="default" onChange={onDateChange} maximumDate={new Date()} />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Enter your phone number"
          placeholderTextColor={colors.hint}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Nationality</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Enter your nationality"
          placeholderTextColor={colors.hint}
          value={nationality}
          onChangeText={setNationality}
        />
        <Text style={[styles.label, { color: colors.hint, fontSize: 12, marginTop: 5 }]}>
          Depending on your nationality, we will provide you with the best possible experience.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <ThemedButton title="Back" onPress={() => setStep(0)} variant="secondary" />
        <ThemedButton title="Next Step" onPress={() => setStep(2)} style={styles.button} />
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Enter your full name"
          placeholderTextColor={colors.hint}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Enter your email"
          placeholderTextColor={colors.hint}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="Create a password"
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
        <Text style={[styles.label, { color: colors.text }]}>About Me</Text>
        <TextInput
          style={[styles.input, styles.bioInput, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="This will be used to personalize your experience."
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
        <ThemedButton title="Back" onPress={() => setStep(1)} variant="secondary" />
        <ThemedButton title="Complete Registration" onPress={handleSubmit} disabled={!isStep2Valid} style={styles.button} loading={isLoading} />
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Title
        title={step === 1 ? "Personal Information" : "Account Details"}
        subtitle={step === 1 ? "Please provide your personal details" : "Create your account credentials"}
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
  dateInput: {
    justifyContent: "center",
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
