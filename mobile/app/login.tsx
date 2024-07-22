import { View, Text, Button } from "react-native";
import { useAuth0 } from "react-native-auth0";

export default function Screen() {
  const { authorize } = useAuth0();

  const onPress = async () => {
    try {
      await authorize({
        audience: "todo",
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View
      style={{
        paddingTop: 100,
      }}
    >
      <Text>Welcome</Text>
      <Button title="Login" onPress={onPress} />
    </View>
  );
}
