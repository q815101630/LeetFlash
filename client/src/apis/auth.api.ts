import { AxiosError } from "axios";
import client from "./client";

interface UserInterface {
  id: string;
  email: string;
}

export const getAPIUrl = () => {
  return `${
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BASE_URL
      : process.env.REACT_DEPLOY_APP_BASE_URL
  }`;
};

export const getSocketUrl = () => {
  return `${
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_SOCKET_URL
      : process.env.REACT_DEPLOY_APP_SOCKET_URL
  }`;
};

export const signInUser = (email: string, password: string) =>
  new Promise<UserInterface>((resolve, reject) => {
    client
      .post("/auth/signin", { email, password })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        reject(error.response?.data);
      });
  });

export const signUpUser = (email: string, password: string) =>
  new Promise<UserInterface>((resolve, reject) => {
    client
      .post("/auth/signup", { email, password })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        reject(error.response?.data);
      });
  });

export const signOutUser = () =>
  new Promise<UserInterface>((resolve, reject) => {
    client
      .post("/auth/signout")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        reject(error.response?.data);
      });
  });

export const checkProfile = () =>
  new Promise<UserInterface>((resolve, reject) => {
    client
      .get("/user/profile")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        reject(error.response?.data);
      });
  });

export const sendResetPassword = (email: string) =>
  new Promise<UserInterface>((resolve, reject) => {
    client
      .post("/auth/forget-password", { email })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        reject(error.response?.data);
      });
  });

export const sendGoogleLogin = (token: string) =>
  new Promise<UserInterface>((resolve, reject) => {
    client
      .post("/auth/google-auth", {
        token,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        reject(error.response?.data);
      });
  });

export const generateApiToken = () =>
  new Promise<string>((resolve, reject) => {
    client
      .post("/auth/generate-api-token")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        reject(error.response?.data);
      });
  });
