import React, { useState } from "react";
import { Pagination, Tooltip } from "antd";
import { LeftSquareFilled, RightSquareFilled, UpSquareOutlined, DownSquareOutlined } from "@ant-design/icons";
import "../css/pagination.css";

const CustomPagination = ({ total, pageSize, currentPage, onPageChange, children }) => {
  const [isHidden, setIsHidden] = useState(false);

  const togglePagination = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div  className={`pagination-wrapper ${isHidden ? "hidden" : ""}`}>
      <div className={`pagination-container ${isHidden ? "hidden" : ""}`}>
        <Pagination
          className="pagination-comp"
          total={total}
          pageSize={pageSize}
          current={currentPage}
          onChange={onPageChange}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} files`}
          itemRender={(current, type, originalElement) => {
            if (type === "prev") {
              return (
                <span>
                  <LeftSquareFilled />
                </span>
              );
            }
            if (type === "next") {
              return (
                <span>
                  <RightSquareFilled className="button-icon" />
                </span>
              );
            }
            return originalElement;
          }}
        />
      </div>
      <div className="side-page-button">

      <Tooltip placement="left" title={isHidden ? "Show Pagination" : "Hide Pagination"}>
        <button className="toggle-button" onClick={togglePagination}>
          {isHidden ? (
            <DownSquareOutlined style={{ color: "var(--text-primary)" }} />
          ) : (
            <UpSquareOutlined style={{ color: "var(--text-primary)" }} />
          )}
        </button>
      </Tooltip>

      {children}
      </div>
    </div>
  );
};

export default CustomPagination;


