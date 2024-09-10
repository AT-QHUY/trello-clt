import { UserDetail } from "./User";

export type Task = {
  id: string;
  title: string;
  fromDate: Date;
  dueDate: Date;
  description: string;
  isPublic: boolean;
  createdBy: UserDetail;
  attender: UserDetail;
  columnId: string;
};

export type TaskList = {
  id: string;
  name: string;
  tasks: Task[];
};
