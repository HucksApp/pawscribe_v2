import React, { useEffect, useState } from 'react';
import { Button, Select, Tag } from 'antd';
import { useLocation } from 'react-router-dom';
import '../css/searchSelect.css'

const tagRender = (props) => {
  const { label, value, closable, onClose } = props;

  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color="var(--text-secondary)"
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        marginInlineEnd: 4,
      }}
    >
      {label}
    </Tag>
  );
};

const SearchSelect = ({ isFile = true, onChange }) => {
  const location = useLocation(); // Get the current location
  const [selectedValues, setSelectedValues] = useState([]);

  // Options for files and folders
  const folderOptions = [
    { value: 'all_folder', label: 'All' },
    { value: 'project_folder', label: 'Project' },
    { value: 'owned', label: 'Owned' },
    { value: 'shared', label: 'Shared' },
  ];

  const fileOptions = [
    { value: 'all_files', label: 'All Files' },
    { value: 'owned', label: 'Owned' },
    { value: 'shared', label: 'Shared' },
  ];

  // Determine options based on isFile
  const options = isFile ? fileOptions : folderOptions;

  // Clear selected values when the location changes
  useEffect(() => {
    setSelectedValues([]);
    onChange([]); // Notify parent about the cleared state
  }, [location.pathname]); // Run only when the path changes

  const handleChange = (values) => {
    setSelectedValues(values); // Update local state
    onChange(values); // Notify parent about the change
  };

  return (
    <Select
      mode="multiple"
      className='search-select'
      popupClassName="search-select-popup"
      tagRender={tagRender}
      showSearch={false}
      placeholder={'Options'}
      options={options}
      value={selectedValues} // Bind selected values to state
      onChange={handleChange} // Handle changes
    />
  );
};

export default SearchSelect;
