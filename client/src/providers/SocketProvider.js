import React from 'react';
import { Config } from '../config';
import socketIOClient from 'socket.io-client';

const ENDPOINT = Config.SOCKET_URL || 'http://127.0.0.1:4001';
const SocketContext = React.createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = React.useState(null);

  const registerEvents = (events) => {
    for (let i = 0; i < events.length; i++) {
      const [event, callback] = events[i];
      socket.on(event, (data) => callback(data));
      // TODO: unregister events
    }
  };

  React.useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, registerEvents }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const { socket, registerEvents } = React.useContext(SocketContext);
  return { socket, registerEvents };
};

export default SocketProvider;
