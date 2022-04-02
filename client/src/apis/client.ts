import axios from "axios";
import { getAPIUrl } from "./auth.api";

//create a axios client
const client = axios.create({
  baseURL: getAPIUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default client;
