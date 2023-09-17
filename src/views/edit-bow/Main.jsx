import React from 'react'
import {
    ClassicEditor,
    Litepicker,
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
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toastify from "toastify-js";
import { selectAllCourses, fetchCourses } from "../../features/courses/courseSlice";
import { useNavigate, useParams } from "react-router-dom";
import { updateBow } from '../../features/BOW/bowSlice';
import EditMcqItem from '../../components/edit-mcq/Main';


const Main = () => {
    const dispatch = useDispatch();

    const { id } = useParams();
    const navigate = useNavigate();

    const allBow = useSelector(state => state.bows.bows);

    const filtered = useMemo(() => {
        const filtered = allBow.filter(item => item._id === id);
        if (filtered.length > 0) {
            return filtered[0];
        }
        return null;
    }, [allBow, id]);

    useEffect(() => {
        if (filtered) {
            console.log(filtered)
            setQuestionsArr(filtered.content[0].questions)
            setDate(filtered.startDate)
            setEndDate(filtered.endDate)
            setInstruction(filtered.instruction)
            setDuration(filtered.content[0].duration)
            setWeek(filtered.content[0].week)
            setTitle(filtered.content[0].title)
        }
    }, [filtered]);






    const [editCourse, setEditCourse] = useState(false);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [emptySubmit, setEmptySubmit] = useState(false);
    const [coursesArray, setCoursesArray] = useState([]);
    const [date, setDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [instruction, setInstruction] = useState('');
    const [duration, setDuration] = useState('');
    const [status, setStatus] = useState(false);

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
    const [answer, setAnswer] = useState({ option: "", optionText: "" });
    const [questionEmpty, setQuestionEmpty] = useState(false);
    const [compileEmpty, setCompileEmpty] = useState(false);
    const [contentNCourseInd, setContentNCourseInd] = useState("");
    const [selectedCourseForEdit, setSelectedCourseForEdit] = useState({});
    const [selectedTypeForEdit, setSelectedTypeForEdit] = useState('');
    const [week, setWeek] = useState('');
    const [title, setTitle] = useState('');
    const [questionsArr, setQuestionsArr] = useState([]);
    const [editContentb, setEditContentb] = useState("");
    const [editQuestion, setEditQuestion] = useState('');
    const [emptyEdit, setEmptyEdit] = useState(false);
    const [editOptions, setEditOptions] = useState([
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
    const [editAnswer, setEditAnswer] = useState({ option: "", optionText: "" });



    const weekCount = []; // create an empty array to hold the numbers

    for (let i = 1; i <= 20; i++) {
        weekCount.push(i); // push numbers from 1 to 20 into the array
    }

    const handleSubmit = () => {
        if (!date || !week || !title || !endDate) {
            setEmptySubmit(true)
            return
        }
        setEmptySubmit(false)

        setLoading(true);

        const dat = {
            id: id, data: {
                startDate: date,
                endDate: endDate,
                instruction: instruction,
                status: status,
                content: [
                    {
                        duration: duration,
                        week: week,
                        title: title,
                        questions: questionsArr,

                    }
                ],

            }
        };

        dispatch(updateBow(dat))
            .then((res) => {
                setLoading(false);
                console.log(res)
                if (res.type === "bows/updateBow/fulfilled") {
                    navigate('/BOW')
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

                // setAnswer(options[index].option)
                setAnswer({ option: options[index].option, optionText: options[index].optionText })
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
            setAnswer({ option: "", optionText: "" })
        }
    };

    const handleOptionChangeEdit = (index, field, value, name) => {
        const updatedOptions = [...editOptions];
        updatedOptions[index] = { ...updatedOptions[index], [field]: value };
        setEditOptions(updatedOptions);

        if (field === "isCorrect" && value === true) {
            if (editOptions[index].optionText === "") {
                alert('Kindly fill in the option text before selecting an answer')
                setEditOptions((prevFormData) => {
                    // Update the value of the current object in formData array
                    const updatedFormData = [...prevFormData];
                    updatedFormData[index].isCorrect = false;
                    return updatedFormData;
                });


            } else {

                // setEditAnswer(editOptions[index].option)
                setEditAnswer({ option: editOptions[index].option, optionText: editOptions[index].optionText })
                const updatedOptions = editOptions.map((option) => {
                    if (option.option === name) {
                        return { ...option, isCorrect: true };
                    } else {
                        return { ...option, isCorrect: false };
                    }
                });
                setEditOptions(updatedOptions);

            }
        }
        if (field === "isCorrect" && value === false) {
            setEditAnswer({ option: "", optionText: "" })
        }
    };

    const handleAddQuestion = () => {
        let obj

        if (question === "") {
            setQuestionEmpty(true);
            return;
        }
        obj = {
            "question": question,
            "options": options,
            "answer": answer
        };
        setQuestionEmpty(false);
        setQuestionsArr([...questionsArr, obj]);
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
        setAnswer({ option: "", optionText: "" })
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



    const handleShowEditQuest = (int) => {
        let obj = questionsArr[int]
        setEditQuestion(obj.question);
        setEditOptions(obj.options)
        setEditAnswer(obj.answer)
        setEditContentb(int)
    }

    const handleRemoveQuest = (index) => {
        const updatedContent = [...questionsArr];
        updatedContent.splice(index, 1);
        setQuestionsArr(updatedContent);
    };

    const handleCourseChange = (coIndex, value) => {
        const updatedCourse = [...coursesArray];
        updatedCourse[coIndex] = value;
        setCoursesArray(updatedCourse);
        setEditCourse(false)
    };

    const handleEditBow = () => {
        if (editQuestion === '') {
            setEmptyEdit(true);
            return;
        } else {
            setEmptyEdit(false);
            let inde = editContentb;

            const updatedContent = [...questionsArr];
            const updatedQuestion = {
                ...updatedContent[inde],
                question: editQuestion,
                options: editOptions,
                answer: editAnswer,
            };
            updatedContent[inde] = updatedQuestion;

            setQuestionsArr(updatedContent);
            setEditContentb('');
            setEditQuestion('');
            setEditAnswer({ option: '', optionText: '' });
            setEditOptions([
                { option: 'A', optionText: '', isCorrect: false },
                { option: 'B', optionText: '', isCorrect: false },
                { option: 'C', optionText: '', isCorrect: false },
                { option: 'D', optionText: '', isCorrect: false },
            ]);

            Toastify({
                node: dom('#success-notification-compile')
                    .clone()
                    .removeClass('hidden')[0],
                duration: 10000,
                newWindow: true,
                close: true,
                gravity: 'bottom',
                position: 'left',
                stopOnFocus: true,
            }).showToast();
        }
    };


    return (
        <>
            {!editCourse ? (<div>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="text-lg font-medium mr-auto">Edit Bow</h2>
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
                                        <Lucide icon="FileText" className="w-4 h-4 mr-2" /> BOW Info
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
                                        <Lucide icon="Code" className="w-4 h-4 mr-2" /> Add Questions
                                    </Tippy>
                                </Tab>

                            </TabList>
                            <TabPanels className="post__content">
                                <TabPanel className="p-5">
                                    <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                                        <div className="mt-5">
                                            <label className="form-label">
                                                Start date and Time
                                            </label>

                                            <input
                                                type="datetime-local"
                                                className="form-control w-full"
                                                value={date}
                                                onChange={(e) => { setDate(e.target.value) }}
                                            />
                                        </div>
                                        <div className="mt-5">
                                            <label className="form-label">
                                                End date and Time
                                            </label>

                                            <input
                                                type="datetime-local"
                                                className="form-control w-full"
                                                value={endDate}
                                                onChange={(e) => { setEndDate(e.target.value) }}
                                            />
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
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control w-full"
                                                value={title}
                                                onChange={(e) => { setTitle(e.target.value) }}
                                            />
                                        </div>
                                        <div className="mt-5">
                                            <label className="form-label">
                                                Duration
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control w-full"
                                                value={duration}
                                                onChange={(e) => { setDuration(e.target.value) }}
                                            />
                                        </div>
                                        <div className="mt-5">
                                            <label className="form-label">
                                                Instruction
                                            </label>
                                            <ClassicEditor
                                                value={instruction}
                                                onChange={setInstruction}
                                            />
                                        </div>

                                        <div className="form-check mt-5">
                                            <label className="form-check-label mr-3" htmlFor="checkbox-switch-1">GO Live</label>

                                            <input id="checkbox-switch-1" className="form-check-input" type="checkbox" checked={status}
                                                onChange={(e) => { setStatus(e.target.checked) }} />
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel className="p-5">

                                    <div className="form-inline items-start flex-col xl:flex-row mt-2 pt-2 first:mt-0 first:pt-0">

                                        <div className="w-full mt-3 xl:mt-0 flex-1">
                                            <div className="relative pl-5 pr-5 xl:pr-10 py-10 bg-slate-50 dark:bg-transparent dark:border rounded-md">
                                                <div className="mt-5">
                                                    <label className="form-label mb-5">
                                                        Question
                                                    </label>
                                                    <textarea
                                                        type="text"
                                                        className="form-control w-full"
                                                        value={question}
                                                        onChange={(e) => { setQuestion(e.target.value) }}
                                                    ></textarea>
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
                                {editContentb === "" ? (
                                    questionsArr.map((itm, inx) => (
                                        <div className="box p-5 rounded-md mt-5" key={inx + "_content"}>
                                            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">

                                                <div className="font-medium text-base truncate">
                                                    (Q{inx + 1})  {itm.question}
                                                </div>
                                                <div className="flex items-center ml-auto text-primary">
                                                    <Lucide icon="Edit" className="w-4 h-4 mr-2" onClick={() => { handleShowEditQuest(inx) }} />
                                                    <Lucide icon="Trash" className="w-4 h-4 mr-2" onClick={() => { handleRemoveQuest(inx) }} />
                                                </div>
                                            </div>

                                        </div>
                                    ))
                                ) : (<div className="box p-5 rounded-md mt-5">
                                    <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">

                                        <div className="mt-5">
                                            <label className="form-label mb-5">
                                                Question
                                            </label>
                                            <textarea
                                                type="text"
                                                className="form-control w-full"
                                                value={editQuestion}
                                                onChange={(e) => { setEditQuestion(e.target.value) }}
                                            ></textarea>
                                        </div>
                                        <div className="mt-5">
                                            <label className="form-label mb-3">
                                                Options
                                            </label>
                                            <div className="flex-1">
                                                {editOptions.map((itm, indx) => (
                                                    <div key={indx + "_editOptions"} className="xl:flex items-center mt-5 first:mt-0">
                                                        <div className="w-20 flex text-slate-500 mt-3 xl:mt-0">
                                                            <label className="form-label">
                                                                <input type="checkbox"
                                                                    className=""
                                                                    name={itm.option}
                                                                    onChange={() => handleOptionChangeEdit(indx, "isCorrect", !itm.isCorrect, itm.option)}
                                                                    checked={itm.isCorrect} />
                                                            </label>
                                                        </div>
                                                        <div className="input-group flex-1">
                                                            <div className="input-group-text">{itm.option}</div>
                                                            <textarea
                                                                type="text"
                                                                className="form-control"
                                                                value={itm.optionText}
                                                                onChange={(e) => handleOptionChangeEdit(indx, "optionText", e.target.value)}
                                                            ></textarea>
                                                        </div>

                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right mt-5">
                                        {emptyEdit ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                                    </div>
                                    <button onClick={handleEditBow} type="button" className="btn mr-2 flex items-center ml-auto sm:ml-0 btn-primary">
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