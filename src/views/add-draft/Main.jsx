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
import { createDraft } from "../../features/drafts/draftsSlice"

function Main() {




    // state start
    const [draftContent, setDraftContent] = useState({
        course: "",
        week: "",
        title: "",
        category: [{
            categoryName: "Drafts",
            content: {
                question: "",
                options: []
            },
        }]
    });
    const [loading, setLoading] = useState(false);
    const [emptySubmit, setEmptySubmit] = useState(false);
    const [optionsi, setOptionsi] = useState([]);
    const [week, setWeek] = useState('');
    const [title, setTitle] = useState('');
    const [course, setCourse] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [information, setInformation] = useState('');
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
    const handleDraftContentChange = (index, field, value) => {
        const updatedContent = [...content];
        updatedContent[index][field] = value;
        setContent(updatedContent);
    };

    const handleSaveQuestion = () => {
        let optsArr = []
        // const noOfQuestions = information.split("{}").length - 1;
        const noOfQuestions = (information.match(/{[^{}]*}/g) || []).length;


        if (noOfQuestions > 0) {
            for (let i = 1; i <= noOfQuestions; i++) {
                optsArr.push({
                    "optionNumber": i,
                    "options": [
                        {
                            "option": "A",
                            "optionText": "",
                            "isCorrect": false
                        },
                        {
                            "option": "B",
                            "optionText": "",
                            "isCorrect": false
                        },
                        {
                            "option": "C",
                            "optionText": "",
                            "isCorrect": false
                        },
                        {
                            "option": "D",
                            "optionText": "",
                            "isCorrect": false
                        }
                    ],
                    "answer": {
                        "option": "",
                        "optionText": ""
                    }
                }); // push numbers from 1 to 20 into the array
            }
            noOfQuestions > 0 ? setCurrentIndex(0) : setCurrentIndex('');
            setOptionsi(optsArr)
        } else {
            setOptionsi([]);
            setCurrentIndex(0);
        }
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

    const handleInputChange = (key, value, indx, name) => {
        // const { value } = e.target;



        setOptionsi((prevFormData) => {
            // Update the value of the current object in formData array
            const updatedFormData = [...prevFormData];
            updatedFormData[currentIndex].options[indx][key] = value;
            return updatedFormData;
        });

        if (key === "isCorrect" && value === true) {
            if (optionsi[currentIndex].options[indx].optionText === "") {
                alert('Kindly fill in the option text before selecting an answer')
                setOptionsi((prevFormData) => {
                    // Update the value of the current object in formData array
                    const updatedFormData = [...prevFormData];
                    updatedFormData[currentIndex].options[indx].isCorrect = false;
                    return updatedFormData;
                });


            } else {
                setOptionsi((prevFormData) => {
                    // Update the value of the current object in formData array
                    const updatedFormData = [...prevFormData];
                    updatedFormData[currentIndex].answer.option = updatedFormData[currentIndex].options[indx].option;
                    updatedFormData[currentIndex].answer.optionText = updatedFormData[currentIndex].options[indx].optionText;
                    return updatedFormData;
                });
                const updatedOptions = optionsi[currentIndex].options.map((option) => {
                    if (option.option === name) {
                        return { ...option, isCorrect: true };
                    } else {
                        return { ...option, isCorrect: false };
                    }
                });
                const updatedOptionss = [...optionsi];
                updatedOptionss[currentIndex] = { ...updatedOptionss[currentIndex], options: updatedOptions };
                setOptionsi(updatedOptionss);
            }

        }
        if (key === "isCorrect" && value === false) {
            setOptionsi((prevFormData) => {
                // Update the value of the current object in formData array
                const updatedFormData = [...prevFormData];
                updatedFormData[currentIndex].answer.option = '';
                updatedFormData[currentIndex].answer.optionText = '';
                return updatedFormData;
            });
        }
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, optionsi.length - 1)); // Increment current index, but not exceeding array length
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Decrement current index, but not below 0
    };

    const handleSubmit = () => {
        if (!course || !week || !title || optionsi.length <= 0) {
            setEmptySubmit(true)
            return
        }
        setEmptySubmit(false)

        setLoading(true);
        const data = {
            "course": course,
            "week": week,
            "title": title,
            "category": [{
                "categoryName": "Drafts",
                "content": {
                    "question": information,
                    "options": optionsi
                }
            }]
        };

        dispatch(createDraft(data))
            .then((res) => {
                setLoading(false);
                console.log(res)
                if (res.type === "drafts/createDraft/fulfilled") {
                    setCourse('')
                    setWeek('')
                    setTitle('')
                    setInformation('')
                    setOptionsi([])
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
                    <h2 className="text-lg font-medium mr-auto">Add Draft</h2>
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
                                        content="Input Draft Basic details"
                                        className="tooltip w-full flex items-center justify-center py-4"
                                        aria-controls="content"
                                        aria-selected="true"
                                    >
                                        <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Draft Details
                                    </Tippy>
                                </Tab>
                                <Tab
                                    fullWidth={false}
                                    className="w-full sm:w-40 py-0 px-0"
                                    tag="button"
                                >
                                    <Tippy
                                        content="Input the draft question, options and answers"
                                        className="tooltip w-full flex items-center justify-center py-4"
                                        aria-selected="false"
                                    >
                                        <Lucide icon="Code" className="w-4 h-4 mr-2" /> Draft Questions
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
                                                className="w-full"
                                            >
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
                                                Title
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
                                            <label>Question</label>
                                            <div className="mt-2">
                                                <ClassicEditor
                                                    value={information}
                                                    onChange={setInformation}
                                                />
                                            </div>
                                        </div>

                                        <button onClick={handleSaveQuestion} type="button" className="btn mr-2 flex items-center ml-auto sm:ml-0 btn-primary">
                                            Save Question
                                        </button>

                                    </div>

                                    <div className="form-inline items-start flex-col xl:flex-row mt-2 pt-2 first:mt-0 first:pt-0">

                                        <div className="w-full mt-3 xl:mt-0 flex-1">
                                            {optionsi.length > 0 && (<div className="relative pl-5 pr-5 xl:pr-10 py-10 bg-slate-50 dark:bg-transparent dark:border rounded-md">

                                                <div className="mt-5">
                                                    <label className="form-label mb-3">
                                                        Option {currentIndex + 1} of {optionsi.length}
                                                    </label>
                                                    <div className="flex-1">
                                                        {optionsi.length > 0 ? optionsi[currentIndex].options && optionsi[currentIndex].options.map((itm, indx) => (
                                                            <div key={indx + "_options"} className="xl:flex items-center mt-5 first:mt-0">
                                                                <div className="w-20 flex text-slate-500 mt-3 xl:mt-0">
                                                                    <label className="form-label">
                                                                        <input type="checkbox"
                                                                            name={itm.option}
                                                                            onChange={() => handleInputChange("isCorrect", !itm.isCorrect, indx, itm.option)}
                                                                            checked={itm.isCorrect} />
                                                                    </label>
                                                                </div>
                                                                <div className="input-group flex-1">
                                                                    <div className="input-group-text">{itm.option}</div>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={itm.optionText}
                                                                        onChange={(e) => handleInputChange("optionText", e.target.value, indx)}
                                                                    />
                                                                </div>

                                                            </div>
                                                        )) : ''}

                                                    </div>
                                                </div>


                                                <div className="intro-x flex items-center h-10">

                                                    <button
                                                        data-carousel="important-notes"
                                                        // data-target="prev"
                                                        className="tiny-slider-navigator btn px-2 border-slate-300 text-slate-600 dark:text-slate-300 mr-2"
                                                        onClick={handlePrevious}
                                                        disabled={currentIndex === 0}
                                                    >
                                                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        data-carousel="important-notes"
                                                        // data-target="next"
                                                        className="tiny-slider-navigator btn px-2 border-slate-300 text-slate-600 dark:text-slate-300 mr-2"
                                                        onClick={handleNext}
                                                        disabled={currentIndex === optionsi.length - 1}
                                                    >
                                                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                                                    </button>
                                                </div>



                                            </div>)}

                                        </div>
                                    </div>





                                </TabPanel>
                            </TabPanels>
                        </TabGroup>

                    </div>
                    {/* END: Post Content */}

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
