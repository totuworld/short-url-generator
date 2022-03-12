import { firestore } from "firebase-admin";

export interface InShortUrlBase {
  /** 이동할 url */
  url: string;
  /** 얼마나 호출되었는지 숫자 */
  count: number;
}

export interface InShortUrlServer extends InShortUrlBase {
  createAt: firestore.Timestamp;
}
