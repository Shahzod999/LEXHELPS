import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

interface LocationState {
  location: Location.LocationObject | null;
  address: string | null;
  error: string | null;
  loading: boolean;
}

let globalState: LocationState = {
  location: null,
  address: null,
  error: null,
  loading: false,
};

let locationPromise: Promise<void> | null = null;

export const useLocation = () => {
  const { t } = useTranslation("common");
  const [state, setState] = useState<LocationState>(globalState);

  const getCurrentLocation = useCallback(async () => {
    if (locationPromise) {
      await locationPromise;
      return;
    }

    if (globalState.location || globalState.error) {
      return;
    }

    locationPromise = (async () => {
      globalState = { ...globalState, loading: true };
      setState(globalState);

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          throw new Error(t("locationPermissionDenied"));
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        let address = null;
        try {
          const [firstResult] = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          address = [firstResult?.city, firstResult?.region, firstResult?.country].filter(Boolean).join(", ");
        } catch {}

        globalState = { location, address, error: null, loading: false };
        setState(globalState);
      } catch (error) {
        globalState = {
          ...globalState,
          error: error instanceof Error ? error.message : t("locationError"),
          loading: false,
        };
        setState(globalState);
        Alert.alert(t("error"), t("unableToGetLocation"));
      }
    })();

    await locationPromise;
    locationPromise = null;
  }, [t]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return useMemo(
    () => ({
      ...state,
      getCurrentLocation,
    }),
    [state, getCurrentLocation]
  );
};
