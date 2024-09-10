import { useMutation } from "@tanstack/react-query";
import { AuthAPI, RegisterParams } from "../apis/AuthAPI";

export const useRegister = () => {
  const { mutate, error, data, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (params: RegisterParams) => {
      return await AuthAPI._register(params);
    },
  });

  return { mutate, error, data, isPending };
};
