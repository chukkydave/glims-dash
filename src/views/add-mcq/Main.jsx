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
import EditMcqItem from '../../components/edit-mcq/Main';


const Main = () => {
    const dispatch = useDispatch();
    const courses = useSelector(selectAllCourses);

    useEffect(() => {
        dispatch(fetchCourses())
    }, [dispatch]);
    const [editCourse, setEditCourse] = useState(false);
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState('');
    const [course, setCourse] = useState('');
    const [information, setInformation] = useState('');
    const [type, setType] = useState('MCQ');
    const [question, setQuestion] = useState('');
    const [emptySubmit, setEmptySubmit] = useState(false);
    const [coursesArray, setCoursesArray] = useState([]);
    const [courseDuration, setCourseDuration] = useState('');
    const [courseEmpty, setCourseEmpty] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({
        "courseID": "",
        "courseName": "",
        "duration": "",
        "questions": []
    });
    const [options, setOptions] = useState(
        [
            {
                "option": "A",
                "optionText": "",
                "isCorrect": false,
            },
            {
                "option": "B",
                "optionText": "",
                "isCorrect": false,
            },
            {
                "option": "C",
                "optionText": "",
                "isCorrect": false,
            },
            {
                "option": "D",
                "optionText": "",
                "isCorrect": false,
            }
        ]);
    const [answer, setAnswer] = useState('');
    const [questionEmpty, setQuestionEmpty] = useState(false);
    const [compileEmpty, setCompileEmpty] = useState(false);
    const [contentNCourseInd, setContentNCourseInd] = useState("");
    const [selectedCourseForEdit, setSelectedCourseForEdit] = useState({});
    const [selectedTypeForEdit, setSelectedTypeForEdit] = useState('');




    const handleSubmit = () => {
        if (!duration || !information || coursesArray.length <= 0) {
            setEmptySubmit(true)
            return
        }
        setEmptySubmit(false)

        setLoading(true);
        const data = {
            type,
            duration,
            information,
            courses: coursesArray
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

    const handleSubmitCourse = () => {
        if (course === "" && courseDuration === "") {
            setCourseEmpty(true)
            return
        } else {
            setCourseEmpty(false)
            setCurrentCourse({
                ...currentCourse,
                "courseID": course.split('/')[0],
                "courseName": course.split('/')[1],
                "duration": courseDuration,
            })
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

    };

    const handleOptionChange = (index, field, value, name) => {
        const updatedOptions = [...options];
        updatedOptions[index] = { ...updatedOptions[index], [field]: value };
        setOptions(updatedOptions);

        if (field === "isCorrect" && value === true) {
            if (options[index].optionText === "") {
                alert('Kindly fill in the option text before selecting an answer')
                setOptions((prevFormData) => {
                    // Update the value of the current object in formData array
                    const updatedFormData = [...prevFormData];
                    updatedFormData[index].isCorrect = false;
                    return updatedFormData;
                });


            } else {

                setAnswer(options[index].option)
                const updatedOptions = options.map((option) => {
                    if (option.option === name) {
                        return { ...option, isCorrect: true };
                    } else {
                        return { ...option, isCorrect: false };
                    }
                });
                setOptions(updatedOptions);

            }
        }
        if (field === "isCorrect" && value === false) {
            setAnswer('')
        }
    };

    const handleAddQuestion = () => {
        let obj
        obj = {
            "question": question,
            "options": options,
            "answer": answer
        }

        if (question === "") {
            setQuestionEmpty(true);
            return;
        }
        setQuestionEmpty(false);
        setCurrentCourse({ ...currentCourse, questions: [...currentCourse.questions, obj] });
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
        setAnswer('')
        setOptions([
            {
                "option": "A",
                "optionText": "",
                "isCorrect": false,
            },
            {
                "option": "B",
                "optionText": "",
                "isCorrect": false,
            },
            {
                "option": "C",
                "optionText": "",
                "isCorrect": false,
            },
            {
                "option": "D",
                "optionText": "",
                "isCorrect": false,
            }
        ])
    };

    const handleCompileCourse = () => {
        // alert(currentCourse.length)
        if (currentCourse.courseID === "" && currentCourse.courseName === "" && currentCourse.duration === "") {
            setCompileEmpty(true)
            return
        } else {
            setCompileEmpty(false);
            setCoursesArray([...coursesArray, currentCourse]);
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
            setCourseDuration('');
            setCourse('');
            setQuestion('');
            setOptions(
                [
                    {
                        "option": "A",
                        "optionText": "",
                        "isCorrect": false,
                    },
                    {
                        "option": "B",
                        "optionText": "",
                        "isCorrect": false,
                    },
                    {
                        "option": "C",
                        "optionText": "",
                        "isCorrect": false,
                    },
                    {
                        "option": "D",
                        "optionText": "",
                        "isCorrect": false,
                    }
                ]
            );
            setCurrentCourse(
                {
                    "courseID": "",
                    "courseName": "",
                    "duration": "",
                    "questions": []
                }
            );
        }


    };

    const handleShowEditCourse = (courseIn) => {
        setContentNCourseInd(courseIn);
        let courser = coursesArray[courseIn];
        let typer = "MCQ"
        setSelectedCourseForEdit(courser);
        setSelectedTypeForEdit(typer);
        setEditCourse(true);
    }

    const handleRemoveCourseFromContent = (index) => {
        const updatedContent = [...coursesArray];
        updatedContent[index].splice(index, 1);
        setCoursesArray(updatedContent);
    };

    const handleCourseChange = (coIndex, value) => {
        const updatedCourse = [...coursesArray];
        updatedCourse[coIndex] = value;
        setCoursesArray(updatedCourse);
        setEditCourse(false)
    };

    return (
        <>
            {!editCourse ? (<div>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="text-lg font-medium mr-auto">Add MCQ Questions for <span>2019</span></h2>
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
                        <TabGroup className="post intro-y box mt-5">
                            <TabList className="post__tabs nav-tabs flex-col sm:flex-row bg-slate-200 dark:bg-darkmode-800" >
                                <Tab
                                    fullWidth={false}
                                    className="w-full sm:w-40 py-0 px-0"
                                    tag="button"
                                >
                                    <Tippy
                                        content="Input MCQ Info"
                                        className="tooltip w-full flex items-center justify-center py-4"
                                        aria-controls="content"
                                        aria-selected="true"
                                    >
                                        <Lucide icon="FileText" className="w-4 h-4 mr-2" /> MCQ Info
                                    </Tippy>
                                </Tab>
                                <Tab
                                    fullWidth={false}
                                    className="w-full sm:w-40 py-0 px-0"
                                    tag="button"
                                >
                                    <Tippy
                                        content="Input the course Info"
                                        className="tooltip w-full flex items-center justify-center py-4"
                                        aria-selected="false"
                                    >
                                        <Lucide icon="Code" className="w-4 h-4 mr-2" /> Course Selection
                                    </Tippy>
                                </Tab>

                            </TabList>
                            <TabPanels className="post__content">
                                <TabPanel className="p-5">
                                    <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
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
                                                value={courseDuration}
                                                onChange={(e) => { setCourseDuration(e.target.value) }}
                                            />
                                        </div>
                                        <div className="text-right mt-5">
                                            {courseEmpty ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                                        </div>
                                        <button onClick={handleSubmitCourse} type="button" className="btn mr-2 flex items-center ml-auto sm:ml-0 btn-primary">
                                            Save 1
                                        </button>
                                    </div>

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
                                                    <label className="form-label mb-3">
                                                        Options
                                                    </label>
                                                    <div className="flex-1">
                                                        {options.map((itm, indx) => (
                                                            <div key={indx + "_options"} className="xl:flex items-center mt-5 first:mt-0">
                                                                <div className="w-20 flex text-slate-500 mt-3 xl:mt-0">
                                                                    <label className="form-label">
                                                                        <input type="checkbox"
                                                                            className=""
                                                                            name={itm.option}
                                                                            onChange={() => handleOptionChange(indx, "isCorrect", !itm.isCorrect, itm.option)}
                                                                            checked={itm.isCorrect} />
                                                                    </label>
                                                                </div>
                                                                <div className="input-group flex-1">
                                                                    <div className="input-group-text">{itm.option}</div>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={itm.optionText}
                                                                        onChange={(e) => handleOptionChange(indx, "optionText", e.target.value)}
                                                                    />
                                                                </div>

                                                            </div>
                                                        ))}

                                                    </div>
                                                </div>

                                                <div className="text-left mt-5">
                                                    {questionEmpty ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                                                </div>
                                                <div className="text-right mt-5">
                                                    {compileEmpty ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                                                </div>

                                                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                                                    {/* <h2 className="text-lg font-medium mr-auto">Add Past Question</h2> */}
                                                    <button onClick={handleAddQuestion} type="button" className="btn mr-auto btn-primary">Save Question</button>
                                                    <div className="w-full sm:w-auto flex mt-4 sm:mt-0">

                                                        <button
                                                            type="button"
                                                            className="btn btn-outlined-secondary box mr-2 flex items-center ml-auto sm:ml-0"
                                                            onClick={handleCompileCourse}
                                                        >
                                                            <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Save Course
                                                        </button>

                                                    </div>
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
                                {coursesArray.map((itm, inx) => (
                                    <div className="box p-5 rounded-md mt-5" key={inx + "_content"}>
                                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                                            <div className="font-medium text-base truncate">
                                                {itm.courseName} ({item.questions.length} Questions)
                                            </div>
                                            <div className="flex items-center ml-auto text-primary">
                                                <Lucide icon="Edit" className="w-4 h-4 mr-2" onClick={() => { handleShowEditCourse(inx) }} />
                                                <Lucide icon="Trash" className="w-4 h-4 mr-2" onClick={() => { handleRemoveCourseFromContent(inx) }} />
                                            </div>
                                        </div>

                                    </div>
                                ))}


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
            </div>) : <EditMcqItem
                indexex={contentNCourseInd}
                course={selectedCourseForEdit}
                type={selectedTypeForEdit}
                handleCourseChange={handleCourseChange}
            />}
        </>
    )
}

export default Main