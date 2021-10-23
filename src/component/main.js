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
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { signOut } from "firebase/auth";

import { auth, db } from "../utils/init";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
} from "firebase/firestore";

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
  const [user, loading, error] = useAuthState(auth);
  const [newInputContent, setNewInputContent] = useState("");
  const [submittingData, setSubmittingData] = useState(false);
  const [markAsCompletedLoading, setMarkAsCompletedLoading] = useState(false);
  const [markAsPendingLoading, setMarkAsPendingLoading] = useState(false);
  const [markAsDeletedLoading, setMarkAsDeletedLoading] = useState(false);
  const [markAsPermanentDeletedLoading, setMarkAsPermanentDeletedLoading] =
    useState(false);

  // Add a new document with a generated id.
  const addDocIntoTodos = async (inputValue, uid) => {
    setSubmittingData(true);
    await addDoc(collection(db, `Users/${uid}/Todos`), {
      details: inputValue,
    });
    // await getData(uid);
    setSubmittingData(false);
  };

  //Fetch user's todos array from firestore
  // const getData = async (uid) => {
  //   const querySnapshot = await getDocs(collection(db, `Users/${uid}/Todos`));
  //   let myArr = [];
  //   setTodos([]);
  //   querySnapshot.forEach(async (doc) => {
  //     let obj = {};
  //     obj = doc.data();
  //     obj.id = doc.id;
  //     myArr.push(obj);
  //     setTodos((arr) => [...arr, obj]);
  //   });
  //   setFetchingData(false);
  // };

  //First time mapping after launching main page
  useEffect(() => {
    if (user) {
      console.log("use effect running");
      let uid = auth.currentUser?.uid;
      // setFetchingData(true);
      // getData(uid);
      const q = query(collection(db, `Users/${uid}/Todos`));
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
    } else if (loading) {
      console.log("is loading");
      return;
    } else {
      console.log("no user found");
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

        {/* Open/Pending item */}
        <Grid container direction="column">
          <Grid container direction="row" justifyContent="center">
            <Grid item xs={8} mt={3}>
              <h3>Open items</h3>
            </Grid>
          </Grid>

          {todos.map((item, index) => {
            return item.itemStatus === "pending" ? (
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignContent="center"
                key={item.id}
              >
                <Grid item alignSelf="center">
                  <LoadingButton
                    color="inherit"
                    loading={markAsCompletedLoading}
                    disabled={markAsDeletedLoading}
                    onClick={async (e) => {
                      setMarkAsCompletedLoading(true);

                      console.log(e);
                      let uid = auth.currentUser?.uid;
                      let itemDetailsReference = doc(
                        db,
                        `Users/${uid}/Todos`,
                        `${item.id}`
                      );
                      await updateDoc(itemDetailsReference, {
                        itemStatus: "completed",
                      });
                      // await getData(uid);

                      setMarkAsCompletedLoading(false);
                    }}
                  >
                    <RadioButtonUncheckedRoundedIcon />
                  </LoadingButton>
                </Grid>
                <Grid item xs={6} ml={2}>
                  <p
                    className={`${
                      markAsCompletedLoading || markAsDeletedLoading
                        ? `${classes.loadingStyles}`
                        : ""
                    }`}
                  >
                    {item.details}
                  </p>
                </Grid>

                <Grid item alignSelf="center">
                  <LoadingButton
                    color="inherit"
                    disabled={markAsCompletedLoading}
                    loading={markAsDeletedLoading}
                    onClick={async () => {
                      console.log("deleted");
                      setMarkAsDeletedLoading(true);
                      let uid = auth.currentUser?.uid;
                      let itemDetailsReference = doc(
                        db,
                        `Users/${uid}/Todos`,
                        `${item.id}`
                      );

                      await updateDoc(itemDetailsReference, {
                        itemStatus: "deleted",
                      });
                      // await getData(uid);
                      setMarkAsDeletedLoading(false);
                    }}
                  >
                    <DeleteOutlineRoundedIcon />
                  </LoadingButton>
                </Grid>
              </Grid>
            ) : (
              ""
            );
          })}
        </Grid>

        {/* Completed item */}
        <Grid container direction="column">
          <Grid container direction="row" justifyContent="center">
            <Grid item xs={8} mt={3}>
              <h3>Completed items</h3>
            </Grid>
          </Grid>

          {todos.map((item, index) => {
            return item.itemStatus === "completed" ? (
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignContent="center"
                key={item.id}
              >
                <Grid item alignSelf="center">
                  <LoadingButton
                    color="inherit"
                    loading={markAsPendingLoading}
                    disabled={markAsDeletedLoading}
                    onClick={async (e) => {
                      setMarkAsPendingLoading(true);

                      console.log(e);
                      let uid = auth.currentUser?.uid;
                      let itemDetailsReference = doc(
                        db,
                        `Users/${uid}/Todos`,
                        `${item.id}`
                      );
                      await updateDoc(itemDetailsReference, {
                        itemStatus: "pending",
                      });
                      // await getData(uid);

                      setMarkAsPendingLoading(false);
                    }}
                  >
                    <ReplayRoundedIcon />
                  </LoadingButton>
                </Grid>
                <Grid item xs={6} ml={2}>
                  <p
                    className={`${
                      markAsPendingLoading || markAsDeletedLoading
                        ? `${classes.loadingStyles}`
                        : ""
                    }`}
                  >
                    {item.details}
                  </p>
                </Grid>

                <Grid item alignSelf="center">
                  <LoadingButton
                    color="inherit"
                    disabled={markAsPendingLoading}
                    loading={markAsDeletedLoading}
                    onClick={async () => {
                      console.log("deleted");
                      setMarkAsDeletedLoading(true);
                      let uid = auth.currentUser?.uid;
                      let itemDetailsReference = doc(
                        db,
                        `Users/${uid}/Todos`,
                        `${item.id}`
                      );

                      await updateDoc(itemDetailsReference, {
                        itemStatus: "deleted",
                      });
                      // await getData(uid);
                      setMarkAsDeletedLoading(false);
                    }}
                  >
                    <DeleteOutlineRoundedIcon />
                  </LoadingButton>
                </Grid>
              </Grid>
            ) : (
              ""
            );
          })}
        </Grid>

        {/* Deleted item */}
        <Grid container direction="column">
          <Grid container direction="row" justifyContent="center">
            <Grid item xs={8} mt={3}>
              <h3>Deleted items</h3>
            </Grid>
          </Grid>

          {todos.map((item, index) => {
            return item.itemStatus === "deleted" ? (
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignContent="center"
                key={item.id}
              >
                <Grid item alignSelf="center">
                  <LoadingButton
                    color="inherit"
                    loading={markAsPendingLoading}
                    disabled={markAsPermanentDeletedLoading}
                    onClick={async (e) => {
                      setMarkAsPendingLoading(true);

                      console.log(e);
                      let uid = auth.currentUser?.uid;
                      let itemDetailsReference = doc(
                        db,
                        `Users/${uid}/Todos`,
                        `${item.id}`
                      );
                      await updateDoc(itemDetailsReference, {
                        itemStatus: "pending",
                      });
                      // await getData(uid);

                      setMarkAsPendingLoading(false);
                    }}
                  >
                    <ReplayRoundedIcon />
                  </LoadingButton>
                </Grid>
                <Grid item xs={6} ml={2}>
                  <p
                    className={`${
                      markAsPendingLoading || markAsPermanentDeletedLoading
                        ? `${classes.loadingStyles}`
                        : ""
                    }`}
                  >
                    {item.details}
                  </p>
                </Grid>

                <Grid item alignSelf="center">
                  <LoadingButton
                    color="inherit"
                    disabled={markAsPendingLoading}
                    loading={markAsPermanentDeletedLoading}
                    onClick={async () => {
                      console.log("permanently deleted");
                      setMarkAsPermanentDeletedLoading(true);
                      let uid = auth.currentUser?.uid;
                      // let itemDetailsReference = doc(
                      //   db,
                      //   `Users/${uid}/Todos`,
                      //   `${item.id}`
                      // );

                      await deleteDoc(doc(db, `Users/${uid}/Todos`, item.id));
                      // await getData(uid);
                      setMarkAsPermanentDeletedLoading(false);
                    }}
                  >
                    <DeleteForeverRoundedIcon />
                  </LoadingButton>
                </Grid>
              </Grid>
            ) : (
              ""
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
