"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router";
const formSchema = z.object({
    email: z.email(),
    password: z.string().refine(
        (pass) => {
            const containsNumbers = pass.match(/[0-9]/);
            const containsLowerCase = pass.match(/[a-z]/);
            const containsUpperCase = pass.match(/[A-Z]/);
            return containsLowerCase && containsUpperCase && containsNumbers;
        },
        { error: "Password should contain lowercase, uppercase and number" }
    ),
});

type TFormSchemaType = z.infer<typeof formSchema>;

type TSignupFormProps = {
    errors?: string[];
    onSubmit: (validatedForm: TFormSchemaType) => void | Promise<void>;
};

export default function Signup({ onSubmit, errors }: TSignupFormProps) {
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(formSchema),
    });

    const { errors: formErrors, isSubmitting } = form.formState;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {errors &&
                errors.length > 0 &&
                errors.map((err) => (
                    <Alert variant="destructive">
                        <AlertDescription>{err}</AlertDescription>
                    </Alert>
                ))}

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    aria-invalid={!!formErrors.email}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...form.register("email")}
                    disabled={isSubmitting}
                />
                {formErrors.email && (
                    <p className="text-sm text-red-500">
                        {formErrors.email?.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        aria-invalid={!!formErrors.password}
                        id="password"
                        type={"password"}
                        placeholder="Enter your password"
                        disabled={isSubmitting}
                        {...form.register("password")}
                    />
                </div>
                {formErrors.password && (
                    <p className="text-sm text-red-500">
                        {formErrors.password.message}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <Link
                    to="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                >
                    Forgot password?
                </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    "Signup"
                )}
            </Button>

            <div className="text-center text-sm">
                {"Already have an account? "}
                <Link
                    to="/auth/login"
                    className="text-blue-600 hover:underline"
                >
                    Login
                </Link>
            </div>
        </form>
    );
}
