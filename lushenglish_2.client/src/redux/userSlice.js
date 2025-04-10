import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userID: null,
    },
    reducers: {
        setUserID: (state, action) => {
            state.userID = action.payload;
        },
        logout: (state) => {
            state.userID = null;
        }
    },
});

export const { setUserID, logout } = userSlice.actions;
export default userSlice.reducer;
