import { AxiosResponse } from "axios";
import { Card, Question } from "../interfaces/interfaces";
import client from "./client";
export const fetchQuestions = () =>
  new Promise<Question[]>((resolve, reject) => {
    client
      .get("/question/")
      .then((response: AxiosResponse) => resolve(response.data))
      .catch((error) => {
        reject(error);
      });
  });

export const fetchCards = () =>
  new Promise<Card[]>((resolve, reject) => {
    client
      .get("/card/")
      .then((response: AxiosResponse) => resolve(response.data))
      .catch((error) => {
        reject(error);
      });
  });
