import { ClassicEditor, TomSelect, LoadingIcon, Lucide } from "@/base-components";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNotification } from "../../features/notifications/notificationSlice";
import Toastify from "toastify-js";

function Main() {

    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();


    const handleSubmit = () => {
        if (!title || !message) {
            setEmpty(true)
            return
        } else {
            setEmpty(false)
        }
        setLoading(true);

        const notification = {
            title: title,
            message: message,
        };

        dispatch(createNotification(notification))
            .then((res) => {
                setLoading(false);
                console.log(res)
                if (res.type === "notifications/createNotification/fulfilled") {
                    setTitle('')
                    setMessage('')
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


    }

    return (
        <>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Send Notification</h2>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 lg:col-span-6">
                    {/* BEGIN: Form Layout */}
                    <div className="intro-y box p-5">
                        <div>
                            <label htmlFor="crud-form-1" className="form-label">
                                Title
                            </label>
                            <input
                                id="crud-form-1"
                                type="text"
                                className="form-control w-full"
                                value={title}
                                onChange={(e) => { setTitle(e.target.value) }}
                            />
                        </div>




                        <div className="mt-3">
                            <label htmlFor="crud-form-2" className="form-label">
                                Message
                            </label>
                            <textarea
                                id="crud-form-1"
                                type="text"
                                className="form-control w-full"
                                value={message}
                                onChange={(e) => { setMessage(e.target.value) }}
                            ></textarea>

                        </div>
                        <div className="text-right mt-5">
                            {empty ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                            {loading ? (<button className="w-24 h-6"><LoadingIcon icon="puff" /></button>) : (<button onClick={handleSubmit} type="button" className="btn btn-primary w-24">
                                Send
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
                            Notification sent successfully!
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
                        <div className="font-medium">Notification Creation failed!</div>
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