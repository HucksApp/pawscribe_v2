import React, { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { pageVariants, pageTransition } from "../theme/theme.js";
import { ToolFilled } from "@ant-design/icons";
import "../css/dashboard.css";
import { Slider, Tooltip } from "antd";
import HeadBar from "../components/HeadBar";
import NavigationMenu from "../components/MenuNav.jsx";
import { DashboardContext } from "../contexts/DashboardContext.jsx";
import SearchSelect from "../components/SearchSelect.jsx";

import { Layout } from "antd";
const { Content, Footer: AntFooter, Header } = Layout;

const DashboardPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [isMenuHidden, setMenuHidden] = useState(false);
  const [dashImageSize, setDashImageSize] = useState(2);
  const [isFile, setIsFile] = useState(true);
  const [onItemChange, setOnItemChange] = useState(() => () => {});
  const location = useLocation();

  const imageSizePath = ["/dashboard/files", "/dashboard/folders"];
  const extraButtons = [];

  // Handle changes for files and folders
  const handleFileChange = (selectedValues) => {
    console.log("Selected File Options:", selectedValues);
  };

  const handleFolderChange = (selectedValues) => {
    console.log("Selected Folder Options:", selectedValues);
  };

  // Update `isFile` and `onItemChange` dynamically based on route
  useEffect(() => {
    if (location.pathname === "/dashboard/folders") {
      setIsFile(false);
      setOnItemChange(() => handleFolderChange);
    } else {
      setIsFile(true);
      setOnItemChange(() => handleFileChange);
    }
  }, [location.pathname]);

  if (imageSizePath.includes(location.pathname)) {
    const slider = (
      <div className="imageSizeSlider-cover">
        <Slider
          className="imageSizeSlider"
          min={2}
          max={7}
          step={0.5}
          defaultValue={dashImageSize}
          onAfterChange={(value) => setDashImageSize(value)}
        />
      </div>
    );
    extraButtons.push(slider);
  }


  if (location.pathname ===  "/dashboard" ) {
    const projectTool = (
      <Tooltip  title="Project Tools">
        <button  className="icon-button" onClick={() => console.log("now now")}>
          <ToolFilled className="button-icon" />
        </button>
        </Tooltip>
    );
    extraButtons.push(projectTool);
  }

  return (
    <DashboardContext.Provider value={{ collapsed, isMenuHidden, dashImageSize }}>
      <Layout className="dashboard" style={{ height: "100vh" }}>
        <HeadBar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMenuHidden={isMenuHidden}
          propsButtons={extraButtons}
          setMenuHidden={setMenuHidden}
          setSearchValue={(value) => console.log("Search:", value)}
        >
          <SearchSelect isFile={isFile} onChange={onItemChange} />
        </HeadBar>

        <div className={`dashboard-slide ${isMenuHidden ? "hidden" : ""}`}>
          <NavigationMenu collapsed={collapsed} />
        </div>

        <Content className="dashboard-content">
          <div style={{ minHeight: "100vh" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </Content>
      </Layout>
    </DashboardContext.Provider>
  );
};

export default DashboardPage;

