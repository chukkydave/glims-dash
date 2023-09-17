import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchInstitutions = createAsyncThunk('institutions/fetchInstitutions', async () => {
    const response = await axios.get(`${baseUrl}/institutions`, { headers: { Authorization: localStorage.getItem('authToken') } });
    return response.data.data;
});

export const createInstitution = createAsyncThunk('institutions/createInstitution', async (institutionData) => {
    const response = await axios.post(`${baseUrl}/addInstitution`, institutionData, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const updateInstitution = createAsyncThunk('institutions/updateInstitution', async (institutionData) => {
    const response = await axios.patch(`${baseUrl}/updateSchool/${institutionData.id}`, institutionData.dta, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data;
});

export const deleteInstitution = createAsyncThunk('institutions/deleteInstitution', async (institutionId) => {
    await axios.delete(`${baseUrl}/deleteSchool/${institutionId}`, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return institutionId;
});

export const institutionsSlice = createSlice({
    name: 'institutions',
    initialState: {
        institutions: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInstitutions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchInstitutions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.institutions = action.payload;
            })
            .addCase(fetchInstitutions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createInstitution.fulfilled, (state, action) => {
                state.institutions.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createInstitution.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createInstitution.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateInstitution.fulfilled, (state, action) => {
                // const { id } = action.payload;
                // const existingInstitution = state.institutions.find(institution => institution.id === id);
                // if (existingInstitution) {
                //     Object.assign(existingInstitution, action.payload);
                // }
            })
            .addCase(deleteInstitution.fulfilled, (state, action) => {
                const index = state.institutions.findIndex(institution => institution._id === action.payload);
                if (index !== -1) {
                    state.institutions.splice(index, 1);
                }
            });
    }
});

export const selectAllInstitutions = state => state.institutions.institutions;
export const selectInstitutionById = (state, institutionId) => state.institutions.institutions.find(institution => institution.id === institutionId);

export default institutionsSlice.reducer;