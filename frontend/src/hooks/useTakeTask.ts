import { useMutation } from "@tanstack/react-query";
import { TaskAPI } from "../apis/TaskAPI";

export const useTakeTask = () => {
  const { mutate, error, data, isPending } = useMutation({
    mutationKey: ["take-task"],
    mutationFn: async (id: string) => {
      return await TaskAPI._takeTask(id);
    },
  });

  return { mutate, error, data, isPending };
};
