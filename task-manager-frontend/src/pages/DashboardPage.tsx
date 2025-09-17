// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../app/store";
import {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../app/slices/taskSlice";
import { logout } from "../app/slices/authSlice";
import { type TaskSchema } from "../utils/validationSchemas";
import TaskForm from "../components/TaskForm";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [openForm, setOpenForm] = useState(false);
  const { tasks, status, error } = useSelector(
    (state: RootState) => state.tasks
  );
  const authStatus = useSelector((state: RootState) => state.auth.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCreateTask = (data: TaskSchema) => {
    dispatch(createTask(data));
    setOpenForm(false);
  };

  const handleDeleteTask = (taskId: number) => {
    dispatch(deleteTask(taskId));
  };

  const handleFormOpen = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleToggleStatus = (task: Task) => {
    const updatedTask = {
      ...task,
      status: task.status === "Pending" ? "Completed" : "Pending",
    };
    dispatch(updateTask(updatedTask));
  };

  return (
    <>
      <div className="min-h-screen  relative">
        <nav className="p-4 bg-white shadow-md">
          <div className="container flex items-center justify-between mx-auto">
            <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </nav>

        <main className="container p-4 mx-auto">
          <div className="flex justify-between">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              Your Tasks
            </h2>
            <button
              className="border px-2 rounded w-[150px] text-white bg-blue-600 cursor-pointer hover:bg-blue-700"
              onClick={handleFormOpen}
            >
              Add Task
            </button>
          </div>

          {status === "loading" && <p>Loading tasks...</p>}
          {status === "failed" && <p className="text-red-500">{error}</p>}

          {status === "succeeded" && (
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <p>You have no tasks yet. Add one!</p>
              ) : (
                <div className="p-4 rounded-lg shadow">
                  <table className="table-auto w-full text-left border-collapse border border-gray-300">
                    <thead className="border-b border-gray-200 bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 font-medium text-gray-700">
                          ID
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-700">
                          Title
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-700">
                          Description
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    {tasks.map((task) => (
                      <tbody>
                        <tr
                          key={task.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-6 py-3">{task.id}</td>
                          <td className="px-6 py-3">{task.title}</td>
                          <td className="px-6 py-3">{task.description}</td>
                          <td className="px-6 py-3">
                            <span
                              className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${
                                task.status === "Pending"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => handleToggleStatus(task)}
                                className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                              >
                                Toggle Status
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              )}
            </div>
          )}
        </main>

        {openForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/60">
            <div className="relative bg-white p-6 rounded-lg  max-w-md w-full mx-4 shadow-md">
              <button
                className="right-5 top-3 absolute cursor-pointer"
                type="button"
                onClick={handleCloseForm}
              >
                <strong>X</strong>
              </button>
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={handleCloseForm}
                isSubmitting={authStatus === "loading"}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
