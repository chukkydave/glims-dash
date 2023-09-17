import {
    Lucide,
    Tippy,
    Alert,
    LoadingIcon
} from "@/base-components";
import { faker as $f } from "@/utils";
import * as $_ from "lodash";
import { useState } from "react";
import axios from "axios";
import Toastify from "toastify-js";
import { useSelector, useDispatch } from "react-redux";
import { createCourse } from "../../features/courses/courseSlice";

function Main() {
    const [courseName, setCourseName] = useState('');
    const [emptyFields, setEmptyFields] = useState(false);
    const [courseIcon, setCourseIcon] = useState('');
    const [loading, setLoading] = useState(false);




    const options = [];
    const dispatch = useDispatch();

    for (let i = 1; i <= 20; i++) {
        options.push(<option value={i}>Week {i}</option>);
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            event.target.value = '';
            return;
        }

        // Check file size (maximum 5 MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5 MB.');
            event.target.value = '';
            return;
        }

        // Convert image to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const image = new Image();
            image.src = reader.result;
            image.onload = () => {
                // Check image dimensions (minimum 200x200 pixels)
                // if (image.width < 200 || image.height < 200) {
                //     alert('Image dimensions should be at least 200x200 pixels.');
                //     event.target.value = '';
                //     return;
                // }
                setCourseIcon(reader.result);
            };
        };
    };

    function submitForm() {

        if (courseName === ""  || courseIcon === "") {
            setEmptyFields(true);
            return
        }else{
            setEmptyFields(false);
        }

        setLoading(true);
        
        const model = {
            "courseName": courseName,
            "courseIcon": courseIcon,
        }

        dispatch(createCourse(model)).then((res) => {
                console.log(res)
                if (res.type === "courses/createCourse/fulfilled") {
                   setCourseName('')
                   setCourseIcon('')
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
                setLoading(false);
                } else {
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
                    setLoading(false);
                }
            })

       
    }


    return (
        <>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Add Course</h2>
            </div>
            <div className="grid grid-cols-11 gap-x-6 mt-5 pb-20">

                <div className="intro-y col-span-11 2xl:col-span-9">
                    {/* BEGIN: Uplaod Product */}
                    <div className="intro-y box p-5">
                        <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                            <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Upload
                                Course Icon
                            </div>
                            <div className="mt-5">
                                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                                    <div className="form-label xl:w-64 xl:!mr-10">
                                        <div className="text-left">
                                            <div className="flex items-center">
                                                <div className="font-medium">Course Name</div>
                                                <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                    Required
                                                </div>
                                            </div>
                                            <div className="leading-relaxed text-slate-500 text-xs mt-3">
                                                Include min. 40 characters to make it more attractive
                                                and easy for buyers to find, consisting of product type,
                                                brand, and information such as color, material, or type.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full mt-3 xl:mt-0 flex-1">
                                        <input
                                            onChange={(e) => { setCourseName(e.target.value) }}
                                            type="text"
                                            className="form-control"
                                            placeholder="Course name"
                                            value={courseName}
                                        />
                                        <div className="form-help text-right">
                                            Maximum character 0/70
                                        </div>
                                    </div>
                                </div>
                                <div className="form-inline items-start flex-col xl:flex-row mt-10">
                                    <div className="form-label w-full xl:w-64 xl:!mr-10">
                                        <div className="text-left">
                                            <div className="flex items-center">
                                                <div className="font-medium">Course Icon</div>
                                                <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                    Required
                                                </div>
                                            </div>
                                            <div className="leading-relaxed text-slate-500 text-xs mt-3">
                                                <div>
                                                    The image format is .png and a minimum size
                                                    of 300 x 300 pixels (For optimal images use a minimum
                                                    size of 700 x 700 pixels).
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full mt-3 xl:mt-0 flex-1 border-2 border-dashed dark:border-darkmode-400 rounded-md pt-4">

                                        <div className="px-4 pb-4 mt-5 flex items-center justify-center cursor-pointer relative">
                                            <Lucide icon="Image" className="w-4 h-4 mr-2" />
                                            <span className="text-primary mr-1">
                                                Upload a file
                                            </span>{" "}
                                            or drag and drop
                                            <input
                                                accept="image/*" onChange={handleFileChange}
                                                type="file"
                                                className="w-full h-full top-0 left-0 absolute opacity-0"
                                            />
                                        </div>
                                        {courseIcon && (
                                            <img src={courseIcon} alt="Uploaded Image" style={{ maxWidth: '100%' }} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 
                    <div className="flex justify-end flex-col md:flex-row gap-2 mt-5">
                        {emptyFields && <div className="text-danger">Blank Fields</div>}
                        {loading ? (<button className="w-24 h-6"><LoadingIcon icon="puff" /></button>) : ( <button
                            type="button"
                            className="btn py-3 btn-primary w-full md:w-52" onClick={submitForm}>
                            Save
                        </button>)}
                       
                    </div>

                </div>
                {/* BEGIN: Success Notification Content */}
                <div
                    id="success-notification-content"
                    className="toastify-content hidden flex"
                >
                    <Lucide icon="CheckCircle" className="text-success" />
                    <div className="ml-4 mr-4">
                        <div className="font-medium">Registration success!</div>
                        <div className="text-slate-500 mt-1">
                            Course has been registered successfully!
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
                            Error
                        </div>
                    </div>
                </div>
                {/* END: Failed Notification Content */}

            </div>
        </>
    );
}

export default Main;
