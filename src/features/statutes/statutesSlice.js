import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchStatutes = createAsyncThunk('statutes/fetchStatutes', async () => {
    const response = await axios.get(`${baseUrl}/fetchStatutes`, { headers: { Authorization: localStorage.getItem('authToken') } });
    return response.data.data;
});

export const createStatute = createAsyncThunk('statutes/createStatute', async (statuteData) => {
    const response = await axios.post(`${baseUrl}/createStatutes`, statuteData, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const updateStatute = createAsyncThunk('statutes/updateStatute', async (statuteData) => {
    const response = await axios.patch(`${baseUrl}/editStatutes/${statuteData.id}`, statuteData.dta, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const deleteStatute = createAsyncThunk('statutes/deleteStatute', async (statuteId) => {
    await axios.delete(`${baseUrl}/deleteStatute/${statuteId}`, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return statuteId;
});

export const statutesSlice = createSlice({
    name: 'statutes',
    initialState: {
        statutes: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStatutes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStatutes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.statutes = action.payload;
            })
            .addCase(fetchStatutes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createStatute.fulfilled, (state, action) => {
                state.statutes.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createStatute.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createStatute.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateStatute.fulfilled, (state, action) => {
                // const { id } = action.payload;
                // const existingStatute = state.statutes.find(statute => statute.id === id);
                // if (existingStatute) {
                //     Object.assign(existingStatute, action.payload);
                // }
            })
            .addCase(deleteStatute.fulfilled, (state, action) => {
                const index = state.statutes.findIndex(statute => statute._id === action.payload);
                if (index !== -1) {
                    state.statutes.splice(index, 1);
                }
            });
    }
});

export const selectAllStatutes = state => state.statutes.statutes;
export const selectStatuteById = (state, statuteId) => state.statutes.statutes.find(statute => statute.id === statuteId);

export default statutesSlice.reducer;