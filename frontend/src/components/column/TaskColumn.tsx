import { Box, Button, Flex, Group, Paper, Popover, rem, ScrollArea, Stack, Text } from "@mantine/core";
import { Task, TaskList } from "../../models/Task";
import { EditAddRowBucket } from "../../screens/TrelloScreen";
import { IconBucketOff, IconCancel, IconHandGrab, IconInfoCircle } from "@tabler/icons-react";
import DraggableTaskRow, { TaskRow } from "../row/DraggableTaskRow";
import classes from "./TaskColumn.module.css";
import { useState } from "react";

type TaskColumnProps = {
  data: TaskList;
  isDroppable: boolean;
  onClickFooter: (bucket: EditAddRowBucket) => void;
  onClickRow: (rowId: string, bucket: EditAddRowBucket) => void;
  renderFooter: boolean;
  bucket: EditAddRowBucket;
  setOverLay: (value: boolean) => void;
  onTakeTask: (id: string) => void;
  onCancelTask: (id: string) => void;
};
type PopOverWrapper = {
  setOverLay: (value: boolean) => void;
  r: Task;
  index: number;
  isDroppable: boolean;
  onTakeTask: (id: string) => void;
  onClickRow: (rowId: string, bucket: EditAddRowBucket) => void;
  onCancelTask: (id: string) => void;
  cancelable?: boolean;
  takeable?: boolean;
};

const PopOverWrapper = ({
  r,
  setOverLay,
  index,
  isDroppable,
  onClickRow,
  onTakeTask,
  onCancelTask,
  cancelable,
  takeable,
}: PopOverWrapper) => {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      key={r.id}
      position="bottom"
      offset={{
        mainAxis: -70,
        crossAxis: 76,
      }}
      opened={opened}
      onOpen={() => {
        setOverLay(true);
      }}
      onClose={() => {
        setOverLay(false);
        setOpened(false);
      }}
    >
      <Popover.Target>
        <Box onClick={() => setOpened(true)}>
          <DraggableTaskRow index={index} isDraggable={isDroppable} rowData={r} key={r.id} />
        </Box>
      </Popover.Target>
      <Popover.Dropdown
        p={0}
        bg="transparent"
        style={{
          border: "none",
        }}
      >
        <Flex gap={rem(10)}>
          <Paper shadow="sm" withBorder radius={"md"} className={classes.item} w={rem(390)} h={rem(70)}>
            <TaskRow rowData={r} key={r.id} />
          </Paper>
          <Stack gap={rem(4)} align="flex-start">
            <Button
              variant={"white"}
              onClick={() => {
                onClickRow(r.id, r.isPublic ? EditAddRowBucket.PUBLIC : EditAddRowBucket.PRIVATE);
                setOpened(false);
              }}
              leftSection={<IconInfoCircle />}
            >
              Show detail
            </Button>
            {takeable && (
              <Button
                variant={"white"}
                onClick={() => {
                  onTakeTask(r.id);
                  setOpened(false);
                }}
                leftSection={<IconHandGrab />}
              >
                Take task
              </Button>
            )}
            {cancelable && (
              <Button
                variant={"white"}
                c={"red"}
                leftSection={<IconCancel />}
                onClick={() => {
                  onCancelTask(r.id);
                  setOpened(false);
                }}
              >
                Cancel
              </Button>
            )}
          </Stack>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
};

const TaskColumn = ({
  data,
  isDroppable,
  onClickRow,
  renderFooter,
  onTakeTask,
  setOverLay,
  onCancelTask,
}: TaskColumnProps) => {
  return (
    <ScrollArea.Autosize mah={260}>
      {data?.tasks.length == 0 && !renderFooter ? (
        <Paper shadow="md" py={rem(12)}>
          <Group gap={10} ml={rem(20)}>
            <IconBucketOff color={"gray"} />
            <Text fw={500} c={"gray"} size="sm">
              No items
            </Text>
          </Group>
        </Paper>
      ) : (
        data?.tasks.map((r, index) => (
          <PopOverWrapper
            index={index}
            r={r}
            onCancelTask={onCancelTask}
            isDroppable={isDroppable}
            onClickRow={onClickRow}
            onTakeTask={onTakeTask}
            setOverLay={setOverLay}
            key={r?.id}
            cancelable={data?.name != "Cancel"}
            takeable={data?.name == "To do" && r?.attender == null}
          />
        ))
      )}
    </ScrollArea.Autosize>
  );
};

export default TaskColumn;
