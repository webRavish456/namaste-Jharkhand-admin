import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CommonDialog = ({
  open,
  onClose,
  dialogTitle,
  dialogContent,
  maxWidth = "md",
  fullWidth = true,
  showCloseButton = true,
  primaryAction = false,
  primaryActionText = "Save",
  primaryActionColor = "primary",
  onPrimaryAction,
  secondaryActionText = "Cancel",
  showActions = true,
}) => {
  

 

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby="common-dialog-title"
      aria-describedby="common-dialog-description"
    >
      {open && (
        <DialogTitle 
          id="common-dialog-title" 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            padding: "1.5rem 1.5rem 0 1.5rem",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#1e293b"
          }}
        >
          {dialogTitle}
          {showCloseButton && (
            <IconButton 
              onClick={onClose} 
              sx={{ 
                color: "#6b7280",
                "&:hover": {
                  backgroundColor: "#f3f4f6"
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}

      {open && (
        <DialogContent sx={{ padding: "1.5rem" }}>
          {dialogContent}
        </DialogContent>
      )}

      {showActions && open && (
        <DialogActions sx={{ padding: "0 1.5rem 1.5rem 1.5rem" }}>
          <Button onClick={onClose} color="inherit">
            {secondaryActionText}
          </Button>
          {primaryAction && (
            <Button 
              onClick={onPrimaryAction} 
              color={primaryActionColor}
              variant="contained"
            >
              {primaryActionText}
            </Button>
          )}
        </DialogActions>
      )}

    </Dialog>
  );
};

export default CommonDialog;