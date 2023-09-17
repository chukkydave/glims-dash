import {
    ClassicEditor,
    TomSelect,
    LoadingIcon,
    Lucide,
    Tippy,
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
} from "@/base-components";
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toastify from "toastify-js";
import { selectAllCourses, fetchCourses } from "../../features/courses/courseSlice";
import EditCourseItem from "../../components/edit-course/Main";
import { createDecidedCase } from "../../features/decided-cases/decidedCasesSlice"

function Main() {




    // state start

    const [loading, setLoading] = useState(false);
    const [emptySubmit, setEmptySubmit] = useState(false);
    const [optionsi, setOptionsi] = useState([]);
    const [week, setWeek] = useState('');
    const [title, setTitle] = useState('');
    const [course, setCourse] = useState('');
    const [information, setInformation] = useState('');
    const [subTopic, setSubTopic] = useState('');
    const [subTopicArr, setSubTopicArr] = useState([]);
    const [editContentb, setEditContentb] = useState("");
    const [editSubTopic, setEditSubTopic] = useState('');
    const [editInformation, setEditInformation] = useState('');
    const [emptyEdit, setEmptyEdit] = useState(false);

    // state end
    const dispatch = useDispatch();
    const courses = useSelector(selectAllCourses);

    useEffect(() => {
        dispatch(fetchCourses())
    }, [dispatch]);
    // const status = useSelector((state) => state.statutes.status);

    // stuffs i need for drafts
    const weekCount = []; // create an empty array to hold the numbers

    for (let i = 1; i <= 20; i++) {
        weekCount.push(i); // push numbers from 1 to 20 into the array
    }
    // const handleDraftContentChange = (index, field, value) => {
    //     const updatedContent = [...content];
    //     updatedContent[index][field] = value;
    //     setContent(updatedContent);
    // };

    const handleSaveSubTopic = () => {
        let obj = {
            name: subTopic,
            courseData: information
        }
        setSubTopicArr([...subTopicArr, obj])
        setSubTopic('');
        setInformation('')
        Toastify({
            node: dom("#success-notification-compile")
                .clone()
                .removeClass("hidden")[0],
            duration: 10000,
            newWindow: true,
            close: true,
            gravity: "bottom",
            position: "left",
            stopOnFocus: true,
        }).showToast();
    };

    const handleShowSubFields = (int) => {
        let obj = subTopicArr[int]
        setEditSubTopic(obj.name);
        setEditInformation(obj.courseData)
        setEditContentb(int)
    };

    const handleRemoveSub = (index) => {
        const updatedContent = [...subTopicArr];
        updatedContent.splice(index, 1);
        setSubTopicArr(updatedContent);
    };

    const handleEditSubTopicFields = () => {
        if (editSubTopic === '' || editInformation === '') {
            setEmptyEdit(true)
            return
        } else {

            setEmptyEdit(false)
            let inde = editContentb

            const updatedContent = [...subTopicArr];
            updatedContent[inde].name = editSubTopic;
            updatedContent[inde].courseData = editInformation;
            setSubTopicArr(updatedContent);
            setEditContentb('')
            setEditSubTopic('');
            setEditInformation('');

            Toastify({
                node: dom("#success-notification-compile")
                    .clone()
                    .removeClass("hidden")[0],
                duration: 10000,
                newWindow: true,
                close: true,
                gravity: "bottom",
                position: "left",
                stopOnFocus: true,
            }).showToast();
        }
    }

    const handleSubmit = () => {
        if (!course || !week || !title || subTopicArr.length <= 0) {
            setEmptySubmit(true)
            return
        }
        setEmptySubmit(false)

        setLoading(true);

        const dat = {
            course: course,
            categories: [{
                categoryName: "Decided cases",
                content: {
                    Topic: title,
                    week: week,
                    subTopics: subTopicArr
                }
            }]
        }

        dispatch(createDecidedCase(dat))
            .then((res) => {
                setLoading(false);
                console.log(res)
                if (res.type === "decidedCases/createDecidedCase/fulfilled") {
                    setCourse('')
                    setWeek('')
                    setTitle('')
                    setInformation('')
                    setSubTopicArr([])
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

    // stuffs i need for drafts end




    return (
        <>
            <div>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="text-lg font-medium mr-auto">Add Decided Case</h2>
                    <div className="w-full sm:w-auto flex mt-4 sm:mt-0">

                        {loading ? (<button className="btn btn-primary mr-1 mb-2">
                            Saving
                            <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />
                        </button>) : (<button onClick={handleSubmit} type="button" className="btn mr-2 flex items-center ml-auto sm:ml-0 btn-primary">
                            Save
                        </button>)}
                    </div>
                </div>
                <div className="pos intro-y grid grid-cols-12 gap-5 mt-5">
                    {/* BEGIN: Post Content */}
                    <div className="intro-y col-span-12 lg:col-span-7">

                        <div className="text-right mt-5">
                            {emptySubmit ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                        </div>
                        <TabGroup className="post intro-y overflow-hidden box mt-5">
                            <TabList className="post__tabs nav-tabs flex-col sm:flex-row bg-slate-200 dark:bg-darkmode-800">
                                <Tab
                                    fullWidth={false}
                                    className="w-full sm:w-40 py-0 px-0"
                                    tag="button"
                                >
                                    <Tippy
                                        content="Input Decided Case Basic details"
                                        className="tooltip w-full flex items-center justify-center py-4"
                                        aria-controls="content"
                                        aria-selected="true"
                                    >
                                        <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Details
                                    </Tippy>
                                </Tab>
                                <Tab
                                    fullWidth={false}
                                    className="w-full sm:w-40 py-0 px-0"
                                    tag="button"
                                >
                                    <Tippy
                                        content="Input multiple subtopics and content"
                                        className="tooltip w-full flex items-center justify-center py-4"
                                        aria-selected="false"
                                    >
                                        <Lucide icon="Code" className="w-4 h-4 mr-2" /> Sub-topics
                                    </Tippy>
                                </Tab>
                                {/* <Tab
                                    fullWidth={false}
                                    className="w-full sm:w-40 py-0 px-0"
                                    tag="button"
                                >
                                    <Tippy
                                        content="Use search keywords"
                                        className="tooltip w-full flex items-center justify-center py-4"
                                        aria-selected="false"
                                    >
                                        <Lucide icon="AlignLeft" className="w-4 h-4 mr-2" /> Keywords
                                    </Tippy>
                                </Tab> */}
                            </TabList>
                            <TabPanels className="post__content">
                                <TabPanel className="p-5">
                                    <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                                        <div className="mt-5">
                                            <label className="form-label">
                                                Select Course
                                            </label>
                                            <TomSelect
                                                value={course}
                                                onChange={setCourse}
                                                className="w-full">
                                                <option>--Select--</option>
                                                {courses.map((itm, iny) => (
                                                    <option value={itm._id} key={iny + "_courset"}>{itm.courseName}</option>
                                                ))}
                                            </TomSelect>
                                        </div>
                                        <div className="mt-5">
                                            <label className="form-label">
                                                Select Week
                                            </label>
                                            <TomSelect
                                                value={week}
                                                onChange={setWeek}
                                                className="w-full"
                                            >
                                                <option value="null">--Select--</option>
                                                {weekCount.map((number) => (
                                                    <option key={number} value={number}>
                                                        {"Week" + " " + number}
                                                    </option>
                                                ))}
                                            </TomSelect>
                                        </div>
                                        <div className="mt-5">
                                            <label className="form-label">
                                                Topic
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control w-full"
                                                value={title}
                                                onChange={(e) => { setTitle(e.target.value) }}
                                            />
                                        </div>


                                    </div>
                                </TabPanel>
                                <TabPanel className="p-5">
                                    <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                                        <div className="mt-5">
                                            <label className="form-label">
                                                Sub topic
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control w-full"
                                                value={subTopic}
                                                onChange={(e) => { setSubTopic(e.target.value) }}
                                            />
                                        </div>
                                        <div className="mt-5">
                                            <label>Content</label>
                                            <div className="mt-2">
                                                <ClassicEditor
                                                    value={information}
                                                    onChange={setInformation}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-5">
                                            <button onClick={handleSaveSubTopic} type="button" className="btn mr-2 flex items-center ml-auto sm:ml-0 btn-primary">
                                                Save Sub-topic
                                            </button>

                                        </div>
                                    </div>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>

                    </div>
                    {/* END: Post Content */}
                    {/* BEGIN: Post Info */}
                    <div className="col-span-12 lg:col-span-5">
                        <div className="intro-y box p-5">
                            <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                                {editContentb === "" ? (subTopicArr.map((itm, inx) => (
                                    <div className="box p-5 rounded-md mt-5" key={inx + "_content"}>
                                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                                            <div className="font-medium text-base truncate">
                                                {itm.name} (sub-topic {inx + 1})
                                            </div>
                                            <div className="flex items-center ml-auto text-primary">
                                                <Lucide icon="Edit" className="w-4 h-4 mr-2" onClick={() => { handleShowSubFields(inx) }} />
                                                <Lucide icon="Trash" className="w-4 h-4 mr-2" onClick={() => { handleRemoveSub(inx) }} />
                                            </div>
                                        </div>

                                    </div>
                                ))) : (<div className="box p-5 rounded-md mt-5">
                                    <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">

                                        <div className="mt-5">
                                            <label className="form-label">
                                                Question
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control w-full"
                                                onChange={(e) => { setEditSubTopic(e.target.value) }}
                                                value={editSubTopic}
                                            />
                                        </div>
                                        <div className="mt-5">
                                            <label className="form-label">
                                                Answer
                                            </label>
                                            <ClassicEditor
                                                value={editInformation}
                                                onChange={setEditInformation}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right mt-5">
                                        {emptyEdit ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                                    </div>
                                    <button onClick={handleEditSubTopicFields} type="button" className="btn mr-2 flex items-center ml-auto sm:ml-0 btn-primary">
                                        Done
                                    </button>
                                </div>)}


                            </div>
                        </div>
                    </div>
                    {/* END: Post Info */}
                    {/* BEGIN: Success Notification Content */}
                    <div
                        id="success-notification-compile"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="CheckCircle" className="text-success" />
                        <div className="ml-4 mr-4">
                            <div className="font-medium">Success!</div>
                            <div className="text-slate-500 mt-1">
                                Saved
                            </div>
                        </div>
                    </div>
                    {/* END: Success Notification Content */}
                    {/* BEGIN: Success Notification Content */}
                    <div
                        id="success-notification-content"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="CheckCircle" className="text-success" />
                        <div className="ml-4 mr-4">
                            <div className="font-medium">Success!</div>
                            <div className="text-slate-500 mt-1">
                                Saved to Server
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
                            <div className="font-medium">Saving failed!</div>
                            <div className="text-slate-500 mt-1">
                                Error saving to server
                            </div>
                        </div>
                    </div>
                    {/* END: Failed Notification Content */}
                </div>
            </div>
            {/* Begin Edit Course */}
        </>
    );
}

export default Main;
