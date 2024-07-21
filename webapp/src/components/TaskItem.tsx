import { forwardRef, memo, useEffect, useRef } from "react";
import Task from "../models/Task";
import { useForm } from "react-hook-form";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

type TaskInputs = {
  name: string;
  completed: boolean;
};

type TaskItemProps = {
  task: Task;
  onChange: (task: Task) => void;
  onMenuClick: (task: Task, top: number, left: number) => void;
};

type TaskItemRef = {
  task: Task;
  onChange: (task: Task) => void;
  onMenuClick: (task: Task) => void;
};

const TaskItem = forwardRef<TaskItemRef, TaskItemProps>(function TaskItem(
  { task, onChange, onMenuClick }: TaskItemProps) {
  const { register, watch, trigger } = useForm<TaskInputs>({
    defaultValues: {
      name: task.name,
      completed: task.completed,
    },
  });

  const nameDebounceRef = useRef<number>();
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "completed" && type === "change") {
        trigger("completed").then((valid) => {
          if (valid) {
            onChange({ ...task, completed: value.completed! });
          }
        });
      } else if (name === "name" && type === "change") {
        if (nameDebounceRef.current) {
          clearTimeout(nameDebounceRef.current);
        }
        nameDebounceRef.current = setTimeout(() => {
          trigger("name").then((valid) => {
            if (valid) {
              onChange({ ...task, name: value.name! });
            }
          });
        }, 300);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex px-2 py-1 group items-center">
      <button
        ref={menuButtonRef}
        className="opacity-0 group-hover:opacity-100 px-2 h-4 hover:bg-gray-100 rounded-sm"
        onClick={() => {
          const rect = menuButtonRef.current?.getBoundingClientRect();
          if (!rect) {
            return;
          }
          onMenuClick(task, rect.top, rect.left);
        }}
      >
        <EllipsisHorizontalIcon className="w-4 h-4" />
      </button>
      <input type="checkbox" {...register("completed")} className="ms-2" />
      <input type="text" {...register("name")} className="ms-2 flex-1 p-1" />
    </div>
  );
});

export default memo(TaskItem);
