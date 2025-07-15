"use client";

import type React from "react";

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
    password: z.string(),
});

type TFormSchemaType = z.infer<typeof formSchema>;

type TLoginFormProps = {
    errors?: string[];
    onSubmit: (validatedForm: TFormSchemaType) => Promise<void>;
};

export default function LoginForm({ onSubmit, errors }: TLoginFormProps) {
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(formSchema),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await onSubmit({
            email: form.getValues("email"),
            password: form.getValues("password"),
        });
    };

    const { errors: formErrors, isSubmitting } = form.formState;

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="space-y-1">
                <h3 className="text-2xl font-bold text-center">Sign In</h3>
                <div className="text-center">
                    Enter your credentials to access your account
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </Button>

                    <div className="text-center text-sm">
                        {"Don't have an account? "}
                        <Link
                            to="/auth/signup"
                            className="text-blue-600 hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
