import appConfig from "appConfig";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";

export default function Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getCredentials } = useAuth0();

  const [name, setName] = useState("");

  const handleBackPress = () => {
    router.back();
  };

  const handleSavePress = async () => {
    const token = (await getCredentials())?.accessToken;
    const reponse = await fetch(`${appConfig.apiUrl}/lists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, id: uuidv4() }),
    });
    if (reponse.ok) {
      router.back();
    }
  };

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          headerLeft: () => <Button title="Cancel" onPress={handleBackPress} />,
          headerRight: () => <Button title="Save" onPress={handleSavePress} />,
        }}
      />
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <TextInput
          placeholder="List Name"
          value={name}
          onChangeText={setName}
          autoFocus
          style={styles.input}
        />
      </SafeAreaView>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgb(250 250 250)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
    fontSize: 18,
  },
  button: {
    margin: 8,
  },
});
