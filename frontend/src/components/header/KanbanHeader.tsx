import { ActionIcon, Button, CloseButton, Group, Loader, rem, Text, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { useSession, getPayloadFromToken } from "../../context/AuthContext";
import { IconArrowRight, IconLogout, IconSearch } from "@tabler/icons-react";
import { useSearchStore } from "../../App";
import { useDebouncedCallback } from "@mantine/hooks";
import { useGetAllTaskList } from "../../hooks/useGetTaskListAPI";

const KanbanHeader = () => {
  const [userDetail] = useState(getPayloadFromToken());
  const session = useSession();
  const searchValue = useSearchStore((state) => state.searchValue);
  const updateValue = useSearchStore((state) => state.updateSearchValue);
  const debouncedSetValue = useDebouncedCallback((value) => updateValue(value), 1000);
  const [value, setValue] = useState(searchValue);

  const { isFetching } = useGetAllTaskList({
    search: searchValue,
  });

  return (
    <Group
      justify="space-between"
      w={"100%"}
      h={"100%"}
      align="center"
      px={rem(40)}
      bg={"#fefefe"}
      style={{
        borderBottom: "1px solid black",
      }}
    >
      <Group>
        <Title
          order={3}
          mr={rem(20)}
          c={"blue"}
          style={{
            cursor: "pointer",
          }}
        >
          DummyTrello
        </Title>

        <TextInput
          radius="xl"
          size="md"
          w={rem(520)}
          placeholder="Search anything"
          rightSectionWidth={42}
          value={value}
          onChange={(e) => {
            debouncedSetValue(e.currentTarget.value);
            setValue(e.currentTarget.value);
          }}
          leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
          rightSection={
            isFetching ? (
              <Loader />
            ) : value.length <= 0 ? (
              <ActionIcon size={32} radius="xl" variant="filled">
                <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ActionIcon>
            ) : (
              <CloseButton
                aria-label="Clear input"
                onClick={() => {
                  debouncedSetValue("");
                  setValue("");
                }}
              />
            )
          }
        />
      </Group>
      <Group>
        <Text size="sm" fw={500} c={"blue"}>
          {userDetail?.sub}
        </Text>
        {userDetail && (
          <Button
            color={"red"}
            variant="light"
            rightSection={<IconLogout size={14} />}
            onClick={() => session?.signOut()}
          >
            Logout
          </Button>
        )}
      </Group>
    </Group>
  );
};

export default KanbanHeader;
