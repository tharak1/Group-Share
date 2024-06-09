// import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { UserModel } from "../models/AllModel";

// interface UserState{
//     User:UserModel|null;
//     status: 'idle' | 'loading' | 'succeeded' | 'failed';
//     error: string | null;
// }

// const initialState : UserState={
//     User:null,
//     status:'idle',
//     error:null
// }


// const userslice = createSlice({
//     name:'user',
//     initialState,
//     reducers:{
//             addUser: (state, action: PayloadAction<UserModel>) => {
//                 state.User = action.payload;
//                 state.status = 'succeeded';
//                 state.error = null;
//             },
//             removeUser: (state) => {
//                 state.User = null;
//                 state.status = 'succeeded';
//                 state.error = null;
//             },
//             updateUser: (state, action: PayloadAction<Partial<UserModel>>) => {
//                 if (state.User) {
//                 state.User = { ...state.User, ...action.payload };
//                 state.status = 'succeeded';
//                 state.error = null;
//                 } else {
//                 state.status = 'failed';
//                 state.error = 'No user to update';
//                 }
//             },
//         }   
//     });

// export const GetUser = (state:any) => state.user.User;

// export const { addUser, removeUser, updateUser } = userslice.actions;

// export default userslice.reducer;


import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverString } from '../models/ServerString';
import { UserModel } from '../models/AllModel';

interface UserState {
  user: UserModel | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async () => {
    const url = `${serverString}/api/user/getUserData`;
    const token = localStorage.getItem('token');
    const response = await axios.get(url, {headers: {Authorization: `Bearer ${token}`,}})
    return response.data as UserModel;
    }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserModel>) => {
      state.user = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    removeUser: (state) => {
      state.user = null;
      state.status = 'succeeded';
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<UserModel>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.status = 'succeeded';
        state.error = null;
      } else {
        state.status = 'failed';
        state.error = 'No user to update';
      }
    },
    setLoading: (state) => {
      state.status = 'loading';
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<UserModel>) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const GetUser = (state:any) => state.user.user;


export const { addUser, removeUser, updateUser, setLoading, setError, resetStatus } = userSlice.actions;

export default userSlice.reducer;
