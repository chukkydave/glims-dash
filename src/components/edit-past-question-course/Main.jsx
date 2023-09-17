import { ClassicEditor, TomSelect, LoadingIcon, Lucide } from "@/base-components";
import { useState, useEffect } from "react";

// ContentItem component
// const ContentItem = ({ index, contentItem, handleTypeChange, handleDurationChange, handleAddCourse, handleRemoveCourse, handleCourseIdChange, handleCourseNameChange, handleDurationChange, handleAddQuestion, handleRemoveQuestion, handleQuestionIdChange, handleQuestionTextChange }) => {
const EditCourseItem = ({ course, type, handleCourseChange, indexex }) => {

    const [empty, setEmpty] = useState(false);
    const [loading, setloading] = useState(false);
    const [coursei, setCoursei] = useState(course);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [questionEmptyy, setQuestionEmptyy] = useState(false);
    const [answerx, setAnswerx] = useState('');
    const [justQuestions, setJustQuestions] = useState(course.questions);
    const [newOptions, setNewOptions] = useState([{
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
    }]);

    // useEffect(() => {
    //     setCoursei(course)
    // }, []);

    const handleAddQuestionr = () => {
        if (newQuestion === "") {
            setQuestionEmptyy(true);
            return;
        }
        setQuestionEmptyy(false);
        if (type === "MCQ") {
            let ans = "";
            newOptions.forEach((itm) => {
                itm.isCorrect ? (ans = itm.option) : (ans = "");
            });
            let newQuest = {
                course: coursei.courseName,
                question: newQuestion,
                options: newOptions,
                answer: answerx,
            };

            const updatedAnswers = [...justQuestions, newQuest]

            setJustQuestions(updatedAnswers);

            setNewQuestion("");
            setNewOptions([
                {
                    option: "A",
                    optionText: "",
                    isCorrect: false,
                },
                {
                    option: "B",
                    optionText: "",
                    isCorrect: false,
                },
                {
                    option: "C",
                    optionText: "",
                    isCorrect: false,
                },
                {
                    option: "D",
                    optionText: "",
                    isCorrect: false,
                },
            ]);
        } else {
            let newQuest = {
                course: coursei.courseName,
                question: newQuestion,
                answer: newAnswer,
            };
            setJustQuestions((prevArray) => [...prevArray, newQuest]);

            setNewQuestion("");
            setNewAnswer("");
        }
    };


    const handleRemoveQuestion = (courseIndex) => {
        // const updatedQuestions = [...justQuestions];
        // updatedQuestions.splice(courseIndex, 1);
        // setJustQuestions(updatedQuestions);

        setJustQuestions((prevArray) => {
            const newArray = [...prevArray]; // Create a copy of the original array
            newArray.splice(courseIndex, 1); // Remove the item at the specified index
            return newArray; // Return the updated array
        });
    };

    const handleAnswerChange = (index, answer) => {
        // const updatedAnswer = { ...coursei };
        // updatedAnswer.questions[index].answer = value;
        // setCoursei(updatedAnswer);

        setJustQuestions((prevTextAreas) =>
            prevTextAreas.map((item, i) => (i === index ? { ...item, answer } : item))
        );
    }

    // const handleQuestionChange = (index, value) => {
    //     // console.log(index, value)
    //     // const updatedQuestion = { ...coursei };
    //     // updatedQuestion.questions[index].question = value;
    //     // setCoursei(updatedQuestion);

    //     // const updatedCourse = { ...coursei };
    //     // updatedCourse.questions[index] = { ...updatedCourse.questions[index], question: value };
    //     // setCoursei(updatedCourse);

    //     const updatedQuestions = [...justQuestions];
    //     updatedQuestions[index] = { ...updatedQuestions[index], question: value };
    //     setJustQuestions((prevCoursei) => ({
    //         ...prevCoursei,
    //         questions: updatedQuestions,
    //     }));

    // }

    const handleQuestionChange = (index, question) => {
        setJustQuestions((prevTextAreas) =>
            prevTextAreas.map((item, i) => (i === index ? { ...item, question } : item))
        );
    };





    // const handleOptionChange = (index, ind, field, value, name) => {
    //     const updatedOption = [...justQuestions];
    //     updatedOption[index].options[ind][field] = value;
    //     setJustQuestions(updatedOption);
    //     if (field === 'isCorrect' && value === true) {
    //         if (coursei.questions[index].options[ind].optionText === "") {
    //             alert('Kindly fill in the option text before selecting an answer')

    //             const updatedOptionss = [...justQuestions]
    //             updatedOptionss[index].options[ind].isCorrect = false;
    //             setJustQuestions(updatedOptionss);
    //         } else {
    //             const updatedOption2 = [...justQuestions];
    //             updatedOption2[index].answer = justQuestions[index].options[ind].option;
    //             setJustQuestions(updatedOption2);
    //             const updatedOptions = [...justQuestions]
    //             let newStu = justQuestions[index].options.map((option, i) => {
    //                 if (option.option === name) {
    //                     return { ...option, isCorrect: true };
    //                 } else {
    //                     return { ...option, isCorrect: false };
    //                 }
    //             });
    //             updatedOptions[index].options = newStu
    //             setJustQuestions(updatedOptions);
    //         }

    //     }
    //     if (field === "isCorrect" && value === false) {
    //         const updatedOption3 = [...justQuestions];
    //         updatedOption3[index].answer = '';
    //         setJustQuestions(updatedOption3);
    //     }
    // }

    const handleOptionChange = (index, ind, field, value, name) => {
        setJustQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            const updatedOptions = [...prevQuestions[index].options];
            const updatedOption = {
                ...updatedOptions[ind],
                [field]: value,
            };
            updatedOptions[ind] = updatedOption;
            updatedQuestions[index] = {
                ...updatedQuestions[index],
                options: updatedOptions,
            };

            if (field === 'isCorrect' && value === true) {
                if (updatedOption.optionText === '') {
                    console.log('Kindly fill in the option text before selecting an answer');
                    updatedOptions[ind] = {
                        ...updatedOption,
                        isCorrect: false,
                    };
                    updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        options: updatedOptions,
                    };
                } else {
                    updatedQuestions[index].answer = updatedOption.option;
                    updatedQuestions[index].options = updatedOptions.map((opt) => ({
                        ...opt,
                        isCorrect: opt.option === name,
                    }));
                }
            }

            if (field === 'isCorrect' && value === false) {
                updatedQuestions[index].answer = '';
            }

            return updatedQuestions;
        });
    };








    const handleNewOptionChange = (index, field, value, name) => {
        // const updatedOptions = [...newOptions];
        // updatedOptions[index] = { ...updatedOptions[index], [field]: value };
        // setNewOptions(updatedOptions);



        const updatedOptions = [...newOptions];
        updatedOptions[index] = { ...updatedOptions[index], [field]: value };
        setNewOptions(updatedOptions);

        if (field === "isCorrect" && value === true) {
            if (newOptions[index].optionText === "") {
                alert('Kindly fill in the option text before selecting an answer')
                setNewOptions((prevFormData) => {
                    // Update the value of the current object in formData array
                    const updatedFormData = [...prevFormData];
                    updatedFormData[index].isCorrect = false;
                    return updatedFormData;
                });


            } else {

                setAnswerx(newOptions[index].option)
                const updatedOptions = newOptions.map((option) => {
                    if (option.option === name) {
                        return { ...option, isCorrect: true };
                    } else {
                        return { ...option, isCorrect: false };
                    }
                });
                setNewOptions(updatedOptions);

            }
        }
        if (field === "isCorrect" && value === false) {
            setAnswerx('')
        }
    };

    // const handleChanger = () => {
    //     setCoursei((prevObject) => ({
    //         ...prevObject,
    //         questions: justQuestions,
    //     }))
    //     handleCourseChange(indexex.contentInd, indexex.courseInd, coursei)
    // }

    const handleChanger = () => {
        setCoursei((prevObject) => {
            const updatedCoursei = {
                ...prevObject,
                questions: justQuestions,
            };
            handleCourseChange(indexex.contentInd, indexex.courseInd, updatedCoursei);
            return updatedCoursei;
        });
    };




    return (
        <>
            <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">{coursei.courseName}</h2>
                <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
                    <button onClick={handleChanger} type="button" className="btn mr-2 flex items-center ml-auto sm:ml-0 btn-primary">
                        Save
                    </button>
                </div>
            </div>

            <div className="pos intro-y grid grid-cols-12 gap-5 mt-5">

                <div className="intro-y col-span-12 lg:col-span-7">
                    <div className="relative pl-5 pr-5 xl:pr-10 py-10 bg-slate-50 dark:bg-transparent dark:border rounded-md">
                        <div className="mt-5">
                            <label className="form-label mb-5">
                                Question
                            </label>
                            {/* <input
                                type="text"
                                className="form-control w-full"
                                value={newQuestion}
                                onChange={(e) => { setNewQuestion(e.target.value) }}
                            /> */}
                            <ClassicEditor
                                className="form-control w-full"
                                value={newQuestion}
                                onChange={setNewQuestion}
                            />
                        </div>
                        {type === "MCQ" ? (<div className="mt-5">
                            <label className="form-label mb-3">
                                Options
                            </label>
                            <div className="flex-1">
                                {newOptions.map((itm, indx) => (
                                    <div key={indx + "_newOption"} className="xl:flex items-center mt-5 first:mt-0">
                                        <div className="w-20 flex text-slate-500 mt-3 xl:mt-0">
                                            <label className="form-label">
                                                <input type="checkbox"
                                                    className=""
                                                    name={itm.option}
                                                    onChange={() => handleNewOptionChange(indx, "isCorrect", !itm.isCorrect, itm.option)}
                                                    checked={itm.isCorrect} />
                                            </label>
                                        </div>
                                        <div className="input-group flex-1">
                                            <div className="input-group-text">{itm.option}</div>
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                value={itm.optionText}
                                                onChange={(e) => handleNewOptionChange(indx, "optionText", e.target.value)}
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
                                value={newAnswer}
                                onChange={(e) => { setNewAnswer(e.target.value) }}
                                ></textarea> */}
                            <ClassicEditor
                                className="form-control w-full"
                                value={newAnswer}
                                onChange={setNewAnswer}
                            />
                        </div>)}

                        <div className="text-left mt-5">
                            {questionEmptyy ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}
                        </div>


                        <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                            {/* <h2 className="text-lg font-medium mr-auto">Add Past Question</h2> */}
                            <button onClick={handleAddQuestionr} type="button" className="btn mr-auto btn-primary">Add Question</button>

                        </div>

                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                {justQuestions.map((item, index) => (
                    <div className="intro-y col-span-12 md:col-span-6 lg:col-span-6" key={index + "_coursei"}>
                        <Lucide icon="Trash" className="w-4 h-4 mr-2 text-danger" onClick={() => { handleRemoveQuestion(index) }} />
                        <div className="box">
                            <div className="form-inline items-start flex-col xl:flex-row mt-2 pt-2 first:mt-0 first:pt-0">
                                <div className="w-full mt-3 xl:mt-0 flex-1">
                                    <div className="relative pl-5 pr-5 xl:pr-10 py-10 bg-slate-50 dark:bg-transparent dark:border rounded-md">
                                        <div className="mt-5">
                                            <label className="form-label mb-5">
                                                Question {index + 1}
                                            </label>
                                            {/* <textarea
                                                type="text"
                                                className="form-control w-full"
                                                value={item.question}
                                                onChange={(e) => { handleQuestionChange(index, e.target.value) }}
                                            ></textarea> */}
                                            <ClassicEditor
                                                className="form-control w-full"
                                                value={item.question}
                                                onChange={(e) => handleQuestionChange(index, e)}
                                            />
                                        </div>
                                        {type === "MCQ" ? (<div className="mt-5">
                                            <label className="form-label mb-3">
                                                Options
                                            </label>
                                            <div className="flex-1">
                                                {item.options.map((itm, indx) => (
                                                    <div key={indx + "_options"} className="xl:flex items-center mt-5 first:mt-0">
                                                        <div className="w-20 flex text-slate-500 mt-3 xl:mt-0">
                                                            <label className="form-label">
                                                                <input type="checkbox"
                                                                    className=""
                                                                    name={itm.option}
                                                                    onChange={() => handleOptionChange(index, indx, "isCorrect", !itm.isCorrect, itm.option)}
                                                                    checked={itm.isCorrect} />
                                                            </label>
                                                        </div>
                                                        <div className="input-group flex-1">
                                                            <div className="input-group-text">{itm.option}</div>
                                                            <textarea
                                                                type="text"
                                                                className="form-control"
                                                                value={itm.optionText}
                                                                onChange={(e) => handleOptionChange(index, indx, "optionText", e.target.value)}
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
                                                value={item.answer}
                                                onChange={(e) => { handleAnswerChange(index, e.target.value) }}
                                                ></textarea> */}
                                            <ClassicEditor
                                                className="form-control w-full"
                                                value={item.answer}
                                                onChange={(e) => handleAnswerChange(index, e)}
                                            />
                                        </div>)}
                                    </div>
                                </div></div>
                        </div>
                    </div>
                ))}
            </div>


        </>
    );
};

export default EditCourseItem;
