import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchQandAs = createAsyncThunk('qAndAs/fetchQandAs', async () => {
    const response = await axios.get(`${baseUrl}/fetchQAs`, { headers: { Authorization: localStorage.getItem('authToken') } });
    return response.data.data;
});

export const createQandA = createAsyncThunk('qAndAs/createQandA', async (qAndAData) => {
    const response = await axios.post(`${baseUrl}/createQA`, qAndAData, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const updateQandA = createAsyncThunk('qAndAs/updateQandA', async (qAndAData) => {
    const response = await axios.put(`${baseUrl}/appendQuestion/${qAndAData.id}`, qAndAData, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const addWeekQandA = createAsyncThunk('qAndAs/addWeekQandA', async (qAndAData) => {
    const response = await axios.patch(`${baseUrl}/addQA/${qAndAData.qaId}/${qAndAData.categoryId}`, qAndAData.data, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const deleteQandA = createAsyncThunk('qAndAs/deleteQandA', async (qAndAId) => {
    await axios.delete(`${baseUrl}/deleteQA/${qAndAId}`, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return qAndAId;
});

export const qandAsSlice = createSlice({
    name: 'qAndAs',
    initialState: {
        qAndAs: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQandAs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchQandAs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.qAndAs = action.payload;
            })
            .addCase(fetchQandAs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createQandA.fulfilled, (state, action) => {
                state.qAndAs.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createQandA.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createQandA.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateQandA.fulfilled, (state, action) => {
                const { id } = action.payload;
                const existingQandA = state.qAndAs.find(qAndA => qAndA.id === id);
                if (existingQandA) {
                    Object.assign(existingQandA, action.payload);
                }
            })
            // .addCase(addWeekQandA.fulfilled, (state, action) => {
            //     const { id } = action.payload;
            //     const existingQandA = state.qAndAs.find(qAndA => qAndA.id === id);
            //     if (existingQandA) {
            //         Object.assign(existingQandA, action.payload);
            //     }
            // })
            .addCase(deleteQandA.fulfilled, (state, action) => {
                const index = state.qAndAs.findIndex(qAndA => qAndA._id === action.payload);
                if (index !== -1) {
                    state.qAndAs.splice(index, 1);
                }
            });
    }
});

export const selectAllQandAs = state => state.qAndAs.qAndAs;
export const selectQandAById = (state, qAndAId) => state.qAndAs.qAndAs.find(qAndA => qAndA.id === qAndAId);

export default qandAsSlice.reducer;