import { Link, useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
} from "react-native";

export default function Screen() {
  const router = useRouter();
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
      }}
    >
      <Link href={"debug"}>debug</Link>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {Array.from({ length: 50 }).map((_, i) => (
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
