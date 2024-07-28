import { Redirect, Stack } from "expo-router";
import { useAuth0 } from "react-native-auth0";
import { Text } from "react-native";

export default function Layout() {
  const { user, isLoading } = useAuth0();
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="login" />;
  }
  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{
          //headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="saveList"
        options={{
          presentation: "modal",
          //headerShown: false,
          title: "Save List",
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
  );
}
