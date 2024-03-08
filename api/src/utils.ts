import { RedisMessageParsed } from './types';

export const decode = (message: any): RedisMessageParsed => {
  const id = message[0];
  const content: Array<string> = message[1];
  const tokensIndexes = {
    type: content.findIndex((x) => x == 'type'),
    requester: content.findIndex((x) => x == 'requester'),
    consumer: content.findIndex((x) => x == 'consumer'),
    payload: content.findIndex((x) => x == 'payload'),
  };
  const consumer = content[tokensIndexes.consumer + 1];
  if (Object.values(tokensIndexes).some((x) => x < 0)) {
    return {
      id,
      consumer,
      type: null,
      requester: null,
      payload: null,
    };
  }
  return {
    id,
    consumer,
    type: parseInt(content[tokensIndexes.type + 1]),
    requester: content[tokensIndexes.requester + 1],
    payload: JSON.parse(content[tokensIndexes.payload + 1]),
  };
};

export function getEnumTypeByValue<T extends { [index: string]: string }>(
  myEnum: T,
  value: string,
): keyof T | null {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] == value);
  return keys.length > 0 ? keys[0] : null;
}
