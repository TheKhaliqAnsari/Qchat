import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import  { useState } from "react";

import endpoint from "../contants/api-url";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleInput = (e) => {
    const [key, value] = [e.target.name, e.target.value];
    setFormData({ ...formData, [key]: value });
  };
  const login = async (formData) => {
    console.log(formData);
    if (!validateInput(formData)) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${endpoint.LOGIN_API}`,
        formData
      );
      console.log(response)
      persistLogin(
        response.data.jwt,
        response.data.user.username,
        response.data.user.email
      );

      setFormData({
        identifier: "",
        password: "",
      });

      setLoading(false);
      enqueueSnackbar("Logged in", { variant: "success" });
      
      navigate('/chats')
    } catch (e) {
      setLoading(false);
      if (e.response && e.response.status === 400) {
        return enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
      return  enqueueSnackbar(
          "Something went wrong. check that the backend is running, reachable and return valid JSON.",
          { variant: "error" }
        );
      }
    }
  };
  const validateInput = (data) => {
    if (!data.identifier) {
      enqueueSnackbar("Username/Email is required field", { variant: "warning" });
      return false;
    }
    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    return true;
  };
  const persistLogin = (token, username, email) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="identifier"
            placeholder="Enter Username or Email"
            fullWidth
            value={formData.identifier}
            onChange={handleInput}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={handleInput}
          />

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress size={25} color="primary" />
            </Box>
          ) : (
            <Button
              className="button"
              variant="contained"
              onClick={async () => {
                await login(formData);
              }}
            >
              LOGIN TO QChat
            </Button>
          )}
          <p className="secondary-action">
            Dont have an account?{" "}
            <a className="link" href="/">
              Register now
            </a>
          </p>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;
