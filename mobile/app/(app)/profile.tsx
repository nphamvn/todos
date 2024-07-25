import { View, Text, ScrollView, TouchableHighlight } from "react-native";
import { useAuth0 } from "react-native-auth0";

export default function Screen() {
  const { user, clearSession } = useAuth0();

  const handleLogoutPress = async () => {
    await clearSession();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Text>{user?.name}</Text>
      </ScrollView>
      <TouchableHighlight onPress={handleLogoutPress}>
        <Text>Logout</Text>
      </TouchableHighlight>
    </View>
  );
}
