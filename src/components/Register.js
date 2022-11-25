import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { Link, useHistory } from "react-router-dom";
const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [registrationDetails,setRegistrationDetails] = useState({
    userName : '',
    password : '',
    confirmPassword : ''
  });

  const [loading,setLoading] = useState(false);
  const history = useHistory();


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    setLoading(true);
    axios.post(`${config.endpoint}/auth/register`,{username : formData.userName,password : formData.password}).then(()=>{
      enqueueSnackbar('Registered Successfully', { 
        variant: 'success'
      })
      history.push('/login');
      setLoading(false);
    }).catch((error)=>{
      if(error.response?.data?.message){
        enqueueSnackbar(error.response.data.message, { 
          variant: 'error',
        })
      }else{
        enqueueSnackbar('Something went wrong.', { 
          variant: 'error',
        })
      }
      
      setLoading(false);
    })
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if(validateInput(registrationDetails)){
      register(registrationDetails);
    }
  }

  const handleChange = (field,value) => {
    const registrationDetailsCopy = {...registrationDetails};
    registrationDetailsCopy[field] = value;
    setRegistrationDetails(registrationDetailsCopy);
  } 

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    const {userName,password,confirmPassword} = data;

    // for userName
    if(!userName){
      enqueueSnackbar('Username is a required field', { 
        variant: 'warning'
      })
    } else if(userName.length <6){
      enqueueSnackbar('Username must be at least 6 characters', { 
        variant: 'warning'
      })
    } else if(!password){
      enqueueSnackbar('Password is a required field', { 
        variant: 'warning'
      })
    } else if(password.length <6){
      enqueueSnackbar('Password must be at least 6 characters', { 
        variant: 'warning'
      })
    } else if(password !== confirmPassword){
      enqueueSnackbar('Passwords do not match', { 
        variant: 'warning'
      })
    }

    return !!userName && userName.length >=6 && !!password && password.length >=6 && password === confirmPassword;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
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
            required
            value = {registrationDetails.userName}
            onChange={(event)=>handleChange('userName',event.target.value)}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            required
            placeholder="Enter a password with minimum 6 characters"
            value = {registrationDetails.password}
            onChange={(event)=>handleChange('password',event.target.value)}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            required
            value = {registrationDetails.confirmPassword}
            onChange={(event)=>handleChange('confirmPassword',event.target.value)}
          />
           <Button role="button" className="button" variant="contained" onClick={handleSubmit}>
            {loading ? <CircularProgress sx={{ color:"white"}} /> : 'Register Now'}
           </Button>
          <p className="secondary-action">
            Already have an account?{" "}
             <Link to="/login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
