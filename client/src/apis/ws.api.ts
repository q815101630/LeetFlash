import { io } from "socket.io-client";
import { getSocketUrl } from "./auth.api";

export const createSocket = () =>
  io(getSocketUrl(), {
    withCredentials: true,
  });
