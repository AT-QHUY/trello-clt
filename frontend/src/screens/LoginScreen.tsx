import {
  Anchor,
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  PasswordInput,
  rem,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useLogin } from "../hooks/useLogin";
import { LoginParams, RegisterParams } from "../apis/AuthAPI";
import { notifications } from "@mantine/notifications";
import { getUserId, useSession } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToggle } from "@mantine/hooks";
import { useRegister } from "../hooks/useRegister";

const LoginScreen = () => {
  const [type, toggle] = useToggle(["login", "register"]);
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUserId: string | null = getUserId();

    if (currentUserId) {
      navigate("/trello");
    }
  }, []);

  const session = useSession();
  const loginForm = useForm<LoginParams>({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) => {
        if (val == "" || val == null) {
          return "Please input email";
        }

        if (!/^\S+@\S+$/.test(val)) {
          return "Invalid email";
        }
      },
      password: (val) => {
        if (val == "" || val == null || val == undefined) {
          return "Please input password";
        }

        if (val.length < 6) {
          return "Password should include at least 6 characters";
        }
      },
    },
  });
  const registerForm = useForm<RegisterParams>({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },

    validate: {
      username: isNotEmpty("Please input name"),
      email: (val) => {
        if (val == "" || val == null) {
          return "Please input email";
        }

        if (!/^\S+@\S+$/.test(val)) {
          return "Invalid email";
        }
      },
      password: (val) => {
        if (val == "" || val == null || val == undefined) {
          return "Please input password";
        }

        if (val.length < 6) {
          return "Password should include at least 6 characters";
        }
      },
    },
  });

  const handleLogin = (values: LoginParams) => {
    login(values, {
      onSuccess(data) {
        session?.signIn(data);
      },
      onError(data) {
        notifications.show({
          title: "Error",
          message: data.message,
          color: "red",
        });
      },
    });
  };

  const handleRegister = (values: RegisterParams) => {
    register(values, {
      onSuccess(data) {
        session?.signIn(data);
      },
      onError(data) {
        notifications.show({
          title: "Error",
          message: data.message,
          color: "red",
        });
      },
    });
  };

  return (
    <Flex w={"100vw"} h={"100vh"} justify={"center"} align={"flex-start"}>
      <Paper
        radius={"md"}
        shadow="xl"
        p={"xl"}
        withBorder
        w={rem(560)}
        mt={rem(100)}
      >
        <Text size="lg" fw={500}>
          Welcome to{" "}
          <Text span fw={700} inherit c={"blue"}>
            Trello
          </Text>
        </Text>
        <Divider my={"md"} />
        {type == "login" ? (
          <form onSubmit={loginForm.onSubmit(handleLogin)}>
            <Stack>
              <TextInput
                required
                label="Email"
                placeholder="hello_its_me@gmail.com"
                value={loginForm.values.email}
                onChange={(event) =>
                  loginForm.setFieldValue("email", event.currentTarget.value)
                }
                error={loginForm.errors.email && "Invalid email"}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={loginForm.values.password}
                onChange={(event) =>
                  loginForm.setFieldValue("password", event.currentTarget.value)
                }
                error={
                  loginForm.errors.password &&
                  "Password should include at least 6 characters"
                }
                radius="md"
              />
              <Group justify="space-between" mt="sm">
                <Anchor
                  component="button"
                  type="button"
                  c="dimmed"
                  onClick={() => toggle()}
                  size="xs"
                >
                  Don't have an account? Register
                </Anchor>
                <Button type="submit" radius="xl" loading={isLoginPending}>
                  Login
                </Button>
              </Group>
            </Stack>
          </form>
        ) : (
          <form onSubmit={registerForm.onSubmit(handleRegister)}>
            <Stack>
              <TextInput
                label="Name"
                required
                placeholder="Your name"
                value={registerForm.values.username}
                onChange={(event) =>
                  registerForm.setFieldValue(
                    "username",
                    event.currentTarget.value
                  )
                }
                radius="md"
              />
              <TextInput
                required
                label="Email"
                placeholder="hello_its_me@gmail.com"
                value={registerForm.values.email}
                onChange={(event) =>
                  registerForm.setFieldValue("email", event.currentTarget.value)
                }
                error={registerForm.errors.email && "Invalid email"}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={registerForm.values.password}
                onChange={(event) =>
                  registerForm.setFieldValue(
                    "password",
                    event.currentTarget.value
                  )
                }
                error={
                  registerForm.errors.password &&
                  "Password should include at least 6 characters"
                }
                radius="md"
              />
              <Group justify="space-between" mt="sm">
                <Anchor
                  component="button"
                  type="button"
                  c="dimmed"
                  onClick={() => toggle()}
                  size="xs"
                >
                  Don't have an account? Login
                </Anchor>
                <Button type="submit" radius="xl" loading={isRegisterPending}>
                  Register
                </Button>
              </Group>
            </Stack>
          </form>
        )}
      </Paper>
    </Flex>
  );
};

export default LoginScreen;
