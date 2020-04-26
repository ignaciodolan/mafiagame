import React from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://127.0.0.1:4001';
export const SocketContext = React.createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = React.useState(null);

  React.useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
