import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchDrafts = createAsyncThunk('drafts/fetchDrafts', async () => {
    const response = await axios.get(`${baseUrl}/fetchDrafts`, { headers: { Authorization: localStorage.getItem('authToken') } });
    return response.data.data;
});

export const createDraft = createAsyncThunk('drafts/createDraft', async (draftData) => {
    const response = await axios.post(`${baseUrl}/createDraft`, draftData, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const updateDraft = createAsyncThunk('drafts/updateDraft', async (draftData) => {
    const response = await axios.patch(`${baseUrl}/appendQuestion/${draftData.id}`, draftData.dta, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data;
});

export const deleteDraft = createAsyncThunk('drafts/deleteDraft', async (draftId) => {
    await axios.delete(`${baseUrl}/deleteDraft/${draftId}`, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return draftId;
});

export const draftsSlice = createSlice({
    name: 'drafts',
    initialState: {
        drafts: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDrafts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDrafts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.drafts = action.payload;
            })
            .addCase(fetchDrafts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createDraft.fulfilled, (state, action) => {
                state.drafts.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createDraft.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createDraft.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateDraft.fulfilled, (state, action) => {
                // const { id } = action.payload;
                // const existingDraft = state.drafts.find(draft => draft.id === id);
                // if (existingDraft) {
                //     Object.assign(existingDraft, action.payload);
                // }
            })
            .addCase(deleteDraft.fulfilled, (state, action) => {
                const index = state.drafts.findIndex(draft => draft._id === action.payload);
                if (index !== -1) {
                    state.drafts.splice(index, 1);
                }
            });
    }
});

export const selectAllDrafts = state => state.drafts.drafts;
export const selectDraftById = (state, draftId) => state.drafts.drafts.find(draft => draft.id === draftId);

export default draftsSlice.reducer;