import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async () => {
    const response = await axios.get(`${baseUrl}/notifications`, { headers: { Authorization: localStorage.getItem('authToken') } });
    return response.data.data;
});

export const createNotification = createAsyncThunk('notifications/createNotification', async (notificationData) => {
    const response = await axios.post(`${baseUrl}/sendDashboardNotification`, notificationData, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data.data;
});

export const updateNotification = createAsyncThunk('notifications/updateNotification', async (notificationData) => {
    const response = await axios.patch(`${baseUrl}/updateSchool/${notificationData.id}`, notificationData.dta, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return response.data;
});

export const deleteNotification = createAsyncThunk('notifications/deleteNotification', async (notificationId) => {
    await axios.delete(`${baseUrl}/deleteSchool/${notificationId}`, {
        headers: {
            Authorization: localStorage.getItem('authToken')
        }
    });
    return notificationId;
});

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createNotification.fulfilled, (state, action) => {
                state.notifications.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createNotification.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createNotification.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateNotification.fulfilled, (state, action) => {
                // const { id } = action.payload;
                // const existingNotification = state.notifications.find(notification => notification.id === id);
                // if (existingNotification) {
                //     Object.assign(existingNotification, action.payload);
                // }
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(notification => notification._id === action.payload);
                if (index !== -1) {
                    state.notifications.splice(index, 1);
                }
            });
    }
});

export const selectAllNotifications = state => state.notifications.notifications;
export const selectNotificationById = (state, notificationId) => state.notifications.notifications.find(notification => notification.id === notificationId);

export default notificationsSlice.reducer;