import {
    Lucide,
    LoadingIcon
} from "@/base-components";
import { useState, useEffect } from "react";
import Toastify from "toastify-js";
import { useSelector, useDispatch } from "react-redux";
import { updateInstitution, selectAllInstitutions, fetchInstitutions } from "../../features/institutions/institutionSlice";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';


function Main() {
    const [institutionName, setInstitutionName] = useState('');
    const [emptyFields, setEmptyFields] = useState(false);
    const [institutionIcon, setInstitutionIcon] = useState('');
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [acronymn, setAcronymn] = useState('');
    const [stateName, setStateName] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const institutions = useSelector(selectAllInstitutions)

    useEffect(() => {
        dispatch(fetchInstitutions())
    }, [dispatch]);

    useEffect(() => {
        const filtered = institutions.filter(item => item._id === id);
        setName(filtered[0].institutionName)
        setAcronymn(filtered[0].acronymn)
        setAddress(filtered[0].address)
        setStateName(filtered[0].state)
    }, [institutions]);


    function submitForm() {

        if (name === "" || acronymn === "" || address === "" || stateName === "") {
            setEmptyFields(true);
            return
        } else {
            setEmptyFields(false);
        }

        setLoading(true);

        const datan = {
            dta: {
                "institutionName": name,
                "address": address,
                "acronymn": acronymn,
                "state": stateName
            },
            id: id
        }

        dispatch(updateInstitution(datan)).then((res) => {
            if (res.type === "institutions/updateInstitution/fulfilled") {
                // setInstitutionName('')
                // setInstitutionIcon('')
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
                navigate('/institutions')
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
                <h2 className="text-lg font-medium mr-auto">Edit Institution</h2>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 lg:col-span-6">
                    {/* BEGIN: Uplaod Product */}
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
                    </div>

                    <div className="flex justify-end flex-col md:flex-row gap-2 mt-5">
                        {emptyFields && <div className="text-danger">Blank Fields</div>}
                        {loading ? (<button className="w-24 h-6"><LoadingIcon icon="puff" /></button>) : (<button
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
                        <div className="font-medium">Update success!</div>
                        <div className="text-slate-500 mt-1">
                            Institution has been updated successfully!
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
                        <div className="font-medium">Update failed!</div>
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
