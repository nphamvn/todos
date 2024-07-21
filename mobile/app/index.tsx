import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
} from "react-native";
interface List {
  id: string;
  name: string;
}
export default function Screen() {
  const router = useRouter();
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    setLists(
      Array.from({ length: 10 }).map((_, i) => ({
        id: i.toString(),
        name: `List ${i}`,
      }))
    );
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
      }}
    >
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
