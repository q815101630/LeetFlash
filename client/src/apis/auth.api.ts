import { AxiosError } from "axios";
import client from "./client";

interface UserInterface {
  id: string;
  email: string;
}

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
      .get("/users/profile")
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