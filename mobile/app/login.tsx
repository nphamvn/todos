import { View, Text, Button, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <Text>Welcome, please login to continue to use the app.</Text>
      <Button title="Login" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
