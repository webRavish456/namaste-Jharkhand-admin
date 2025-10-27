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
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{ 
              textTransform: 'none',
              backgroundColor: '#dadada',
              color: '#000',
              borderColor: '#d1d5db',
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#d2d2d2'
              }
            }}
          >
            {secondaryActionText}
          </Button>
          {primaryAction && (
            <Button 
              onClick={onPrimaryAction} 
              variant="contained"
              sx={{ 
                textTransform: 'none',
                backgroundColor: primaryActionColor === 'error' ? '#dc2626' : '#2b8c54',
                '&:hover': {
                  backgroundColor: primaryActionColor === 'error' ? '#b91c1c' : '#28a745'
                }
              }}
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