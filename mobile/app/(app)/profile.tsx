import {
  Text,
  ScrollView,
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useAuth0 } from "react-native-auth0";

export default function Screen() {
  const { user, clearSession } = useAuth0();

  const handleLogoutPress = async () => {
    await clearSession();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text>{user?.name}</Text>
      </ScrollView>
      <TouchableHighlight onPress={handleLogoutPress}>
        <Text>Logout</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
