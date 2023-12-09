import { createSlice } from "@reduxjs/toolkit";
import {
  deleteApiHandler,
  getApiHandler,
  postApiHandler,
  putApiHandler,
} from "../apiHandler";
import { toast } from "react-toastify";

const crudSlice = createSlice({
  name: "crud",
  initialState: {
    allUsers: [],
    page: 0,
    dataPerPage: 5,
    totalUsers: 0,
    loading: false,
  },
  reducers: {
    setUsers: (state, action) => {
      return {
        ...state,
        allUsers: action.payload.users,
        totalUsers: action.payload.totalUsers,
      };
    },
    setPaginationKey: (state, action) => {
      const { page } = action.payload;
      if (
        page !== undefined &&
        (page < 0 || page >= Math.ceil(state.totalUsers / state.dataPerPage))
      ) {
        return { ...state, ...action.payload, page: state.page };
      } else {
        return { ...state, ...action.payload };
      }
    },
    resetPaginationKey: (state) => {
      return { ...state, page: 0, dataPerPage: 5 };
    },
    setLoading: (state, action) => {
      return { ...state, loading: action.payload };
    },
  },
});
export const { setUsers, setPaginationKey, resetPaginationKey, setLoading } =
  crudSlice.actions;
export const getDataAsync = (option) => async (dispatch) => {
  const { page, dataPerPage, search } = option;
  dispatch(setLoading(true));
  const getResp = await getApiHandler(
    `/user?search=${search}&page=${page}&limit=${dataPerPage}`
  );
  if (getResp?.status === 200) {
    dispatch(setUsers(getResp.data));
  } else {
    toast.error("Can't fetch data", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
  dispatch(setLoading(false));
};

export default crudSlice.reducer;
