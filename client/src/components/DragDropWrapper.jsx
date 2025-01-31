import React from "react";
import { useDrag, useDrop } from "react-dnd";

const DragDropWrapper = ({ item, onDrop, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "PROJECT_TREE_ITEM",
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: "PROJECT_TREE_ITEM",
    drop: (droppedItem) => onDrop(droppedItem, item),
  }));

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
};

export default DragDropWrapper;
