import React from 'react'
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
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toastify from "toastify-js";
import { selectAllCourses, fetchCourses } from "../../features/courses/courseSlice";

const Main = () => {
    const dispatch = useDispatch();
    const courses = useSelector(selectAllCourses);

    useEffect(() => {
        dispatch(fetchCourses())
    }, [dispatch]);
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState('');
    const [course, setCourse] = useState('');
    const [information, setInformation] = useState('');
    const [answerType, setAnswerType] = useState('');
    const [question, setQuestion] = useState('');
    const [questionEmpty, setQuestionEmpty] = useState(false);
    const [questionsArray, setQuestionsArray] = useState([]);
    const [editContentb, setEditContentb] = useState("");
    const [editQuestion, setEditQuestion] = useState('');
    const [editAnswer, setEditAnswer] = useState('');
    const [emptyEditQuestionFields, setEmptyEditQuestionFields] = useState(false);
    const [emptySubmit, setEmptySubmit] = useState(false);

    const handleSubmit = () => {
        if (!duration || !course || !information || questionsArray.length <= 0) {
            setEmptySubmit(true)
            return
        }
        setEmptySubmit(false)

        setLoading(true);

        const data = {
            duration,
            information,
            type: "Essay",
            questions: questionsArray,
            courseId: course.split('/')[0],
            courseName: course.split('/')[1],
        };

        // dispatch(createQuestion(data))
        //     .then((res) => {
        //         setLoading(false);
        //         console.log(res)
        //         if (res.type === "question/createQuestion/fulfilled") {
        //             setYear('')
        //             setContent([])
        //             Toastify({
        //                 node: dom("#success-notification-content")
        //                     .clone()
        //                     .removeClass("hidden")[0],
        //                 duration: 10000,
        //                 newWindow: true,
        //                 close: true,
        //                 gravity: "top",
        //                 position: "right",
        //                 stopOnFocus: true,
        //             }).showToast();
        //         } else {
        //             Toastify({
        //                 node: dom("#failed-notification-content")
        //                     .clone()
        //                     .removeClass("hidden")[0],
        //                 duration: 10000,
        //                 newWindow: true,
        //                 close: true,
        //                 gravity: "top",
        //                 position: "right",
        //                 stopOnFocus: true,
        //             }).showToast();
        //         }
        //     })
    };
    const handleAddQuestion = () => {
        let obj

        obj = {
            "question": question,
            "answer": answerType
        }

        if (question === "" || answerType === "") {
            setQuestionEmpty(true);
            return;
        }
        setQuestionEmpty(false);
        setQuestionsArray([...questionsArray, obj]);
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
        setQuestion('')
        setAnswerType('')

    };
    const handleShowQuestionFields = (int) => {
        let obj = questionsArray[int]
        setEditAnswer(obj.question);
        setEditQuestion(obj.answer);
        setEditContentb(int)
    };

    const handleEditQuestionFields = () => {
        if (editAnswer === '' || editQuestion === '') {
            setEmptyEditQuestionFields(true)
            return
        } else {
            // alert(duration)
            // alert(type)
            setEmptyEditQuestionFields(false)
            let inde = editContentb

            const updatedContent = [...questionsArray];
            updatedContent[inde][question] = editQuestion;
            updatedContent[inde][answer] = editAnswer;
            setQuestionsArray(updatedContent);
            setEditContentb('')
            setEditAnswer('');
            setEditQuestion('');

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

    const handleRemoveQuestion = (index) => {
        const updatedContent = [...questionsArray];
        updatedContent.splice(index, 1);
        setQuestionsArray(updatedContent);
    };

    return (

        <>
            <div>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="text-lg font-medium mr-auto">Add Past Question</h2>
                    <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
                        {loading ? (<button className="btn btn-primary mr-1 mb-2">
                            Saving
                            <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />
                        </button>) : (<button onClick={handleSubmit} type="button" className="btn mr-2 flex items-center ml-auto sm:ml-0 btn-primary">
                            Save
                        </button>)}
                        <div className="text-right mt-5">
                            {emptySubmit ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                        </div>
                    </div>
                </div>
                <div className="pos intro-y grid grid-cols-12 gap-5 mt-5">
                    {/* BEGIN: Post Content */}
                    <div className="intro-y col-span-12 lg:col-span-7">
                        <TabGroup className="post intro-y box mt-5">
                            <TabList className="post__tabs nav-tabs flex-col sm:flex-row bg-slate-200 dark:bg-darkmode-800" >
                                <Tab
                                    fullWidth={false}
                                    className="w-full sm:w-40 py-0 px-0"
                                    tag="button"
                                >
                                    <Tippy
                                        content="Input Essay Info"
                                        className="tooltip w-full flex items-center justify-center py-4"
                                        aria-controls="content"
                                        aria-selected="true"
                                    >
                                        <Lucide icon="FileText" className="w-4 h-4 mr-2" />Essay Info
                                    </Tippy>
                                </Tab>
                                <Tab
                                    fullWidth={false}
                                    className="w-full sm:w-40 py-0 px-0"
                                    tag="button"
                                >
                                    <Tippy
                                        content="Input questions and answers"
                                        className="tooltip w-full flex items-center justify-center py-4"
                                        aria-selected="false"
                                    >
                                        <Lucide icon="Code" className="w-4 h-4 mr-2" /> Add Questions
                                    </Tippy>
                                </Tab>
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
                                                className="w-full"
                                            >
                                                <option>--Select--</option>
                                                {courses.map((itm, iny) => (
                                                    <option value={itm._id + "/" + itm.courseName} key={iny + "_courset"}>{itm.courseName}</option>
                                                ))}
                                            </TomSelect>
                                        </div>

                                        <div className="mt-5">
                                            <label className="form-label">
                                                Duration
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control w-full"
                                                placeholder="In minutes (e.g 60)"
                                                value={duration}
                                                onChange={(e) => { setDuration(e.target.value) }}
                                            />
                                        </div>

                                        <div className="mt-5">
                                            <label>Instructions</label>
                                            <div className="mt-2">
                                                <ClassicEditor
                                                    value={information}
                                                    onChange={setInformation}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel className="p-5">
                                    {/* <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5"></div> */}
                                    <div className="form-inline items-start flex-col xl:flex-row mt-2 pt-2 first:mt-0 first:pt-0">

                                        <div className="w-full mt-3 xl:mt-0 flex-1">
                                            <div className="relative pl-5 pr-5 xl:pr-10 py-10 bg-slate-50 dark:bg-transparent dark:border rounded-md">
                                                <div className="mt-5">
                                                    <label className="form-label mb-5">
                                                        Question
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control w-full"
                                                        value={question}
                                                        onChange={(e) => { setQuestion(e.target.value) }}
                                                    />
                                                </div>
                                                <div className="mt-5">
                                                    <label className="form-label mb-5">
                                                        Answer
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control w-full"
                                                        value={answerType}
                                                        onChange={(e) => { setAnswerType(e.target.value) }}
                                                    />
                                                </div>

                                                <div className="text-left mt-5">
                                                    {questionEmpty ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                                                </div>


                                                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                                                    {/* <h2 className="text-lg font-medium mr-auto">Add Past Question</h2> */}
                                                    <button onClick={handleAddQuestion} type="button" className="btn mr-auto btn-primary">Save Question</button>

                                                </div>

                                            </div>
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
                                {editContentb === "" ? (questionsArray.map((itm, inx) => (
                                    <div className="box p-5 rounded-md mt-5" key={inx + "_content"}>
                                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                                            <div className="font-medium text-base truncate">
                                                Question {inx + 1}
                                            </div>
                                            <div className="flex items-center ml-auto text-primary">
                                                <Lucide icon="Edit" className="w-4 h-4 mr-2" onClick={() => { handleShowQuestionFields(inx) }} />
                                                <Lucide icon="Trash" className="w-4 h-4 mr-2" onClick={() => { handleRemoveQuestion(inx) }} />
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
                                                onChange={(e) => { setEditQuestion(e.target.value) }}
                                                value={editQuestion}
                                            />
                                        </div>
                                        <div className="mt-5">
                                            <label className="form-label">
                                                Answer
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control w-full"
                                                value={editAnswer}
                                                onChange={(e) => { setEditAnswer(e.target.value) }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right mt-5">
                                        {emptyEditQuestionFields ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                                    </div>
                                    <button onClick={handleEditQuestionFields} type="button" className="btn mr-2 flex items-center ml-auto sm:ml-0 btn-primary">
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
        </>
    )
}

export default Main