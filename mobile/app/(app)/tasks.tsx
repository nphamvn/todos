import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  UIManager,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  LayoutAnimation,
  ImageBackground,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useIsKeyboardShown from "@utils/useIsKeyboardShown";
import TaskItem, { RefMethods } from "components/tasks/TaskItem";
import Task from "@models/task";
import { useRouter } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { HeaderBackButton } from "@react-navigation/elements";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const [tasks, setTasks] = useState<Task[]>(
    Array.from({ length: 2 }).map((_, i) => ({
      id: i,
      title: `Task ${i} \nThis is a task description. `,
      completed: false,
      createdAt: new Date(),
    }))
  );

  const notCompletedTasks = useMemo(() => {
    return tasks
      .filter((task) => task.completed === false)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks
      .filter((task) => task.completed === true)
      .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime());
  }, [tasks]);

  const handlePress = (item: Task) => {
    const ref = itemRefs.current[item.id];
    if (ref) {
      ref.expand();
    }
  };

  const handlePressCompleted = (item: Task, completed: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((tasks) =>
      tasks.map((task) => {
        if (task.id === item.id) {
          const prevCompleted = task.completed;
          if (prevCompleted !== completed) {
            return {
              ...task,
              completed,
              completedAt: completed ? new Date() : undefined,
            };
          }
        }
        return task;
      })
    );
  };

  const handlePressDelete = (item: Task) => {
    showActionSheetWithOptions(
      {
        title: "Delete Task",
        options: ["Delete", "Cancel"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      (i) => {
        switch (i) {
          case 0:
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setTasks((tasks) => tasks.filter((task) => task.id !== item.id));
            break;
          case 1:
            break;
        }
      }
    );
  };

  const itemRefs = useRef({} as { [key: number]: RefMethods });
  const currentSwipeable = useRef<Swipeable | null>(null);
  const currentSwipeableDirection = useRef<"left" | "right" | null>(null);
  const handleSwipeableOpen = (
    direction: "left" | "right",
    swipeable: Swipeable
  ) => {
    currentSwipeableDirection.current = direction;
    currentSwipeable.current = swipeable;
  };

  const handleSwipeableOpenStartDrag = (
    task: Task,
    direction: "left" | "right"
  ) => {
    if (currentSwipeable.current) {
      currentSwipeable.current.close();
    }
  };
  const [inputing, setInputing] = useState(false);
  const [task, setTask] = useState<string>();
  const taskInputRef = useRef<TextInput>(null);
  useEffect(() => {
    if (inputing) {
      taskInputRef.current?.focus();
    }
  }, [inputing]);

  const isKeyboardVisible = useIsKeyboardShown();
  useEffect(() => {
    if (!isKeyboardVisible) {
      setInputing(false);
    }
  }, [isKeyboardVisible]);

  const [showCompleted, setShowCompleted] = useState(true);
  const opacityAnim = useSharedValue(1);

  const [headerLargeShown, setHeaderLargeShown] = useState(true);
  const headerTitleOpacity = useSharedValue(0);
  const headerTitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerTitleOpacity.value,
    };
  });

  useEffect(() => {
    headerTitleOpacity.value = withTiming(headerLargeShown ? 0 : 1, {
      duration: 100,
    });
  }, [headerLargeShown]);

  return (
    <ImageBackground
      source={{
        uri: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1msDBU.img",
      }}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          height: 100,
        }}
      >
        <View
          style={{
            paddingTop: 60,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <HeaderBackButton
            style={{
              flex: 1,
            }}
            label="List"
            onPress={() => {
              router.back();
            }}
          />
          <Animated.Text
            style={[
              {
                fontWeight: "bold",
                textAlign: "center",
                flex: 1,
              },
              headerTitleAnimatedStyle,
            ]}
          >
            Tasks
          </Animated.Text>
          <View
            style={{
              flex: 1,
            }}
          ></View>
        </View>
      </View>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingHorizontal: 4,
        }}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          if (offsetY > 0) {
            setHeaderLargeShown(false);
          } else {
            setHeaderLargeShown(true);
          }
        }}
        scrollEventThrottle={16}
      >
        <View
          style={{
            gap: 2,
          }}
        >
          {notCompletedTasks.map((task) => (
            <TaskItem
              key={task.id}
              ref={(ref) => {
                if (ref) {
                  itemRefs.current[task.id] = ref;
                }
              }}
              style={{
                borderRadius: 10,
              }}
              task={task}
              onPress={() => handlePress(task)}
              onPressCompleted={() => handlePressCompleted(task, true)}
              onSwipeableOpenStartDrag={(direction) =>
                handleSwipeableOpenStartDrag(task, direction)
              }
              onSwipeableOpen={(direction, swipeable) =>
                handleSwipeableOpen(direction, swipeable)
              }
              onPressDelete={() => handlePressDelete(task)}
            />
          ))}
        </View>
        <View
          style={{
            marginTop: 6,
            marginBottom: 4,
          }}
        >
          <Pressable
            onPress={() => {
              setShowCompleted(!showCompleted);
              opacityAnim.value = withTiming(showCompleted ? 0 : 1, {
                duration: 300,
              });
            }}
          >
            <Text>Completed</Text>
          </Pressable>
        </View>
        <Animated.View
          style={{
            opacity: opacityAnim,
          }}
        >
          {showCompleted &&
            completedTasks.map((task) => (
              <View
                key={task.id}
                style={{
                  marginVertical: 2,
                }}
              >
                <TaskItem
                  ref={(ref) => {
                    if (ref) {
                      itemRefs.current[task.id] = ref;
                    }
                  }}
                  style={{
                    borderRadius: 10,
                  }}
                  task={task}
                  onPress={() => handlePress(task)}
                  onPressCompleted={() => handlePressCompleted(task, true)}
                  onSwipeableOpenStartDrag={(direction) =>
                    handleSwipeableOpenStartDrag(task, direction)
                  }
                  onSwipeableOpen={(direction, swipeable) =>
                    handleSwipeableOpen(direction, swipeable)
                  }
                  onPressDelete={() => handlePressDelete(task)}
                />
              </View>
            ))}
        </Animated.View>
      </ScrollView>
      <KeyboardAvoidingView
        behavior="padding"
        //keyboardVerticalOffset={headerHeight}
      >
        {!inputing ? (
          <Pressable
            style={{
              margin: 4,
              paddingVertical: 14,
              paddingHorizontal: 10,
              borderRadius: 4,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onPress={() => {
              console.log("Add Task");
              setInputing(true);
            }}
          >
            <MaterialIcons name="add" size={24} color="white" />
            <Text
              style={{
                color: "white",
                marginLeft: 4,
              }}
            >
              Add Task
            </Text>
          </Pressable>
        ) : (
          <View
            style={{
              padding: 20,
              backgroundColor: "white",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              // iOS shadow properties
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              // Android shadow property
              elevation: 10,
            }}
          >
            <TextInput
              ref={taskInputRef}
              value={task}
              onChangeText={setTask}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                console.log("Submit Task");
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );
                setTasks((tasks) => [
                  ...tasks,
                  {
                    id: tasks.length,
                    title: task!,
                    completed: false,
                    createdAt: new Date(),
                  },
                ]);
                setTask("");
              }}
              placeholder="Add Task"
              style={{
                fontSize: 16,
              }}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default App;
