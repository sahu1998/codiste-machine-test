import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./feature/crudSlice"
export default configureStore({
    reducer: { User: userReducer}
})