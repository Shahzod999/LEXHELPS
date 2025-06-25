import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "../context/MenuContext";
import { ThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../context/ToastContext";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ErrorBoundary } from "react-error-boundary";
import { View, Text, TouchableOpacity } from "react-native";

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Something went wrong
      </Text>
      <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#666' }}>
        {error.message}
      </Text>
      <TouchableOpacity 
        onPress={resetErrorBoundary}
        style={{ 
          backgroundColor: '#007AFF', 
          paddingHorizontal: 20, 
          paddingVertical: 10, 
          borderRadius: 8 
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <ThemeProvider>
            <ToastProvider>
              <MenuProvider>
                <Slot />
              </MenuProvider>
            </ToastProvider>
          </ThemeProvider>
        </Provider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
