import { StyleSheet, Text, View, Animated, Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useGetQuotesQuery } from "@/redux/api/endpoints/uploadApi";

const { width } = Dimensions.get("window");

const Quotes = () => {
  const { data: quotes } = useGetQuotesQuery();
  const { colors } = useTheme();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!quotes || quotes.length === 0) return;

    const interval = setInterval(() => {
      // Fade out current quote
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Update quote index
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);

        // Reset animations and fade in new quote
        slideAnim.setValue(50);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, [quotes, fadeAnim, slideAnim]);

  if (!quotes || quotes.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.quoteText, { color: colors.hint }]}>Trust the process</Text>
      </View>
    );
  }

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.quoteCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.accent,
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <Text style={[styles.quoteText, { color: colors.text }]}>"{currentQuote.text}"</Text>
      </Animated.View>
    </View>
  );
};

export default Quotes;

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    alignItems: "center",
    opacity: 0.7,
  },
  quoteCard: {
    width: width - 32,
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quoteText: {
    fontSize: 12,
    lineHeight: 11,
    fontWeight: "500",
    fontStyle: "italic",
  },
});
