import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Lato"
  },
  palette: {
    primary: {
      extraLight : '#E9F5E1',
      light: "#45c09f",
      main: "#00a278",
      dark: "#00845c",
      contrastText: "#fff",
    },
  },
});

export default theme;
