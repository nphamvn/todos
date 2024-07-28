import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
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
  taskCount: number;
}
export default function Screen() {
  const { getCredentials, user } = useAuth0();
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

  useFocusEffect(
    useCallback(() => {
      fetchLists();
    }, [])
  );

  const handleAddListPress = async () => {
    router.navigate("saveList");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLists();
    setRefreshing(false);
  };

  const handleListPress = (id: string) => {
    router.navigate({
      pathname: "tasks",
      params: { listId: id },
    });
  };

  const handleAvatarPress = () => {
    router.navigate("profile");
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable style={styles.avatarContainer} onPress={handleAvatarPress}>
          <Image src={user?.picture} style={styles.avatar} />
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
            style={styles.listRow}
            onPress={() => handleListPress(list.id)}
          >
            <React.Fragment>
              <Text>{list.name}</Text>
              <Text>{list.taskCount}</Text>
            </React.Fragment>
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
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  header: {},
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  addButton: {
    padding: 10,
    backgroundColor: "rgb(99 102 241)",
    borderRadius: 50,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  listRow: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
