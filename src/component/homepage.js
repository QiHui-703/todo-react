import { Button, Grid, TextField, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import _ from "lodash";

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
  const [isEmailValid, setIsEmailValid] = useState();
  const [isPasswordFieldClicked, setIsPasswordFieldClicked] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState();

  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push("/main");
    }
  }, [user, userLoading, history]);

  return !userLoading ? (
    <Grid
      container
      direction="column"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
      }}
      rowSpacing={6}
    >
      <Grid item sx={{ alignSelf: "center" }}>
        <img src={Logo} style={{ width: "7rem" }} alt="to do's logo"></img>
      </Grid>

      <Grid item container justifyContent="center">
        <Grid
          container
          item
          columnSpacing={1}
          sx={{
            width: { xs: "80%", md: "30%" },
            justifyContent: "space-around",
          }}
        >
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
                  const errorCode = error.code
                    .replace("auth/", "")
                    .replaceAll("-", " ");
                  alert(_.upperFirst(errorCode));
                  setLoading(false);
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
                  const errorCode = error.code
                    .replace("auth/", "")
                    .replaceAll("-", " ");
                  alert(_.upperFirst(errorCode));
                  setLoading(false);
                });
            }
          }}
        >
          <Grid container direction="column" textAlign="center" rowSpacing={3}>
            <Grid item>
              <p>Email Address</p>
              <TextField
                sx={{ minWidth: { xs: "60%", md: "20vw" } }}
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
                  if (e.target.value.length !== 0) {
                    setIsEmailFieldClicked(true);
                  } else {
                    setIsEmailFieldClicked(false);
                  }
                }}
              />
            </Grid>

            <Grid item>
              <p>Password</p>
              <TextField
                sx={{ minWidth: { xs: "60%", md: "20vw" } }}
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
                  if (passwordLength < 6) {
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
                        const errorCode = error.code
                          .replace("auth/", "")
                          .replaceAll("-", " ");
                        alert(_.upperFirst(errorCode));
                        setLoading(false);
                      });
                  }}
                >
                  Login
                </LoadingButton>
              ) : (
                //new user register onClick
                <LoadingButton
                  type="submit"
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
                        const errorCode = error.code
                          .replace("auth/", "")
                          .replaceAll("-", " ");
                        alert(_.upperFirst(errorCode));
                        setLoading(false);
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
