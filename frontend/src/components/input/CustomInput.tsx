import { Box, Text, TextInput, TextInputProps } from "@mantine/core";
import { useClickOutside, useFocusTrap } from "@mantine/hooks";
import { useState } from "react";

export type CustomInputProps = {
  inputValue: string;
  inputProps: TextInputProps;
};

const CustomInput = ({ inputValue, inputProps }: CustomInputProps) => {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));
  const focusTrapRef = useFocusTrap();

  return (
    <Box ref={ref} flex={1}>
      {opened ? (
        <TextInput {...inputProps} ref={focusTrapRef} value={inputValue} />
      ) : (
        <Text
          fw={500}
          ml={"md"}
          tt={"capitalize"}
          onMouseUp={() => setOpened(true)}
        >
          {inputValue}
        </Text>
      )}
    </Box>
  );
};

export default CustomInput;
