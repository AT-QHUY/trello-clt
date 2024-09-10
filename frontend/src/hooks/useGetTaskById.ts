import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { Task } from "../models/Task";
import { TaskAPI } from "../apis/TaskAPI";

export const useGetTaskByID = (id: string | null) => {
  const { isLoading, data, isError, error, refetch }: UseQueryResult<Task, Error> = useQuery({
    queryKey: ["task", id],
    enabled: !!id && id != "",
    queryFn: async () => {
      return await TaskAPI._getTaskById(id ?? "");
    },
  });

  return { isError, isLoading, data, error, refetch };
};

export const useMutationGetTaskByID = () => {
  const { mutate, error, data, isPending } = useMutation({
    mutationKey: ["get", "task"],
    mutationFn: async (id: string) => {
      return await TaskAPI._getTaskById(id);
    },
  });

  return { mutate, error, data, isPending };
};
