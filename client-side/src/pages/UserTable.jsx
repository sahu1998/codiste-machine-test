import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { getDataAsync, setPaginationKey } from "../feature/crudSlice";
import { useNavigate } from "react-router-dom";
import { deleteApiHandler } from "../apiHandler";
import { toast } from "react-toastify";

const UserTable = () => {
  const [search, setSearch] = useState("");
  const { allUsers, page, dataPerPage, totalUsers, loading } = useSelector(
    (state) => state.User
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deleteUser = async (id) => {
    const deletedUserRes = await deleteApiHandler(`/user/${id}`);
    if (deletedUserRes?.status === 200) {
      toast.success(deletedUserRes.data, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      dispatch(getDataAsync({ page, dataPerPage, search }));
    } else {
      toast.error(deletedUserRes.data.message, {
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
  };
  const setDataPerPage = (e) => {
    if (e.target.value !== "") {
      dispatch(setPaginationKey({ dataPerPage: e.target.value }));
    }
  };
  useEffect(() => {
    dispatch(getDataAsync({ page, dataPerPage, search }));
  }, [page, dataPerPage, search]);
  return (
    <MainLayout>
      <div className="container">
        <div className="input-group flex-nowrap py-3">
          <span
            className="input-group-text border border-2 border-success"
            id="addon-wrapping"
          >
            Search
          </span>
          <input
            type="text"
            className="form-control border border-2 border-success"
            placeholder="Search by name, email or mobile number..."
            aria-label="Username"
            aria-describedby="addon-wrapping"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="table-responsive" style={{ height: "70vh" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            {loading ? "loading..." : (
              <tbody>
                {allUsers?.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + page * dataPerPage + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobileNumber}</td>
                    <td className="text-end">
                      <div
                        class="btn-group"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button
                          type="button"
                          class="btn btn-outline-dark"
                          onClick={(e) => navigate(`/user-form?id=${user._id}`)}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          class="btn btn-outline-dark"
                          onClick={(e) => deleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <div className="d-flex justify-content-center gap-2">
          <nav aria-label="...">
            <ul className="pagination">
              <li
                role="button"
                className={`page-item ${page === 0 ? "disabled" : ""}`}
                onClick={(e) => dispatch(setPaginationKey({ page: page - 1 }))}
              >
                <span className="page-link" tabindex="-1" aria-disabled="true">
                  Previous
                </span>
              </li>
              {new Array(Math.ceil(totalUsers / dataPerPage))
                .fill(0)
                .map((_, index) => (
                  <li
                    key={"page-" + index}
                    role="button"
                    className={`page-item ${page === index ? "active" : ""}`}
                    onClick={(e) => dispatch(setPaginationKey({ page: index }))}
                  >
                    <span className="page-link">{index + 1}</span>
                  </li>
                ))}
              <li
                role="button"
                className={`page-item ${
                  page === Math.ceil(totalUsers / dataPerPage) - 1
                    ? "disabled"
                    : ""
                }`}
                onClick={(e) => dispatch(setPaginationKey({ page: page + 1 }))}
              >
                <span className="page-link">Next</span>
              </li>
            </ul>
          </nav>
          <div className="d-flex gap-2">
            <div className="py-1">Data per page:</div>
            <div className="">
            <select
              class="form-select"
              aria-label="Default select example"
              onChange={setDataPerPage}
            >
              <option selected value={5}>
                5
              </option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserTable;
