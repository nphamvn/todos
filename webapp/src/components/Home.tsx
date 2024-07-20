import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface List {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
}

type ListInputs = {
  name: string;
};

type TaskInputs = {
  name: string;
};

export default function Home() {
  const { getAccessTokenSilently } = useAuth0();
  const [lists, setLists] = useState<List[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const listId = searchParams.get("listId");
  const taskId = searchParams.get("taskId");

  const [editListId, setEditListId] = useState<string>();
  const [editTaskId, setEditTaskId] = useState<string>();

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
    })();
  }, []);

  useEffect(() => {
    if (!listId) return;
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
    setEditListId(undefined);
  };
  useEffect(() => {
    if (editListId) {
      const list = lists.find((list) => list.id === editListId)!;
      listSaveForm.setValue("name", list.name);
      listSaveForm.setFocus("name");
    }
  }, [editListId]);

  const taskInputForm = useForm<TaskInputs>();

  useEffect(() => {
    if (editTaskId) {
      const task = tasks.find((task) => task.id === editTaskId)!;
      taskInputForm.setValue("name", task.name);
      taskInputForm.setFocus("name");
    }
  }, [editTaskId]);

  const taskInputFormSubmit = async (inputs: TaskInputs) => {
    const token = await getAccessTokenSilently();
    const response = await fetch(`/api/lists/${listId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...inputs, id: editTaskId }),
    });
    if (!response.ok) {
      throw new Error("Failed to save task");
    }
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === editTaskId ? { ...task, name: inputs.name } : task
      )
    );
    setEditTaskId(undefined);
  };

  return (
    <div className="flex border-gray-100 border h-screen w-[80%] mx-auto">
      <div className="border basis-48">
        <div className="flex justify-between">
          <h1 className="font-semibold">Lists</h1>
          <button
            onClick={() => {
              const newList = {
                id: uuidv4(),
                name: "New List",
              };
              setLists([newList, ...lists]);
              setSearchParams({ listId: newList.id });
              setEditListId(newList.id);
            }}
          >
            New
          </button>
        </div>
        <ul>
          {lists.map((list) => (
            <li key={list.id}>
              {editListId === list.id ? (
                <form onSubmit={listSaveForm.handleSubmit(listSaveFormSubmit)}>
                  <input {...listSaveForm.register("name")} />
                </form>
              ) : (
                <Link
                  to={"."}
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchParams({ listId: list.id });
                  }}
                >
                  {list.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="border flex-1">
        <div className="flex justify-between">
          <h1 className="font-semibold">Tasks</h1>
          <button
            onClick={() => {
              const newTask = {
                id: uuidv4(),
                name: "New Task",
              };
              setTasks([newTask, ...tasks]);
              setEditTaskId(newTask.id);
            }}
          >
            New
          </button>
        </div>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {editTaskId === task.id ? (
                <form
                  onSubmit={taskInputForm.handleSubmit(taskInputFormSubmit)}
                >
                  <input {...taskInputForm.register("name")} />
                </form>
              ) : (
                <Link
                  to={"."}
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchParams({ taskId: task.id });
                  }}
                >
                  {task.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="border flex-1">{taskId && <h1>Task {taskId}</h1>}</div>
    </div>
  );
}
