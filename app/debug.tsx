import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ItemType {
  id: string;
  title: string;
  createdTime: number;
  deleted: boolean;
  deletedTime: number | null;
}

interface ItemProps {
  item: ItemType;
  onPress: (item: ItemType) => void;
  closeSwipeable: () => void;
  setCurrentSwipeable: (ref: Swipeable | null) => void;
}

const Item: React.FC<ItemProps> = ({
  item,
  onPress,
  closeSwipeable,
  setCurrentSwipeable,
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  useEffect(() => {
    if (setCurrentSwipeable) {
      setCurrentSwipeable(swipeableRef.current);
    }
  }, [setCurrentSwipeable]);

  const handleItemPress = () => {
    closeSwipeable();
    onPress(item);
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [100, 0],
    });

    return (
      <Animated.View style={{ transform: [{ translateX: trans }] }}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            closeSwipeable();
            onPress(item);
          }}
        >
          <Text style={styles.deleteButtonText}>
            {item.deleted ? "Undo" : "Delete"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => setCurrentSwipeable(swipeableRef.current)}
    >
      <TouchableOpacity onPress={handleItemPress} style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
};

interface ItemListProps {
  data: ItemType[];
  onPress: (item: ItemType) => void;
  closeSwipeable: () => void;
  setCurrentSwipeable: (ref: Swipeable | null) => void;
}

const ItemList: React.FC<ItemListProps> = ({
  data,
  onPress,
  closeSwipeable,
  setCurrentSwipeable,
}) => (
  <FlatList
    data={data}
    renderItem={({ item }) => (
      <Item
        item={item}
        onPress={onPress}
        closeSwipeable={closeSwipeable}
        setCurrentSwipeable={setCurrentSwipeable}
      />
    )}
    keyExtractor={(item) => item.id}
  />
);

const App: React.FC = () => {
  const [items, setItems] = useState<ItemType[]>([
    {
      id: "1",
      title: "Item 1",
      createdTime: new Date().getTime(),
      deleted: false,
      deletedTime: null,
    },
    {
      id: "2",
      title: "Item 2",
      createdTime: new Date().getTime() + 1000,
      deleted: false,
      deletedTime: null,
    },
    {
      id: "3",
      title: "Item 3",
      createdTime: new Date().getTime() + 2000,
      deleted: false,
      deletedTime: null,
    },
  ]);

  const [showDeleted, setShowDeleted] = useState(true);
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const currentSwipeableRef = useRef<Swipeable | null>(null);

  const handleItemPress = (item: ItemType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id
          ? {
              ...i,
              deleted: !i.deleted,
              deletedTime: i.deleted ? null : new Date().getTime(),
            }
          : i
      )
    );
  };

  const toggleDeletedItems = () => {
    setShowDeleted((prev) => !prev);
    Animated.timing(opacityAnim, {
      toValue: showDeleted ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSwipeable = () => {
    if (currentSwipeableRef.current) {
      currentSwipeableRef.current.close();
      currentSwipeableRef.current = null;
    }
  };

  const list1 = items
    .filter((item) => !item.deleted)
    .sort((a, b) => b.createdTime - a.createdTime);
  const list2 = items
    .filter((item) => item.deleted)
    .sort((a, b) => b.deletedTime! - a.deletedTime!);

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableWithoutFeedback onPress={closeSwipeable}>
        <View style={styles.innerContainer}>
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>List 1 (Created Time)</Text>
            <ItemList
              data={list1}
              onPress={handleItemPress}
              closeSwipeable={closeSwipeable}
              setCurrentSwipeable={(ref) => {
                currentSwipeableRef.current = ref;
              }}
            />
          </View>
          <TouchableOpacity
            onPress={toggleDeletedItems}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>
              {showDeleted ? "Hide Deleted Items" : "Show Deleted Items"}
            </Text>
          </TouchableOpacity>
          <Animated.View
            style={[styles.listContainer, { opacity: opacityAnim }]}
          >
            <Text style={styles.listTitle}>List 2 (Deleted Time)</Text>
            <ItemList
              data={list2}
              onPress={handleItemPress}
              closeSwipeable={closeSwipeable}
              setCurrentSwipeable={(ref) => {
                currentSwipeableRef.current = ref;
              }}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  innerContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    //alignItems: "center",
  },
  listTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#f9c2ff",
  },
  title: {
    fontSize: 18,
  },
  toggleButton: {
    padding: 10,
    backgroundColor: "#6200EE",
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: "100%",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});

export default App;
