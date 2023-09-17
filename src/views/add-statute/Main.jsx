import { ClassicEditor, TomSelect, LoadingIcon, Lucide } from "@/base-components";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStatute } from "../../features/statutes/statutesSlice";
import Toastify from "toastify-js";
import { selectAllCourses, fetchCourses } from "../../features/courses/courseSlice";
import { helper } from "../../utils";
// import cloudinary from "../../../cloudinaryConfig";
const apiKey = import.meta.env.VITE_CLOUDFARE_API_KEY;
const secret = import.meta.env.VITE_CLOUDFARE_SECRET_KEY;
const cloudName = import.meta.env.VITE_CLOUDFARE_NAME;


function Main() {
    const [categories, setCategories] = useState([]);
    // const [editorData, setEditorData] = useState('');
    const [pdf, setPdf] = useState('');
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [fetchUrlLoading, setFetchUrlLoading] = useState(false);

    const dispatch = useDispatch();
    const courses = useSelector(selectAllCourses);

    useEffect(() => {
        dispatch(fetchCourses())
    }, [dispatch]);
    // const status = useSelector((state) => state.statutes.status);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Only PDF files are allowed')
            event.target.value = null;
        }

        // Check file size (maximum 5 MB)
        // if (file.size > 10 * 1024 * 1024) {
        //     alert('File size should be less than 5 MB.');
        //     event.target.value = '';
        //     return;
        // }

        setPdf(file)

        // Convert image to base64
        // const reader = new FileReader();

        // reader.onload = () => {
        //     const base64Data = reader.result;
        //     setPdf(base64Data);
        // };

        // reader.readAsDataURL(file);

        // helper.convertPdfToBase64(file, (base64String) => {
        //     // Do something with the base64String, such as storing it in a state
        //     setPdf(base64String)
        // });
    };


    const handleFileUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Only PDF files are allowed')
            event.target.value = null;
        }

        // Check file size (maximum 5 MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size should be less than 10 MB.');
            event.target.value = '';
            return;
        }

        setLoading(true)
        setFetchUrlLoading(true)




        // try {
        //     const uploadResponse = await cloudinary.uploader.upload(file);
        //     const imageUrl = uploadResponse.secure_url;

        //     // Send the imageUrl to your endpoint or perform any necessary actions
        //     console.log(imageUrl);
        //     setPdf(imageUrl)
        // } catch (error) {
        //     // Handle upload error
        //     event.target.value = '';
        //     alert("file not uploaded, kindly reselect the file again")
        //     console.error('Error uploading image:', error);
        // } finally {
        //     setLoading(false)
        // }
    };


    const handleSubmit = async () => {

        if (!topic || !pdf) {
            setEmpty(true)
            return
        } else {
            setEmpty(false)
        }
        setLoading(true);

        let tags = []
        if (categories.length > 0) {
            tags = categories.map((itms) => {
                return {
                    "courseID": itms.split('/')[0],
                    "courseName": itms.split('/')[1]
                }
            })

        }


        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`; // Replace with your Cloudinary cloud name


        const formData = new FormData();
        formData.append('file', pdf);
        formData.append('upload_preset', 'zhoebnei');
        formData.append('api_key', apiKey);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            // Get the URL of the uploaded file
            const imageUrl = data.secure_url;

            // Dispatch an action with the imageUrl
            // dispatchAction(imageUrl);
            console.log(imageUrl)
            const statute = {
                "statutesTopic": topic,
                "statutesData": imageUrl,
                "tags": tags,
            };

            dispatch(createStatute(statute))
                .then((res) => {
                    setLoading(false);
                    if (res.type === "statutes/createStatute/fulfilled") {
                        setTopic('')
                        setPdf('')
                        setCategories([])
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
                    }
                })
        } catch (error) {
            // Handle upload error
            // event.target.value = '';
            alert("file Url not retrieved, kindly reselect the file again")
            console.error('Error uploading file:', error);
        }










    }

    return (
        <>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Add Statute</h2>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 lg:col-span-12">
                    {/* BEGIN: Form Layout */}
                    <div className="intro-y box p-5">
                        <div>
                            <label htmlFor="crud-form-1" className="form-label">
                                Statute Topic
                            </label>
                            <input
                                id="crud-form-1"
                                type="text"
                                className="form-control w-full"
                                value={topic}
                                onChange={(e) => { setTopic(e.target.value) }}
                            />
                        </div>
                        <div className="mt-3">
                            <label htmlFor="crud-form-2" className="form-label">
                                Course Tags
                            </label>
                            <TomSelect
                                id="crud-form-2"
                                value={categories}
                                onChange={setCategories}
                                className="w-full"
                                multiple
                            >
                                {courses.map((itm) => (
                                    <option value={itm._id + "/" + itm.courseName} key={itm._id}>{itm.courseName}</option>
                                ))
                                }
                            </TomSelect>
                        </div>


                        <div className="mt-3">
                            <label>Statute File</label>
                            <div className="mt-2">
                                {/* <ClassicEditor
                                    value={editorData}
                                    onChange={setEditorData}
                                /> */}



                                {fetchUrlLoading ? (<p>Fetching File Url</p>) : (<input
                                    type="file"
                                    accept=".pdf"
                                    className="form-control w-full"
                                    onChange={handleFileChange}
                                />)}

                            </div>
                        </div>
                        <div className="text-right mt-5">
                            {empty ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                            {/* <button
                                type="button"
                                className="btn btn-outline-secondary w-24 mr-1"
                            >
                                Cancel
                            </button> */}
                            {loading ? (<button className="w-24 h-6"><LoadingIcon icon="puff" /></button>) : (<button onClick={handleSubmit} type="button" className="btn btn-primary w-24">
                                Save
                            </button>)}


                        </div>
                    </div>
                    {/* END: Form Layout */}
                </div>
                {/* BEGIN: Success Notification Content */}
                <div
                    id="success-notification-content"
                    className="toastify-content hidden flex"
                >
                    <Lucide icon="CheckCircle" className="text-success" />
                    <div className="ml-4 mr-4">
                        <div className="font-medium">Success!</div>
                        <div className="text-slate-500 mt-1">
                            Statute has been added successfully!
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
                        <div className="font-medium">Statute Creation failed!</div>
                        <div className="text-slate-500 mt-1">
                            Error Occured
                        </div>
                    </div>
                </div>
                {/* END: Failed Notification Content */}
            </div>
        </>
    );
}

export default Main;
