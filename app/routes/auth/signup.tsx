import { useNavigate } from "react-router";
import { useRegister } from "~/features/auth/api";
import { SignupForm } from "~/features/auth/components";
import { useAuthStore } from "~/features/auth/store";

export default function Signup() {
    const { mutateAsync: register, error } = useRegister();
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const navigate = useNavigate();
    return (
        <>
            <div className="space-y-1 text-left mb-8">
                <h3 className="text-2xl font-bold text-left">Sign Up</h3>
                <div className="text-left text-sm">
                    Enter your credentials to create your account
                </div>
            </div>
            <SignupForm
                onSubmit={async (form) => {
                    console.log(form);
                    const res = await register(form);
                    setAccessToken(res.token);
                    navigate("/home");
                }}
                errors={error ? [error?.message] : undefined}
            />
        </>
    );
}
