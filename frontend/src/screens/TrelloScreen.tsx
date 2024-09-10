import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Overlay,
  rem,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { TaskList, Task } from "../models/Task";
import { useGetAllTaskList } from "../hooks/useGetTaskListAPI";
import { useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import { IconCalendar, IconFileInfo, IconListDetails, IconReceipt, IconTags } from "@tabler/icons-react";
import { RichEditor } from "../components/RichEditor/RichEditor";
import { useDisclosure } from "@mantine/hooks";
import { useCreateTask } from "../hooks/useCreateTask";
import { useForm } from "@mantine/form";
import { CreateTaskParams, MoveTaskParams, UpdateTaskParams } from "../apis/TaskAPI";
import dayjs from "dayjs";
import { useMutationGetTaskByID } from "../hooks/useGetTaskById";
import { getUserId } from "../context/AuthContext";
import { useUpdateTask } from "../hooks/useUpdateTask";
import { useMoveTask } from "../hooks/useMoveTask";
import DroppableTaskColumn from "../components/column/DroppableTaskColumn";
import { useSearchStore } from "../App";
import { useTakeTask } from "../hooks/useTakeTask";
import { useCancelTask } from "../hooks/useCancelTask";

export enum EditAddRowBucket {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

type EditRow = {
  id: string;
  columnId: string;
  title: string;
  dueDate: Date;
  description: string;
  isPublic: boolean;
  bucket: EditAddRowBucket;
};

type AddRow = {
  title: string;
  dueDate: Date | null;
  description: string;
  bucket: EditAddRowBucket;
};

const filterTaskWithStatusAndId = (list: TaskList[], isPublic: boolean, currentId: string): TaskList[] => {
  return list.map((tl) => {
    return {
      ...tl,
      tasks: tl.tasks.filter((t) => t.isPublic == isPublic || t?.attender?.id == currentId),
    };
  });
};

const filterTaskWithStatus = (list: TaskList[], isPublic: boolean): TaskList[] => {
  return list.map((tl) => {
    return {
      ...tl,
      tasks: tl.tasks.filter((t) => t.isPublic == isPublic),
    };
  });
};

export const TrelloScreen = () => {
  const searchValue = useSearchStore((state) => state.searchValue);
  const editForm = useForm<EditRow>({
    mode: "uncontrolled",
    initialValues: {
      description: "",
      dueDate: new Date(),
      id: "",
      isPublic: false,
      title: "",
      bucket: EditAddRowBucket.PRIVATE,
      columnId: "",
    },
    validate: {},
  });

  const addForm = useForm<AddRow>({
    mode: "uncontrolled",
    initialValues: {
      bucket: EditAddRowBucket.PRIVATE,
      description: "",
      dueDate: new Date(),
      title: "",
    },
  });

  const { data, isLoading, error, refetch: refetchAllTaskList } = useGetAllTaskList({ search: searchValue });

  const [openedEditingModal, { open: openEditingModal, close: closeEditingModal }] = useDisclosure(false);
  const [openedAddModal, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);

  const { mutate: getTaskById, isPending: isGetTaskByIdLoading } = useMutationGetTaskByID();
  const { mutate: takeTask } = useTakeTask();
  const { mutate: createTask, isPending: isCreateTaskLoading } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdateTaskLoading } = useUpdateTask();
  const { mutate: moveTask } = useMoveTask();
  const { mutate: cancelTask } = useCancelTask();
  const [privateBucket, setPrivateBucket] = useState<TaskList[]>([]);
  const [publicBucket, setPublicBucket] = useState<TaskList[]>([]);

  const handleOpenAddModal = (bucket: EditAddRowBucket) => {
    addForm.setFieldValue("bucket", bucket);
    openAddModal();
  };
  const handleOpenEditModal = (rowId: string, bucket: EditAddRowBucket) => {
    editForm.setValues({ id: rowId });
    editForm.setFieldValue("bucket", bucket);

    openEditingModal();
    getTaskById(rowId, {
      onSuccess(data: Task) {
        editForm.setValues({
          ...data,
          bucket: data?.isPublic ? EditAddRowBucket.PUBLIC : EditAddRowBucket.PRIVATE,
          dueDate: new Date(data?.dueDate),
          description: data?.description,
        });

        editForm.resetDirty();
      },
      onError(error) {
        notifications.show({
          title: "Unable to fetch data",
          message: error?.message,
          color: "red",
        });
      },
    });
  };

  const handleTakeTask = (rowId: string) => {
    takeTask(rowId, {
      onSuccess() {
        notifications.show({
          title: "Success",
          message: `Task id: ${rowId} is taken!`,
          color: "green",
        });
        refetchAllTaskList();
      },
      onError(error) {
        notifications.show({
          title: "Error",
          message: error?.message,
          color: "red",
        });
      },
    });
  };
  const handleCancelTask = (rowId: string) => {
    cancelTask(rowId, {
      onSuccess() {
        notifications.show({
          title: "Success",
          message: `Task id: ${rowId} is canceled!`,
          color: "green",
        });
        refetchAllTaskList();
      },
      onError(error) {
        notifications.show({
          title: "Error",
          message: error?.message,
          color: "red",
        });
      },
    });
  };

  const toDoColumnData = useMemo(() => {
    return data?.find((i) => i.name === "To do");
  }, [data]);

  const handleSubmitAddForm = ({ bucket, description, dueDate, title }: AddRow) => {
    if (!dueDate) return;

    const createTaskParams: CreateTaskParams = {
      columnId: toDoColumnData?.id ?? "",
      description,
      dueDate: dayjs(dueDate).format("YYYY-MM-DD"),
      isPublic: bucket == EditAddRowBucket.PRIVATE ? false : true,
      title,
    };

    createTask(createTaskParams, {
      onSuccess() {
        notifications.show({ message: "success", color: "green" });
        closeAddModal();
        refetchAllTaskList();
      },
      onError(error) {
        notifications.show({
          title: "Error",
          message: error.message,
          color: "red",
        });
      },
    });
  };

  const handleSubmitEditAddForm = ({ columnId, description, dueDate, id, isPublic, title }: EditRow) => {
    if (!columnId || !dueDate) return;

    if (id == null || id == "" || id == undefined) return;
    const updateTaskParams: UpdateTaskParams = {
      taskListId: columnId,
      description,
      dueDate: dayjs(dueDate).format("YYYY-MM-DD"),
      isPublic,
      title,
      id,
    };

    updateTask(updateTaskParams, {
      onSuccess() {
        notifications.show({ message: "success", color: "green" });
        closeEditingModal();
        refetchAllTaskList();
      },
      onError(error) {
        notifications.show({
          title: "Error",
          message: error.message,
          color: "red",
        });
      },
    });
  };

  useEffect(() => {
    if (data) {
      setPrivateBucket(filterTaskWithStatusAndId(data, false, getUserId() ?? ""));
      setPublicBucket(filterTaskWithStatus(data, true));
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      notifications.show({
        title: error?.name,
        message: error?.message,
      });
    }
  }, [error]);

  // if (isLoading) {
  //   return <LoaderScreen />;
  // }

  const onDragEnd = ({ destination, source, draggableId }: DropResult) => {
    if (!destination) return;
    console.log({ destination, source, draggableId });

    // TODO: find movedToBeforeTaskId
    const destinationColumn = privateBucket?.find((tl) => tl.id == destination.droppableId);
    if (!destinationColumn) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    var movedBeforeTaskId: string | null = null;
    const isSameBucket: boolean = destination?.droppableId == source?.droppableId;
    const isMoveToLowerIndex: boolean = source.index > destination.index;
    var destinationIndex = destination.index;

    if (isSameBucket && !isMoveToLowerIndex) {
      destinationIndex += 1;
    }

    if (destinationColumn?.tasks?.length > destinationIndex) {
      movedBeforeTaskId = destinationColumn.tasks[destinationIndex].id;
    }

    const moveTaskParams: MoveTaskParams = {
      movedToColumnId: destination?.droppableId,
      taskId: draggableId,
      movedBeforeTaskId,
    };
    // console.log(moveTaskParams, destinationIndex);

    moveTask(moveTaskParams, {
      onSuccess() {
        notifications.show({
          title: "Move task success",
          message: `Task id : ${draggableId} moved to column ${destinationColumn.name}`,
          color: "green",
        });
        refetchAllTaskList();
      },
      onError(error) {
        notifications.show({
          title: "Move task failed",
          message: error?.message,
          color: "red",
        });
      },
    });
  };

  const [visible, setVisible] = useState(false);

  return (
    <>
      <Box
        bg={
          "linear-gradient(160deg, rgba(9,9,121,1) 0%, rgba(8,40,141,1) 0%, rgba(4,126,198,1) 34%, rgba(0,212,255,1) 100%)"
        }
        pl={rem(40)}
        pt={rem(32)}
        pb={rem(32)}
        pr={rem(180)}
        flex={1}
      >
        <Box
          bg="#fff"
          w={"fit-content"}
          px={"md"}
          py={6}
          style={{
            borderRadius: rem(4),
          }}
          mb={rem(16)}
        >
          <Text fw={500}>Private</Text>
        </Box>
        <DragDropContext onDragEnd={onDragEnd}>
          <Flex gap={rem(60)}>
            {privateBucket.map((i) => (
              <Box key={"private" + i.id} flex={1}>
                <DroppableTaskColumn
                  onCancelTask={handleCancelTask}
                  data={i}
                  onTakeTask={handleTakeTask}
                  isDroppable={true}
                  setOverLay={setVisible}
                  onClickRow={handleOpenEditModal}
                  onClickFooter={handleOpenAddModal}
                  renderFooter={i.id === toDoColumnData?.id}
                  bucket={EditAddRowBucket.PRIVATE}
                />
              </Box>
            ))}
          </Flex>
        </DragDropContext>

        <Divider c={"white"} size={"md"} my={"xl"} />
        <Box
          bg="#fff"
          w={"fit-content"}
          px={"md"}
          py={6}
          style={{
            borderRadius: rem(4),
          }}
          mb={rem(16)}
        >
          <Text fw={500}>Public</Text>
        </Box>
        <Flex gap={rem(60)}>
          {publicBucket.map((i) => (
            <Box key={"public" + i.id} flex={1}>
              <DroppableTaskColumn
                onCancelTask={handleCancelTask}
                onTakeTask={handleTakeTask}
                setOverLay={setVisible}
                renderFooter={i.id === toDoColumnData?.id}
                data={i}
                isDroppable={false}
                onClickRow={handleOpenEditModal}
                onClickFooter={handleOpenAddModal}
                bucket={EditAddRowBucket.PUBLIC}
              />
            </Box>
          ))}
        </Flex>
      </Box>
      {visible && <Overlay color="#000" backgroundOpacity={0.4} blur={2} />}
      <Modal.Root
        opened={openedEditingModal}
        onClose={() => {
          editForm.reset();
          closeEditingModal();
        }}
        size={"xl"}
        trapFocus={false}
      >
        <Modal.Overlay backgroundOpacity={0.55} blur={2} />
        <Modal.Content radius={rem(16)} bg={"#f1f2f4"} pb={rem(20)}>
          <Modal.Header bg={"#f1f2f4"}>
            <Group justify="space-between" w={"100%"} align="start" gap={rem(3)}>
              <Group>
                <IconFileInfo />
                <Title order={2}>Update task</Title>
              </Group>
              <Modal.CloseButton />
            </Group>
          </Modal.Header>

          <Modal.Body pos={"relative"}>
            <LoadingOverlay
              visible={isGetTaskByIdLoading || isUpdateTaskLoading}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            <form onSubmit={editForm.onSubmit(handleSubmitEditAddForm)}>
              <Group align="center" mb={4} mt={"lg"}>
                <IconTags color="black" />
                <Text size="md" fw={500} c={"black"}>
                  Title
                </Text>
              </Group>

              <Box ml={rem(40)} mr={rem(20)}>
                <TextInput
                  w={400}
                  key={editForm.key("title")}
                  {...editForm.getInputProps("title")}
                  placeholder="Enter task title"
                />
              </Box>

              <Group align="center" mb={4} mt={"lg"}>
                <IconListDetails color="black" />
                <Text size="md" fw={500} c={"black"}>
                  From
                </Text>
              </Group>
              <Group ml={rem(40)} mr={rem(20)}>
                <Select
                  disabled={editForm.getValues().bucket == EditAddRowBucket.PUBLIC}
                  placeholder="Select a column"
                  w={400}
                  key={editForm.key("columnId")}
                  {...editForm.getInputProps("columnId")}
                  data={data?.map((i) => {
                    return {
                      value: i.id,
                      label: i.name,
                    };
                  })}
                />
              </Group>

              <Group align="center" mb={4} mt={"lg"}>
                <IconCalendar color="black" />
                <Text size="md" fw={500} c={"black"}>
                  Due date
                </Text>
              </Group>
              <Group ml={rem(40)} mr={rem(20)} gap={40}>
                <DateInput
                  key={editForm.key("dueDate")}
                  {...editForm.getInputProps("dueDate")}
                  placeholder="Select due date"
                  w={400}
                />
                <Group align="center" gap={rem(8)}>
                  <Text size="md" fw={500} c={"black"}>
                    Public
                  </Text>
                  <Checkbox
                    key={editForm.key("isPublic")}
                    {...editForm.getInputProps("isPublic", {
                      type: "checkbox",
                    })}
                    disabled={
                      // editForm?.createdBy.id != getUserId() ||
                      editForm.getInputProps("columnId").defaultValue !== toDoColumnData?.id
                    }
                    size="lg"
                  />
                </Group>
              </Group>

              <Group align="center" mb={"sm"} mt={"lg"}>
                <IconReceipt />
                <Text size="md" fw={500} c={"black"}>
                  Task description
                </Text>
              </Group>
              <Box ml={rem(40)} mr={rem(20)}>
                <RichEditor {...editForm.getInputProps("description")} key={editForm.key("description")} />
              </Box>
              <Box ml={rem(40)} mr={rem(20)} mt={"lg"}>
                <Button loading={isCreateTaskLoading} type="submit">
                  Save
                </Button>
              </Box>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <Modal.Root
        opened={openedAddModal}
        onClose={() => {
          addForm.reset();
          closeAddModal();
        }}
        size={"xl"}
        trapFocus={false}
      >
        <Modal.Overlay backgroundOpacity={0.55} blur={2} />
        <Modal.Content radius={rem(16)} bg={"#f1f2f4"} pb={rem(20)}>
          <Modal.Header bg={"#f1f2f4"}>
            <Group justify="space-between" w={"100%"} align="start" gap={rem(3)}>
              <Group>
                <IconFileInfo />
                <Title order={2}>
                  Add new task to{" "}
                  <Text span c={"blue"} inherit>
                    {addForm.getValues().bucket}
                  </Text>{" "}
                  column
                </Title>
              </Group>
              <Modal.CloseButton />
            </Group>
          </Modal.Header>

          <Modal.Body pos={"relative"}>
            <LoadingOverlay visible={isCreateTaskLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <form onSubmit={addForm.onSubmit(handleSubmitAddForm)}>
              <Group align="center" mb={4} mt={"lg"}>
                <IconTags color="black" />
                <Text size="md" fw={500} c={"black"}>
                  Title
                </Text>
              </Group>

              <Box ml={rem(40)} mr={rem(20)}>
                <TextInput
                  w={400}
                  key={addForm.key("title")}
                  {...addForm.getInputProps("title")}
                  placeholder="Enter task title"
                />
              </Box>

              <Group align="center" mb={4} mt={"lg"}>
                <IconCalendar color="black" />
                <Text size="md" fw={500} c={"black"}>
                  Due date
                </Text>
              </Group>
              <Group ml={rem(40)} mr={rem(20)} gap={40}>
                <DateInput
                  key={addForm.key("dueDate")}
                  {...addForm.getInputProps("dueDate")}
                  placeholder="Select due date"
                  w={400}
                />
              </Group>

              <Group align="center" mb={"sm"} mt={"lg"}>
                <IconReceipt />
                <Text size="md" fw={500} c={"black"}>
                  Task description
                </Text>
              </Group>
              <Box ml={rem(40)} mr={rem(20)}>
                <RichEditor
                  // key={addForm.key("description")}
                  key={"adddesc"}
                  value={addForm.getValues().description}
                  onChange={(value) => addForm.setFieldValue("description", value)}
                />
              </Box>
              <Box ml={rem(40)} mr={rem(20)} mt={"lg"}>
                <Button loading={isCreateTaskLoading} type="submit">
                  Save
                </Button>
              </Box>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
