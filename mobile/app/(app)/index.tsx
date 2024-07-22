import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  Button,
  Image,
  Pressable,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface List {
  id: string;
  name: string;
}
export default function Screen() {
  const { getCredentials, user } = useAuth0();
  const router = useRouter();
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    (async () => {
      const { accessToken } = (await getCredentials())!;
      const response = await fetch("http://127.0.0.1:5138/lists", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setLists(data);
    })();
  }, []);
  const { clearSession } = useAuth0();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        paddingTop: insets.top,
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
        {lists.map((_, i) => (
          <TouchableHighlight
            key={i}
            underlayColor={"#f0f0f0"}
            style={{
              padding: 20,
            }}
            onPress={() => {
              router.navigate("tasks");
            }}
          >
            <View>
              <Text>List {i}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
