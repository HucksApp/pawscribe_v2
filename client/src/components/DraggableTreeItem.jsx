import React from "react";
import { useDrag, useDrop } from "react-dnd";

const DraggableTreeItem = ({ item, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "treeItem",
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: "treeItem",
    drop: (draggedItem) => {
      if (item.type === "folder") {
        onDrop(draggedItem, item);
      }
    },
  }));

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {item.name || item.filename}
    </div>
  );
};

export default DraggableTreeItem;
