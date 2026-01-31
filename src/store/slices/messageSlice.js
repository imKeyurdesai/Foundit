import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    users: [],
    loading: false,
    error: null,
};

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
            state.loading = false;
            state.error = null;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
            state.error = null;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { setLoading, setMessages, setUsers, addMessage, setError, clearError } =
    messageSlice.actions;
export default messageSlice.reducer;
