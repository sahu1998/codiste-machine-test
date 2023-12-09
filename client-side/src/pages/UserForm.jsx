import { Container, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MainLayout from "../layout/MainLayout";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { getApiHandler, postApiHandler, putApiHandler } from "../apiHandler";
import { toast } from "react-toastify";
const schema = yup.object().shape({
  name: yup
    .string()
    .required("*Name is required")
    .matches(/^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$/, "*Use only alphabats"),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/,
      "*Incorrect Email"
    )
    .required("*Email is required"),
  mobileNumber: yup
    .string()
    .required("*Mobile Number is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),
  password: yup
    .string()
    .required("*Password is required")
    .min(8, "*Minimum 8 characters "),
});
const UserForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let id = useSearchParams()[0].get("id");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      mobileNumber: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const user = id
      ? await putApiHandler(`/user/${id}`, values)
      : await postApiHandler("/user", values);
    if (user?.status === 201 || user?.status === 200) {
      toast.success(`User ${id ? "updated" : "created"} successfully`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate("/");
    } else {
      toast.error(user.data.message, {
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

  const getUserInfoToUpdate = async (userId) => {
    setLoading(true);
    const userInfo = await getApiHandler(`/user/${userId}`);
    if (userInfo?.status === 200) {
      const { name, email, mobileNumber } = userInfo.data;
      setValue("name", name);
      setValue("email", email);
      setValue("mobileNumber", mobileNumber);
    } else {
      toast.error("Can't fetch User info!", {
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
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      getUserInfoToUpdate(id);
    }
  }, [id]);

  return (
    <MainLayout>
      <Container className="py-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {!loading && (
              <>
                <Grid item xs={12}>
                  <TextField
                    id="name-field"
                    fullWidth
                    label="Name"
                    variant="outlined"
                    placeholder="Enter Your Name"
                    {...register("name")}
                    error={!!errors?.name}
                    helperText={errors?.name?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="email-field"
                    fullWidth
                    label="Email"
                    variant="outlined"
                    placeholder="Enter Email"
                    {...register("email")}
                    error={!!errors?.email}
                    helperText={errors?.email?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="number-field"
                    fullWidth
                    label="Mobile Number"
                    variant="outlined"
                    placeholder="Enter Mobile Number"
                    {...register("mobileNumber")}
                    error={!!errors?.mobileNumber}
                    helperText={errors?.mobileNumber?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="password-field"
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    placeholder="Enter Password"
                    {...register("password")}
                    error={!!errors?.password}
                    helperText={errors?.password?.message}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-outline-primary mx-2"
                  disabled={loading}
                >
                  Submit
                </button>
                <NavLink to="/">
                  <button type="reset" className="btn btn-outline-danger mx-2">
                    Cancel
                  </button>
                </NavLink>
              </div>
            </Grid>
          </Grid>
        </form>
      </Container>
    </MainLayout>
  );
};

export default UserForm;
