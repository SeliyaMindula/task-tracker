// src/components/TaskManager.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchFromApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

type TaskStatus = "todo" | "inprogress" | "testing" | "completed";

type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  userId: number | null;
  user?: {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
  };
};

export default function TaskManager() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    status: "todo",
    userId: user?.id || null,
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | "all">("all");

  const fetchTasks = async () => {
    try {
      const tasksData = await fetchFromApi("/tasks");
      setTasks(tasksData);

      // Extract unique users from tasks
      const usersMap = new Map<number, { id: number; username: string }>();
      tasksData.forEach((task: Task) => {
        if (task.user) {
          usersMap.set(task.user.id, {
            id: task.user.id,
            username: task.user.username,
          });
        }
      });
      setUsers(Array.from(usersMap.values()));

      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleCreateTask = async () => {
    try {
      const createdTask = await fetchFromApi("/tasks", {
        method: "POST",
        body: JSON.stringify({ ...newTask, userId: user?.id || null }),
      });
      setTasks([...tasks, createdTask]);
      fetchTasks(); 
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        userId: user?.id || null,
      });
      setIsFormOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      const updatedTask = await fetchFromApi(`/tasks/${editingTask.id}`, {
        method: "PATCH",
        body: JSON.stringify(editingTask),
      });
      setTasks(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setEditingTask(null);
      setIsFormOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await fetchFromApi(`/tasks/${id}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      const updatedTask = await fetchFromApi(`/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...task, status: newStatus }),
      });
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredTasks =
    selectedUserId === "all"
      ? tasks
      : tasks.filter((task) => task.userId === selectedUserId);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "bg-yellow-100 text-yellow-800";
      case "inprogress":
        return "bg-blue-100 text-blue-800";
      case "testing":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Task Manager
            </h1>
            <p className="text-gray-600">Welcome back, {user?.username}!</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setEditingTask(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + New Task
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {/* User Filter Dropdown */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <label
              htmlFor="user-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by User
            </label>
            <select
              id="user-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
              value={selectedUserId}
              onChange={(e) =>
                setSelectedUserId(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
            >
              <option value="all">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </div>
                
        {/* Task Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {editingTask ? "Edit Task" : "Create New Task"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title*
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                      placeholder="Enter task title"
                      value={editingTask ? editingTask.title : newTask.title}
                      onChange={(e) =>
                        editingTask
                          ? setEditingTask({
                              ...editingTask,
                              title: e.target.value,
                            })
                          : setNewTask({ ...newTask, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                      placeholder="Enter task description"
                      rows={3}
                      value={
                        editingTask
                          ? editingTask.description
                          : newTask.description
                      }
                      onChange={(e) =>
                        editingTask
                          ? setEditingTask({
                              ...editingTask,
                              description: e.target.value,
                            })
                          : setNewTask({
                              ...newTask,
                              description: e.target.value,
                            })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                      title="Select a status"
                      value={editingTask ? editingTask.status : newTask.status}
                      onChange={(e) => {
                        const value = e.target.value as TaskStatus;
                        editingTask
                          ? setEditingTask({ ...editingTask, status: value })
                          : setNewTask({ ...newTask, status: value });
                      }}
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="testing">Testing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                <button
                  className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={editingTask ? handleUpdateTask : handleCreateTask}
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {selectedUserId !== "all"
                ? "No tasks for selected user"
                : "No tasks"}
            </h3>
            <p className="mt-1 text-gray-500">
              {selectedUserId !== "all"
                ? "Try selecting a different user"
                : "Get started by creating a new task."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Task
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-gray-50 p-4 border-b font-medium text-gray-600 uppercase text-xs">
              <div className="col-span-5 md:col-span-3">Task</div>
              <div className="hidden md:col-span-5 md:block">Description</div>
              <div className="col-span-3 md:col-span-1">User</div>
              <div className="col-span-3 md:col-span-1">Status</div>
              <div className="col-span-4 md:col-span-2 text-right">Actions</div>
            </div>

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-12 p-4 border-b hover:bg-gray-50 transition-colors items-center"
              >
                <div className="col-span-5 md:col-span-3 font-medium">
                  <div className="line-clamp-1 text-gray-700">{task.title}</div>
                  <div className="md:hidden text-sm text-gray-500 line-clamp-1 mt-1">
                    {task.description}
                  </div>
                </div>
                <div className="hidden md:col-span-5 md:block text-gray-600">
                  <div className="line-clamp-2">{task.description}</div>
                </div>
                <div className="col-span-3 md:col-span-1 text-sm text-gray-600">
                  {users.find((u) => u.id === task.userId)?.username ||
                    "Unknown"}
                </div>
                <div className="col-span-3 md:col-span-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status.replace("-", " ")}
                  </span>
                </div>
                <div className="col-span-4 md:col-span-2 flex justify-end space-x-2">
                  <button
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    onClick={() => {
                      setEditingTask(task);
                      setIsFormOpen(true);
                    }}
                    title="Edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <select
                    className="hidden md:block p-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-500"
                    value={task.status}
                    title="Change Status"
                    onChange={(e) =>
                      handleStatusChange(task, e.target.value as TaskStatus)
                    }
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="testing">Testing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
