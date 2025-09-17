// src/app/slices/taskSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { type TaskSchema } from "../../utils/validationSchemas";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
}

interface TaskState {
  tasks: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  status: "idle",
  error: null,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: TaskSchema, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        taskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: Task, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { id, ...taskData } = task;
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        taskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as any)?.message || "Failed to fetch tasks";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });
  },
});

export default taskSlice.reducer;
