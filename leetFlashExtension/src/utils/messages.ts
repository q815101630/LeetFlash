export enum MessageType {
  GET_QUESTION_INFO,
  SUBMIT
}

export interface Message {
  info: any;
  msg: MessageType;
}
