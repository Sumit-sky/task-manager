// src/components/TaskForm.tsx
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskSchema } from "../utils/validationSchemas";

interface TaskFormProps {
  onSubmit: SubmitHandler<TaskSchema>;
  onCancel: Function;
  isSubmitting: boolean;
}

const TaskForm = ({ onSubmit, isSubmitting, onCancel }: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 mb-6 space-y-4 bg-white rounded-lg"
    >
      <h3 className="text-lg font-bold">Add New Task</h3>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={3}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="hidden">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          defaultValue="Pending"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full ml-1 px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-indigo-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
