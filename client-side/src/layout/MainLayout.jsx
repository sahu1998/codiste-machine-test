import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPaginationKey } from "../feature/crudSlice";

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const createUser = (e) => {
    dispatch(resetPaginationKey());
    navigate("/user-form");
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <div className="container d-flex justify-content-between py-1">
          <img src="assets/codistelogo.svg" width="140px" alt="Codiste" />
          {location.pathname !== "/user-form" && (
            <div className="" id="navbarSupportedContent">
              <button className="btn btn-success" onClick={createUser}>
                Create User
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className="">{children}</div>
    </div>
  );
};

export default MainLayout;
