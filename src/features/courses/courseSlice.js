import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// const baseUrl = process.env.VITE_NAME;
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
    const response = await axios.get(`${baseUrl}/fetchCourses`, { headers: { Authorization: localStorage.getItem('authToken') } });
    return response.data.data;
});

export const createCourse = createAsyncThunk('courses/createCourse', async (courseData) => {
    const response = await axios.post(`${baseUrl}/createCourse`, courseData, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data;
});

export const updateCourse = createAsyncThunk('courses/updateCourse', async (courseData) => {
    const response = await axios.patch(`${baseUrl}/editNormalCourse/${courseData.id}`, courseData.data, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data;
});

export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (courseId) => {
    await axios.delete(`${baseUrl}/deleteCourse/${courseId}`, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return courseId;
});

export const fetchSingleCourse = createAsyncThunk(
    'courses/fetchSingleObject',
    async (id, thunkAPI) => {
        const state = thunkAPI.getState();
        const filteredObjects = state.courses.filter(obj => obj._id === id);
        if (filteredObjects.length > 0) {
            return filteredObjects[0]; // Return the first object that matches the ID
        } else {
            throw new Error(`No object found with ID ${id}`);
        }
    }
);

export const coursesSlice = createSlice({
    name: 'courses',
    initialState: {
        courses: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.courses.push(action.payload);
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                // console.log(action)
                // const { id } = action.payload;
                // const existingCourse = state.courses.find(course => course.id === id);
                // if (existingCourse) {
                //     Object.assign(existingCourse, action.payload);
                // }
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                const index = state.courses.findIndex(course => course._id === action.payload);
                if (index !== -1) {
                    state.courses.splice(index, 1);
                }
            });
    }
});

export const selectAllCourses = state => state.courses.courses;
export const selectCourseById = (state, courseId) => state.courses.courses.find(course => course.id === courseId);

export default coursesSlice.reducer;