import { createHash } from 'crypto';
import getMAC from 'getmac';

export const RESPONSE_STREAM = 'responses';
export const REQUEST_STREAM = 'requests';
export const CONSUMER_GROUP = process.env.BACKEND_CG || 'backend_cg';
export const BLOCK_MS_TIMEOUT = 3000;
export const CONSUMER_NAME = createHash('sha256')
  .update(getMAC())
  .digest('hex');

export const STREAM_INDEX = 0;
export const MESSAGE_LIST_INDEX = 1;
export const REGISTRY_METADATA_KEY = '__api--registry__';
