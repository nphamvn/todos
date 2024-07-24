import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  Image,
  Pressable,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import appConfig from "appConfig";
interface List {
  id: string;
  name: string;
}
export default function Screen() {
  const { getCredentials, user, clearSession } = useAuth0();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);
  const [lists, setLists] = useState<List[]>([]);

  const fetchLists = async () => {
    const { accessToken } = (await getCredentials())!;
    const response = await fetch(`${appConfig.apiUrl}/lists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setLists(data);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleAddListPress = async () => {
    router.navigate("saveList");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLists();
    setRefreshing(false);
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
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
