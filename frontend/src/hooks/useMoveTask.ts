import { useMutation } from "@tanstack/react-query";
import { MoveTaskParams, TaskAPI } from "../apis/TaskAPI";

export const useMoveTask = () => {
  const { mutate, error, data, isPending } = useMutation({
    mutationKey: ["move-task"],
    mutationFn: async (params: MoveTaskParams) => {
      return await TaskAPI._moveTask(params);
    },
  });

  return { mutate, error, data, isPending };
};
