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
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toastify from "toastify-js";
import { selectAllCourses, fetchCourses } from "../../features/courses/courseSlice";
import EditCourseItem from "../../components/edit-past-question-course/Main";
import { updateQuestion } from "../../features/past-questions/pastQuestionsSlice"
import { useNavigate, useParams } from "react-router-dom";


function Main() {



    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [emptySubmit, setEmptySubmit] = useState(false);
    const [year, setYear] = useState('');
    const [content, setContent] = useState([]);
    const [editContentb, setEditContentb] = useState("");
    const [currentContent, setCurrentContent] = useState({
        type: "",
        duration: "",
        information: "",
        courses: []
    });
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
    const [type, setType] = useState('');
    const [duration, setDuration] = useState('');
    const [courseDuration, setCourseDuration] = useState('');
    const [information, setInformation] = useState('');
    const [course, setCourse] = useState('');
    const [question, setQuestion] = useState('');
    const [answerType, setAnswerType] = useState('');
    const [answer, setAnswer] = useState('');
    const [compileEmpty, setCompileEmpty] = useState(false);
    const [courseEmpty, setCourseEmpty] = useState(false);
    const [questionEmpty, setQuestionEmpty] = useState(false);
    const [emptyEditContentFields, setEmptyEditContentFields] = useState(false);
    const [editCourse, setEditCourse] = useState(false);
    const [contentNCourseInd, setContentNCourseInd] = useState({ contentInd: '', courseInd: '' });
    const [selectedCourseForEdit, setSelectedCourseForEdit] = useState({});
    const [selectedTypeForEdit, setSelectedTypeForEdit] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const allPastQue = useSelector(state => state.pastQuestions.question);

    const filtered = useMemo(() => {
        const filtered = allPastQue.filter(item => item._id === id);
        if (filtered.length > 0) {
            return filtered[0];
        }
        return null;
    }, [allPastQue, id]);

    useEffect(() => {
        dispatch(fetchCourses())
    }, [dispatch]);

    useEffect(() => {
        if (filtered) {
            console.log(filtered)
            setYear(filtered.year)
            setContent(filtered.content)
            // setTopic(filtered.statutesTopic)
            // setEditorData(filtered.statutesData)
            // if (filtered.tags && filtered.tags.length > 0) {
            //     // let tagt = filtered.tags.map((itms) => (
            //     //     `${itms.courseID}/${itms.courseName}`
            //     // ))
            //     // setCategories(tagt)
            //     setCategories(filtered.tags)
            // }
        }
    }, [filtered]);


    // const handleContentChange = (index, field, value) => {
    //     const updatedContent = [...content];
    //     updatedContent[index][field] = value;
    //     setContent(updatedContent);
    // };
    const handleContentChange = (index, field, value) => {
        const updatedContent = [...content]; // Create a new copy of the array
        updatedContent[index] = {
            ...updatedContent[index], // Create a new object for the specific index
            [field]: value, // Update the specific field with the new value
        };
        setContent(updatedContent); // Update the state with the new array
    };

    // const handleCourseChange = (index, coIndex, value) => {
    //     const updatedCourse = [...content];
    //     updatedCourse[index].courses[coIndex] = value;
    //     setContent(updatedCourse);
    //     setEditCourse(false)
    // };

    const handleCourseChange = (index, coIndex, value) => {
        const updatedContent = JSON.parse(JSON.stringify(content)); // Create a deep copy of the array
        updatedContent[index].courses[coIndex] = value; // Update the specific course at the given index
        setContent(updatedContent); // Update the state with the new array
        setEditCourse(false);
    };


    const handleAddContent = (newContent) => {
        setContent([...content, newContent]);
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
        // setContent([...content, { type: '', duration: '', information: '', courses: [] }]);
    };

    const handleRemoveContent = (index) => {
        const updatedContent = [...content];
        updatedContent.splice(index, 1);
        setContent(updatedContent);
    };

    const handleRemoveCourseFromContent = (index, courseIdx) => {
        const updatedContent = [...content];
        updatedContent[index].courses.splice(courseIdx, 1);
        setContent(updatedContent);
    };


    const courses = useSelector(selectAllCourses);


    // const status = useSelector((state) => state.statutes.status);
    const generateArrayOfYears = () => {
        var max = new Date().getFullYear() - 1
        var min = max - 9
        var years = []

        for (var i = max; i >= min; i--) {
            years.push(i)
        }
        return years
    }

    let tenYears = generateArrayOfYears();

    const handleSubmitContent = () => {

        if (type === '' && duration === '' && information === "") {
            setEmpty(true)
            return
        } else {
            // alert(duration)
            // alert(type)
            setEmpty(false)
            setCurrentContent({
                "type": type,
                "duration": duration,
                "information": information,
                "courses": []
            })
            // handleAddContent(newContent)

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

    }

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
        if (type === "MCQ") {
            obj = {
                "course": currentCourse.courseName,
                "question": question,
                "options": options,
                "answer": answer
            }
        } else {
            obj = {
                "course": currentCourse.courseName,
                "duration": "1",
                "question": question,
                "answer": answerType
            }
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
        setAnswerType('')
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
            setCurrentContent({ ...currentContent, courses: [...currentContent.courses, currentCourse] });
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
            setAnswerType('');
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


    }

    const handleCompile = () => {
        handleAddContent(currentContent)
        setType('');
        setDuration('')
        setInformation('')
        setCurrentContent({
            type: "",
            duration: "",
            information: "",
            courses: []
        });
    }

    const handleSubmit = () => {
        if (!year || content.length <= 0) {
            setEmptySubmit(true)
            return
        }
        setEmptySubmit(false)

        setLoading(true);
        const data = {
            year,
            content
        };

        const dta = {
            data: data,
            id: id
        }

        dispatch(updateQuestion(dta))
            .then((res) => {
                setLoading(false);
                console.log(res)
                if (res.type === "question/updateQuestion/fulfilled") {
                    // setYear('')
                    // setContent([])
                    navigate('/past-questions')
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

    const handleShowContentFields = (int) => {
        let obj = content[int]
        setInformation(obj.information);
        setDuration(obj.duration);
        setType(obj.type);
        setEditContentb(int)
    }

    const handleEditContentFields = () => {
        if (type === '' && duration === '' && information === "") {
            setEmptyEditContentFields(true)
            return
        } else {
            // alert(duration)
            // alert(type)
            setEmptyEditContentFields(false)
            let inde = editContentb

            handleContentChange(inde, 'type', type)
            handleContentChange(inde, 'duration', duration)
            handleContentChange(inde, 'information', information)
            setEditContentb('')
            setInformation('');
            setDuration('');
            setType('');

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

    const handleShowEditCourse = (contentIn, courseIn) => {
        setContentNCourseInd({ contentInd: contentIn, courseInd: courseIn });
        let courser = content[contentIn].courses[courseIn];
        let typer = content[contentIn].type
        setSelectedCourseForEdit(courser);
        setSelectedTypeForEdit(typer);
        setEditCourse(true);
    }



    return (
        <>
            {!editCourse ? (<div>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="text-lg font-medium mr-auto">Add Past Question</h2>
                    <div className="w-full sm:w-auto flex mt-4 sm:mt-0">

                        <button
                            type="button"
                            className="btn box mr-2 flex items-center ml-auto sm:ml-0"
                        >
                            <Lucide icon="Eye" className="w-4 h-4 mr-2" /> Preview
                        </button>
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
                        <label className="form-label">
                            Select Year
                        </label>
                        <TomSelect
                            disabled={true}
                            value={year}
                            onChange={setYear}
                            className="w-full"
                        >
                            <option>--Select--</option>
                            {tenYears.map((itm, ind) => (
                                <option value={itm} key={ind + "_years"}>{itm}</option>
                            ))
                            }
                        </TomSelect>
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
                                        content="Input type and Instruction"
                                        className="tooltip w-full flex items-center justify-center py-4"
                                        aria-controls="content"
                                        aria-selected="true"
                                    >
                                        <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Type and Info
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
                                                Select Type
                                            </label>
                                            <TomSelect
                                                value={type}
                                                onChange={setType}
                                                className="w-full"
                                            >
                                                <option value="null">--Select--</option>
                                                <option value="MCQ">MCQ</option>
                                                <option value="Essay">Essay</option>
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
                                    <div className="text-right mt-5">
                                        {empty ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                                    </div>
                                    <button onClick={handleSubmitContent} type="button" className="btn mr-2 flex items-center ml-auto sm:ml-0 btn-primary">
                                        Save
                                    </button>

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
                                    {type === "null" ? (
                                        <div className="form-inline items-start flex-col xl:flex-row mt-2 pt-2 first:mt-0 first:pt-0">
                                            <div className="w-full mt-3 xl:mt-0 flex-1">
                                                <div className="relative pl-5 pr-5 xl:pr-10 py-10 bg-slate-50 dark:bg-transparent dark:border rounded-md">
                                                    <p className="text-warning">Kindly select and exam type from the "Type and Info" Tab</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="form-inline items-start flex-col xl:flex-row mt-2 pt-2 first:mt-0 first:pt-0">

                                            <div className="w-full mt-3 xl:mt-0 flex-1">
                                                <div className="relative pl-5 pr-5 xl:pr-10 py-10 bg-slate-50 dark:bg-transparent dark:border rounded-md">
                                                    <div className="mt-5">
                                                        <label className="form-label mb-5">
                                                            Question
                                                        </label>
                                                        {/* <input
                                                            type="text"
                                                            className="form-control w-full"
                                                            value={question}
                                                            onChange={(e) => { setQuestion(e.target.value) }}
                                                            /> */}
                                                        <ClassicEditor
                                                            className="form-control w-full"
                                                            value={question}
                                                            onChange={setQuestion}
                                                        />
                                                    </div>
                                                    {type === "MCQ" ? (<div className="mt-5">
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
                                                                        <textarea
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={itm.optionText}
                                                                            onChange={(e) => handleOptionChange(indx, "optionText", e.target.value)}
                                                                        ></textarea>
                                                                    </div>

                                                                </div>
                                                            ))}

                                                        </div>
                                                    </div>) : (<div className="mt-5">
                                                        <label className="form-label mb-5">
                                                            Answer
                                                        </label>
                                                        {/* <textarea
                                                            type="text"
                                                            className="form-control w-full"
                                                            value={answerType}
                                                            onChange={(e) => { setAnswerType(e.target.value) }}
                                                                ></textarea> */}
                                                        <ClassicEditor
                                                            className="form-control w-full"
                                                            value={answerType}
                                                            onChange={setAnswerType}
                                                        />
                                                    </div>)}

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
                                    )}

                                    <div className="xl:ml-64 xl:pl-10 mt-2 pt-2 first:mt-0 first:pt-0">
                                        <Tippy
                                            content="Click to compile questions and (or) start adding another course"
                                            className="tooltip w-full flex items-center justify-center py-4"
                                            aria-controls="content"
                                            aria-selected="true"
                                        >
                                            <button className="btn btn-success py-3 border-dashed w-full" onClick={handleCompile}>
                                                <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Compile

                                            </button>
                                        </Tippy>
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
                                {editContentb === "" ? (content.map((itm, inx) => (
                                    <div className="box p-5 rounded-md mt-5" key={inx + "_content"}>
                                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                                            <div className="font-medium text-base truncate">
                                                Content {inx + 1} ({itm.type})
                                            </div>
                                            <div className="flex items-center ml-auto text-primary">
                                                <Lucide icon="Edit" className="w-4 h-4 mr-2" onClick={() => { handleShowContentFields(inx) }} />
                                                <Lucide icon="Trash" className="w-4 h-4 mr-2" onClick={() => { handleRemoveContent(inx) }} />
                                            </div>
                                        </div>
                                        {itm.courses.map((item, index) => (

                                            <div className="flex flex-col lg:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400" key={index + "_courses"}>

                                                <div className="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                                    <a href="" className="font-medium">
                                                        {item.courseName}
                                                    </a>
                                                    <div className="text-slate-500 text-xs mt-0.5">
                                                        {item.questions.length} Questions
                                                    </div>
                                                </div>
                                                <div className="flex -ml-2 lg:ml-0 lg:justify-end mt-3 lg:mt-0">
                                                    <Tippy
                                                        className="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in"
                                                        content={'Edit' + " " + item.courseName}
                                                    >
                                                        <Lucide icon="Edit" className="w-3 h-3 fill-current" onClick={() => { handleShowEditCourse(inx, index) }} />
                                                    </Tippy>
                                                    <Tippy
                                                        className="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in"
                                                        content={'Delete' + " " + item.courseName}
                                                    >
                                                        <Lucide icon="Trash" className="w-3 h-3 fill-current" onClick={() => { handleRemoveCourseFromContent(inx, index) }} />
                                                    </Tippy>

                                                </div>
                                            </div>



                                        ))}
                                    </div>
                                ))) : (<div className="box p-5 rounded-md mt-5">
                                    <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">

                                        <div className="mt-5">
                                            <label className="form-label">
                                                Select Type
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control w-full"
                                                // onChange={(e) => { setType(e.target.value) }}
                                                value={type}
                                                disabled={true}
                                            />
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
                                    <div className="text-right mt-5">
                                        {emptyEditContentFields ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                                    </div>
                                    <button onClick={handleEditContentFields} type="button" className="btn mr-2 flex items-center ml-auto sm:ml-0 btn-primary">
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
            </div>) : <EditCourseItem
                indexex={contentNCourseInd}
                course={selectedCourseForEdit}
                type={selectedTypeForEdit}
                handleCourseChange={handleCourseChange}
            />}
            {/* Begin Edit Course */}
        </>
    );
}

export default Main;
