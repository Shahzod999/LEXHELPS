import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, FlashMode, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CameraProps {
  onPhotoTaken?: (uri: string) => void;
}

const CameraViewComponent: React.FC<CameraProps> = ({ onPhotoTaken }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const { colors } = useTheme();
  const { t } = useTranslation("common");
  // Reference to the camera component to call takePictureAsync
  const cameraRef = useRef<CameraView>(null);

  const showSettingsAlert = useCallback(() => {
    Alert.alert(t("cameraPermissionTitle"), t("cameraPermissionDeniedMessage"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("openSettings"),
        onPress: () => Linking.openSettings(),
      },
    ]);
  }, [t]);

  // Automatically request permission when component mounts
  useEffect(() => {
    if (permission === null) {
      // Permissions are still loading
      return;
    }

    if (!permission.granted && !permission.canAskAgain && permissionDenied) {
      // User has previously denied and can't ask again
      return;
    }

    if (!permission.granted && permission.canAskAgain) {
      // Request permission immediately without custom screen
      requestPermission().then((result) => {
        if (!result.granted) {
          setPermissionDenied(true);
          if (!result.canAskAgain) {
            // User denied and selected "Don't ask again"
            showSettingsAlert();
          }
        }
      });
    }
  }, [permission, requestPermission, permissionDenied, showSettingsAlert]);

  const handleBack = () => {
    if (onPhotoTaken) {
      onPhotoTaken("");
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const picture = await cameraRef.current.takePictureAsync();
        if (onPhotoTaken && picture?.uri) {
          onPhotoTaken(picture.uri);
        }
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        if (onPhotoTaken) {
          onPhotoTaken(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error("Failed to pick image from gallery:", error);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => {
      if (current === "off") return "on";
      if (current === "on") return "auto";
      return "off";
    });
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>{t("loadingCameraPermissions")}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted
    if (permission.canAskAgain) {
      // Still can ask for permission - show loading state while auto-requesting
      return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.text, { color: colors.text }]}>{t("requestingCameraPermission")}</Text>
        </View>
      );
    } else {
      // User has denied permission and can't ask again
      return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.deniedContainer}>
            <Ionicons name="camera-outline" size={64} color={colors.text} style={styles.deniedIcon} />
            <Text style={[styles.text, { color: colors.text }]}>{t("cameraAccessRequired")}</Text>
            <Text style={[styles.descriptionText, { color: colors.text }]}>{t("cameraPermissionDeniedDescription")}</Text>
            <TouchableOpacity style={[styles.settingsButton, { backgroundColor: colors.accent }]} onPress={showSettingsAlert}>
              <Text style={styles.settingsButtonText}>{t("openSettings")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.goBackButton} onPress={handleBack}>
              <Text style={[styles.backButtonText, { color: colors.text }]}>{t("goBack")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} flash={flash} zoom={0}>
        <View style={styles.documentFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>

        <View style={styles.topControls}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.cameraButton} onPress={toggleFlash}>
            <Ionicons name={flash === "off" ? "flash-off" : flash === "on" ? "flash" : "flash-outline"} size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.galleryButton} onPress={pickImageFromGallery}>
          <Ionicons name="images-outline" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.cameraText}>{t("positionDocumentInFrame")}</Text>
      </CameraView>
    </View>
  );
};

export default CameraViewComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  topControls: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraText: {
    position: "absolute",
    top: "15%",
    alignSelf: "center",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  cameraControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#fff",
  },
  documentFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cornerTL: {
    position: "absolute",
    top: "20%",
    left: "5%",
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "white",
  },
  cornerTR: {
    position: "absolute",
    top: "20%",
    right: "5%",
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "white",
  },
  cornerBL: {
    position: "absolute",
    bottom: "20%",
    left: "5%",
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "white",
  },
  cornerBR: {
    position: "absolute",
    bottom: "20%",
    right: "5%",
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "white",
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  deniedContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  deniedIcon: {
    marginBottom: 20,
  },
  settingsButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  settingsButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  goBackButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
