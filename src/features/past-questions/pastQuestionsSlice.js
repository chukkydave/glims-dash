import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchQuestions = createAsyncThunk('question/fetchQuestions', async () => {
    const response = await axios.get(`${baseUrl}/fetchPqs`, { headers: { Authorization: localStorage.getItem('authToken') } });
    return response.data.data;
});

export const createQuestion = createAsyncThunk('question/createQuestion', async (questionData) => {
    const response = await axios.post(`${baseUrl}/createPastQuestion`, questionData, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data;
});

export const updateQuestion = createAsyncThunk('question/updateQuestion', async (questionData) => {
    const response = await axios.patch(`${baseUrl}/updatePQ/${questionData.id}`, questionData.data, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data;
});

export const deleteQuestion = createAsyncThunk('question/deleteQuestion', async (questionId) => {
    await axios.delete(`${baseUrl}/deletePastQuestion/${questionId}`, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return questionId;
});

export const questionSlice = createSlice({
    name: 'question',
    initialState: {
        question: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.question = action.payload;
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createQuestion.fulfilled, (state, action) => {
                state.question.push(action.payload);
            })
            .addCase(updateQuestion.fulfilled, (state, action) => {
                // const { id } = action.payload;
                // const existingQuestion = state.question.find(question => question.id === id);
                // if (existingQuestion) {
                //     Object.assign(existingQuestion, action.payload);
                // }
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                const index = state.question.findIndex(question => question._id === action.payload);
                if (index !== -1) {
                    state.question.splice(index, 1);
                }
            });
    }
});

export const selectAllQuestions = state => state.pastQuestions.question;
export const selectQuestionById = (state, questionId) => state.question.question.find(question => question.id === questionId);

export default questionSlice.reducer;