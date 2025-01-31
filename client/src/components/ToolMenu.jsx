import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Button, Tooltip, Slider, Select } from 'antd';
import {
  AppstoreFilled,
  SaveOutlined,
  CodeOutlined,
  PlayCircleFilled,
  EyeInvisibleFilled,
  ShrinkOutlined,
  ArrowsAltOutlined,
  EyeFilled,
  TeamOutlined,
  FolderOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import Draggable from 'react-draggable';
import  {useEditorThemeProvider} from '../contexts/EditorThemeProvider'
import '../css/toolmenu.css'


const { Option } = Select;

const ToolMenu = ({
  onSaveToBackend,
  onSaveToFile,
  onCollaborate,
  runCode,
  toggleChat,
  toggleDrawer,
  folderId,
  running,
  children,
  propsButtons
}) => {
  const [isFloating, setIsFloating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
   const [dragging, setDragging] = useState(false); // Track dragging state
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Drag position
  const toolbarRef = useRef(null);
  const navigate = useNavigate();
   
  const { options, handleChangeOptions } = useEditorThemeProvider();

  const initialPosition = { x: 0, y: 0 }; // Original docked position

  const toggleFloating = () => {
    if (isFloating) {
      setPosition(initialPosition); // Reset to docked position
    }
    setIsFloating(!isFloating);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleDragStop = (e, data) => {
    const windowHeight = window.innerHeight;
    const buffer = 50; // Snap buffer distance

    let newY = data.y;

    // Snap to bottom
    if (windowHeight - data.y - 50 < buffer) {
      setPosition({ x: data.x, y: windowHeight - 50 }); // Snap to bottom
    } else {
      setPosition({ x: data.x, y: newY }); // Stay floating
    }
  };

  return (
    <>
      {isVisible ? (
        <Draggable
          disabled={!isFloating}
          onStop={handleDragStop}
          position={isFloating ? position : initialPosition}
        >
          <div
          className='tool-menu-cover'
            style={{
              position: isFloating ? 'absolute' : 'relative', // Initially relative at the top
              top: isFloating ? position.y : 'unset', // If floating, set the position dynamically
              bottom: isFloating ? 'unset' : 0, // If docked at the bottom, position it there
              left: isFloating ? position.x : 0,
              width: isFloating ? 'auto' : '100%',
              boxShadow: isFloating ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
            }}
            ref={toolbarRef}
          >
            <Menu
              mode="horizontal"
              className='tool-menu'
            >
              { propsButtons &&
            propsButtons.map((button, index) => (
              <div key={index} className="pros-button-item">
                {button}
              </div>
              ))
          }

              <Menu.Item key="dashboard">
                <Tooltip title="Dashboard">
                < button className="icon-button"
                  onClick={()=> navigate("/dashboard")}
                >
                 <AppstoreFilled style={{fontSize:"1.3em"}} className="button-icon" />
                </button>
                </Tooltip>
              </Menu.Item>


              {folderId && (
                <Menu.Item key="folder" onClick={toggleDrawer}>
                  <FolderOutlined />
                  Project Folder
                </Menu.Item>
              )}


              <Menu.Item 
              // style={{ backgroundColor: "var(--background-default)"}}
              key="language">
                <Select
                 className='tool-menu-select'
                value={options.language}
                onChange={(value) => handleChangeOptions({ language: value })}
                >
                  <Option className='tool-menu-select-option'  value="plaintext">Plain Text</Option>
                  <Option className='tool-menu-select-option' value="javascript">JavaScript</Option>
                  <Option className='tool-menu-select-option' value="python">Python</Option>
                  <Option className='tool-menu-select-option' value="cpp">C++</Option>
                  <Option className='tool-menu-select-option' value="java">Java</Option>
                </Select>
              </Menu.Item>


              <Menu.Item key="fontWeight">
              <Select
                  className='tool-menu-select'
                  value={options.fontWeight}
                  onChange={(value) => handleChangeOptions({ fontWeight: value })}
                >
                  <Option className='tool-menu-select-option'  style={{fontWeight: 'normal' }} value="normal">Normal</Option>
                  <Option className='tool-menu-select-option' style={{fontWeight: 'bold' }} value="bold">Bold</Option>
                  <Option className='tool-menu-select-option' style={{fontWeight: '1000' }} value={1000}>Bolder</Option>
                </Select>
              </Menu.Item>

              <Menu.Item key="fontFamily">
                <Select
                className='tool-menu-select'
                value={options.fontFamily}
                onChange={(value) => handleChangeOptions({ fontFamily: value })}
                >
                  <Option className='tool-menu-select-option'  value="Arial"  style={{ fontFamily: 'Arial', fontWeight: 1000 }}>Arial</Option>
                  <Option className='tool-menu-select-option'  value="Times New Roman" style={{ fontFamily: 'Times New Roman', fontWeight: 1000 }}> Times New Roman</Option>
                  <Option className='tool-menu-select-option'  value="Raleway" style={{ fontFamily: 'Raleway', fontWeight: 1000 }}>Raleway</Option>
                  <Option className='tool-menu-select-option' value="Roboto" style={{ fontFamily: 'Roboto', fontWeight: 1000 }}>Roboto</Option>
                  <Option className='tool-menu-select-option'  value="Sevillana" style={{ fontFamily: 'Sevillana', fontWeight: 1000 }}> Sevillana</Option>
                  <Option className='tool-menu-select-option'  value="Londrina solid" style={{ fontFamily: 'Londrina solid', fontWeight: 1000 }}> Londrina</Option>
                </Select>
              </Menu.Item>

              <Menu.Item key="fontSize">
                <Tooltip title="Font Size">
                <Slider
                    className="icon-button-slidder"
                    min={10}
                    max={40}
                    value={options.fontSize}
                    onChange={(value) => handleChangeOptions({ fontSize: value })}
                  />
                </Tooltip>
              </Menu.Item>


              <Menu.Item key="run">
                <Tooltip title="Run Code">
                  <Button
                    icon={<PlayCircleFilled />}
                    onClick={runCode}
                    loading={running}
                  />
                </Tooltip>
              </Menu.Item>



              <Menu.Item key="terminal">
                <Tooltip title="Open Terminal">
                < button className="icon-button"
                  onClick={onSaveToFile}
                >
                 <CodeOutlined style={{fontSize:"1.3em"}} className="button-icon" />
                </button>
                </Tooltip>
              </Menu.Item>



              <Menu.Item key="save">
                <Tooltip title="Save">
                < button className="icon-button"
                  onClick={onSaveToBackend}
                >
                 <SaveOutlined style={{fontSize:"1.3em"}} className="button-icon" />
                </button>
                </Tooltip>
              </Menu.Item>


              <Menu.Item key="collaborate">
              <Tooltip  title={"Collaborate"}>
              < button className="icon-button"
                  onClick={onCollaborate}
                >
                 <TeamOutlined style={{fontSize:"1.3em"}} className="button-icon" />
                </button>
                </Tooltip >
              </Menu.Item>



              
              <Menu.Item key="float">
              <Tooltip  title={isFloating ? 'Dock' : 'Float'}>
              < button className="icon-button"
                 onClick={toggleFloating}
                >
                {isFloating ? <ShrinkOutlined style={{fontSize:"1.3em"}} className="button-icon"/> : <ArrowsAltOutlined style={{fontSize:"1.3em"}} className="button-icon" /> }
                </button>
                </Tooltip >
              </Menu.Item>




              <Menu.Item key="hide">
              <Tooltip  title={"Hide Toolbar"}>
              < button className="icon-button"
                  onClick={toggleVisibility}
                >
                 <EyeInvisibleFilled className="button-icon" />
                </button>

                </Tooltip >
              </Menu.Item>
              {children}
            </Menu>
          </div>
        </Draggable>
      ) : (
        <Draggable
       handle=".float-button"
       onStart={() => setDragging(true)} // Start dragging
      onDrag={() => setDragging(true)} // Continue dragging
        onStop={(e, data) => {
          setDragging(false)
          // Optionally update position if needed after drag stop
          console.log('Dragged to:', data.x, data.y);
        }}
        >
          <Tooltip title="show ToolBar">
          <Button
            type="secondary"
            icon={<EyeFilled />}
            shape="circle"
            className="float-button"
            style={{
              position: 'fixed',
              bottom: '5vh',
              right:'15vw',
            }}
            onMouseDown={(e) => {
              // Prevent toggling on mouse down when dragging
              if (dragging) {
                e.preventDefault(); // Prevent further handling if dragging
              }
            }}
            onClick={(e) => {
              if (!dragging) {
                toggleVisibility(); // Only toggle if not dragging
              }
            }}
            />
            </Tooltip>
      
      </Draggable>
      )}
    </>
  );
};

export default ToolMenu;
