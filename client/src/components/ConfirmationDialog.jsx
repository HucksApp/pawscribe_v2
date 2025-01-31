import React from 'react';
import { Modal, Typography, Button } from 'antd';
import PropTypes from 'prop-types';
import { CloseCircleFilled, DeleteFilled } from '@ant-design/icons';
import '../css/dialog.css';

const { Text } = Typography;

const ConfirmationDialog = ({ 
  visible, 
  type, 
  title, 
  onConfirm, 
  onCancel 
}) => {
  const isFile = type === 'file';
  
  return (
    <Modal
      className='confimation-dialog-modal'
      title={<div className='confimation-dialog-title'>Delete {isFile ? 'File' : 'Folder'} </div>}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button  icon={<CloseCircleFilled/>} type='default' key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="confirm" 
          type="secondary" 
          icon={<DeleteFilled/>}
          onClick={onConfirm}
        >
          Delete
        </Button>,
      ]}
    >
      <Text className='confimation-dialog-message' >
        Are you sure you want to {title} this {isFile ? 'file' : 'folder'}? 
      </Text>
    </Modal>
  );
};

ConfirmationDialog.propTypes = {
  visible: PropTypes.bool.isRequired, // Whether the dialog is visible
  type: PropTypes.oneOf(['file', 'folder']).isRequired, // Type of item
  name: PropTypes.string.isRequired, // Name of the item to display
  onConfirm: PropTypes.func.isRequired, // Callback when 'Delete' is clicked
  onCancel: PropTypes.func.isRequired, // Callback when 'Cancel' is clicked
};

export default ConfirmationDialog;
