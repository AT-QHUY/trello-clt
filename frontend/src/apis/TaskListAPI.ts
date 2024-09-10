import { getAccessToken } from "../context/AuthContext";
import http, { toQueryParams } from "../utils/http";

export type GetAllTaskListParams = {
  search: string;
};

export const TaskListAPI = {
  _getAllTaskList: async (params: GetAllTaskListParams) => {
    const res = await http.get(`/api/taskList/all?${toQueryParams(params)}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    return res?.data;
  },
};
