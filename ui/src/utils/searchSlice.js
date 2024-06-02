import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: "search",
    initialState: {

    },
    reducers: {
        cacheResults: (state, action) => {
            // state = { ...action.payload, ...state };
            state = Object.assign(state, action.payload);
        }
    }
})

/**
 * time complexity to search in array =  O(n)
 * time complexity search in Object = O(1)
 * 
 * array.indexOf()
 */

export const { cacheResults } = searchSlice.actions;

export default searchSlice.reducer;
