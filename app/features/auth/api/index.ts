import { useMutation } from "@tanstack/react-query";
import { Api } from "~/core/api";
import type { LoginDto, RegisterDto } from "~/core/api/generated";
export { useLogin, useRegister };

function useLogin() {
    return useMutation({
        mutationFn: async (loginDto: LoginDto) =>
            await Api.Auth.apiAuthLoginPost({ loginDto }),
    });
}

function useRegister() {
    return useMutation({
        mutationFn: async (registerDto: RegisterDto) =>
            await Api.Auth.apiAuthRegisterPost(
                { registerDto },
                {
                    method: "POST",
                }
            ),
    });
}
