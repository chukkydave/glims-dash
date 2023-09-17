import { ClassicEditor, TomSelect, LoadingIcon, Lucide } from "@/base-components";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createInstitution } from "../../features/institutions/institutionSlice";
import Toastify from "toastify-js";
import { selectAllCourses, fetchCourses } from "../../features/courses/courseSlice";

function Main() {

    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [acronymn, setAcronymn] = useState('');
    const [stateName, setStateName] = useState('');

    const dispatch = useDispatch();
    const courses = useSelector(selectAllCourses);

    useEffect(() => {
        dispatch(fetchCourses())
    }, [dispatch]);
    // const status = useSelector((state) => state.institutions.status);


    const handleSubmit = () => {
        if (!name || !acronymn || !stateName) {
            setEmpty(true)
            return
        } else {
            setEmpty(false)
        }
        setLoading(true);

        const institution = {
            "institutionName": name,
            "address": address,
            "acronymn": acronymn,
            "state": stateName
        };

        dispatch(createInstitution(institution))
            .then((res) => {
                setLoading(false);
                console.log(res)
                if (res.type === "institutions/createInstitution/fulfilled") {
                    setName('')
                    setAcronymn('')
                    setAddress('')
                    setStateName('')
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
                <h2 className="text-lg font-medium mr-auto">Add Institution</h2>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 lg:col-span-6">
                    {/* BEGIN: Form Layout */}
                    <div className="intro-y box p-5">
                        <div>
                            <label htmlFor="crud-form-1" className="form-label">
                                Institution Name
                            </label>
                            <input
                                id="crud-form-1"
                                type="text"
                                className="form-control w-full"
                                placeholder="Lagos State University"
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                            />
                        </div>
                        <div className="mt-3">
                            <label htmlFor="crud-form-2" className="form-label">
                                Acronymn
                            </label>
                            <input
                                id="crud-form-1"
                                type="text"
                                className="form-control w-full"
                                value={acronymn}
                                placeholder="UNILAG"
                                onChange={(e) => { setAcronymn(e.target.value) }}
                            />

                        </div>


                        <div className="mt-3">
                            <label>State</label>
                            <div className="mt-2">
                                <input
                                    id="crud-form-1"
                                    type="text"
                                    className="form-control w-full"
                                    value={stateName}
                                    placeholder="Lagos State"
                                    onChange={(e) => { setStateName(e.target.value) }}
                                />
                                {/* <TomSelect
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
                            </TomSelect> */}
                            </div>
                        </div>
                        <div className="mt-3">
                            <label htmlFor="crud-form-2" className="form-label">
                                Address
                            </label>
                            <input
                                id="crud-form-1"
                                type="text"
                                className="form-control w-full"
                                placeholder="Yaba, Lagos"
                                value={address}
                                onChange={(e) => { setAddress(e.target.value) }}
                            />

                        </div>
                        <div className="text-right mt-5">
                            {empty ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
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
                            Institution has been added successfully!
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
                        <div className="font-medium">Institution Creation failed!</div>
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