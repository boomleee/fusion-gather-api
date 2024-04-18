/* eslint-disable prettier/prettier */

import { Request } from 'express';
 
interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}
 
export default RequestWithRawBody;