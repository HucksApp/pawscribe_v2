import React,{useState,useEffect} from "react";
import { List } from "antd";
import File from "./File";
import Folder from "./Folder";
import '../css/listview.css'
import { useDashboardContext } from "../contexts/DashboardContext";

const ListViewComponent = ({ Items, onOpen, onCopy, onDelete, onInfo, onAcess, onRename, isFile, onDrop }) => {
    
       const { collapsed, isMenuHidden } = useDashboardContext();


       const handleDrop = (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData("type");

        if (!type) {
            console.error("No data type found in the drag-and-drop event.");
            return;
        }

        try {
            const droppedData = JSON.parse(e.dataTransfer.getData(type));

            if (type === "file" || type === "folder") {
                console.log(`Dropped ${type}:`, droppedData);
                onDrop(droppedData, /*file*/ "item"); // Call onDrop function passed from parent
            } else {
                console.warn("Unhandled drop type:", type);
            }
        } catch (error) {
            console.error("Error parsing dropped data:", error.message);
        }
    };

      
    
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
    
    return(
    <div style={menuOption} className="filelist-container">
    <List
        itemLayout="horizontal"
        dataSource={Items}
        renderItem={(Item) => (
        <List.Item>
            <div className="filelist-filecover">
            {
                isFile ? 
                <File file={Item} onOpen={onOpen} onCopy={onCopy} onDelete={onDelete} onInfo={onInfo} onRename={onRename}  imageSize={"4em"} onDrop={handleDrop}/>
                :
                <Folder folder={Item} onOpen={onOpen} onCopy={onCopy} onDelete={onDelete} onInfo={onInfo} onAcess={onAcess} onRename={onRename}   imageSize={"4em"} onDrop={handleDrop}/>
            }
            <div className="filelist-fileinfo">
                    hhh
            </div>
            </div>
        </List.Item>
        )}
    />
    </div>
)};

export default ListViewComponent;
