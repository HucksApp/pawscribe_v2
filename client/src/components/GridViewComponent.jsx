import React,{useState,useEffect} from "react";
import { Row, Col } from "antd";
import File from "./File";
import Folder from "./Folder"
import "../css/gridview.css"
import { useDashboardContext } from "../contexts/DashboardContext";

const GridView = ({ Items, onOpen, onCopy, onDelete, onInfo, onAcess, onRename, isFile, onDrop }) =>{ 
    const { collapsed, isMenuHidden } = useDashboardContext();


    // const handleDrop = (e) => {
    //     e.preventDefault();
    //     const type = e.dataTransfer.getData("type");

    //     if (!type) {
    //         console.error("No data type found in the drag-and-drop event.");
    //         return;
    //     }

    //     try {
    //         const droppedData = JSON.parse(e.dataTransfer.getData(type));

    //         if (type === "file" || type === "folder") {
    //             console.log(`Dropped ${type}:`, droppedData);
    //             onDrop(droppedData, /*file*/ "item"); // Call onDrop function passed from parent
    //         } else {
    //             console.warn("Unhandled drop type:", type);
    //         }
    //     } catch (error) {
    //         console.error("Error parsing dropped data:", error.message);
    //     }
    // };
      
      


    const options = {
        marginLeft: "1%",
        width: "70%"
    }
    const [menuOption, setMenuOption] = useState(options);

    useEffect(()=>{
        if (isMenuHidden)
            setMenuOption({...menuOption ,marginLeft : "1%", width:"100%" })
        else if(!isMenuHidden && collapsed)
            setMenuOption({...menuOption ,marginLeft : "7%", width:"90%" })
        else if(!isMenuHidden && !collapsed)
            setMenuOption({...menuOption ,marginLeft : "13%", width:"83%" })
    }, [collapsed, isMenuHidden])

    
    return (
        <div style={menuOption}  className="filegrid-container">
        <Row gutter={[16, 16]}>
            {Items.map((file) => (
            <Col key={file.id} xs={24} sm={12} md={8} lg={6}>
                {isFile ?
                <File file={file} onOpen={onOpen} onCopy={onCopy} onDelete={onDelete} onInfo={onInfo} onRename={onRename} onDrop={onDrop} />:
                <Folder folder={file} onOpen={onOpen} onCopy={onCopy} onDelete={onDelete} onInfo={onInfo} onRename={onRename} onAcess={onAcess} onDrop={onDrop} />
                }
                
            </Col>
            ))}
        </Row>
        </div>)
};

export default GridView;
