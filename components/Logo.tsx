import { Image, StyleSheet, View } from "react-native";

const Logo = () => {
  return (
    <View style={styles.iconContainer}>
      <Image source={require("@/assets/images/icon.png")} style={styles.imageIcon} />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "10%",
    left: 0,
    right: 0,
    marginVertical: 20,
    gap: 15,
  },
  imageIcon: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});
