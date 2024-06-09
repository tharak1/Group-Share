// import storage from "redux-persist/lib/storage";
// import {persistReducer} from "redux-persist";
// import {combineReducers, configureStore} from "@reduxjs/toolkit";
// import themeReducer from "./ThemeSlice";
// import drawerReducer from './DrawerSlice'
// import userReducer from './UserSlice'

// const persistConfig = {
//     key:"root",
//     version:1,
//     storage
// }

// const reducer = combineReducers({
//     theme:themeReducer,
//     drawer: drawerReducer,
//     user:userReducer
// });

// const persistedReducer = persistReducer(persistConfig,reducer);


// export const store = configureStore({
//     reducer : persistedReducer
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeReducer from "./ThemeSlice";
import drawerReducer from './DrawerSlice';
import userReducer from './UserSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  theme: themeReducer,
  drawer: drawerReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register', 'rehydrate'],
      },
    }),
});


export default store;


export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();



export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;