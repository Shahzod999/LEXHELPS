import { Platform, Vibration } from "react-native";
import * as Haptics from "expo-haptics";
import { AndroidHaptics } from "expo-haptics";

export const handleHapticPress = () => {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } else {
    AndroidHaptics.Clock_Tick;
  }
};
