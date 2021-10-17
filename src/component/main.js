import {
  Container,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LoadingButton } from "@mui/lab";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuthStateChecker } from "./authState";
import { useAuthState } from "react-firebase-hooks/auth";

import { signOut } from "firebase/auth";
import { auth, db } from "../utils/init";
import { collection, getDocs, addDoc } from "firebase/firestore";

import EditPencil from "../images/inactive-pencil.png";

// font-family: 'Sacramento', cursive;
const useStyle = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    maxWidth: "70vw",
  },
  pageTitle: {
    fontFamily: "Sacramento",
    fontSize: "5rem",
    borderBottomStyle: "groove",
  },
  editPencilStyle: {
    width: "50px",
  },
}));

function Main() {
  const classes = useStyle();
  const history = useHistory();
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [newInputContent, setNewInputContent] = useState("");
  const [submittingData, setSubmittingData] = useState(false);

  const addDocIntoTodos = async (inputValue, uid) => {
    setSubmittingData(true);
    // Add a new document with a generated id.
    await addDoc(collection(db, `Users/${uid}/Todos`), {
      ABC123: inputValue,
    });
    await getData(uid);
    setSubmittingData(false);
  };

  const getData = async (uid) => {
    const querySnapshot = await getDocs(collection(db, `Users/${uid}/Todos`));
    let myArr = [];
    setTodos([]);
    querySnapshot.forEach(async (doc) => {
      let obj = {};
      obj = doc.data();
      obj.id = doc.id;
      myArr.push(obj);
      setTodos((arr) => [...arr, obj]);
    });
    setFetchingData(false);
  };

  useEffect(() => {
    if (user) {
      console.log("user found");
      let uid = auth.currentUser?.uid;
      setFetchingData(true);
      getData(uid);
      console.log(todos);
    } else if (loading) {
      console.log("is loading");
      return;
    } else {
      console.log("no user ound");
      history.push("/");
    }
  }, [user, loading]);

  return user && !fetchingData ? (
    <Container className={classes.root}>
      <Grid container direction="column" alignContent="flex-end">
        <Grid item pt={5}>
          <LoadingButton
            variant="outlined"
            disableElevation
            loading={signOutLoading}
            onClick={() => {
              setSignOutLoading(true);
              signOut(auth)
                .then(() => {
                  history.push("/");
                  setSignOutLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setSignOutLoading(false);
                });
            }}
          >
            Sign Out
          </LoadingButton>
          <Button
            onClick={() => {
              console.log("clicked");
              console.log(todos);
            }}
          >
            Test
          </Button>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} textAlign="center">
          <h1 className={classes.pageTitle}>todos</h1>
        </Grid>
      </Grid>

      <Grid container direction="row">
        <Grid
          item
          container
          sx={{
            width: "100%",
            maxWidth: "100%",
          }}
          justifyContent="center"
          alignItems="center"
          direction="row"
        >
          <Grid item>
            <img
              src={EditPencil}
              className={classes.editPencilStyle}
              alt="Edit's pencil icon"
            ></img>
          </Grid>
          <Grid item xs={7} ml={3}>
            <TextField
              disabled={submittingData}
              label="Type here..."
              id="standard-size-small"
              size="small"
              fullWidth
              variant="outlined"
              onChange={(e) => setNewInputContent(e.target.value)}
            />
          </Grid>
          <Grid item>
            <LoadingButton
              loading={submittingData}
              color="inherit"
              onClick={() => {
                let uid = auth.currentUser?.uid;
                addDocIntoTodos(newInputContent, uid);
              }}
            >
              <SendRoundedIcon />
            </LoadingButton>
          </Grid>
        </Grid>

        <Grid container direction="column">
          <Grid container direction="row" justifyContent="center">
            <Grid item xs={8} mt={3}>
              <h3>Open items</h3>
            </Grid>
          </Grid>

          {todos.map((item, index) => {
            return (
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignContent="center"
                key={item.id}
                onClick={() => {
                  let tempArray = todos;
                  tempArray[index].done = !tempArray[index].done;
                  setTodos([]);
                  tempArray.forEach(async (obj) => {
                    setTodos((arr) => [...arr, obj]);
                  });
                }}
              >
                <Grid item alignSelf="center">
                  <Button color="inherit">
                    {item.done ? (
                      <CheckCircleOutlineRoundedIcon />
                    ) : (
                      <RadioButtonUncheckedRoundedIcon />
                    )}
                  </Button>
                </Grid>
                <Grid item xs={7} ml={3}>
                  <p>{item.ABC123}</p>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Container>
  ) : (
    <Container className={classes.root}>
      <Grid
        container
        direction="column"
        alignContent="center"
        justifyContent="center"
        sx={{
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Grid>
    </Container>
  );
}

export default Main;
