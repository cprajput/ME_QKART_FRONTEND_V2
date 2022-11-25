import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Typography } from "@mui/material";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const [loginDetails,setLoginDetails] = useState(null);
  const history = useHistory();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('username');
    localStorage.removeItem('balance');
    localStorage.removeItem('token');
    history.push('/login');
  },[history])

    const renderHeaderBUttons = useMemo(() => {
      if(hasHiddenAuthButtons){
        return <Box component={Link} sx={{textDecoration : 'none'}}  to="/" >
              <Button
                className="explore-button"
                startIcon={<ArrowBackIcon />}
                variant="text"
              >
                Back to explore
              </Button>
            </Box>
      }else{
        if(!loginDetails?.username && !loginDetails?.token){
          return <>
            <Box component={Link} sx={{textDecoration : 'none'}}  to="/login" >
              <Button name="login">
                Login
              </Button>
            </Box>
            <Box component={Link} sx={{textDecoration : 'none'}}  to="/register" >
              <Button variant="contained" name="register">
                register
              </Button>
            </Box>
          </>
        }else{
          return <Box sx={{display:'flex',alignItems:'center'}}>
            <Avatar alt={loginDetails.username} src="avatar.png" />
            <Typography sx={{py:0.75,px:1}}>{loginDetails.username}</Typography>
            <Button name="logout" onClick={handleLogout}>Logout</Button>
          </Box>
        }
      }
    },[handleLogout, hasHiddenAuthButtons, loginDetails]);


    useEffect(()=>{
      const details = {
        username : localStorage.getItem('username'),
        token : localStorage.getItem('token')    
      }
      setLoginDetails(details);
    },[]);

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>

        {children}
      
        <Box>{renderHeaderBUttons}</Box>
        
      </Box>
    );
};

export default Header;
