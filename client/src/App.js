import "./css/App.css";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./css/App.css";
import "antd/dist/reset.css"; // Reset Ant Design styles
import "./css/theme.css"; // Custom styles
import HomePage from "./pages/HomePage.jsx";
import Footer from "./components/Footer.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import Home from "./components/Home.jsx";
import FilesView from "./components/FilesView.jsx";
import FoldersView from "./components/FoldersView.jsx";
import { pageVariants } from "./theme/theme.js";
import { motion } from "framer-motion";
import Profile from "./components/Profile.jsx";

function App() {
  const [stateChanged, setStateChange] = useState(false); // manually triger state change
  const [editorContent, setEditorContent] = useState("");

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <DashboardPage  />
              </motion.div>
            }
          >
            <Route path="" element={<Home />} />
            <Route path="files" element={<FilesView />} />
            <Route path="folders" element={<FoldersView />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/editor" element={<EditorPage />} />

        </Routes>
      </Router>
      <div className="footer_container">
        <Footer />
      </div>
    </div>
  );
}

export default App;
