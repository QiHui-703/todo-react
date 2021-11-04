import { Grid, Popover, Typography } from "@mui/material";
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
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Grid
      container
      direction="row"
      alignContent="center"
      key={props.item.id}
      sx={{
        justifyContent: { xs: "space-around", md: "center" },
        fontSize: { xs: "0.9rem" },
      }}
    >
      <Grid item alignSelf="center">
        <LoadingButton
          color="inherit"
          loading={markAsPendingLoading}
          disabled={markAsPermanentDeletedLoading}
          onClick={async () => {
            setMarkAsPendingLoading(true);
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
      <Grid item xs={6} sx={{ overflowWrap: "break-word" }}>
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
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <DeleteForeverRoundedIcon />
        </LoadingButton>
      </Grid>
      <Grid
        item
        sx={{
          display: { xs: "none" },
        }}
      >
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: "none",
            display: { xs: "none", md: "block" },
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{ p: 1, fontSize: "0.9rem", fontWeight: "300" }}>
            Permanently delete
          </Typography>
        </Popover>
      </Grid>
    </Grid>
  );
}

export default DeletedItemMapping;
