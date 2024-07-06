import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import "./Register.css";
import endpoint from "../contants/api-url";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    const [key, value] = [e.target.name, e.target.value];
    setFormData({ ...formData, [key]: value });
  };
  const register = async (formData) => {
    console.log(formData);
    if (!validateInput(formData)) return;

    setLoading(true);

    try {
      await axios.post(`${endpoint.REGISTER_API}`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      setLoading(false);
      enqueueSnackbar("Registed successfully", { variant: "success" });
      navigate('/login')
    } catch (e) {
      setLoading(false);
      console.log(e)
      if (e.code === "ERR_BAD_REQUEST") {
        return enqueueSnackbar("Username or Email Already taken.", { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. check that the backend is running, reachable and return valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar("Username is required field", { variant: "warning" });
      return false;
    }

    if (data.username.length < 6) {
      enqueueSnackbar("Username must be atleast 6 characters", {
        variant: "warning",
      });
      return false;
    }

    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }

    if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    }

    if (!data.email) {
      enqueueSnackbar("Email is a required field", { variant: "warning" });
      return false;
    }

    if (data.email.length < 5) {
      enqueueSnackbar("Kindly put valid email address.", {
        variant: "warning",
      });
      return false;
    }

    return true;
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={formData.username}
            onChange={handleInput}
          />
          <TextField
            id="email"
            variant="outlined"
            label="Email Address"
            name="email"
            type="text"
            fullWidth
            value={formData.email}
            onChange={handleInput}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
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
                await register(formData);
              }}
            >
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <a className="link" href="/login">
              Login here
            </a>
          </p>
        </Stack>
      </Box>
    </Box>
  );
};

export default Register;
