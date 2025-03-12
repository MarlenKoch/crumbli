import React from "react";
import "./ConfirmationDialog.css";

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-dialog">
        <p>{message}</p>
        <button onClick={onConfirm} className="delete-button">
          Ja
        </button>
        <button onClick={onCancel} className="cancel-button">
          Nein
        </button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
