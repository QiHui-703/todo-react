import { Button, Grid, TextField, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import Logo from "../images/todo-logo-plain.png";

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
  const [user, userLoading] = useAuthState(auth);
  const [isEmailFieldClicked, setIsEmailFieldClicked] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordFieldClicked, setIsPasswordFieldClicked] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState();

  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push("/main");
    } else if (userLoading) {
      console.log("is loading");
      return;
    } else {
      console.log("no user found");
    }
  }, [user, userLoading]);

  return !userLoading ? (
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

      <Grid item>
        <form
          onSubmit={() => {
            setLoading(true);

            //existing user login onSubmit
            if (formType === "existingUser") {
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
            }
            //new user register onSubmit
            else {
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
            }
          }}
        >
          <Grid container direction="column" textAlign="center" rowSpacing={3}>
            <Grid item>
              <p>Email Address</p>
              <TextField
                sx={{ minWidth: "20vw" }}
                autoComplete="off"
                required
                id="email-filled-required"
                label="Required"
                variant="filled"
                type="email"
                size="small"
                error={isEmailFieldClicked && !isEmailValid}
                helperText={
                  isEmailFieldClicked && !isEmailValid
                    ? "Please enter a valid email address"
                    : ""
                }
                onChange={(e) => {
                  setEmailAddress(e.target.value);
                  setIsEmailValid(e.target.validity.valid);
                }}
                onClick={(e) => {
                  setIsEmailFieldClicked(true);
                }}
              />
            </Grid>

            <Grid item>
              <p>Password</p>
              <TextField
                sx={{ minWidth: "20vw" }}
                autoComplete="off"
                required
                id="password-filled-required"
                label="Required"
                variant="filled"
                type="password"
                size="small"
                error={isPasswordFieldClicked && isPasswordInvalid}
                helperText={
                  isPasswordInvalid ? "Invalid password (min. length: 6)" : ""
                }
                onChange={(e) => {
                  setPassword(e.target.value);
                  let passwordLength = e.target.value.length;
                  console.log(passwordLength);
                  if (passwordLength < 6) {
                    setIsPasswordFieldClicked(true);
                    setIsPasswordInvalid(true);
                  } else {
                    setIsPasswordInvalid(false);
                  }
                }}
                onClick={(e) => {
                  setIsPasswordFieldClicked(true);
                }}
              />
            </Grid>

            <Grid item>
              {formType === "existingUser" ? (
                //existing user login onClick
                <LoadingButton
                  disabled={
                    !emailAddress ||
                    !isEmailValid ||
                    !password ||
                    isPasswordInvalid
                  }
                  type="submit"
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
              ) : (
                //new user register onClick
                <LoadingButton
                  disabled={
                    !emailAddress ||
                    !isEmailValid ||
                    !password ||
                    isPasswordInvalid
                  }
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
              )}
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  ) : (
    <Grid
      container
      justifyContent="center"
      alignContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  );
}

export default Homepage;
