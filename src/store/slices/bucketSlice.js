import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const bucketSlice = createSlice({
    name: "bucket",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setItems: (state, action) => {
            state.items = action.payload;
            state.loading = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { setLoading, setItems, setError, addItem, clearError } =
    bucketSlice.actions;
export default bucketSlice.reducer;
