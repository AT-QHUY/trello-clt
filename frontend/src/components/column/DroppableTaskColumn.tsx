import { Droppable } from "@hello-pangea/dnd";
import { Box, Button, Card, Text } from "@mantine/core";
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
      <Card shadow="sm" padding={"sm"} radius="md" withBorder bg={"#f1f2f4"}>
        <Card.Section py={"xs"} inheritPadding>
          <Text size={"md"} fw={500} ml={"sm"}>
            {data.name}
          </Text>
        </Card.Section>
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
    <Card shadow="sm" padding={"sm"} radius="md" withBorder bg={"#f1f2f4"}>
      <Card.Section py={"xs"} inheritPadding>
        <Text size={"md"} fw={500} ml={"sm"}>
          {data.name}
        </Text>
      </Card.Section>
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
