import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;


export const fetchBows = createAsyncThunk('bows/fetchBows', async () => {
    const response = await axios.get(`${baseUrl}/fetchBow`, { headers: { Authorization: localStorage.getItem('authToken') } });
    return response.data.data;
});

export const createBow = createAsyncThunk('bows/createBow', async (bowData) => {
    const response = await axios.post(`${baseUrl}/createBow`, bowData, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const updateBow = createAsyncThunk('bows/updateBow', async (bowData) => {
    const response = await axios.patch(`${baseUrl}/editBow/${bowData.id}`, bowData.data, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const updateBowStatus = createAsyncThunk('bows/updateBowStatus', async (bowData) => {
    const response = await axios.patch(`${baseUrl}/changeStatus/${bowData}`, null, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const deleteBow = createAsyncThunk('bows/deleteBow', async (bowId) => {
    await axios.delete(`${baseUrl}/deleteBow/${bowId}`, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return bowId;
});

export const bowsSlice = createSlice({
    name: 'bows',
    initialState: {
        bows: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBows.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBows.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bows = action.payload;
            })
            .addCase(fetchBows.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createBow.fulfilled, (state, action) => {
                state.bows.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createBow.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createBow.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateBow.fulfilled, (state, action) => {
                const { id } = action.payload;
                const existingBow = state.bows.find(bow => bow._id === id);
                if (existingBow) {
                    Object.assign(existingBow, action.payload);
                }
            })

            .addCase(deleteBow.fulfilled, (state, action) => {
                const index = state.bows.findIndex(bow => bow._id === action.payload);
                if (index !== -1) {
                    state.bows.splice(index, 1);
                }
            });
    }
});

export const selectAllBows = state => state.bows.bows;
export const selectBowById = (state, bowId) => state.bows.bows.find(bow => bow.id === bowId);

export default bowsSlice.reducer;