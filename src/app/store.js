import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import statuteReducer from "../features/statutes/statutesSlice";
import courseReducer from "../features/courses/courseSlice"
import adReducer from "../features/ads/adSlice"
import pastQuestionsReducer from "../features/past-questions/pastQuestionsSlice";
import draftsReducer from "../features/drafts/draftsSlice";
import decidedCasesReducer from "../features/decided-cases/decidedCasesSlice";
import qAndAsReducer from "../features/QandA/QandASlice";
import bowReducer from "../features/BOW/bowSlice";
import institutionReducer from "../features/institutions/institutionSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import usersReducer from "../features/users/usersSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

// const persistConfig = {
//     key: 'root',
//     storage,
// }

const authPersistConfig = {
    key: 'auth',
    storage,
}
const appReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    statutes: statuteReducer,
    courses: courseReducer,
    pastQuestions: pastQuestionsReducer,
    drafts: draftsReducer,
    decidedCases: decidedCasesReducer,
    qAndAs: qAndAsReducer,
    bows: bowReducer,
    institutions: institutionReducer,
    notifications: notificationReducer,
    ads: adReducer,
    users: usersReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'auth/logout') {
        state = undefined; // reset the state of all slices
    }

    return appReducer(state, action);
};
// const persistedReducer = persistReducer(authPersistConfig, authReducer)

export const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk]
});

export const persistor = persistStore(store)