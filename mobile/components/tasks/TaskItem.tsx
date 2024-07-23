import Task from "models/task";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  Pressable,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Swipeable, RectButton } from "react-native-gesture-handler";
import FixedTouchableHighlight from "@components/FixedTouchableHighlight";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

import { Animated as RNAnimated } from "react-native";

type TaskItemProps = {
  task: Task;
  onPress: () => void;
  onPressCompleted: (completed: boolean) => void;
  onPressDelete: () => void;
  style?: StyleProp<ViewStyle> | undefined;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
  onSwipeableOpenStartDrag?: (direction: "left" | "right") => void;
  onSwipeableOpen?: (direction: "left" | "right", swipeable: Swipeable) => void;
  onSwipeableClose?: (
    direction: "left" | "right",
    swipeable: Swipeable
  ) => void;
};

export type RefMethods = {
  closeSwipeable: () => void;
  expand: () => void;
  collapse: () => void;
};

const TaskItem = forwardRef<RefMethods, TaskItemProps>((props, ref) => {
  const {
    task: task,
    onPress,
    onPressCompleted,
    onPressDelete,
    onSwipeableOpenStartDrag,
    onSwipeableOpen,
    onSwipeableClose,
    ...rest
  } = props;

  const [innerChecked, setInnerChecked] = useState(task.completed);
  const toggleScale = useSharedValue(1);
  const toggleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: toggleScale.value }],
    };
  });

  const handlePressCompleted = () => {
    Haptics.selectionAsync().then(() => {
      const currentChecked = innerChecked;
      setInnerChecked(!innerChecked);
      if (currentChecked === false) {
        toggleScale.value = withSpring(1.3, undefined, (isFinished) => {
          if (isFinished) {
            toggleScale.value = withSpring(1, undefined, (isFinished) => {
              if (isFinished) {
                runOnJS(onPressCompleted)(true);
                runOnJS(Haptics.impactAsync)(
                  Haptics.ImpactFeedbackStyle.Medium
                );
              }
            });
          }
        });
      } else {
        onPressCompleted(false);
      }
    });
  };

  const expand = () => {
    console.log("expand");
  };

  const collapse = () => {};

  const closeSwipeable = () => {
    innerRef?.current?.close();
  };

  const innerRef = useRef<Swipeable>(null);
  useImperativeHandle(ref, () => {
    return {
      closeSwipeable,
      expand,
      collapse,
    };
  });
  const renderLefttActions = (
    _progress: RNAnimated.AnimatedInterpolation<number>,
    dragX: RNAnimated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
      extrapolate: "clamp",
    });

    return (
      <Text
        style={{
          flex: 1,
          backgroundColor: "#497AFC",
          color: "white",
        }}
      >
        Debug
      </Text>
    );
  };

  const renderRightActions = () => {
    return (
      <Pressable
        style={{
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
        onPress={() => {
          innerRef?.current?.close();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPressDelete();
        }}
      >
        <MaterialIcons name="delete" size={24} color="white" />
      </Pressable>
    );
  };

  const handleItemPress = () => {
    onPress();
  };

  return (
    <Swipeable
      ref={innerRef}
      friction={2}
      rightThreshold={40}
      leftThreshold={40}
      renderLeftActions={renderLefttActions}
      renderRightActions={renderRightActions}
      onSwipeableOpenStartDrag={(direction) => {
        if (onSwipeableOpenStartDrag) {
          onSwipeableOpenStartDrag(direction);
        }
      }}
      onSwipeableOpen={onSwipeableOpen}
      onSwipeableClose={(direction, swipeable) => {
        if (onSwipeableClose) {
          onSwipeableClose(direction, swipeable);
        }
      }}
      containerStyle={[
        {
          overflow: "hidden",
        },
        rest.style,
      ]}
    >
      <FixedTouchableHighlight underlayColor={"gray"} onPress={handleItemPress}>
        <View
          style={[
            {
              backgroundColor: "white",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
            },
            rest.contentContainerStyle,
          ]}
        >
          <TouchableWithoutFeedback onPress={handlePressCompleted}>
            <Animated.View style={toggleStyle}>
              <MaterialIcons
                name={innerChecked ? "check-circle" : "radio-button-unchecked"}
                size={28}
                color="#666"
              />
            </Animated.View>
          </TouchableWithoutFeedback>
          <Text
            style={{
              marginLeft: 4,
              color: "#333",
              textDecorationLine: innerChecked ? "line-through" : "none",
            }}
          >
            {task.name}
          </Text>
        </View>
      </FixedTouchableHighlight>
    </Swipeable>
  );
});
const styles = StyleSheet.create({
  leftAction: {
    //flex: 1,
    backgroundColor: "#497AFC",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default TaskItem; // 👈 memoize the component
