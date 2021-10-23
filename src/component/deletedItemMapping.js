import { Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { makeStyles } from "@mui/styles";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

import { useState } from "react";
import { auth, db } from "../utils/init";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

const useStyle = makeStyles((theme) => ({
  loadingStyles: {
    color: "#5E503F",
  },
}));

function DeletedItemMapping(props) {
  const classes = useStyle();
  const [markAsPendingLoading, setMarkAsPendingLoading] = useState(false);
  const [markAsPermanentDeletedLoading, setMarkAsPermanentDeletedLoading] =
    useState(false);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignContent="center"
      key={props.item.id}
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
              `${props.item.id}`
            );
            await updateDoc(itemDetailsReference, {
              itemStatus: "pending",
              itemLastUpdatedDate: new Date(),
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
          {props.item.details}
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

            await deleteDoc(doc(db, `Users/${uid}/Todos`, props.item.id));
            // await getData(uid);
            setMarkAsPermanentDeletedLoading(false);
          }}
        >
          <DeleteForeverRoundedIcon />
        </LoadingButton>
      </Grid>
    </Grid>
  );
}

export default DeletedItemMapping;
