import Header from "@/components/Card/Header";
import ResourceCard from "@/components/Resource/ResourceCard";
import ResourceLoadingCard from "@/components/Resource/ResourceLoadingCard";
import ThemedCard from "@/components/ThemedCard";
import ThemedScreen from "@/components/ThemedScreen";
import ToggleTabsRN from "@/components/ToggleTabs/ToggleTabsRN";
import { useTheme } from "@/context/ThemeContext";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocation } from "@/hooks/useLocation";
import { useGetOpenAIQuery } from "@/redux/api/endpoints/openAI";
import { selectUser } from "@/redux/features/userSlice";
import { Resource } from "@/types/resource";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const RESOURCE_TABS = [
  { id: "1", label: "All Resources", type: "all" },
  { id: "2", label: "Legal Aid", type: "legal" },
  { id: "3", label: "Immigration", type: "immigration" },
  { id: "4", label: "Housing", type: "housing" },
  { id: "5", label: "Hotlines", type: "hotlines" },
];

const LOADING_PLACEHOLDERS_COUNT = 3;

export default function ResourcesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const RESOURCE_TABS = useMemo(() => [
    { id: "1", label: t('allResources'), type: "all" },
    { id: "2", label: t('legalAid'), type: "legal" },
    { id: "3", label: t('immigration'), type: "immigration" },
    { id: "4", label: t('housing'), type: "housing" },
    { id: "5", label: t('hotlines'), type: "hotlines" },
  ], [t]);
  const [activeTab, setActiveTab] = useState<string>("1");
  const [customLocation, setCustomLocation] = useState<string>("");

  const { location, address } = useLocation();
  const profile = useAppSelector(selectUser);

  // Debounce the custom location input with 800ms delay
  const debouncedCustomLocation = useDebounce(customLocation, 800);

  // Use debounced location or fallback to device location
  const currentLocation = debouncedCustomLocation || address || "";
  const activeTabType = RESOURCE_TABS.find((tab) => tab.id === activeTab)?.type || "all";
  const isReadyForResourcesQuery = Boolean(currentLocation && profile?.nationality && profile?.language);

  const handleLocationChange = useCallback((text: string) => {
    setCustomLocation(text);
  }, []);

  const {
    data: resourcesData,
    isLoading,
    isFetching,
    error,
  } = useGetOpenAIQuery(
    {
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that provides accurate information about local resources for immigrants. Always respond in ${profile?.language} language with valid JSON format. Focus on real, verified organizations and services.`,
        },
        {
          role: "user",
          content: `Find me various types of resources and services for immigrants from ${profile?.nationality} living in ${currentLocation}. 

          Please provide real organizations with accurate contact information including:
          - Legal aid organizations
          - Immigration services  
          - Housing assistance
          - Hotlines and emergency services

          Focus on organizations that serve ${profile?.nationality} immigrants and provide services in ${profile?.language}. 

          Return the response as a valid JSON array with the following structure:
          [
            {
              "id": "unique_id",
              "title": "Organization Name", 
              "description": "Brief description of services",
              "type": "legal|immigration|housing|hotlines",
              "contactInfo": {
                "phone": "+1-xxx-xxx-xxxx",
                "email": "contact@org.com",
                "address": "Full address",
                "website": "https://website.com"
              },
              "languages": ["${profile?.language}", "English"],
              "nationality": "${profile?.nationality}",
              "hours": "Mon-Fri 9AM-5PM",
              "services": ["Service 1", "Service 2", "Service 3"],
              "rating": 4.5,
              "verified": true,
            }
          ]

          Provide 8-12 real, relevant resources covering all types of services with accurate contact information.`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.1,
    },
    { skip: !isReadyForResourcesQuery }
  );

  const resources = useMemo(() => {
    if (!resourcesData?.data) return [];

    try {
      const content = resourcesData.data;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (error) {
      console.error("Resources parsing error:", error);
      return [];
    }
  }, [resourcesData?.data]);

  const filteredResources = useMemo(() => {
    return activeTabType === "all" ? resources : resources.filter((resource: Resource) => resource.type === activeTabType);
  }, [resources, activeTabType]);

  const renderContent = () => {
    if (!isReadyForResourcesQuery) {
      return (
        <ThemedCard>
          <View style={styles.noDataContainer}>
            <Ionicons name="information-circle-outline" size={32} color={colors.hint} />
            <Text style={[styles.noDataText, { color: colors.text }]}>{t('completeProfileForResources')}</Text>
            <Text style={[styles.noDataSubtext, { color: colors.hint }]}>
              {t('profileRequirementsDesc')}
            </Text>
          </View>
        </ThemedCard>
      );
    }

    if (isLoading || isFetching) {
      return (
        <View style={styles.resourcesContainer}>
          <Text style={[styles.resourcesHeader, { color: colors.text }]}>
            {t('findingResourcesFor', { nationality: profile?.nationality, location: currentLocation })}
          </Text>
          {Array(LOADING_PLACEHOLDERS_COUNT)
            .fill(0)
            .map((_, index) => (
              <ResourceLoadingCard key={`loading-${index}`} />
            ))}
        </View>
      );
    }

    if (error) {
      return (
        <ThemedCard>
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={32} color="#EF4444" />
            <Text style={[styles.errorText, { color: colors.text }]}>{t('unableToLoadResources')}</Text>
          </View>
        </ThemedCard>
      );
    }

    if (filteredResources.length === 0) {
      return (
        <ThemedCard>
          <View style={styles.noDataContainer}>
            <Ionicons name="search-outline" size={32} color={colors.hint} />
            <Text style={[styles.noDataText, { color: colors.text }]}>{t('noResourcesFound')}</Text>
            <Text style={[styles.noDataSubtext, { color: colors.hint }]}>{t('adjustLocationCategory')}</Text>
          </View>
        </ThemedCard>
      );
    }

    return (
      <View style={styles.resourcesContainer}>
        <Text style={[styles.resourcesHeader, { color: colors.text }]}>
          {activeTabType === "all" 
            ? t('resourcesFound', { count: filteredResources.length })
            : t('typeResourcesFound', { 
                count: filteredResources.length, 
                type: activeTabType === "legal" ? t('legalAid') : 
                      activeTabType === "immigration" ? t('immigration') :
                      activeTabType === "housing" ? t('housing') :
                      activeTabType === "hotlines" ? t('hotlines') : activeTabType
              })
          }
        </Text>
        {filteredResources.map((resource: Resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </View>
    );
  };

  return (
    <ThemedScreen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header title={t('localLegalCommunityHelp')} subtitle={t('realWorldSupport')} />

        <ThemedCard>
          <Text style={[styles.locationTitle, { color: colors.hint }]}>{t('yourLocation')}</Text>
          <View
            style={[
              styles.locationInputContainer,
              {
                borderColor: colors.border,
                backgroundColor: colors.darkBackground,
              },
            ]}
          >
            <Ionicons name="location-outline" size={24} color={colors.hint} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={address || t('enterYourLocation')}
              placeholderTextColor={colors.hint}
              value={customLocation}
              onChangeText={handleLocationChange}
            />
            {isFetching && <Ionicons name="hourglass-outline" size={20} color={colors.hint} style={styles.searchingIcon} />}
          </View>

          {currentLocation && (
            <View style={styles.currentLocationContainer}>
              <Ionicons name="navigate-outline" size={16} color={colors.success} />
              <Text style={[styles.currentLocationText, { color: colors.success }]}>{t('searchingIn')} {currentLocation}</Text>
            </View>
          )}
        </ThemedCard>

        <View style={styles.tabsContainer}>
          <ToggleTabsRN tabs={RESOURCE_TABS} onTabChange={setActiveTab} />
        </View>

        {renderContent()}
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
  locationTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  locationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  input: {
    flex: 1,
  },
  searchingIcon: {
    marginLeft: 8,
  },
  tabsContainer: {
    marginVertical: 16,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  noDataContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  noDataSubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  resourcesContainer: {
    marginTop: 8,
  },
  resourcesHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  currentLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  currentLocationText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
