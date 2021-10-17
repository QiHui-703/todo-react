import "./App.css";
import Homepage from "./component/homepage";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./component/main";

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
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/">
              <Homepage />
            </Route>
            <Route path="/main">
              <Main />
            </Route>
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
