import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (data) => {
    const response = await axios.get(`${baseUrl}/user`, {
        headers: { Authorization: localStorage.getItem('authToken'), "x-auth-key": "dGhpc2lzd29uZGVyZnVsOnNlY3JldHNhdWNl" }, params: {
            page: data.page, limit: data.limit,
        }
    });
    return response.data.data;
});

export const createUser = createAsyncThunk('users/createUser', async (userData) => {
    const response = await axios.post(`${baseUrl}/register`, userData, {
        headers: {
            Authorization: localStorage.getItem('authToken'),
            "x-auth-key": "dGhpc2lzd29uZGVyZnVsOnNlY3JldHNhdWNl"
        }
    });
    return response.data.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async (userData) => {
    const response = await axios.put(`${baseUrl}/user/profile`, userData.dta, {
        headers: {
            Authorization: localStorage.getItem('authToken'),
            "x-auth-key": "dGhpc2lzd29uZGVyZnVsOnNlY3JldHNhdWNl"
        }
    });
    return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
    await axios.delete(`${baseUrl}/deleteUser/${userId}`, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return userId;
});

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                // const { id } = action.payload;
                // const existingUser = state.users.find(user => user.id === id);
                // if (existingUser) {
                //     Object.assign(existingUser, action.payload);
                // }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user._id === action.payload);
                if (index !== -1) {
                    state.users.splice(index, 1);
                }
            });
    }
});

export const selectAllUsers = state => state.users.users;
export const selectUserById = (state, userId) => state.users.users.find(user => user.id === userId);

export default usersSlice.reducer;