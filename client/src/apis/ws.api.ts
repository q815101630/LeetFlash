import { io } from "socket.io-client";

export const createSocket = () =>
  io(`${process.env.REACT_APP_SOCKET_URL}`, {
    withCredentials: true,
  });
