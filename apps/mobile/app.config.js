const getApiUrl = () => {
  return (
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    'http://localhost:3000/api'
  );
};

const getWhatsappNumber = () => {
  return (
    process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ||
    process.env.REACT_APP_WHATSAPP_BUSINESS_NUMBER ||
    '+244923123456'
  );
};

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl: getApiUrl(),
    whatsappNumber: getWhatsappNumber()
  }
});
