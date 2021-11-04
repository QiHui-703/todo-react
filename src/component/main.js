import {
  Container,
  Grid,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LoadingButton } from "@mui/lab";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import OpenItemMapping from "./openItemMapping";
import CompletedItemMapping from "./completedItemMapping";
import DeletedItemMapping from "./deletedItemMapping";

import { signOut } from "firebase/auth";
import { auth, db } from "../utils/init";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import EditPencil from "../images/inactive-pencil.png";
import ActiveEditPencil from "../images/active-pencil.png";

// font-family: 'Sacramento', cursive;
const useStyle = makeStyles(() => ({
  root: {
    minHeight: "100vh",
    maxWidth: "90vw",
  },
  pageTitle: {
    fontFamily: "Sacramento",
    borderBottomStyle: "groove",
    color: "#0C1B33",
  },
  categoryTitleStyle: {
    color: "#439A86",
  },
  editPencilStyle: {
    width: "45px",
  },
  loadingStyles: {
    color: "#5E503F",
  },
}));

function Main() {
  const classes = useStyle();
  const history = useHistory();
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [newInputContent, setNewInputContent] = useState("");
  const [submittingData, setSubmittingData] = useState(false);
  const [userInputFieldOnFocus, setUserInputFieldOnFocus] = useState(false);

  // Add a new document with a generated id.
  const addDocIntoTodos = async (inputValue, uid) => {
    setSubmittingData(true);
    await addDoc(collection(db, `Users/${uid}/Todos`), {
      details: inputValue,
      itemCreationDate: new Date(),
      itemLastUpdatedDate: new Date(),
      itemStatus: "pending",
    });
    setSubmittingData(false);
  };

  //First time mapping after launching main page
  useEffect(() => {
    if (user) {
      let uid = auth.currentUser?.uid;
      const q = query(
        collection(db, `Users/${uid}/Todos`),
        orderBy("itemLastUpdatedDate", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setFetchingData(true);
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
      });
    } else {
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
                  setSignOutLoading(false);
                });
            }}
          >
            Sign Out
          </LoadingButton>
        </Grid>
      </Grid>

      <Grid container>
        <Grid
          item
          xs={12}
          textAlign="center"
          sx={{ fontSize: { xs: "1.5rem", md: "3rem" } }}
        >
          <h1 className={classes.pageTitle}>todos</h1>
        </Grid>
      </Grid>

      <Grid container direction="row">
        <Grid
          item
          sx={{
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <form
            autoComplete="off"
            onSubmit={() => {
              let uid = auth.currentUser?.uid;
              addDocIntoTodos(newInputContent, uid);
              setUserInputFieldOnFocus(false);
            }}
          >
            <Grid
              container
              sx={{
                width: "100%",
              }}
              justifyContent="center"
              alignItems="center"
              direction="row"
            >
              <Grid item>
                <img
                  src={userInputFieldOnFocus ? ActiveEditPencil : EditPencil}
                  className={classes.editPencilStyle}
                  alt="Edit's pencil icon"
                />
              </Grid>
              <Grid item xs={6} md={7} ml={1}>
                <TextField
                  disabled={submittingData}
                  label="Type here..."
                  id="standard-size-small"
                  size="small"
                  fullWidth
                  variant="outlined"
                  type="text"
                  onChange={(e) => {
                    setNewInputContent(e.target.value);
                  }}
                  onFocus={() => {
                    setUserInputFieldOnFocus(true);
                  }}
                  onBlur={() => {
                    setUserInputFieldOnFocus(false);
                  }}
                />
              </Grid>
              <Grid item>
                <LoadingButton
                  loading={submittingData}
                  type="submit"
                  color="inherit"
                  onClick={() => {
                    let uid = auth.currentUser?.uid;
                    addDocIntoTodos(newInputContent, uid);
                    setUserInputFieldOnFocus(false);
                  }}
                >
                  <SendRoundedIcon />
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </Grid>

        {/* Open/Pending item */}
        <Grid container direction="column" sx={{ minHeight: "15vh" }}>
          <Grid container item direction="row" justifyContent="center">
            <Grid item xs={12} md={8} mt={3} sx={{ fontSize: { xs: "0.9em" } }}>
              <h3 className={classes.categoryTitleStyle}>Open items</h3>
            </Grid>
          </Grid>

          {todos.map((item, index) => {
            return item.itemStatus === "pending" ? (
              <OpenItemMapping item={item} key={item.id} />
            ) : (
              ""
            );
          })}
        </Grid>

        {/* Completed item */}
        <Grid container direction="column" sx={{ minHeight: "15vh" }}>
          <Grid container direction="row" justifyContent="center">
            <Grid item xs={12} md={8} mt={3} sx={{ fontSize: { xs: "0.9em" } }}>
              <h3 className={classes.categoryTitleStyle}>Completed items</h3>
            </Grid>
          </Grid>

          {todos.map((item, index) => {
            return item.itemStatus === "completed" ? (
              <CompletedItemMapping item={item} key={item.id} />
            ) : (
              ""
            );
          })}
        </Grid>

        {/* Deleted item */}
        <Grid container direction="column" sx={{ minHeight: "15vh" }}>
          <Grid container direction="row" justifyContent="center">
            <Grid item xs={12} md={8} mt={3} sx={{ fontSize: { xs: "0.9em" } }}>
              <h3 className={classes.categoryTitleStyle}>Deleted items</h3>
            </Grid>
          </Grid>

          {todos.map((item, index) => {
            return item.itemStatus === "deleted" ? (
              <DeletedItemMapping item={item} key={item.id} />
            ) : (
              ""
            );
          })}
        </Grid>

        <Grid
          item
          container
          justifyContent="center"
          alignContent="center"
          sx={{
            minHeight: "5vh",
          }}
        >
          <Grid item pt={20} pb={10}>
            <Typography>🌈 CREATED BY QI HUI 🌈</Typography>
          </Grid>
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
