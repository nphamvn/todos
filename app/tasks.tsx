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
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  LayoutAnimation,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useIsKeyboardShown from "@utils/useIsKeyboardShown";
import TaskItem from "components/tasks/TaskItem";
import Task from "@models/task";
import { useRouter } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(
    Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      title: `Task ${i}`,
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

  const handlePress = useCallback((item: Task) => {
    router.navigate({
      pathname: "taskEdit",
      params: { id: item.id },
    });
  }, []);

  const handleCompletedPress = useCallback((item: Task, completed: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((tasks) =>
      tasks.map((task) => {
        if (task.id === item.id) {
          return {
            ...task,
            completed,
            completedAt: completed ? new Date() : undefined,
          };
        }
        return task;
      })
    );
  }, []);

  const currentSwipeableRef = useRef<Swipeable | null>(null);
  const closeSwipeable = useCallback(() => {
    if (currentSwipeableRef.current) {
      currentSwipeableRef.current.close();
    }
  }, []);

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
  const opacityAnim = useRef(new Animated.Value(1)).current;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
      }}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        {notCompletedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onPress={handlePress}
            onCompletedPress={handleCompletedPress}
            closeSwipeable={closeSwipeable}
            setCurrentSwipeable={(swipeable) => {
              currentSwipeableRef.current = swipeable;
            }}
          />
        ))}
        <View
          style={{
            marginTop: 6,
            marginBottom: 4,
          }}
        >
          <Pressable
            onPress={() => {
              setShowCompleted(!showCompleted);
              Animated.timing(opacityAnim, {
                toValue: showCompleted ? 0 : 1,
                duration: 300,
                useNativeDriver: true,
              }).start();
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
              <TaskItem
                key={task.id}
                task={task}
                onPress={handlePress}
                onCompletedPress={handleCompletedPress}
                closeSwipeable={closeSwipeable}
                setCurrentSwipeable={(swipeable) => {
                  currentSwipeableRef.current = swipeable;
                }}
              />
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
              backgroundColor: "rgb(156 163 175)",
              alignItems: "center",
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 50,
  },
  listContainer: {
    flex: 1,
    alignItems: "center",
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
});

export default App;
