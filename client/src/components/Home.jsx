// import React, { useEffect, useState } from 'react';
// // import Appbar from './Appbar';
// // import FileList from './FileList';
// // import TextList from './TextList';
// // import Footer from './Footer';
// // import NoContent from './NoContent';
// // import FolderList from './FolderList';
// import { Empty, Layout } from 'antd';
// // import useDashboardStore from '../store/dashboardStore'; // Zustand store
// import '../css/dashboard.css';
// import HeadBar from './HeadBar';
// import MenuComponent from './MenuColumn';

// const { Header, Content, Footer: AntFooter } = Layout;

// const MainDashboard = () => {
//   // State to store the current search value
//   const [searchValue, setSearchValue] = useState('');
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMenuHidden, setMenuHidden] = useState(false);

//   // Zustand state hooks
//   // const { texts, files, folders, stateChanged, setStateChanged } = useDashboardStore();

//   // Effect hook to handle changes in texts, files, and folders
//   // useEffect(() => {
//   //   if (stateChanged) {
//   //     setStateChanged(false); // Reset the state change flag after re-render
//   //   }
//   // }, [texts, files, folders, stateChanged, setStateChanged]);

//   // Check if all content (files, texts, and folders) is empty
//   // const isEmptyContent = [files, texts, folders].every(
//   //   list => Array.isArray(list) && list.length === 0
//   // );

  

//   return (
//     <Layout className="dashboard" style={{height:"100vh"}}>
//       {/* Appbar component with a search bar */}

//       <HeadBar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMenuHidden={isMenuHidden}
//         propsButtons={[]}
//         setMenuHidden={setMenuHidden}
//         setSearchValue={(value) => console.log("Search:", value)}
//       />

//       <div className={`dashboard-slide ${isMenuHidden ? "hidden" : ""}`}>
//         <MenuComponent collapsed={collapsed} />
//       </div>
//       <Content className="dashboard-content">
//         <p style={{color:"red"}}>i am hereeeeee</p>
//         {/* {isEmptyContent ? (
//           <Empty
//             description="No Folder, Files, or script present"
//             style={{ marginTop: '20%' }}
//           />
//         ) : (
//           <> */}
//             {/* Render FileList */}
//             {/* <FileList
//               searchValue={searchValue}
//               setStateChange={setStateChanged}
//               stateChanged={stateChanged}
//             /> */}
//             {/* Render TextList */}
//             {/* <TextList
//               searchValue={searchValue}
//               setStateChange={setStateChanged}
//               stateChanged={stateChanged}
//             /> */}
//             {/* Render FolderList */}
//             {/* <FolderList
//               searchValue={searchValue}
//               setStateChange={setStateChanged}
//               stateChanged={stateChanged}
//             />
//           </>
//         )} */}
         
//       </Content>
//     </Layout>
//   );
// };

// export default MainDashboard;


import React from 'react'

function Home() {
  return (
    <div>
      i love u
    </div>
  )
}

export default Home
