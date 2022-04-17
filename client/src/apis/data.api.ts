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

/**
 * patch to update a card, only update three fields: next_rep_date, note, stage
 * @param card card object
 */
export const patchCard = (card: Card): Promise<Card> => {
  return new Promise<Card>((resolve, reject) => {
    client
      .patch(`/card/${card.id}`, card)
      .then((response: AxiosResponse) => resolve(response.data))
      .catch((error) => {
        reject(error);
      });
  });
};

export const moveNextStageCard = (card: Card): Promise<Card> => {
  return new Promise<Card>((resolve, reject) => {
    card.last_rep_date = new Date();
    card.next_rep_date = new Date(
      new Date().getTime() +
        card.total_stages[Math.min(card.stage, card.total_stages.length-1)] *
          86400000
    );
    return patchCard(card)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
