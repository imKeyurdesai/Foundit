import { configureStore } from "@reduxjs/toolkit";
import bucketReducer from "./slices/bucketSlice";
import messageReducer from "./slices/messageSlice";

export const store = configureStore({
    reducer: {
        bucket: bucketReducer,
        messages: messageReducer,
    },
});

export default store;
