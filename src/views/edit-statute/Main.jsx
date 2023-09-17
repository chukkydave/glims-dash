import {
    Lucide,
    LoadingIcon,
    ClassicEditor, TomSelect,
} from "@/base-components";
import { useState, useEffect, useMemo } from "react";
import Toastify from "toastify-js";
import { useSelector, useDispatch } from "react-redux";
import { updateStatute, selectAllStatutes, fetchStatutes } from "../../features/statutes/statutesSlice";
import { selectAllCourses, fetchCourses } from "../../features/courses/courseSlice";
import { useNavigate, useParams } from "react-router-dom";
import PdfViewer from "../../components/pdf-viewer/Main"


function Main() {
    const [emptyFields, setEmptyFields] = useState(false);
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [editorData, setEditorData] = useState("");
    const [topic, setTopic] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // const statutes = useSelector(selectAllStatutes);
    const courses = useSelector(selectAllCourses);

    const allStatutes = useSelector(state => state.statutes.statutes);

    const filtered = useMemo(() => {
        const filtered = allStatutes.filter(item => item._id === id);
        if (filtered.length > 0) {
            return filtered[0];
        }
        return null;
    }, [allStatutes, id]);

    useEffect(() => {
        if (filtered) {
            setTopic(filtered.statutesTopic)
            setEditorData(filtered.statutesData)
            console.log(filtered.tags)
            if (filtered.tags && filtered.tags.length > 0) {
                let tagt = filtered.tags.map((itms) => (
                    `${itms.courseID}/${itms.courseName}`
                ))
                setCategories(tagt)
                // setCategories(filtered.tags)
            }
        }
    }, [filtered]);

    // Update the state using useEffect or within a function/component bod



    function submitForm() {

        if (topic === "" || editorData === "") {
            setEmptyFields(true);
            return
        } else {
            setEmptyFields(false);
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

        const datan = {
            dta: {
                "statutesTopic": topic,
                "statutesData": editorData,
                "tags": tags,
            },
            id: id
        }

        dispatch(updateStatute(datan)).then((res) => {
            if (res.type === "statutes/updateStatute/fulfilled") {
                // setStatuteName('')
                // setStatuteIcon('')
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
                navigate('/statutes')
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
                <h2 className="text-lg font-medium mr-auto">Edit Statute</h2>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 lg:col-span-6">
                    {/* BEGIN: Uplaod Product */}
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
                                // disabled={true}
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


                        {/* <div className="mt-3">
                            <label>Statute</label>
                            <div className="mt-2">
                                <ClassicEditor
                                    value={editorData}
                                    onChange={setEditorData}
                                />
                            </div>
                        </div> */}
                        <div className="mt-3">
                            {/* <label>Statute</label> */}
                            <div className="mt-2">
                                {/* <PdfViewer pdfBase64={editorData} /> */}
                                <a href={editorData} target="_blank"><button className="btn btn-primary" >View Statute</button></a>
                            </div>
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
                            Statute has been updated successfully!
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
