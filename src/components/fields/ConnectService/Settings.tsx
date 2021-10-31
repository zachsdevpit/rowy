import { TextField, FormControlLabel, Switch, Grid } from "@mui/material";

export default function Settings({ config, handleChange }) {
  return (
    <>
      <TextField
        label="Web service URL"
        name="url"
        value={config.url}
        fullWidth
        onChange={(e) => {
          handleChange("url")(e.target.value);
        }}
      />
      <TextField
        label="Results key path"
        name="resultsKey"
        helperText="Can be specified as a key path"
        placeholder="data.results"
        value={config.resultsKey}
        fullWidth
        onChange={(e) => {
          handleChange("resultsKey")(e.target.value);
        }}
      />
      <TextField
        label="Primary key"
        name="primaryKey"
        value={config.primaryKey}
        fullWidth
        onChange={(e) => {
          handleChange("primaryKey")(e.target.value);
        }}
      />
      <Grid container direction="row" spacing={1}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Title key (optional)"
            name="titleKey"
            value={config.titleKey}
            fullWidth
            onChange={(e) => {
              handleChange("titleKey")(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Subtitle key (optional)"
            name="subtitleKey"
            value={config.subtitleKey}
            fullWidth
            onChange={(e) => {
              handleChange("subtitleKey")(e.target.value);
            }}
          />{" "}
        </Grid>{" "}
      </Grid>
      <FormControlLabel
        control={
          <Switch
            checked={config.multiple}
            onChange={() => handleChange("multiple")(!Boolean(config.multiple))}
            name="select-multiple"
          />
        }
        label="Enable multiple item selection"
        sx={{
          alignItems: "center",
          "& .MuiFormControlLabel-label": { mt: 0 },
        }}
      />
    </>
  );
}
