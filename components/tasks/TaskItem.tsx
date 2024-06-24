import Task from "models/task";
import { memo, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import FixedTouchableHighlight from "@components/FixedTouchableHighlight";

export function TaskItem({
  task,
  onPress,
  onCompletedPress,
  setCurrentSwipeable,
  closeSwipeable,
}: {
  task: Task;
  onPress: (task: Task) => void;
  onCompletedPress: (task: Task, completed: boolean) => void;
  setCurrentSwipeable: (swipeable: Swipeable | null) => void;
  closeSwipeable: () => void;
}) {
  const swipeableRef = useRef<Swipeable>(null);
  useEffect(() => {
    if (setCurrentSwipeable) {
      setCurrentSwipeable(swipeableRef.current);
    }
  }, [setCurrentSwipeable]);

  const handleItemPress = () => {
    closeSwipeable();
    onPress(task);
  };

  const renderRightActions = (
    progressAnimatedValue: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [100, 0],
    });

    return (
      <Animated.View style={{ transform: [{ translateX: trans }] }}>
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            justifyContent: "center",
            alignItems: "center",
            width: 75,
            height: "100%",
          }}
          onPress={() => {
            closeSwipeable();
            onPress(task);
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18 }}>
            {task.completed ? "Undo" : "Delete"}
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
      onSwipeableOpen={() => {
        setCurrentSwipeable(swipeableRef.current);
      }}
    >
      <FixedTouchableHighlight
        underlayColor={"#f0f0f0"}
        style={{
          margin: 4,
        }}
        onPress={handleItemPress}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              onCompletedPress(task, !task.completed);
            }}
          >
            <View>
              <MaterialIcons
                name={task.completed ? "check-circle" : "check-circle-outline"}
                size={24}
                color="#333"
              />
            </View>
          </TouchableWithoutFeedback>
          <Text
            style={{
              marginLeft: 4,
              color: "#333",
              textDecorationLine: task.completed ? "line-through" : "none",
            }}
          >
            {task.title}
          </Text>
        </View>
      </FixedTouchableHighlight>
    </Swipeable>
  );
}

export default memo(TaskItem); // 👈 memoize the component
