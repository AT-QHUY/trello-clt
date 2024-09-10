import { ActionIcon, Avatar, Box, Flex, Group, Paper, rem, Stack, Text } from "@mantine/core";
import classes from "./DraggableTaskRow.module.css";
import cx from "clsx";
import { Draggable } from "@hello-pangea/dnd";
import { IconBrandTeams, IconCalendar } from "@tabler/icons-react";
import { Task } from "../../models/Task";
import dayjs from "dayjs";

type TaskRowProps = {
  rowData: Task;
};

export type DraggableTaskRowProps = {
  isDraggable: boolean;
  index: number;
  rowData: Task;
};

const DraggableTaskRow = ({ index, isDraggable, rowData }: DraggableTaskRowProps) => {
  if (!isDraggable) {
    return (
      <Box>
        <Paper shadow="sm" withBorder radius={"md"} className={classes.item}>
          <TaskRow rowData={rowData} />
        </Paper>
      </Box>
    );
  }
  return (
    <Draggable key={rowData.id} index={index} draggableId={rowData.id}>
      {(provided, snapshot) => {
        return (
          <Box>
            <Paper
              shadow="sm"
              withBorder
              radius={"md"}
              className={cx(classes.item, {
                [classes.itemDragging]: snapshot.isDragging,
              })}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <TaskRow rowData={rowData} />
            </Paper>
          </Box>
        );
      }}
    </Draggable>
  );
};

const renderDueDate = (dueDate: Date) => {
  return (
    <Group
      bg={"yellow"}
      gap={4}
      px={"xs"}
      py={3}
      style={{
        borderRadius: rem(3),
      }}
      align="center"
    >
      <IconCalendar
        style={{
          width: "1rem",
          height: "1rem",
          color: "#fff",
        }}
        stroke={2.4}
      />
      <Text size="sm" c={"#fff"} fw={500}>
        {dayjs(dueDate).format("DD/MM")}
      </Text>
    </Group>
  );
};

export const TaskRow = ({ rowData }: TaskRowProps) => {
  return (
    <>
      <Stack
        justify="space-between"
        align="flex-start"
        w={"100%"}
        gap={4}
        pl={"sm"}
        style={{
          alignSelf: "center",
        }}
        mb={rem(8)}
      >
        <Text size="sm" c={"#374153"} truncate="end" flex={1} pt={rem(6)}>
          {rowData.title}
        </Text>
        {renderDueDate(rowData.dueDate)}
      </Stack>
      <Stack justify="space-between" align="flex-end" mt={2} mr={2} mb={rem(2)}>
        <Box></Box>
        <Flex mr={rem(6)} mb={rem(6)} gap={rem(8)}>
          {rowData?.attender && (
            <Avatar color="initials" size={"sm"} w={rem(24)} h={rem(24)}>
              {rowData?.attender?.username.substring(0, 1)}
            </Avatar>
          )}
          {rowData?.isPublic ? (
            <IconBrandTeams
              color="red"
              style={{
                width: rem(24),
                height: rem(24),
              }}
            />
          ) : (
            <Box w={rem(24)} h={rem(24)} />
          )}
        </Flex>
      </Stack>
    </>
  );
};

export default DraggableTaskRow;
