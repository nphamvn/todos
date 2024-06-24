import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
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
            title: "Tasks",
            headerLargeTitle: true,
            headerLargeTitleShadowVisible: false,
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            },
          }}
        />
        <Stack.Screen
          name="taskEdit"
          options={{
            title: "Task Edit",
            // headerLargeTitle: true,
            // headerLargeTitleShadowVisible: false,
            // headerShadowVisible: false,
            // headerStyle: {
            //   backgroundColor: "rgba(255, 255, 255, 0.5)",
            // },
          }}
          //getId={({ params }) => params.id} // 👈 add getId
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
