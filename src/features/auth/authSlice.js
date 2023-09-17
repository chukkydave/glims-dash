import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        user: null, // add user data to the initial state
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('authToken', action.payload)
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        editUser: (state, action) => {
            const { fullName, phone } = action.payload; // Destructure the new data
            // Update the corresponding fields in the user object
            state.user.fullName = fullName;
            state.user.phone = phone;
        },
        logout: (state) => {
            state.token = null;
            state.user = null; // clear user data on logout
            localStorage.removeItem('authToken')
        },

    },
});

export const { setToken, setUser, editUser, logout } = authSlice.actions;
export default authSlice.reducer;
