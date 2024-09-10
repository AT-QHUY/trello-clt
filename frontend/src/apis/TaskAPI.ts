import { getAccessToken } from "../context/AuthContext";
import http from "../utils/http";

export type CreateTaskParams = {
  columnId: string;
  title: string;
  dueDate: string;
  description: string;
  isPublic: boolean;
};

export type UpdateTaskParams = {
  id: string;
  taskListId: string;
  title: string;
  dueDate: string;
  description: string;
  isPublic: boolean;
};

export type MoveTaskParams = {
  taskId: string;
  movedToColumnId: string;
  movedBeforeTaskId: string | null;
};

export const TaskAPI = {
  _createNewTask: async (params: CreateTaskParams) => {
    const res = await http.post("/api/task/create", params, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    return res?.data;
  },
  _getTaskById: async (id: string) => {
    const res = await http.get(`/api/task/${id}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    return res?.data;
  },
  _updateTask: async (params: UpdateTaskParams) => {
    const { id, ...rest } = params;
    const res = await http.put(`/api/task/${id}/update`, rest, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    return res?.data;
  },
  _moveTask: async (params: MoveTaskParams) => {
    const { taskId, ...rest } = params;
    const res = await http.put(`api/task/${taskId}/move`, rest, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    return res?.data;
  },
  _takeTask: async (id: string) => {
    const res = await http.put(
      `api/task/${id}/take`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );

    return res?.data;
  },
  _cancelTask: async (id: string) => {
    const res = await http.delete(`api/task/${id}/cancel`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    return res?.data;
  },
};
