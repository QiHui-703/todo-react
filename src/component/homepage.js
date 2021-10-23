import { Button, Grid, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import Logo from "../images/todo-logo-plain.png";
import { useHistory } from "react-router-dom";

//firebase
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../utils/init";

function delay(delayInms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

function Homepage() {
  const [formType, setFormType] = useState("existingUser");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingAuthDetails, setIsFetchingAuthDetails] = useState(false);

  const history = useHistory();

  return !isFetchingAuthDetails ? (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
      rowSpacing={6}
    >
      <Grid item>
        <img src={Logo} style={{ width: "150px" }} alt="to do's logo"></img>
      </Grid>

      <Grid item>
        <Grid container columnSpacing={12}>
          <Grid item>
            <Button
              variant={formType === "existingUser" ? "contained" : "outlined"}
              disableElevation
              size="small"
              onClick={() => {
                setFormType("existingUser");
              }}
            >
              Existing user
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant={formType === "newUser" ? "contained" : "outlined"}
              color="secondary"
              disableElevation
              size="small"
              onClick={() => {
                setFormType("newUser");
              }}
            >
              New user
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Existing user login */}
      <Grid item>
        {formType === "existingUser" ? (
          <Grid
            container
            direction="column"
            textAlign="center"
            className="user-login"
            rowSpacing={3}
          >
            <Grid item>
              <p>Email Address</p>
              <TextField
                required
                id="email-filled-required"
                label="Required"
                variant="filled"
                type="email"
                size="small"
                onChange={(e) => {
                  setEmailAddress(e.target.value);
                }}
              />
            </Grid>

            <Grid item>
              <p>Password</p>
              <TextField
                required
                id="password-filled-required"
                label="Required"
                variant="filled"
                type="password"
                size="small"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Grid>

            <Grid item>
              <LoadingButton
                variant="contained"
                disableElevation
                loading={loading}
                onClick={() => {
                  setLoading(true);
                  signInWithEmailAndPassword(auth, emailAddress, password)
                    .then((userCredential) => {
                      history.push("/main");
                      setLoading(false);
                    })
                    .catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      setLoading(false);
                      console.log(errorCode);
                      console.log(errorMessage);
                    });
                }}
              >
                Login
              </LoadingButton>
            </Grid>
          </Grid>
        ) : (
          // New user sign up
          <Grid
            container
            direction="column"
            textAlign="center"
            className="user-signup"
            rowSpacing={3}
          >
            <Grid item>
              <p>Email Address</p>
              <TextField
                required
                id="filled-required"
                label="Required"
                variant="filled"
                type="email"
                size="small"
                onChange={(e) => {
                  setEmailAddress(e.target.value);
                }}
              />
            </Grid>

            <Grid item>
              <p>Password</p>
              <TextField
                required
                id="password-filled-required"
                label="Required"
                variant="filled"
                type="password"
                size="small"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Grid>

            <Grid item>
              <LoadingButton
                variant="contained"
                loading={loading}
                disableElevation
                color="secondary"
                onClick={() => {
                  setLoading(true);
                  const auth = getAuth();
                  createUserWithEmailAndPassword(auth, emailAddress, password)
                    .then(async (userCredential) => {
                      const userId = userCredential.user.uid;
                      const docRef = doc(db, "Users", userId);
                      let docSnap = await getDoc(docRef);
                      while (!docSnap.exists()) {
                        await delay(1000);
                        docSnap = await getDoc(docRef);
                      }
                      history.push("/main");
                      setLoading(false);
                    })
                    .catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      setLoading(false);
                      console.log(errorCode);
                      console.log(errorMessage);
                    });
                }}
              >
                Register
              </LoadingButton>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  ) : (
    <div />
  );
}

export default Homepage;
