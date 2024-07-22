import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Header from "./Header";
import Task from "../models/Task";
import TaskItem, { TaskItemRef } from "./TaskItem";
import useOutsideClick from "../hooks/useOutsideClick";
import { TrashIcon } from "@heroicons/react/24/outline";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import useEffectOnNextRender from "../hooks/useEffectOnNextRender ";

interface List {
  id: string;
  name: string;
}

type ListInputs = {
  name: string;
};

export default function Home() {
  const { getAccessTokenSilently } = useAuth0();
  const [lists, setLists] = useState<List[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const listId = searchParams.get("listId");

  const [editListId, setEditListId] = useState<string>();
  const newTaskId = useRef<string>();

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const response = await fetch("/api/lists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const lists = await response.json();
      setLists(lists);
      if (!listId && lists.length > 0) {
        setSearchParams({ listId: lists[0].id });
      }
    })();
  }, []);

  useEffect(() => {
    if (!listId) {
      setTasks([]);
      return;
    }
    (async () => {
      const token = await getAccessTokenSilently();
      const response = await fetch(`/api/lists/${listId}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tasks = await response.json();
      setTasks(tasks);
    })();
  }, [listId]);

  const listSaveForm = useForm<ListInputs>();
  const listSaveFormSubmit = async (inputs: ListInputs) => {
    const token = await getAccessTokenSilently();
    const response = await fetch("/api/lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...inputs, id: editListId }),
    });
    if (!response.ok) {
      throw new Error("Failed to save list");
    }
    setLists((lists) =>
      lists.map((list) =>
        list.id === editListId ? { ...list, name: inputs.name } : list
      )
    );
    setSearchParams({ listId: editListId! });
    setEditListId(undefined);
  };
  useEffect(() => {
    if (editListId) {
      const list = lists.find((list) => list.id === editListId)!;
      listSaveForm.setValue("name", list.name);
      listSaveForm.setFocus("name");
    }
  }, [editListId]);

  const onTaskChange = useCallback(
    (task: Task) => {
      if (task.id === newTaskId.current) {
        // create new task
        (async () => {
          const token = await getAccessTokenSilently();
          const response = await fetch(`/api/lists/${listId}/tasks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(task),
          });
          if (!response.ok) {
            throw new Error("Failed to create task");
          }
          newTaskId.current = undefined;
        })();
      } else {
        // update task
        (async () => {
          const token = await getAccessTokenSilently();
          const response = await fetch(`/api/tasks/${task.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(task),
          });
          if (!response.ok) {
            throw new Error("Failed to update task");
          }
        })();
      }
    },
    [listId]
  );

  //#region list menu
  const menuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const listMenuRef = useRef<HTMLDivElement>(null);
  const [listMenuVisible, setListMenuVisible] = useState(false);
  const currentList = useRef<{
    list: List;
    top: number;
    left: number;
  }>();
  const onListMenuClick = useCallback(
    (list: List, top: number, left: number) => {
      currentList.current = {
        list,
        top,
        left,
      };
      setListMenuVisible(true);
    },
    []
  );
  useOutsideClick(listMenuRef, () => {
    setListMenuVisible(false);
    currentList.current = undefined;
  });

  const handleListDelete = async () => {
    const { list } = currentList.current!;
    const token = await getAccessTokenSilently();
    const response = await fetch(`/api/lists/${list.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete list");
    }
    setLists((lists) => lists.filter((l) => l.id !== list.id));
    setListMenuVisible(false);
    currentList.current = undefined;
  };
  //#endregion

  //#region task menu
  const taskMenuRef = useRef<HTMLDivElement>(null);
  const [taskMenuVisible, setTaskMenuVisible] = useState(false);
  const currentTask = useRef<{
    task: Task;
    top: number;
    left: number;
  }>();
  const onTaskMenuClick = useCallback(
    (task: Task, top: number, left: number) => {
      currentTask.current = {
        task,
        top,
        left,
      };
      setTaskMenuVisible(true);
    },
    []
  );

  useOutsideClick(taskMenuRef, () => {
    setTaskMenuVisible(false);
    currentTask.current = undefined;
  });

  const handleTaskDelete = async () => {
    const task = currentTask.current!.task;
    const token = await getAccessTokenSilently();
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
    setTasks((tasks) => tasks.filter((t) => t.id !== task.id));
    setTaskMenuVisible(false);
    currentTask.current = undefined;
  };
  //#endregion

  const taskItemRefs = useRef<Record<string, TaskItemRef | null>>({});
  const focusOnNewTask = useEffectOnNextRender(() => { 
    if(newTaskId.current) {
      taskItemRefs.current[newTaskId.current]?.focustNameInput();
    }
  });

  return (
    <div className="h-screen border-gray-100 border w-[80%] mx-auto flex-col flex">
      <Header />
      <div className="flex flex-1">
        <div className="border basis-1/4">
          <div className="flex justify-between border-b-[1px] px-2 py-1">
            <h1 className="font-semibold">Lists</h1>
            <button
              onClick={() => {
                const newList = {
                  id: uuidv4(),
                  name: "New List",
                };
                setLists([newList, ...lists]);
                setEditListId(newList.id);
              }}
              className="text-blue-500 hover:underline"
            >
              New
            </button>
          </div>
          <div className="px-2 py-1 gap-1 flex flex-col">
            {lists.map((list) => (
              <div key={list.id}>
                {editListId === list.id ? (
                  <form
                    onSubmit={listSaveForm.handleSubmit(listSaveFormSubmit)}
                  >
                    <input
                      {...listSaveForm.register("name")}
                      className="block w-full px-1 py-0.5"
                    />
                  </form>
                ) : (
                  <Link
                    to={{ pathname: ".", search: `?listId=${list.id}` }}
                    className={
                      "px-2 py-0.5 hover:bg-neutral-50 rounded group justify-between flex items-center" +
                      " " +
                      (listId === list.id ? "bg-neutral-100" : "")
                    }
                  >
                    {list.name}
                    <button
                      ref={(ref) => {
                        menuButtonRefs.current[list.id] = ref;
                      }}
                      className="hover:bg-neutral-200 h-5 px-1 rounded"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const rect =
                          menuButtonRefs.current[
                            list.id
                          ]?.getBoundingClientRect();
                        if (rect) {
                          onListMenuClick(list, rect.top, rect.left);
                        }
                        return false;
                      }}
                    >
                      <EllipsisHorizontalIcon className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
          {listMenuVisible && currentList.current && (
            <div
              ref={listMenuRef}
              className="absolute w-48 border flex flex-col bg-white p-2 rounded-md shadow-md shadow-gray-200 z-10"
              style={{
                top: currentList.current.top,
                left: currentList.current.left + 4,
              }}
            >
              <button
                className="w-full text-start flex items-center px-2 py-1 hover:bg-gray-100 hover:text-red-500 rounded"
                onClick={handleListDelete}
              >
                <TrashIcon className="w-4 h-4 me-2" />
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="border flex-1">
          <div className="flex justify-between border-b-[1px] px-2 py-1">
            <h1 className="font-semibold">Tasks</h1>
            { listId && <button
              onClick={() => {
                const newTask = {
                  id: uuidv4(),
                  name: "New Task",
                  completed: false,
                };
                setTasks([newTask, ...tasks]);
                newTaskId.current = newTask.id;
                focusOnNewTask();
              }}
              className="text-blue-500 hover:underline"
            >
              New
            </button>}
          </div>
          <div className="">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                ref={(ref) => {
                  taskItemRefs.current[task.id] = ref;
                }}
                task={task}
                onChange={onTaskChange}
                onMenuClick={onTaskMenuClick}
              />
            ))}
            {taskMenuVisible && currentTask.current && (
              <div
                ref={taskMenuRef}
                className="absolute w-48 border flex flex-col bg-white p-2 rounded-md shadow-md shadow-gray-200 z-10"
                style={{
                  top: currentTask.current.top,
                  left: currentTask.current.left - 196,
                }}
              >
                <button
                  className="w-full text-start flex items-center px-2 py-1 hover:bg-gray-100 hover:text-red-500 rounded"
                  onClick={handleTaskDelete}
                >
                  <TrashIcon className="w-4 h-4 me-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
