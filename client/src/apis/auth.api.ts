import { AxiosError } from "axios";
import client from "./client";

interface UserInterface {
  id: string;
  email: string;
}

export const signInUser = (email: string, password: string) =>
  new Promise<UserInterface>((resolve, reject) => {
    client
      .post("/user/signin", { email, password })
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
      .post("/user/signup", { email, password })
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
      .post("/user/forget-password", { email })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        reject(error.response?.data);
      });
  });
