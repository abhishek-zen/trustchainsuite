import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Button,
  Checkbox,
  Typography,
  Paper,
  Box,
} from "@mui/material";

const ConsentMatrixDialog = ({
  open,
  onClose,
  onSave,
  editRow,
  setEditRow,
}) => {
  if (!editRow) return null;

  const fields = editRow.fields?.split(",").map((f) => f.trim()) || [];
  const purposes = editRow.purpose?.split(",").map((p) => p.trim()) || [];

  const handleFieldPurposeToggle = (rowIdx, colIdx) => {
    setEditRow((prev) => ({
      ...prev,
      [`fp_${rowIdx}_${colIdx}`]: !prev[`fp_${rowIdx}_${colIdx}`],
    }));
  };

  const handleColumnSelectAll = (colIdx, isChecked) => {
    const updated = { ...editRow };
    fields.forEach((_, rowIdx) => {
      updated[`fp_${rowIdx}_${colIdx}`] = isChecked;
    });
    setEditRow(updated);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: "90%", maxHeight: "90vh" } }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6">Edit Consent Entry</Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Field-Level Consent Matrix
        </Typography>
        <Box sx={{ overflowX: "auto" }}>
          <Paper elevation={3} sx={{ minWidth: "100%" }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: 14 }}>
                    Field
                  </TableCell>
                  {purposes.map((purpose, colIdx) => (
                    <TableCell
                      align="center"
                      key={colIdx}
                      sx={{ whiteSpace: "nowrap", fontSize: 12 }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "text.primary" }}
                      >
                        {purpose}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {fields.map((field, rowIdx) => (
                  <TableRow key={rowIdx} hover>
                    <TableCell sx={{ fontSize: 13 }}>{field}</TableCell>
                    {purposes.map((_, colIdx) => (
                      <TableCell align="center" key={`fp-${rowIdx}-${colIdx}`}>
                        <Checkbox
                          size="small"
                          color="primary"
                          checked={editRow[`fp_${rowIdx}_${colIdx}`] || false}
                          onChange={() =>
                            handleFieldPurposeToggle(rowIdx, colIdx)
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow
                  sx={{
                    borderTop: "3px solid",
                    borderColor: "primary.main",
                    backgroundColor: "grey.50",
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>
                    Select All
                  </TableCell>
                  {purposes.map((_, colIdx) => (
                    <TableCell align="center" key={`selectAll-${colIdx}`}>
                      <Checkbox
                        size="small"
                        color="secondary"
                        checked={fields.every(
                          (_, rowIdx) => editRow[`fp_${rowIdx}_${colIdx}`]
                        )}
                        onChange={(e) =>
                          handleColumnSelectAll(colIdx, e.target.checked)
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsentMatrixDialog;
