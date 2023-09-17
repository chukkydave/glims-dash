import {
    Lucide,
    PreviewComponent,
    Preview,
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
} from "@/base-components";
import { useForm } from "react-hook-form";
import classnames from "classnames";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Toastify from "toastify-js";
import { editUser } from "../../features/auth/authSlice";
import { faker as $f } from "@/utils";
const baseUrl = import.meta.env.VITE_BASE_URL;

function Main() {
    const [details, setDetails] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [apiError, setapiError] = useState('Error');
    const schema = yup
        .object({
            fullName: yup.string().required().min(2),
            email: yup.string().required().email(),
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
        watch,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        setDetails(user)
        reset({
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phone
        });
    }, [user]);

    const onSubmit = async (data) => {
        // event.preventDefault();
        const result = await trigger();
        if (result) {
            axios.patch(`${baseUrl}/editAdmin`, data, {
                headers: {
                    Authorization: localStorage.getItem('authToken')
                }
            })
                .then((response) => {
                    const fullNameValue = watch('fullName');
                    const phoneValue = watch('phoneNumber');
                    dispatch(editUser({ fullName: fullNameValue, phone: phoneValue }));
                    reset();
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
                    console.log(error)
                    setapiError(error.response.statusText)
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
                <h2 className="text-lg font-medium mr-auto">Profile</h2>
            </div>
            <TabGroup>
                {/* BEGIN: Profile Info */}
                <div className="intro-y box px-5 pt-5 mt-5">
                    <div className="flex flex-col lg:flex-row border-b border-slate-200/60 dark:border-darkmode-400 pb-5 -mx-5">
                        <div className="flex flex-1 px-5 items-center justify-center lg:justify-start">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="rounded-full"
                                    src={$f()[0].photos[0]}
                                />
                                <div className="absolute mb-1 mr-1 flex items-center justify-center bottom-0 right-0 bg-primary rounded-full p-2">
                                    <Lucide icon="Camera" className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="ml-5">
                                <div className="w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg">
                                    {details.fullName}
                                </div>
                                <div className="text-slate-500">{details.isAdmin ? "Admin" : "User"}</div>
                            </div>
                        </div>
                        <div className="mt-6 lg:mt-0 flex-1 px-5 border-l border-r border-slate-200/60 dark:border-darkmode-400 border-t lg:border-t-0 pt-5 lg:pt-0">
                            <div className="font-medium text-center lg:text-left lg:mt-3">
                                Profile Details
                            </div>
                            <div className="flex flex-col justify-center items-center lg:items-start mt-4">
                                {/* <div className="truncate sm:whitespace-normal flex items-center">
                                    <Lucide icon="User" className="w-4 h-4 mr-2" />
                                    {details.fullName}
                                </div> */}
                                <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                    <Lucide icon="Mail" className="w-4 h-4 mr-2" />
                                    {details.email}
                                </div>
                                <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                    <Lucide icon="Phone" className="w-4 h-4 mr-2" />
                                    {details.phone}
                                </div>
                            </div>
                        </div>

                    </div>
                    <TabList className="nav-link-tabs flex-col sm:flex-row justify-center lg:justify-start text-center">
                        <Tab fullWidth={false} className="py-4 cursor-pointer">
                            Update Profile
                        </Tab>
                        <Tab fullWidth={false} className="py-4 cursor-pointer">
                            Change Password
                        </Tab>
                    </TabList>
                </div>
                {/* END: Profile Info */}
                <TabPanels className="intro-y mt-5">
                    <TabPanel>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="intro-y box col-span-12 lg:col-span-6">
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
                                                                disabled={true}
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


                                                        <button type="submit" className="btn btn-primary mt-5">
                                                            Update
                                                        </button>
                                                    </form>
                                                    {/* END: Validation Form */}
                                                </Preview>

                                            </div>
                                        </>
                                    )}
                                </PreviewComponent>
                                {/* END: Form Validation */}
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="intro-y box col-span-12 lg:col-span-6">
                                This is the seond one
                            </div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
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
        </>
    );
}

export default Main;