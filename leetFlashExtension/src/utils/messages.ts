export enum MessageType {
    GET_QUESTION_INFO,
}

export interface Message {
  info: any;
  msg: MessageType;
}
