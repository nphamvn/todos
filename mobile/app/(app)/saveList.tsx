import appConfig from "appConfig";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Button title="Back" onPress={handleBackPress} />
        <Text>Add List</Text>
        <Button title="Save" onPress={handleSavePress} />
      </View>
      <View>
        <TextInput
          placeholder="List Name"
          value={name}
          onChangeText={setName}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 8,
    margin: 8,
  },
  button: {
    margin: 8,
  },
});
