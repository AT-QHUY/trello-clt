import { useMutation } from "@tanstack/react-query";
import { TaskAPI, UpdateTaskParams } from "../apis/TaskAPI";

export const useUpdateTask = () => {
  const { mutate, error, data, isPending } = useMutation({
    mutationKey: ["update", "task"],
    mutationFn: async (params: UpdateTaskParams) => {
      return await TaskAPI._updateTask(params);
    },
  });

  return { mutate, error, data, isPending };
};
