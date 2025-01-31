import React, {useState} from 'react'
import PropTypes from 'prop-types'
import ToolMenu from '../components/ToolMenu'
import TextEditor from '../components/TextEditor'
import { CommentOutlined, CompressOutlined, ExpandOutlined,  RightCircleOutlined, LeftCircleOutlined } from '@ant-design/icons'
import { Menu, Tooltip, Badge } from 'antd'
import ChatDrawer from '../components/ChatDrawer'
import { EditorThemeProvider } from '../contexts/EditorThemeProvider'
import ProjectTree from '../components/ProjectTree'
import FileUtility from "../utils/FileUtility";
import TerminalStack from '../components/TerminalStack'
import '../css/editorspage.css'


const EditorPage = () => {
    

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
   const [isTreeHidden, setTreeHidden] = useState(false);




   const handleFileIcon = (file) => {
    const { isImg, Icon } = FileUtility.fileIcon(file.filename);

    return (
      <>
        {isImg ? (
          <div className="file-img-icon-cover">
            <img style={{ height: '1.5em', width: '1.5em' }} className="file-img-icon" src={Icon} />
          </div>
        ) : (
          <Icon className="file-ant-icon" style={{ fontSize: '1.5em' }} />
        )}
      </>
    );
  };


   const dummyData = [
    {
      title: 'Project 1',
      key: '0-0',
      children: [
        {
          title: 'src',
          key: '0-0-0',
          children: [
            {
              title: 'App.js',
              key: '0-0-0-0',
              isLeaf: true,
              icon: handleFileIcon({filename : "App.js"})
            },
            {
              title: 'index.js',
              key: '0-0-0-1',
              isLeaf: true,
              icon: handleFileIcon({filename : "index.js"})
            },
          ],
        },
        {
          title: 'public',
          key: '0-0-1',
          children: [
            {
              title: 'index.html',
              key: '0-0-1-0',
              isLeaf: true,
              icon: handleFileIcon({filename : "index.html"})
            },
          ],
        },
      ],
    },
  ];

  

  const handleFileClick = (file) => {
    console.log("File clicked:", file);
  };
  const propsButtons = []

    const chatbutton = (
      <>

    <Tooltip  title={isTreeHidden ? "Show Project Tree" : "Hide Project Tree"}>
          < button className="icon-button"
              onClick={() => setTreeHidden(!isTreeHidden)}
            >
              {isTreeHidden ? <RightCircleOutlined className="button-icon" /> :  <LeftCircleOutlined className="button-icon" />}
            </button>
      </Tooltip >

      {/* <Tooltip  title={collapsed ? "Expand Tool Menu" : "Collapse Tool Menu"}>
      <button  className={`icon-button ${isTreeHidden? 'hidden': ''}`} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <ExpandOutlined className="button-icon" /> : <CompressOutlined  className="button-icon"  />}
      </button>
      </Tooltip> */}
      </>
    )

    propsButtons.push(chatbutton)

  
  return (
    <div className="editorpage">
         <EditorThemeProvider>
        <ToolMenu
        propsButtons={propsButtons}
         >
              <Menu.Item key="chat">
            
            <Tooltip title={`${isChatOpen? "Close": "Open"} Chat Drawer`}>
           
            < button className="icon-button"
            onClick={() => setIsChatOpen(true)}
            >
             <Badge dot={true} size="small">
            <CommentOutlined style={{fontSize:"1.3em"}} className="button-icon" />
            </Badge>
            </button>
             
            </Tooltip>
           
          </Menu.Item>
          

        </ToolMenu>
        <div className="enlargeable-container">

        <div className={`project-tree-slide ${isTreeHidden ? "hidden" : ""}`}>
        <ProjectTree data={dummyData}  collapsed={collapsed}  onFileClick={handleFileClick} />
        </div>
        {/* <div className="editor-container"> */}
        <TextEditor/>
        {/* </div> */}
        </div>
        <TerminalStack  />

        <ChatDrawer open={isChatOpen} onClose={() => setIsChatOpen(!isChatOpen)} />

        </EditorThemeProvider>
    </div>
  )
}

EditorPage.propTypes = {}

export default EditorPage