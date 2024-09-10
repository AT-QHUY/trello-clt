import { useMutation } from "@tanstack/react-query";
import { CreateTaskParams, TaskAPI } from "../apis/TaskAPI";

export const useCreateTask = () => {
  const { mutate, error, data, isPending } = useMutation({
    mutationKey: ["create", "task"],
    mutationFn: async (params: CreateTaskParams) => {
      return await TaskAPI._createNewTask(params);
    },
  });

  return { mutate, error, data, isPending };
};
