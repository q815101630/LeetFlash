import { AxiosError } from "axios";
import client from "./client";
export const signInUser = (email: string, password: string) =>
  new Promise<{ id: string; email: string }>((resolve, reject) => {
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
  new Promise<{ id: string; email: string }>((resolve, reject) => {
    client
      .post("/user/signup", { email, password })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        reject(error.response?.data);
      });
  });

      