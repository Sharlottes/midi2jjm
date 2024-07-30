import { blue, blueDark } from "@radix-ui/colors";
import { style } from "@vanilla-extract/css";

export const dropZone = style({
  border: `2px dashed ${blue.blue11}`,
  borderRadius: "8px",
  width: "100%",
  height: "100px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  userSelect: "none",
  backgroundColor: blueDark.blue12,
  transition: "background-color 0.2s",
  selectors: {
    "&:hover": {
      backgroundColor: blueDark.blue11,
    },
  },
  padding: "8px",
});
