import LoadingScreen from "@/components/common/LoadingScreen";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { selectToken, setToken } from "@/redux/features/tokenSlice";
import { getTokenFromSecureStore } from "@/utils/secureStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const token = useAppSelector(selectToken);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await getTokenFromSecureStore();
        if (token) {
          dispatch(setToken(token));
        }
      } catch (error) {
        console.error("Error loading token:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      try {
        if (token) {
          router.replace("/(tabs)");
        } else {
          router.replace("/register");
        }
      } catch (error) {
        console.error("Error navigating:", error);
        // Fallback to register page if navigation fails
        router.replace("/register");
      }
    }
  }, [isLoading, token, router]);

  if (hasError) {
    // If there's an error loading the token, just go to register
    return <LoadingScreen />;
  }

  return <LoadingScreen />;
}
