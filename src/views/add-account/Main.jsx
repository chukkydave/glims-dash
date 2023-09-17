import { useState } from "react";
import {
    Lucide,
    PreviewComponent,
    Preview,
    LoadingIcon,
    Source,
    Highlight,
} from "@/base-components";
import { useForm } from "react-hook-form";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";
import classnames from "classnames";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

function Main() {
    const [apiError, setapiError] = useState('Error');
    const [loading, setLoading] = useState(false);

    const schema = yup
        .object({
            fullName: yup.string().required().min(2),
            email: yup.string().required().email(),
            password: yup.string().required().min(6),
            phoneNumber: yup
                .number()
                .required()
                .test(
                    "len",
                    "phone must be greater than or equal to 11",
                    (val) => val.toString().length >= 10
                )
        })
        .required();

    const {
        register,
        trigger,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });
    const onSubmit = async (data) => {
        // event.preventDefault();
        const result = await trigger();
        if (result) {
            setLoading(true)
            axios.post(`${baseUrl}/registerAdmin`, data)
                .then((response) => {
                    reset();
                    setLoading(false)
                    Toastify({
                        node: dom("#success-notification-content")
                            .clone()
                            .removeClass("hidden")[0],
                        duration: 10000,
                        newWindow: true,
                        close: true,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                    }).showToast();
                })
                .catch((error) => {
                    console.error(error.response.statusText)
                    setapiError(error.response.statusText)
                    setLoading(false)
                    Toastify({
                        node: dom("#failed-notification-content")
                            .clone()
                            .removeClass("hidden")[0],
                        duration: 10000,
                        newWindow: true,
                        close: true,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                    }).showToast();
                });
        }

    };

    return (
        <>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Add User</h2>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 lg:col-span-6">
                    {/* BEGIN: Form Validation */}
                    <PreviewComponent className="intro-y box">
                        {({ toggle }) => (
                            <>

                                <div className="p-5">
                                    <Preview>
                                        {/* BEGIN: Validation Form */}
                                        <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
                                            <div className="input-form">
                                                <label
                                                    htmlFor="validation-form-1"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Full name
                                                    <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                                                        Required, at least 2 characters
                                                    </span>
                                                </label>
                                                <input
                                                    {...register("fullName")}
                                                    id="validation-form-1"
                                                    type="text"
                                                    name="fullName"
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.fullName,
                                                    })}
                                                    placeholder="John Legend"
                                                />
                                                {errors.fullName && (
                                                    <div className="text-danger mt-2">
                                                        {errors.fullName.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="input-form mt-3">
                                                <label
                                                    htmlFor="validation-form-2"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Email
                                                    <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                                                        Required, email address format
                                                    </span>
                                                </label>
                                                <input
                                                    {...register("email")}
                                                    id="validation-form-2"
                                                    type="email"
                                                    name="email"
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.email,
                                                    })}
                                                    placeholder="example@gmail.com"
                                                />
                                                {errors.email && (
                                                    <div className="text-danger mt-2">
                                                        {errors.email.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="input-form mt-3">
                                                <label
                                                    htmlFor="validation-form-3"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Password
                                                    <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                                                        Required, at least 6 characters
                                                    </span>
                                                </label>
                                                <input
                                                    {...register("password")}
                                                    id="validation-form-3"
                                                    type="password"
                                                    name="password"
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.password,
                                                    })}
                                                    placeholder="secret"
                                                />
                                                {errors.password && (
                                                    <div className="text-danger mt-2">
                                                        {errors.password.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="input-form mt-3">
                                                <label
                                                    htmlFor="validation-form-4"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Phone Number
                                                    <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                                                        Required, integer only & minimum 11 characters
                                                    </span>
                                                </label>
                                                <input
                                                    {...register("phoneNumber")}
                                                    id="validation-form-4"
                                                    type="number"
                                                    name="phoneNumber"
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.phoneNumber,
                                                    })}
                                                    placeholder="08061234567"
                                                />
                                                {errors.phoneNumber && (
                                                    <div className="text-danger mt-2">
                                                        {errors.phoneNumber.message}
                                                    </div>
                                                )}
                                            </div>




                                            {loading ? (<button className="w-24 h-6"><LoadingIcon icon="puff" /></button>) : (<button type="submit" className="btn btn-primary mt-5">
                                                Add
                                            </button>)}
                                        </form>
                                        {/* END: Validation Form */}
                                    </Preview>

                                </div>
                            </>
                        )}
                    </PreviewComponent>
                    {/* END: Form Validation */}
                    {/* BEGIN: Success Notification Content */}
                    <div
                        id="success-notification-content"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="CheckCircle" className="text-success" />
                        <div className="ml-4 mr-4">
                            <div className="font-medium">Registration success!</div>
                            <div className="text-slate-500 mt-1">
                                User has been registered successfully!
                            </div>
                        </div>
                    </div>
                    {/* END: Success Notification Content */}
                    {/* BEGIN: Failed Notification Content */}
                    <div
                        id="failed-notification-content"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="XCircle" className="text-danger" />
                        <div className="ml-4 mr-4">
                            <div className="font-medium">Registration failed!</div>
                            <div className="text-slate-500 mt-1">
                                {apiError}
                            </div>
                        </div>
                    </div>
                    {/* END: Failed Notification Content */}
                </div>
            </div>
        </>
    );
}

export default Main;
