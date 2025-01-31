import React, { useEffect, useState } from 'react';
import Appbar from './Appbar';
import FileList from './FileList';
import TextList from './TextList';
import Footer from './Footer';
import NoContent from './NoContent';
import FolderList from './FolderList';
import { Empty, Layout } from 'antd';
import useDashboardStore from '../store/dashboardStore'; // Zustand store
import '../css/dashboard.css';

const { Header, Content, Footer: AntFooter } = Layout;

const DashboardPage = () => {
  // State to store the current search value
  const [searchValue, setSearchValue] = useState('');

  // Zustand state hooks
  const { texts, files, folders, stateChanged, setStateChanged } = useDashboardStore();

  // Effect hook to handle changes in texts, files, and folders
  useEffect(() => {
    if (stateChanged) {
      setStateChanged(false); // Reset the state change flag after re-render
    }
  }, [texts, files, folders, stateChanged, setStateChanged]);

  // Check if all content (files, texts, and folders) is empty
  const isEmptyContent = [files, texts, folders].every(
    list => Array.isArray(list) && list.length === 0
  );

  return (
    <Layout className="dashboard">
      {/* Appbar component with a search bar */}
      <Header className="dashboard-header">
        <Appbar setSearchValue={setSearchValue} />
      </Header>

      <Content className="dashboard-content">
        {isEmptyContent ? (
          <Empty
            description="No Folder, Files, or script present"
            style={{ marginTop: '20%' }}
          />
        ) : (
          <>
            {/* Render FileList */}
            <FileList
              searchValue={searchValue}
              setStateChange={setStateChanged}
              stateChanged={stateChanged}
            />
            {/* Render TextList */}
            <TextList
              searchValue={searchValue}
              setStateChange={setStateChanged}
              stateChanged={stateChanged}
            />
            {/* Render FolderList */}
            <FolderList
              searchValue={searchValue}
              setStateChange={setStateChanged}
              stateChanged={stateChanged}
            />
          </>
        )}
      </Content>

      <AntFooter className="dashboard-footer">
        <Footer />
      </AntFooter>
    </Layout>
  );
};

export default DashboardPage;
