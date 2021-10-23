import { Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { makeStyles } from "@mui/styles";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

import { useState } from "react";
import { auth, db } from "../utils/init";
import { doc, updateDoc } from "firebase/firestore";

const useStyle = makeStyles((theme) => ({
  loadingStyles: {
    color: "#5E503F",
  },
}));

function CompletedItemMapping(props) {
  const classes = useStyle();
  const [markAsPendingLoading, setMarkAsPendingLoading] = useState(false);
  const [markAsDeletedLoading, setMarkAsDeletedLoading] = useState(false);

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
          disabled={markAsDeletedLoading}
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
            markAsPendingLoading || markAsDeletedLoading
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
          loading={markAsDeletedLoading}
          onClick={async () => {
            console.log("deleted");
            setMarkAsDeletedLoading(true);
            let uid = auth.currentUser?.uid;
            let itemDetailsReference = doc(
              db,
              `Users/${uid}/Todos`,
              `${props.item.id}`
            );

            await updateDoc(itemDetailsReference, {
              itemStatus: "deleted",
              itemLastUpdatedDate: new Date(),
            });
            // await getData(uid);
            setMarkAsDeletedLoading(false);
          }}
        >
          <DeleteOutlineRoundedIcon />
        </LoadingButton>
      </Grid>
    </Grid>
  );
}

export default CompletedItemMapping;
