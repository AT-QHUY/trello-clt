import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { TaskList } from "../models/Task";
import { GetAllTaskListParams, TaskListAPI } from "../apis/TaskListAPI";

export const useGetAllTaskList = (params: GetAllTaskListParams) => {
  const { isLoading, data, isError, error, refetch }: UseQueryResult<TaskList[], Error> = useQuery({
    queryKey: ["TaskList", params],
    queryFn: async () => {
      return await TaskListAPI._getAllTaskList(params);
    },
  });

  return { isError, isLoading, data, error, refetch };
};
