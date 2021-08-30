import { makeStyles, createStyles } from "@material-ui/styles";
import { Stack, Button } from "@material-ui/core";

import { isCollectionGroup } from "utils/fns";
import AddRowIcon from "assets/icons/AddRow";

import Filters from "../Filters";
import ImportCSV from "./ImportCsv";
import Export from "./Export";
import TableSettings from "./TableSettings";
import TableLogs from "./TableLogs";
import HiddenFields from "../HiddenFields";
import RowHeight from "./RowHeight";
import Extensions from "./Extensions";
import ReExecute from "./ReExecute";

import { useAppContext } from "contexts/AppContext";
import { useFiretableContext, firetableUser } from "contexts/FiretableContext";
import { FieldType } from "constants/fields";

export const TABLE_HEADER_HEIGHT = 44;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      margin: 0,
      padding: theme.spacing(0, 2, 1.5, 1),
      height: TABLE_HEADER_HEIGHT,

      overflowX: "auto",
      whiteSpace: "nowrap",

      userSelect: "none",

      [theme.breakpoints.down("md")]: {
        width: "100%",
        paddingRight: theme.spacing(1),
      },

      "& > *": { paddingTop: "0 !important" },
    },

    spacer: { width: theme.spacing(2) },
    midSpacer: { minWidth: theme.spacing(8) },
  })
);

/**
 * TODO: Make this properly mobile responsive, not just horizontally scrolling
 */
export default function TableHeader() {
  const { currentUser } = useAppContext();
  const { tableActions, tableState, userClaims } = useFiretableContext();

  const hasDerivatives =
    tableState &&
    Object.values(tableState.columns)?.filter(
      (column) => column.type === FieldType.derivative
    ).length > 0;
  const hasExtensions =
    tableState &&
    tableState.config?.compiledExtension?.replace(/\W/g, "")?.length > 0;

  if (!tableState || !tableState.columns) return null;
  const { columns } = tableState;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        pl: 2,
        pr: 2,
        pb: 1.5,
        height: TABLE_HEADER_HEIGHT,
        overflowX: "auto",
        overflowY: "hidden",
        "& > *": { flexShrink: 0 },
      }}
    >
      {!isCollectionGroup() && (
        /* <ButtonGroup
            variant="contained"
            aria-label="Split button"
            style={{ display: "flex" }}
          > */
        <Button
          onClick={() => {
            const requiredFields = Object.values(columns)
              .map((column) => {
                if (column.config.required) {
                  return column.key;
                }
              })
              .filter((c) => c);
            const initialVal = Object.values(columns).reduce((acc, column) => {
              if (column.config?.defaultValue?.type === "static") {
                return {
                  ...acc,
                  [column.key]: column.config.defaultValue.value,
                };
              } else if (column.config?.defaultValue?.type === "null") {
                return { ...acc, [column.key]: null };
              } else return acc;
            }, {});
            tableActions?.row.add(
              {
                ...initialVal,
                _ft_updatedBy: firetableUser(currentUser),
                _ft_createdBy: firetableUser(currentUser),
              },
              requiredFields
            );
          }}
          variant="contained"
          color="primary"
          startIcon={<AddRowIcon />}
          // sx={{ pr: 1.5 }}
        >
          Add Row
        </Button>
        /* <Button
              // aria-controls={open ? 'split-button-menu' : undefined}
              // aria-expanded={open ? 'true' : undefined}
              // aria-label="select merge strategy"
              aria-haspopup="menu"
              style={{ padding: 0 }}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup> */
      )}
      {/* Spacer */} <div />
      <HiddenFields />
      <Filters />
      <div style={{ flexGrow: 1, minWidth: 64 }} />
      <RowHeight />
      {/* Spacer */} <div />
      {!isCollectionGroup() && <ImportCSV />}
      <Export />
      {userClaims?.roles?.includes("ADMIN") && (
        <>
          {/* Spacer */} <div />
          <Extensions />
          <TableLogs />
          {(hasDerivatives || hasExtensions) && <ReExecute />}
        </>
      )}
      {/* Spacer */} <div />
      <TableSettings />
    </Stack>
  );
}
