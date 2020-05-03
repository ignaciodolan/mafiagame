export const Config = {
  SOCKET_URL:
    process.env.REACT_APP_ENVIRONMENT === 'LIVE'
      ? process.env.REACT_APP_PRODUCTION_SOCKET_URL
      : process.env.REACT_APP_DEV_SOCKET_URL,
};
