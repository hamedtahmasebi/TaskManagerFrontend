import { useLogin } from "~/features/auth/api";
import { LoginForm } from "~/features/auth/components";
import { useAuthStore } from "~/features/auth/store";

export default function login() {
    const { mutateAsync: login } = useLogin();
    const setAccessToken = useAuthStore((s) => s.setAccessToken);

    return (
        <LoginForm
            onSubmit={async (form) => {
                const res = await login(form);
                setAccessToken(res.token);
            }}
        />
    );
}
