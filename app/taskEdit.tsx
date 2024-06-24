import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Screen() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Task {id}</Text>
    </View>
  );
}
