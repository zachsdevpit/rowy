import { useAtom, useSetAtom } from "jotai";

import { Box, BoxProps, Button } from "@mui/material";
import { AddColumn as AddColumnIcon } from "@src/assets/icons";

import { projectScope, userRolesAtom } from "@src/atoms/projectScope";
import { tableScope, columnModalAtom } from "@src/atoms/tableScope";
import { spreadSx } from "@src/utils/ui";

export interface IFinalColumnHeaderProps extends Partial<BoxProps> {
  focusInsideCell: boolean;
}

export default function FinalColumnHeader({
  focusInsideCell,
  ...props
}: IFinalColumnHeaderProps) {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const openColumnModal = useSetAtom(columnModalAtom, tableScope);

  if (!userRoles.includes("ADMIN")) return null;

  return (
    <Box
      role="columnheader"
      {...props}
      sx={[
        {
          backgroundColor: "background.default",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderLeft: "none",
          borderTopRightRadius: (theme) => theme.shape.borderRadius,
          borderBottomRightRadius: (theme) => theme.shape.borderRadius,

          display: "flex",
          alignItems: "center",

          width: 32 * 3 + 4 * 2 + 10 * 2,
          overflow: "visible",
          px: 1,
        },
        ...spreadSx(props.sx),
      ]}
      className="column-header"
    >
      <Button
        onClick={() => openColumnModal({ type: "new" })}
        variant="contained"
        color="primary"
        startIcon={<AddColumnIcon />}
        style={{ zIndex: 1, flexShrink: 0 }}
        tabIndex={focusInsideCell ? 0 : -1}
      >
        Add column
      </Button>
    </Box>
  );
}
