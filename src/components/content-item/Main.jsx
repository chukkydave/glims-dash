import { ClassicEditor, TomSelect, LoadingIcon, Lucide } from "@/base-components";
import { useState, useEffect } from "react";

// ContentItem component
// const ContentItem = ({ index, contentItem, handleTypeChange, handleDurationChange, handleAddCourse, handleRemoveCourse, handleCourseIdChange, handleCourseNameChange, handleDurationChange, handleAddQuestion, handleRemoveQuestion, handleQuestionIdChange, handleQuestionTextChange }) => {
const ContentItem = ({ index, key, item, handleContentChange, handleRemoveContent }) => {

    const handleRemoveContentItem = () => {
        handleRemoveContent(index);
    };

    const handleTypeChange = (e) => {
        handleContentChange(index, 'type', e.target.value);
    };

    const handleDurationChange = (e) => {
        handleContentChange(index, 'duration', e.target.value);
    };

    const handleInformationChange = (e) => {
        handleContentChange(index, 'information', e.target.value);
    };

    const handleAddCourse = () => {
        handleContentChange(index, 'courses', [
            ...item.courses,
            { courseId: '', courseName: '', duration: '', questions: [] }
        ]);
    };



    const handleRemoveCourse = (courseIndex) => {
        const updatedCourses = [...item.courses];
        updatedCourses.splice(courseIndex, 1);
        handleContentChange(index, 'courses', updatedCourses);
    };

    return (
        <>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Content</h2>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 lg:col-span-12">
                    {/* BEGIN: Form Layout */}
                    <div className="intro-y box p-5">
                        <div className="mt-3">
                            <label htmlFor="crud-form-2" className="form-label">
                                Select Type
                            </label>
                            <TomSelect
                                id="crud-form-2"
                                value={type}
                                onChange={setType}
                                className="w-full"
                            >
                                <option>--Select--</option>
                                <option value="MCQ">MCQ</option>
                                <option value="Essay">Essay</option>
                            </TomSelect>
                        </div>
                        <div>
                            <label htmlFor="crud-form-1" className="form-label">
                                Duration
                            </label>
                            <input
                                id="crud-form-1"
                                type="text"
                                className="form-control w-full"
                                value={duration}
                                onChange={(e) => { setDuration(e.target.value) }}
                            />
                        </div>

                        <div className="mt-3">
                            <label>Information</label>
                            <div className="mt-2">
                                <ClassicEditor
                                    value={editorData}
                                    onChange={setEditorData}
                                />
                            </div>
                        </div>

                        <div className="mt-3">
                            {courseQuestions.map((item, index) => (
                                <CourseItem
                                    key={index}
                                    index={index}
                                    item={item}
                                    handleCourseChange={handleCourseChange}
                                    handleRemoveCourse={handleRemoveCourse}
                                />
                            ))}
                        </div>

                        <div className="text-right mt-5">
                            {empty ? (<span className="text-danger mr-2">Blank Fields</span>) : ''}

                            {loading ? (<button className="w-24 h-6"><LoadingIcon icon="puff" /></button>) : (<button onClick={handleSubmit} type="button" className="btn btn-primary w-24">
                                Save
                            </button>)}

                        </div>
                    </div>
                    {/* END: Form Layout */}
                </div>


            </div>
        </>
    );
};

export default ContentItem;
