import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Card, Row, Col, Tooltip } from 'antd';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';
// import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MailOutlined, FileOutlined } from '@ant-design/icons';
import "../css/profile.css"
// import { setUser, clearUser } from '../store/userSlice';
// import { Notify } from '../utils/Notification';
// import Appbar from './Appbar';

const { Title, Text } = Typography;

const Profile = () => {
  const [fileData, setFileData] = useState([]);
  const [textData, setTextData] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalTexts, setTotalTexts] = useState(0);
//   const user = useSelector((state) => state.user);

//   const base = process.env.REACT_APP_BASE_API_URL;
//   const token = localStorage.getItem('jwt_token');
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   if (!token) navigate('/');

//   const fileTypeColors = (type) => {
//     switch (type) {
//       case 'py': return '#3776AB';
//       case 'js': return '#F7DF1E';
//       case 'txt': return '#000000';
//       case 'pdf': return '#FF0000';
//       case 'doc': return '#4285F4';
//       default: return '#616161';
//     }
//   };

  const fetchUserStats = async () => {
    // try {
    //   const response = await axios.get(`${base}/Api/v1/user/stats`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   const { file_type_count, text_type_count, total_files, total_texts } = response.data;

    //   const formatData = (data) =>
    //     Object.entries(data || {}).map(([type, count]) => ({
    //       name: type.toUpperCase(),
    //       value: count,
    //       color: fileTypeColors(type),
    //     }));

    //   setFileData(formatData(file_type_count));
    //   setTextData(formatData(text_type_count));
    //   setTotalFiles(total_files || 0);
    //   setTotalTexts(total_texts || 0);
    // } catch (error) {
    //   if (error.response?.data.msg === 'Token has expired') {
    //     localStorage.removeItem('jwt_token');
    //     dispatch(clearUser());
    //     navigate('/');
    //   } else {
    //     Notify({ message: error.message, type: 'error' });
    //   }
    // }
  };

  const fetchUser = async () => {
    // try {
    //   const response = await axios.get(`${base}/Api/v1/user`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   dispatch(setUser(response.data.user));
    // } catch (error) {
    //   if (error.response?.data.msg === 'Token has expired') {
    //     localStorage.removeItem('jwt_token');
    //     dispatch(clearUser());
    //     navigate('/');
    //   } else {
    //     Notify({ message: error.message, type: 'error' });
    //   }
    // }
  };

//   useEffect(() => {
//     if (!user) fetchUser();
//     fetchUserStats();
//   }, [user]);

const dummyUser = {
    username: 'john_doe',
    email: 'john.doe@example.com',
  };

  const dummyFileData = [
    { name: 'PYTHON', value: 10, color: '#3776AB' },
    { name: 'JAVASCRIPT', value: 15, color: '#F7DF1E' },
    { name: 'TEXT', value: 8, color: '#000000' },
    { name: 'PDF', value: 5, color: '#FF0000' },
  ];

  const dummyTextData = [
    { name: 'DOCX', value: 12, color: '#4285F4' },
    { name: 'MARKDOWN', value: 7, color: '#616161' },
    { name: 'HTML', value: 20, color: '#E34C26' },
  ];

  useEffect(() => {
    // Set dummy data
    setFileData(dummyFileData);
    setTextData(dummyTextData);
    setTotalFiles(dummyFileData.reduce((acc, item) => acc + item.value, 0));
    setTotalTexts(dummyTextData.reduce((acc, item) => acc + item.value, 0));
  }, []);

  return (
    <>
      <div className='profile-container'>
        {dummyUser && (
          <div className='profile-title-container'>
            <Title className='profile-title' level={3}>Profile of {dummyUser.username}</Title>
            <Text  className='profile-email' >
              <MailOutlined style={{ marginRight: '8px' }} />
              {dummyUser.email}
            </Text>
          </div>
        )}

        <Row className='chart-row' gutter={24}>
          {fileData.length > 0 && (
            <Col className='chart-container' xs={24} md={12}>
              <Card className='chart-card' title={<div className='chart-card-title'><FileOutlined /> All File Types ({totalFiles})</div>} bordered>
                <PieChart className='chart-pie-chart' width={300} height={300}>
                  <Pie
                    data={fileData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {fileData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </Card>
            </Col>
          )}

          {textData.length > 0 && (
            <Col  className='chart-container' xs={24} md={12}>
              <Card className='chart-card' title={<div className='chart-card-title'><FileOutlined /> All Script Types ({totalTexts})</div>} bordered>
                <PieChart   className='chart-pie-chart' width={300} height={300}>
                  <Pie
                    data={textData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {textData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </>
  );
};

export default Profile;
