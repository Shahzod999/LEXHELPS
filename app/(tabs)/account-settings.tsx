import { Loading } from "@/components/common/LoadingScreen";
import BottomModal from "@/components/Modal/BottomModal";
import ThemedButton from "@/components/ThemedButton";
import ThemedCard from "@/components/ThemedCard";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { apiSlice } from "@/redux/api/apiSlice";
import { useDeleteProfileMutation, useUpdateProfileMutation } from "@/redux/api/endpoints/authApiSlice";
import { useUploadImageMutation } from "@/redux/api/endpoints/uploadApi";
import { clearToken } from "@/redux/features/tokenSlice";
import { selectUser } from "@/redux/features/userSlice";
import { removeTokenFromSecureStore } from "@/utils/secureStore";
import { getValidatedUrl } from "@/utils/ValidateImg";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ThemedScreen from "../../components/ThemedScreen";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";

export default function AccountSettings() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { showSuccess, showError } = useToast();
  const profile = useAppSelector(selectUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [deleteProfile, { isLoading: isDeleting }] = useDeleteProfileMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    bio: profile?.bio || "",
    phoneNumber: profile?.phoneNumber || "",
    nationality: profile?.nationality || "",
    language: profile?.language || "",
    dateOfBirth: profile?.dateOfBirth ? new Date(profile?.dateOfBirth) : new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    password: "",
  });

  const uploadImg = async (imageUri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile-image.jpg",
    } as unknown as File);
    formData.append("type", "logo");

    try {
      const response = await uploadImage(formData);
      return response.data?.filePath;
    } catch (error) {
      console.error("Error uploading image:", error);
      showError(t('errorUploadingImage'));
      throw error;
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri && profile) {
        try {
          const res = await uploadImg(result.assets[0].uri);

          if (!res) {
            throw new Error("Failed to upload image");
          }

          const updateResult = await updateProfile({
            profilePicture: res,
          }).unwrap();

          if (!updateResult) {
            throw new Error("Failed to update profile");
          }

          showSuccess(t('profilePictureUpdated'));
        } catch (error) {
          console.error("Error updating profile picture:", error);
          showError(t('errorUpdatingProfilePicture'));
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (selectedDate) {
        setFormData((prev) => ({ ...prev, dateOfBirth: selectedDate }));
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirmDate = () => {
    setFormData((prev) => ({ ...prev, dateOfBirth: tempDate }));
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {
    try {
      if (profile) {
        await updateProfile({
          ...profile,
          ...formData,
          dateOfBirth: formData.dateOfBirth.toISOString(),
        }).unwrap();
        showSuccess(t('profileUpdated'));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showError(t('errorUpdatingProfile'));
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (profile) {
        await updateProfile({
          oldPassword: passwordData.oldPassword,
          password: passwordData.password,
        }).unwrap();
        setPasswordData({ oldPassword: "", password: "" });
        showSuccess(t('passwordChanged'));
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showError(t('errorChangingPassword'));
    }
  };

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        nationality: profile.nationality,
        language: profile.language,
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date(),
        bio: profile.bio,
      }));
    }
  }, [profile]);

  const handleDeleteAccount = async () => {
    try {
      const res = await deleteProfile(profile?._id).unwrap();
      if (res.status == "success") {
        await removeTokenFromSecureStore();
        dispatch(clearToken());
        router.replace("/login");
        dispatch(apiSlice.util.resetApiState());
        showSuccess(t('accountDeleted'));
      } else {
        showError(res.message);
      }
    } catch (error) {
      showError(t('errorDeletingAccount'));
    }
  };

  const totalLoading = isLoading || isDeleting || isUploading;
  return (
    <ThemedScreen>
      {totalLoading && <Loading />}
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedCard style={styles.profileCard}>
            <TouchableOpacity disabled={totalLoading} onPress={handleImagePick} style={styles.imageContainer}>
              {totalLoading && <ActivityIndicator style={styles.loadingIndicator} color={colors.accent} size="large" />}
              {profile?.profilePicture ? (
                <Image
                  source={{
                    uri: getValidatedUrl(profile._id, profile.profilePicture),
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={[styles.profileImage, { backgroundColor: colors.accent }]}>
                  <Ionicons name="person" size={40} color="white" />
                </View>
              )}
              <View style={[styles.editIconContainer, { backgroundColor: colors.accent }]}>
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.name, { color: colors.text }]}>{profile?.name}</Text>
            <Text style={[styles.email, { color: colors.hint }]}>{profile?.email}</Text>
          </ThemedCard>

          <ThemedCard style={styles.infoCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-circle-outline" size={24} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('personalInformation')}</Text>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="person-outline" size={20} color={colors.hint} />
                <Text style={[styles.label, { color: colors.hint }]}>{t('fullName')}</Text>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.name}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                placeholder={t('enterFullName')}
                placeholderTextColor={colors.hint}
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="mail-outline" size={20} color={colors.hint} />
                <Text style={[styles.label, { color: colors.hint }]}>{t('email')}</Text>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.email}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
                placeholder={t('enterEmail')}
                placeholderTextColor={colors.hint}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="call-outline" size={20} color={colors.hint} />
                <Text style={[styles.label, { color: colors.hint }]}>{t('phoneNumber')}</Text>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.phoneNumber}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, phoneNumber: text }))}
                placeholder={t('enterPhoneNumber')}
                placeholderTextColor={colors.hint}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="globe-outline" size={20} color={colors.hint} />
                <Text style={[styles.label, { color: colors.hint }]}>{t('nationality')}</Text>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.nationality}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, nationality: text }))}
                placeholder={t('enterNationality')}
                placeholderTextColor={colors.hint}
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="calendar-outline" size={20} color={colors.hint} />
                <Text style={[styles.label, { color: colors.hint }]}>{t('dateOfBirth')}</Text>
              </View>
              <TouchableOpacity
                style={[styles.input, styles.dateInput, { backgroundColor: colors.card }]}
                onPress={() => {
                  setTempDate(formData.dateOfBirth);
                  setShowDatePicker(true);
                }}
              >
                <Text style={{ color: colors.text }}>{formData.dateOfBirth.toLocaleDateString()}</Text>
              </TouchableOpacity>

              {Platform.OS === "ios" ? (
                <BottomModal visible={showDatePicker} onClose={() => setShowDatePicker(false)} onConfirm={handleConfirmDate} title={t('selectDate')}>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    style={styles.datePicker}
                  />
                </BottomModal>
              ) : (
                showDatePicker && (
                  <DateTimePicker value={formData.dateOfBirth} mode="date" display="default" onChange={handleDateChange} maximumDate={new Date()} />
                )
              )}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="chatbubble-outline" size={20} color={colors.hint} />
                <Text style={[styles.label, { color: colors.hint }]}>{t('aboutMe')}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.bioInput, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.bio}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, bio: text }))}
                placeholder={t('tellAboutYourself')}
                placeholderTextColor={colors.hint}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <ThemedButton title={t('saveChanges')} onPress={handleSubmit} loading={isLoading} style={styles.button} icon="save-outline" />
          </ThemedCard>

          <ThemedCard style={styles.infoCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="lock-closed-outline" size={24} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('changePassword')}</Text>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="key-outline" size={20} color={colors.hint} />
                <Text style={[styles.label, { color: colors.hint }]}>{t('currentPassword')}</Text>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput, { backgroundColor: colors.card, color: colors.text }]}
                  value={passwordData.oldPassword}
                  onChangeText={(text) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      oldPassword: text,
                    }))
                  }
                  placeholder={t('enterCurrentPassword')}
                  placeholderTextColor={colors.hint}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="key-outline" size={20} color={colors.hint} />
                <Text style={[styles.label, { color: colors.hint }]}>{t('newPassword')}</Text>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput, { backgroundColor: colors.card, color: colors.text }]}
                  value={passwordData.password}
                  onChangeText={(text) => setPasswordData((prev) => ({ ...prev, password: text }))}
                  placeholder={t('enterNewPassword')}
                  placeholderTextColor={colors.hint}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            <ThemedButton title={t('changePassword')} onPress={handlePasswordChange} loading={totalLoading} style={styles.button} icon="key-outline" />
          </ThemedCard>

          <ThemedButton
            title={t('deleteAccount')}
            onPress={() => setShowDeleteModal(true)}
            loading={totalLoading}
            style={styles.deleteButton}
            icon="trash-outline"
            variant="danger"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => setShowDeleteModal(false)}
        title={t('deleteAccount')}
      >
        <View style={styles.deleteModal}>
          <Text style={[styles.deleteModalTitle, { color: colors.text }]}>{t('areYouSureYouWantToDeleteYourAccount')}</Text>
        </View>
        <ThemedButton
          title={t('deleteAccount')}
          onPress={handleDeleteAccount}
          loading={totalLoading}
          style={styles.button}
          icon="trash-outline"
          variant="danger"
        />
      </BottomModal>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  loadingIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 16,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  infoCard: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
  },
  formGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
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
  datePicker: {
    height: 200,
  },
  bioInput: {
    height: 100,
    paddingTop: 10,
  },
  button: {
    marginTop: 8,
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
  deleteButton: {
    marginVertical: 20,
  },
  deleteModal: {
    padding: 20,
  },
  deleteModalTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  deleteModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
