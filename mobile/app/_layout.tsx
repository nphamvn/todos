import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Slot } from "expo-router";
import { Auth0Provider } from "react-native-auth0";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <Auth0Provider
      domain="dev-vzxphouz.us.auth0.com"
      clientId="QqAyHPMn0JaURmvDNESvLtO642ikMcH2"
    >
      <ActionSheetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Slot />
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </Auth0Provider>
  );
}
