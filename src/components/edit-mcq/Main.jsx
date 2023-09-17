import { ClassicEditor, TomSelect, LoadingIcon, Lucide } from "@/base-components";
import { useState, useEffect } from "react";

// ContentItem component
// const ContentItem = ({ index, contentItem, handleTypeChange, handleDurationChange, handleAddCourse, handleRemoveCourse, handleCourseIdChange, handleCourseNameChange, handleDurationChange, handleAddQuestion, handleRemoveQuestion, handleQuestionIdChange, handleQuestionTextChange }) => {
const EditMcqItem = ({ course, type, handleCourseChange, indexex }) => {

    const [empty, setEmpty] = useState(false);
    const [loading, setloading] = useState(false);
    const [coursei, setCoursei] = useState(course);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [questionEmptyy, setQuestionEmptyy] = useState(false);
    const [answerx, setAnswerx] = useState('');
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
        if (type === 'MCQ') {
            let ans = ""
            newOptions.forEach((itm) => {
                itm.isCorrect ? ans = itm.option : ans = ""
            })
            let newQuest = { "question": newQuestion, "options": newOptions, "answer": answerx }
            const updatedAnswers = { ...coursei };
            updatedAnswers.questions.push(newQuest);
            setNewQuestion('')
            setNewOptions([{
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
            }])
        } else {
            let newQuest = { "course": coursei.courseName, "question": newQuestion, "answer": newAnswer }
            // setCoursei([...coursei.questions, newQuest]);
            const updatedAnswer = { ...coursei };
            updatedAnswer.questions.push(newQuest);
            setCoursei(updatedAnswer);
            setNewQuestion('')
            setNewAnswer('')
        }
    };

    const handleRemoveQuestion = (courseIndex) => {
        const updatedQuestions = { ...coursei };
        updatedQuestions.questions.splice(courseIndex, 1);
        setCoursei(updatedQuestions);
    };

    const handleAnswerChange = (index, value) => {
        const updatedAnswer = { ...coursei };
        updatedAnswer.questions[index].answer = value;
        setCoursei(updatedAnswer);
    }

    const handleQuestionChange = (index, value) => {
        const updatedQuestion = { ...coursei };
        updatedQuestion.questions[index].question = value;
        setCoursei(updatedQuestion);
    }

    const handleOptionChange = (index, ind, field, value) => {
        // const updatedOption = { ...coursei };
        // updatedOption.questions[index].options[ind][field] = value;
        // setCoursei(updatedOption);

        const updatedOption = { ...coursei };
        updatedOption.questions[index].options[ind][field] = value;
        setCoursei(updatedOption);
        if (field === 'isCorrect' && value === true) {
            if (coursei.questions[index].options[ind].optionText === "") {
                alert('Kindly fill in the option text before selecting an answer')

                const updatedOptionss = { ...coursei }
                updatedOptionss.questions[index].options[ind].isCorrect = false;
                setCoursei(updatedOptionss);
            } else {
                const updatedOption2 = { ...coursei };
                updatedOption2.questions[index].answer = coursei.questions[index].options[ind].option;
                setCoursei(updatedOption2);
                const updatedOptions = { ...coursei }
                let newStu = coursei.questions[index].options.map((option, i) => {
                    if (option.option === name) {
                        return { ...option, isCorrect: true };
                    } else {
                        return { ...option, isCorrect: false };
                    }
                });
                updatedOptions.questions[index].options = newStu
                setCoursei(updatedOptions);
            }

        }
        if (field === "isCorrect" && value === false) {
            const updatedOption3 = { ...coursei };
            updatedOption3.questions[index].answer = '';
            setCoursei(updatedOption3);
        }


    }

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

    const handleChanger = () => {
        handleCourseChange(indexex, coursei)
    }



    return (
        <>
            <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">{coursei.courseName}</h2>
                <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
                    {loading ? (<button className="btn btn-primary mr-1 mb-2">
                        Saving
                        <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />
                    </button>) : (<button onClick={handleChanger} type="button" className="btn mr-2 flex items-center ml-auto sm:ml-0 btn-primary">
                        Save
                    </button>)}
                </div>
            </div>

            <div className="pos intro-y grid grid-cols-12 gap-5 mt-5">

                <div className="intro-y col-span-12 lg:col-span-7">
                    <div className="relative pl-5 pr-5 xl:pr-10 py-10 bg-slate-50 dark:bg-transparent dark:border rounded-md">
                        <div className="mt-5">
                            <label className="form-label mb-5">
                                Question
                            </label>
                            <input
                                type="text"
                                className="form-control w-full"
                                value={newQuestion}
                                onChange={(e) => { setNewQuestion(e.target.value) }}
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
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={itm.optionText}
                                                onChange={(e) => handleNewOptionChange(indx, "optionText", e.target.value)}
                                            />
                                        </div>

                                    </div>
                                ))}

                            </div>
                        </div>) : (<div className="mt-5">
                            <label className="form-label mb-5">
                                Answer
                            </label>
                            <input
                                type="text"
                                className="form-control w-full"
                                value={newAnswer}
                                onChange={(e) => { setNewAnswer(e.target.value) }}
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
                {coursei.questions.map((item, index) => (
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
                                            <input
                                                type="text"
                                                className="form-control w-full"
                                                value={item.question}
                                                onChange={(e) => { handleQuestionChange(index, e.target.value) }}
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
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={itm.optionText}
                                                                onChange={(e) => handleOptionChange(index, indx, "optionText", e.target.value)}
                                                            />
                                                        </div>

                                                    </div>
                                                ))}

                                            </div>
                                        </div>) : (<div className="mt-5">
                                            <label className="form-label mb-5">
                                                Answer
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control w-full"
                                                value={item.answer}
                                                onChange={(e) => { handleAnswerChange(index, e.target.value) }}
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

export default EditMcqItem;
