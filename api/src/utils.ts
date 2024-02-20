import { RedisMessage, RedisMessageType } from './types';

export const decode = (message: any): RedisMessage => {
  const parsed = JSON.parse(message);
  return {
    requester: parsed.requester,
    type: parsed.type,
    payload: {
      success: parsed.payload.success,
      errors: parsed.payload.errors,
      data: parsed.payload.data,
      cached: parsed.payload.cached,
    },
  };
};

export const encode_channel = (type: RedisMessageType, requester: string) =>
  `computed${type}_${requester}`;
