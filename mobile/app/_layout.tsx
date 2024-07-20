import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function Layout() {
  return (
    <ActionSheetProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "List",
              headerLargeTitle: true,
              headerLargeTitleShadowVisible: false,
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="tasks"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="taskEdit"
            options={{
              title: "Task Edit",
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </ActionSheetProvider>
  );
}
