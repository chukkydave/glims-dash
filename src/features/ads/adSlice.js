import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// const baseUrl = process.env.VITE_NAME;
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchAds = createAsyncThunk('ads/fetchAds', async () => {
    const response = await axios.get(`${baseUrl}/fetchAds`, { headers: { Authorization: localStorage.getItem('authToken') } });
    return response.data.data;
});

export const createAd = createAsyncThunk('ads/createAd', async (adData) => {
    const response = await axios.post(`${baseUrl}/createAd`, adData, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data;
});

export const updateAd = createAsyncThunk('ads/updateAd', async (adData) => {
    const response = await axios.patch(`${baseUrl}/editAd/${adData.id}`, adData.data, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data;
});

export const deleteAd = createAsyncThunk('ads/deleteAd', async (adId) => {
    await axios.delete(`${baseUrl}/deleteAd/${adId}`, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return adId;
});

export const fetchSingleAd = createAsyncThunk(
    'ads/fetchSingleObject',
    async (id, thunkAPI) => {
        const state = thunkAPI.getState();
        const filteredObjects = state.ads.filter(obj => obj._id === id);
        if (filteredObjects.length > 0) {
            return filteredObjects[0]; // Return the first object that matches the ID
        } else {
            throw new Error(`No object found with ID ${id}`);
        }
    }
);

export const adsSlice = createSlice({
    name: 'ads',
    initialState: {
        ads: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAds.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAds.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ads = action.payload;
            })
            .addCase(fetchAds.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createAd.fulfilled, (state, action) => {
                state.ads.push(action.payload);
            })
            .addCase(updateAd.fulfilled, (state, action) => {
                // console.log(action)
                // const { id } = action.payload;
                // const existingAd = state.ads.find(ad => ad.id === id);
                // if (existingAd) {
                //     Object.assign(existingAd, action.payload);
                // }
            })
            .addCase(deleteAd.fulfilled, (state, action) => {
                const index = state.ads.findIndex(ad => ad._id === action.payload);
                if (index !== -1) {
                    state.ads.splice(index, 1);
                }
            });
    }
});

export const selectAllAds = state => state.ads.ads;
export const selectAdById = (state, adId) => state.ads.ads.find(ad => ad.id === adId);

export default adsSlice.reducer;