import "./App.css";
import Homepage from "./component/homepage";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Signika",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "Signika",
          letterSpacing: "0.1rem",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Homepage />
      </div>
    </ThemeProvider>
  );
}

export default App;
