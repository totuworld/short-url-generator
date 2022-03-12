import { firestore } from "firebase-admin";
import { BadRequestError } from "../../utils/error_class/bad_request";
import FirebaseAdmin from "../firebase_admin";
import { InShortUrlServer } from "./interface/in_short_url";
import FieldValue = firestore.FieldValue;

const COLLECTION = "short_url";

async function create(targetUrl: string) {
  const col = FirebaseAdmin.instance.Firestore.collection(COLLECTION);
  const doc = await col.add({
    url: targetUrl,
    count: 0,
    createAt: FieldValue.serverTimestamp(),
  });
  return doc.id;
}

/** 단순히 특정 문서를 읽는다. */
async function read(id: string) {
  const docRef =
    FirebaseAdmin.instance.Firestore.collection(COLLECTION).doc(id);
  const doc = await docRef.get();
  if (doc.exists === false) {
    throw new BadRequestError("존재하지 않는 문서");
  }
  const data = doc.data() as InShortUrlServer;
  return data;
}

async function readAndAddCount(id: string) {
  const docRef =
    FirebaseAdmin.instance.Firestore.collection(COLLECTION).doc(id);
  const info = await FirebaseAdmin.instance.Firestore.runTransaction(
    async (transaction) => {
      const doc = await transaction.get(docRef);
      if (doc.exists === false) {
        throw new BadRequestError("존재하지 않는 문서");
      }
      await transaction.update(docRef, { count: FieldValue.increment(1) });
      return doc.data() as InShortUrlServer;
    }
  );
  return info;
}

const ShortUrlModel = {
  create,
  read,
  readAndAddCount,
};

export default ShortUrlModel;
