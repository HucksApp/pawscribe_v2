import React from "react";
import "../css/footer.css";
import ClockDigital from "./ClockDigital";
import { Switch, Tooltip } from "antd";
import { MoonOutlined, MoonFilled } from "@ant-design/icons";
import { useTheme } from "../contexts/ThemeProvider";

const Footer = () => {
  const { themeMode, toggleTheme } = useTheme(); // Use the theme context

  return (
    <div className="footer_cover">
      <div className="switch_container">
        <div>
          Pawscribe - Seamlessly Share, Collaborate, and Manage Your Documents.
        </div>

        <div className="footer_switch">
          <div className="theme_switch">
            <Tooltip
              title={`Switch to ${
                themeMode === "light" ? "dark" : "light"
              } mode`}
            >
              <Switch
                onChange={toggleTheme} // Toggle the theme
                checked={themeMode === "dark"} // Reflect current theme
                checkedChildren={
                  <MoonOutlined
                    style={{ color: "var(--button-tertiary-bg-color)" }}
                  />
                }
                unCheckedChildren={
                  <MoonFilled
                    style={{ color: "var(--button-primary-bg-color)" }}
                  />
                }
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="copywright">
          <div>
            <span>&#169; HucksWare 2025</span>
            <span>All rights reserved</span>
          </div>
        </div>
        <div className="concepts">pawscribe</div>
        <div className="clock">
          <ClockDigital />
        </div>
      </div>
    </div>
  );
};

export default Footer;
