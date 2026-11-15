import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../App";
import api from "../../api/axios";
import { ProfileUpdateValidation, type ProfileUpdateFormData } from "../../schemas/ValidationSchema";
import { useFormik } from "formik";
import { User, Mail, Phone, Lock, ShieldCheck } from "lucide-react";


const UpdateModal = ({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void, data:any }): React.JSX.Element | null => {
    if (!isOpen) return null;

    const handleUpdate = async (values: ProfileUpdateFormData) => {
        const response = await api.put("/user/modify", { updatingData: values });
        return response;
    };

    const { isPending, isError, error, mutate } = useMutation({
        mutationFn: handleUpdate,
        onSuccess: (data) => {
            queryClient.setQueryData(["me"], data);
            onClose();
        },
    });

    const formik = useFormik({
        initialValues: {
            userName: data.userName,
            userID: data.userID,
            email: data.email,
            aboutUserInfo: "",
            phoneNumber: data?.phoneNumber || "",
            password: ""
        },
        validationSchema: ProfileUpdateValidation,
        onSubmit: mutate
    });

    const { values, errors, handleChange, handleBlur, handleSubmit, touched } = formik;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
            bg-black/70 backdrop-blur-sm p-2 sm:p-4"
            onClick={onClose}
        >

            <div className="w-[100vw] md:w-[80%] lg:w-[50%] h-[100] bg-surface_1 p-2 md:p-4 lg:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-text_primary text-lg md:text-xl lg:text-3xl text-center p-4">Update Profile</h1>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Form Fields */}
                    {[
                        {
                            name: "userName",
                            label: "Full Name",
                            placeholder: data.userName,
                            type: "text",
                            icon: <User size={20} />,
                        },
                        {
                            name: "userID",
                            label: "Email Address",
                            placeholder: data.userID,
                            type: "email",
                            icon: <Mail size={20} />,
                        },
                        {
                            name: "phoneNumber",
                            label: "Phone Number",
                            placeholder: data?.phoneNumber || "Enter 10 digit phone number",
                            type: "tel",
                            icon: <Phone size={20} />,
                        },
                        {
                            name: "password",
                            label: "Password",
                            placeholder:  "********",
                            type: "password",
                            icon: <Lock size={20} />,
                        },
                        {
                            name: "confirmPassword",
                            label: "Re-enter your password",
                            placeholder:  "********",
                            type: "password",
                            icon: <ShieldCheck size={20} />,
                        },
                    ].map((field) => {
                        const hasError = Boolean(
                            touched[field.name] && errors[field.name]
                        );

                        return (
                            <div key={field.name}>
                                <label
                                    htmlFor={field.name}
                                    className="mb-2 block text-sm font-semibold text-text_label"
                                >
                                    {field.label}
                                </label>

                                <div
                                    className={`flex items-center gap-3 rounded-lg
            border px-3 py-3 transition-all
            focus-within:ring-2 focus-within:ring-purple-500
            ${hasError
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                >
                                    <span className="shrink-0 text-text_label">
                                        {field.icon}
                                    </span>

                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type={field.type}
                                        value={values[field.name]}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder={field.placeholder}
                                        autoComplete={
                                            field.name === "userName"
                                                ? "name"
                                                : field.name === "userID"
                                                    ? "email"
                                                    : field.name === "phoneNumber"
                                                        ? "tel"
                                                        : field.name === "password"
                                                            ? "new-password"
                                                            : "new-password"
                                        }
                                        className="w-full min-w-0 bg-transparent
              text-sm text-text_primary outline-none
              placeholder:text-gray-400"
                                    />
                                </div>

                                {hasError && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors[field.name]}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-lg bg-purple-600
      py-3 font-semibold text-white
      transition-all hover:bg-purple-700
      active:scale-[0.98]
      disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending ? "Creating Account..." : "Update Account"}
                    </button>
                    {
                        isError &&
                        <p className="text-red-500 text-center">{error.message}</p>
                    }
                </form>
            </div>
        </div>
    )
};

export default UpdateModal;