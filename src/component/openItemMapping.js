import { Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { makeStyles } from "@mui/styles";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { useState } from "react";
import { auth, db } from "../utils/init";
import { doc, updateDoc } from "firebase/firestore";

const useStyle = makeStyles((theme) => ({
  loadingStyles: {
    color: "#5E503F",
  },
}));

function OpenItemMapping(props) {
  const classes = useStyle();
  const [markAsCompletedLoading, setMarkAsCompletedLoading] = useState(false);
  const [markAsDeletedLoading, setMarkAsDeletedLoading] = useState(false);
  return (
    <Grid
      container
      item
      sx={{
        justifyContent: { xs: "space-around", md: "center" },
        fontSize: { xs: "0.9rem" },
      }}
    >
      <Grid item alignSelf="center">
        <LoadingButton
          color="inherit"
          loading={markAsCompletedLoading}
          disabled={markAsDeletedLoading}
          onClick={async () => {
            setMarkAsCompletedLoading(true);
            let uid = auth.currentUser?.uid;
            let itemDetailsReference = doc(
              db,
              `Users/${uid}/Todos`,
              `${props.item.id}`
            );
            await updateDoc(itemDetailsReference, {
              itemStatus: "completed",
              itemLastUpdatedDate: new Date(),
            });
            // await getData(uid);

            setMarkAsCompletedLoading(false);
          }}
        >
          <RadioButtonUncheckedRoundedIcon />
        </LoadingButton>
      </Grid>

      <Grid item xs={6} sx={{ overflowWrap: "break-word" }}>
        <p
          className={`${
            markAsCompletedLoading || markAsDeletedLoading
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
          disabled={markAsCompletedLoading}
          loading={markAsDeletedLoading}
          onClick={async () => {
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

export default OpenItemMapping;
