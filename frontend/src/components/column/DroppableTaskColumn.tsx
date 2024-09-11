import { Droppable } from "@hello-pangea/dnd";
import { Box, Button, Card, Group, rem, Text } from "@mantine/core";
import { TaskList } from "../../models/Task";
import { IconPlus } from "@tabler/icons-react";
import { EditAddRowBucket } from "../../screens/TrelloScreen";
import TaskColumn from "./TaskColumn";

export type DroppableTaskColumnProps = {
  isDroppable: boolean;
  data: TaskList;
  renderFooter: boolean;
  onClickFooter: (bucket: EditAddRowBucket) => void;
  onClickRow: (rowId: string, bucket: EditAddRowBucket) => void;
  bucket: EditAddRowBucket;
  setOverLay: (value: boolean) => void;
  onTakeTask: (id: string) => void;
  onCancelTask: (id: string) => void;
};

const renderColumnHeader = (title: string, count: number) => {
  switch (title) {
    case "To do":
      return (
        <Card.Section py={"xs"} inheritPadding>
          <Group gap={rem(2)} align="center">
            <Text
              c={"blue"}
              size={"md"}
              fw={500}
              bg={"blue.0"}
              span
              py={rem(2)}
              px={rem(16)}
              style={{
                borderRadius: rem(6),
              }}
            >
              {title}
            </Text>
            <Text span fw={700} size="md" c={"blue"}>
              ({count})
            </Text>
          </Group>
        </Card.Section>
      );
    case "In progress":
      return (
        <Card.Section py={"xs"} inheritPadding>
          <Group gap={rem(2)} align="center">
            <Text
              c={"orange"}
              size={"md"}
              fw={500}
              bg={"yellow.0"}
              span
              py={rem(2)}
              px={rem(16)}
              style={{
                borderRadius: rem(6),
              }}
            >
              {title}
            </Text>
            <Text span fw={700} size="md" c={"orange"}>
              ({count})
            </Text>
          </Group>
        </Card.Section>
      );
    case "Done":
      return (
        <Card.Section py={"xs"} inheritPadding>
          <Group gap={rem(2)} align="center">
            <Text
              c={"green"}
              size={"md"}
              fw={500}
              bg={"green.0"}
              span
              py={rem(2)}
              px={rem(16)}
              style={{
                borderRadius: rem(6),
              }}
            >
              {title}
            </Text>
            <Text span fw={700} size="md" c={"green"}>
              ({count})
            </Text>
          </Group>
        </Card.Section>
      );
    case "Cancel":
      return (
        <Card.Section py={"xs"} inheritPadding>
          <Group gap={rem(2)} align="center">
            <Text
              c={"red"}
              size={"md"}
              fw={500}
              bg={"red.0"}
              span
              py={rem(2)}
              px={rem(16)}
              style={{
                borderRadius: rem(6),
              }}
            >
              {title}
            </Text>
            <Text span fw={700} size="md" c={"red"}>
              ({count})
            </Text>
          </Group>
        </Card.Section>
      );
    default:
      return (
        <Card.Section py={"xs"} inheritPadding>
          <Group gap={rem(2)} align="center">
            <Text
              c={"blue"}
              size={"md"}
              fw={500}
              bg={"blue.0"}
              span
              py={rem(2)}
              px={rem(16)}
              style={{
                borderRadius: rem(6),
              }}
            >
              {title}
            </Text>
            <Text span fw={700} size="md" c={"blue"}>
              ({count})
            </Text>
          </Group>
        </Card.Section>
      );
  }
};

const DroppableTaskColumn = ({
  isDroppable,
  data,
  onClickFooter,
  renderFooter,
  onClickRow,
  bucket,
  setOverLay,
  onTakeTask,
  onCancelTask,
}: DroppableTaskColumnProps) => {
  if (!isDroppable) {
    return (
      <Card
        shadow="sm"
        padding={"sm"}
        radius="md"
        bg={"#eeeeee"}
        style={{
          overflow: "hidden",
        }}
      >
        <Box mb={rem(16)} mt={rem(4)}>
          {renderColumnHeader(data?.name, data?.tasks?.length)}
        </Box>
        <TaskColumn
          onCancelTask={onCancelTask}
          onTakeTask={onTakeTask}
          setOverLay={setOverLay}
          bucket={bucket}
          data={data}
          isDroppable={isDroppable}
          onClickFooter={onClickFooter}
          onClickRow={onClickRow}
          renderFooter={renderFooter}
        />
        <Box>
          {renderFooter && (
            <Button
              fullWidth
              onClick={() => {
                onClickFooter(bucket);
              }}
              variant="subtle"
              justify="start"
              color="#4e5d76"
              leftSection={
                <IconPlus
                  style={{
                    width: "70%",
                    height: "70%",
                    color: "#4e5d76",
                  }}
                  stroke={3}
                />
              }
            >
              <Text size="sm" fw={500} c={"#4e5d76"}>
                Add row
              </Text>
            </Button>
          )}
        </Box>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding={"sm"} radius="md" bg={"#eeeeee"}>
      <Box mb={rem(16)} mt={rem(4)}>
        {renderColumnHeader(data?.name, data?.tasks?.length)}
      </Box>
      <Droppable droppableId={data.id} type="task">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              minHeight: "18px",
            }}
          >
            <TaskColumn
              onCancelTask={onCancelTask}
              setOverLay={setOverLay}
              bucket={bucket}
              onTakeTask={onTakeTask}
              renderFooter={renderFooter}
              data={data}
              isDroppable={isDroppable}
              onClickFooter={onClickFooter}
              onClickRow={onClickRow}
            />
            {provided.placeholder}
            <Box>
              {renderFooter && (
                <Button
                  fullWidth
                  onClick={() => {
                    onClickFooter(bucket);
                  }}
                  variant="subtle"
                  justify="start"
                  color="#4e5d76"
                  leftSection={
                    <IconPlus
                      style={{
                        width: "70%",
                        height: "70%",
                        color: "#4e5d76",
                      }}
                      stroke={3}
                    />
                  }
                >
                  <Text size="sm" fw={500} c={"#4e5d76"}>
                    Add row
                  </Text>
                </Button>
              )}
            </Box>
          </div>
        )}
      </Droppable>
    </Card>
  );
};

export default DroppableTaskColumn;
