import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

/**
 * 
 * @params
 * Component (function): Pass in the component that you want to appear inside the dialog box
 * dialogOpen (bool): A state variable passed in from the parent component that
 * setDialogOpen (callback): useState setter that sets the boolean value from the parent
 * handleClose (function): This function handles the closing of the modal

 * @returns  
 * A modal with a component of your choosing inside 
 */

export default function DialogBox({ Component, dialogOpen, setDialogOpen, handleClose }) {
  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        {Component}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}