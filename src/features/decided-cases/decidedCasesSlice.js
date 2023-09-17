import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;


export const fetchDecidedCases = createAsyncThunk('decidedCases/fetchDecidedCases', async () => {
    const response = await axios.get(`${baseUrl}/fetchCases`, { headers: { Authorization: localStorage.getItem('authToken') } });
    return response.data.data;
});

export const createDecidedCase = createAsyncThunk('decidedCases/createDecidedCase', async (decidedCaseData) => {
    const response = await axios.post(`${baseUrl}/createCase`, decidedCaseData, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const updateDecidedCase = createAsyncThunk('decidedCases/updateDecidedCase', async (decidedCaseData) => {
    const response = await axios.put(`${baseUrl}/appendQuestion/${decidedCaseData.id}`, decidedCaseData, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const deleteDecidedCase = createAsyncThunk('decidedCases/deleteDecidedCase', async (decidedCaseId) => {
    await axios.delete(`${baseUrl}/deleteCase/${decidedCaseId}`, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return decidedCaseId;
});

export const decidedCasesSlice = createSlice({
    name: 'decidedCases',
    initialState: {
        decidedCases: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDecidedCases.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDecidedCases.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.decidedCases = action.payload;
            })
            .addCase(fetchDecidedCases.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createDecidedCase.fulfilled, (state, action) => {
                state.decidedCases.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createDecidedCase.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createDecidedCase.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateDecidedCase.fulfilled, (state, action) => {
                const { id } = action.payload;
                const existingDecidedCase = state.decidedCases.find(decidedCase => decidedCase.id === id);
                if (existingDecidedCase) {
                    Object.assign(existingDecidedCase, action.payload);
                }
            })
            .addCase(deleteDecidedCase.fulfilled, (state, action) => {
                const index = state.decidedCases.findIndex(decidedCase => decidedCase._id === action.payload);
                if (index !== -1) {
                    state.decidedCases.splice(index, 1);
                }
            });
    }
});

export const selectAllDecidedCases = state => state.decidedCases.decidedCases;
export const selectDecidedCaseById = (state, decidedCaseId) => state.decidedCases.decidedCases.find(decidedCase => decidedCase.id === decidedCaseId);

export default decidedCasesSlice.reducer;