import { notification } from 'antd';

const Notify = ({ title, message, type }) => {
  const config = {
    message:  title,
    description: message,
    placement: 'topRight',
    duration: 5, // Auto-close after 5 seconds
    showProgress: true,
    pauseOnHover: true,
  };

  switch (type) {
    case 'success':
      notification.success(config);
      break;
    case 'error':
      notification.error(config);
      break;
    case 'warn':
      notification.warning(config);
      break;
    case 'info':
      notification.info(config);
      break;
    default:
      notification.open({
        ...config,
        message: 'Notification',
      });
  }
};

export default Notify;
