import { useLanguage } from "@/context/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { apiSlice } from "@/redux/api/apiSlice";
import { clearToken } from "@/redux/features/tokenSlice";
import { selectUser } from "@/redux/features/userSlice";
import { removeTokenFromSecureStore } from "@/utils/secureStore";
import { getValidatedUrl } from "@/utils/ValidateImg";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useMenu } from "../context/MenuContext";
import { useTheme } from "../context/ThemeContext";

export default function SlideMenu() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const profile = useAppSelector(selectUser);
  // Memoize profile data to prevent unnecessary re-renders
  const memoizedProfile = useMemo(() => profile, [profile?._id, profile?.name, profile?.profilePicture]);

  const dispatch = useAppDispatch();
  const { menuVisible, hideMenu } = useMenu();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  // const [notifications, setNotifications] = useState(true);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [legalDropdownOpen, setLegalDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(menuVisible);

  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const languages = [
    { code: 'en', name: '🇬🇧 English' },
    { code: 'ru', name: '🇷🇺 Русский' },
    { code: 'es', name: '🇪🇸 Español' },
    { code: 'fr', name: '🇫🇷 Français' },
    { code: 'de', name: '🇩🇪 Deutsch' },
    { code: 'it', name: '🇮🇹 Italiano' },
    { code: 'pt', name: '🇵🇹 Português' },
    { code: 'zh', name: '🇨🇳 中文' },
    { code: 'ja', name: '🇯🇵 日本語' },
    { code: 'ko', name: '🇰🇷 한국어' },
    { code: 'ar', name: '🇸🇦 العربية' },
    { code: 'hi', name: '🇮🇳 हिन्दी' },
  ];

  // Найти текущий язык в списке
  const selectedLanguage = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const legalItems = [
    { title: t('privacyPolicy'), route: "privacy-policy" },
    { title: t('termsOfUse'), route: "terms-of-use" },
  ];

  useEffect(() => {
    if (menuVisible) {
      setIsVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Only hide the component after animation completes
        setIsVisible(false);
      });
    }
  }, [menuVisible, slideAnim, fadeAnim]);

  const handleLogout = async () => {
    hideMenu();
    try {
      await removeTokenFromSecureStore();
      dispatch(clearToken());
      router.replace("/login");
      dispatch(apiSlice.util.resetApiState());
    } catch (error) {
      console.error(error);
    }
  };

  const navigateTo = (route: string) => {
    hideMenu();
    router.push(route as any);
  };

  // Use the internal visibility state instead of menuVisible for rendering
  if (!menuVisible && !isVisible) {
    return null;
  }

  return (
    <Modal visible={isVisible} transparent={true} animationType="none" onRequestClose={hideMenu}>
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={hideMenu}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
              backgroundColor: colors.card,
            },
          ]}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.scrollContent}>
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={hideMenu}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>

              {/* User Profile Header */}
              <View style={styles.profileHeader}>
                <Image
                  source={{
                    uri: getValidatedUrl(memoizedProfile?._id, memoizedProfile?.profilePicture),
                  }}
                  style={styles.avatar}
                />
                <View style={styles.profileInfo}>
                  <Text style={[styles.userName, { color: colors.text }]}>{t('hiUser', { name: memoizedProfile?.name })}</Text>
                  <Text style={[styles.welcomeText, { color: colors.hint }]}>{t('welcomeBack')}</Text>
                  <View style={[styles.badge, { backgroundColor: colors.accent + "20" }]}>
                    <Text style={[styles.badgeText, { color: colors.accent }]}>{t('freeUser')}</Text>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              {/* Profile Section */}
              <View style={styles.section}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("account-settings")}>
                  <Ionicons name="person-outline" size={22} color={colors.text} />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>{t('accountSettings')}</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("subscription")}>
                  <Ionicons name="card-outline" size={22} color={colors.text} />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>Subscription</Text>
                </TouchableOpacity> */}
              </View>

              {/* Preferences Section */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.hint }]}>{t('preferences')}</Text>

                <View style={styles.menuItem}>
                  <Ionicons name="moon-outline" size={22} color={colors.text} />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>{t('darkMode')}</Text>
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    style={styles.switch}
                    trackColor={{
                      false: "#767577",
                      true: colors.accent + "80",
                    }}
                    thumbColor={isDarkMode ? colors.accent : "white"}
                  />
                </View>

                {/* <View style={styles.menuItem}>
                  <Ionicons name="notifications-outline" size={22} color={colors.text} />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>Notifications</Text>
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    style={styles.switch}
                    trackColor={{
                      false: "#767577",
                      true: colors.accent + "80",
                    }}
                    thumbColor={notifications ? colors.accent : "white"}
                  />
                </View> */}

                <TouchableOpacity style={styles.menuItem} onPress={() => setLanguageDropdownOpen(!languageDropdownOpen)}>
                  <Ionicons name="language-outline" size={22} color={colors.text} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.menuItemText, { color: colors.text }]}>{t('language')}</Text>
                    <Text style={[styles.selectedLanguageText, { color: colors.hint }]}>{selectedLanguage.name}</Text>
                  </View>
                  <Ionicons name={languageDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.text} style={styles.chevron} />
                </TouchableOpacity>

                {languageDropdownOpen && (
                  <View style={[styles.dropdownContainer, { backgroundColor: colors.darkBackground }]}>
                    {languages.map((language, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownItem,
                          selectedLanguage.code === language.code && {
                            backgroundColor: colors.accent + "30",
                          },
                        ]}
                        onPress={() => {
                          changeLanguage(language.code);
                          setLanguageDropdownOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            { color: colors.text },
                            selectedLanguage.code === language.code && {
                              color: colors.accent,
                              fontWeight: "500",
                            },
                          ]}
                        >
                          {language.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Support Section */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.hint }]}>{t('support')}</Text>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("help-center")}>
                  <Ionicons name="help-circle-outline" size={22} color={colors.text} />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>{t('helpCenter')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("resources")}>
                  <Ionicons name="book-outline" size={22} color={colors.text} />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>{t('findResources')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => setLegalDropdownOpen(!legalDropdownOpen)}>
                  <Ionicons name="document-text-outline" size={22} color={colors.text} />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>{t('legal')}</Text>
                  <Ionicons name={legalDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.text} style={styles.chevron} />
                </TouchableOpacity>

                {legalDropdownOpen && (
                  <View style={[styles.dropdownContainer, { backgroundColor: colors.darkBackground }]}>
                    {legalItems.map((item, index) => (
                      <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => navigateTo(item.route)}>
                        <Text style={[styles.dropdownItemText, { color: colors.text }]}>{item.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <TouchableOpacity style={[styles.logoutButton, { backgroundColor: "#F44336" }]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color="white" />
                <Text style={styles.logoutText}>{t('logout')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 15,
    position: "absolute",
    top: 0,
    right: 0,
  },
  sidebar: {
    width: 300,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    height: "100%",
    position: "absolute",
    right: 0,
    zIndex: 1000,
  },
  scrollContent: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  badge: {
    backgroundColor: "#E0F7FA",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#00838F",
    fontSize: 12,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#999",
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  selectedLanguageText: {
    fontSize: 12,
    marginLeft: 15,
    marginTop: 2,
  },
  chevron: {
    marginLeft: 5,
  },
  dropdownContainer: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: 20,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  selectedItem: {
    backgroundColor: "#E3F2FD",
  },
  dropdownItemText: {
    fontSize: 14,
  },
  selectedItemText: {
    color: "#1976D2",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#F44336",
    margin: 20,
    marginTop: 10,
    marginBottom: 30,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 10,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});
