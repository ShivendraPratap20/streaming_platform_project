import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../App";
import { Mail, Lock } from "lucide-react"; import { useFormik } from "formik";
import { SignInValidation } from "../../../schemas/ValidationSchema";
import { type SignInFormData } from "../../../schemas/ValidationSchema";
import api from "../../../api/axios";

const LoginTab = ({ onClose, setShowLoginTab }: { onClose: () => void, setShowLoginTab: (val:boolean) => void }): React.JSX.Element => {
  
    const handleLogin = useCallback(
        async (values: SignInFormData) => {
            const response = await api.post("/user/login", values);
            return response;
        },
        []
    );
    const { isPending, isError, error, mutate } = useMutation({
        mutationFn: handleLogin,
        onSuccess: (data) => {
            queryClient.setQueryData(["me"], data);
            onClose();
        },
    });

    const formik = useFormik({
        initialValues: { userID: "", password: "" },
        validationSchema: SignInValidation,
        onSubmit: mutate,
    });
    const { values, errors, handleChange, handleBlur, handleSubmit, touched } = formik;


    const googleLoginHandler = useCallback(() => {
        window.location.href = "http://localhost:8000/googleSignIn"
    }, []);

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email Field */}
            <div>
                <label
                    htmlFor="userID"
                    className="mb-2 block text-sm font-semibold text-text_label"
                >
                    UserID / Email
                </label>

                <div
                    className={`flex items-center gap-3 rounded-lg
              border px-3 py-3 transition-all
              focus-within:ring-2 focus-within:ring-purple-500
              ${touched.userID && errors.userID
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                >
                    <Mail
                        size={20}
                        className="shrink-0 text-text_label"
                    />

                    <input
                        id="userID"
                        name="userID"
                        type="text"
                        value={values.userID}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="jonas_kahnwald@gmail.com"
                        className="w-full min-w-0 bg-transparent
                text-sm text-text_primary outline-none
                placeholder:text-gray-400"
                    />
                </div>

                {touched.userID && errors.userID && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.userID}
                    </p>
                )}
            </div>

            {/* Password Field */}
            <div>
                <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-text_label"
                >
                    Password
                </label>

                <div
                    className={`flex items-center gap-3 rounded-lg
              border px-3 py-3 transition-all
              focus-within:ring-2 focus-within:ring-purple-500
              ${touched.password && errors.password
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                >
                    <Lock
                        size={20}
                        className="shrink-0 text-text_label"
                    />

                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your password"
                        className="w-full min-w-0 bg-transparent
                text-sm text-text_primary outline-none
                placeholder:text-gray-400"
                    />
                </div>

                {touched.password && errors.password && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.password}
                    </p>
                )}
            </div>

            {/* Sign In Button */}
            <button
            disabled={isPending}
            type="submit"
            className="w-full rounded-lg bg-custom_purple
            py-3 font-semibold text-white
            transition-all hover:bg-purple-700
            active:scale-[0.98]
            disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sign In
          </button>

            {/* Google Login */}
            <button
                onClick={googleLoginHandler}
                type="button"
                className="inline-flex w-full items-center
            justify-center gap-3 rounded-lg border
            border-gray-300 bg-white px-4 py-3
            text-sm font-medium text-gray-700
            transition-colors hover:bg-gray-50
            focus:outline-none focus:ring-2
            focus:ring-purple-500"
            >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>

                <span>Sign In with Google</span>
            </button>

            {/* Sign Up */}
            <p className="text-center text-sm text-text_label">
                Don’t have an account?{" "}
                <button
                    type="button"
                    onClick={() => setShowLoginTab(true)}
                    className="font-semibold text-purple-500
              transition hover:text-purple-400"
                >
                    Sign up for free
                </button>
            </p>
            {
                isError &&
                <p className="text-red-500 text-center">{error.message}</p>
            }
        </form>
    )

};

export default LoginTab;