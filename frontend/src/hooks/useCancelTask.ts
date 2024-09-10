import { useMutation } from "@tanstack/react-query";
import { TaskAPI } from "../apis/TaskAPI";

export const useCancelTask = () => {
  const { mutate, error, data, isPending } = useMutation({
    mutationKey: ["cancel", "task"],
    mutationFn: async (id: string) => {
      return await TaskAPI._cancelTask(id);
    },
  });

  return { mutate, error, data, isPending };
};
