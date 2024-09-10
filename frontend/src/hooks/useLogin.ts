import { useMutation } from "@tanstack/react-query";
import { AuthAPI, LoginParams } from "../apis/AuthAPI";

export const useLogin = () => {
  const { mutate, error, data, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (params: LoginParams) => {
      return await AuthAPI._login(params);
    },
  });

  return { mutate, error, data, isPending };
};
