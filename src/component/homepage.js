import { FormControl, Grid, TextField } from "@mui/material";

function Homepage() {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item textAlign="center">
        <FormControl>
          <p>Email Address</p>
          <TextField
            required
            id="filled-required"
            label="Required"
            variant="filled"
            type="email"
            size="small"
          />
          <p>Password</p>
          <TextField
            required
            id="filled-required"
            label="Required"
            variant="filled"
            type="password"
            size="small"
          />
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default Homepage;
