import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";

import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  Button,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface List {
  id: string;
  name: string;
}
export default function Screen() {
  const { getCredentials, user, clearSession } = useAuth0();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    (async () => {
      const { accessToken } = (await getCredentials())!;
      const response = await fetch("http://raspberrypi.local:5138/lists", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setLists(data);
    })();
  }, []);

  const handleAddListPress = async () => {
    Alert.prompt("Add List", "", async (name) => {
      const token = (await getCredentials())?.accessToken;
      const reponse = await fetch("http://raspberrypi.local:5138/lists", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, id: uuidv4() }),
      });
      if (reponse.ok) {
        const data = await reponse.json();
        setLists((prev) => [...prev, data]);
      }
    });
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        paddingTop: insets.top,
        flex: 1,
      }}
    >
      <View>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            //clearSession();
          }}
        >
          <Image
            src={user?.picture}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
            }}
          />
          <Text>{user?.name}</Text>
        </Pressable>
      </View>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {lists.map((list, i) => (
          <TouchableHighlight
            key={i}
            underlayColor={"#f0f0f0"}
            style={{
              padding: 20,
            }}
            onPress={() => {
              router.navigate({
                pathname: "tasks",
                params: { listId: list.id },
              });
            }}
          >
            <View>
              <Text>{list.name}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </ScrollView>
      <Pressable style={styles.addButton} onPress={handleAddListPress}>
        <MaterialIcons name="add" size={24} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    padding: 10,
    backgroundColor: "rgb(99 102 241)",
    borderRadius: 50,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
