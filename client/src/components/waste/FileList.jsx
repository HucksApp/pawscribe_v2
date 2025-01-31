// import React, { useEffect, useState } from 'react';
// import { /*Row, Col,*/ Layout, /*Pagination, Empty, notification, Button, Spin*/ } from 'antd';
// import { useNavigate, useLocation } from 'react-router-dom';
// // import FileView from './FileView';
// import FileStats from './FileStats';
// // import AddFile from './AddFile';

// import PropTypes from 'prop-types';

// const { Content } = Layout;

// const FileList = ({ searchValue, stateChanged, setStateChange }) => {
//   const [filteredFiles, setFilteredFiles] = useState([]);
//   const base = process.env.REACT_APP_BASE_API_URL;
//   const token = localStorage.getItem('jwt_token');
//   const location = useLocation();
//   const { pathname } = location;
//   const navigate = useNavigate();
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [publicCount, setPublicCount] = useState(0);
//   const [privateCount, setPrivateCount] = useState(0);

  // if (!token) navigate('/');

  // const openNotification = (message, type) => {
  //   notification[type]({
  //     message,
  //   });
  // };

  // const fetchFiles = async (page = 1) => {
  //   try {
  //     const response = await axios.get(`${base}/Api/v1/files/all`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       params: {
  //         page,
  //         per_page: 5, // Adjust as needed
  //       },
  //     });

  //     const { files, publicCount, privateCount, total, pages } = response.data;
  //     dispatch(setFiles(files));
  //     setFilteredFiles(files);
  //     setTotal(total);
  //     setPublicCount(publicCount);
  //     setPrivateCount(privateCount);
  //     setTotalPages(pages);
  //   } catch (error) {
  //     if (error.response?.data?.msg === 'Token has expired') {
  //       localStorage.removeItem('jwt_token');
  //       dispatch(clearUser());
  //       navigate('/');
  //     } else {
  //       openNotification(error.message, 'error');
  //     }
  //   }
  // };

  //  const handleNext = () => {
  // //   setPage((prev) => Math.min(prev + 1, totalPages));
  //  };

  // const handlePrev = () => {
  //   // setPage((prev) => Math.max(prev - 1, 1));
  // };

  // useEffect(() => {
  //   if (stateChanged) {
  //     fetchFiles(page);
  //     setStateChange(false); // Reset stateChanged
  //   }
  // }, [stateChanged, page]);

  // useEffect(() => {
  //   fetchFiles(page); // Fetch files on component mount
  // }, [page]);

  // useEffect(() => {
  //   if (searchValue) {
  //     setFilteredFiles(
  //       files.filter((file) =>
  //         file.filename.toLowerCase().includes(searchValue.toLowerCase())
  //       )
  //     );
  //   } else {
  //     setFilteredFiles(files);
  //   }
  // }, [searchValue, files]);

  // if (!files) return <Spin size="large" />;

  // if (files.length === 0 && pathname === '/files') {
  //   return (
  //     <Content style={{ padding: '20px', textAlign: 'center' }}>
  //       <AddFile setStateChange={setStateChange} />
  //       <Empty description="No File is Present" />
  //     </Content>
  //   );
  // }

//   return (
//     <div style={{color:"red"}}>
//       <p style={{color:"red"}}>now noe</p>
//     <Layout>
//        <p style={{color:"red"}}>now noe</p>
//       <Content style={{ padding: '20px' }}>
//         <FileStats
//           files={filteredFiles}
//           handleNext={handleNext}
//           handlePrev={handlePrev}
//           page={page}
//           total={total}
//           privateCount={privateCount}
//           publicCount={publicCount}
//           totalPages={totalPages}
//         />
//         <p style={{color:"red"}}>now noe</p>
//         {/* <Row gutter={[16, 16]}>
//           <Col span={24}>
//             <AddFile setStateChange={setStateChange} />
//           </Col> */}
//           {/* {filteredFiles.map((file) => (
//             <Col key={file.id} xs={24} sm={12} md={8} lg={6} xl={4}>
//               <FileView file={file} setStateChange={setStateChange} />
//             </Col>
//           ))}
//         </Row> */}
//         {/* <Pagination
//           current={page}
//           total={total}
//           pageSize={5}
//           onChange={(page) => setPage(page)}
//           style={{ marginTop: '20px', textAlign: 'center' }}
//         /> */}
//       </Content>
//     </Layout>
//     </div>
//   );
// };

// FileList.propTypes = {
//   searchValue: PropTypes.string.isRequired,
//   stateChanged: PropTypes.bool.isRequired,
//   setStateChange: PropTypes.func.isRequired,
// };

// export default FileList;
import React from 'react'
import PropTypes from 'prop-types'
 import FileStats from './FileStats';

const FileList = props => {
  return (
    <div>
       <FileStats
          files={[]}
          handleNext={()=>console.log("mee")}
          handlePrev={()=>console.log("mee")}
          page={1}
          total={9}
          privateCount={1}
          publicCount={1}
          totalPages={4}
        />
    </div>
  )
}

FileList.propTypes = {

}

export default FileList
