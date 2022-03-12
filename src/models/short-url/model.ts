import { firestore } from "firebase-admin";
import { nanoid } from "nanoid";
import { BadRequestError } from "../../utils/error_class/bad_request";
import { CreateError } from "../../utils/error_class/create_error";
import FirebaseAdmin from "../firebase_admin";
import { InShortUrlServer } from "./interface/in_short_url";
import FieldValue = firestore.FieldValue;

const COLLECTION = "short_url";
const ID_LENGTH = 5;

async function create(targetUrl: string) {
  const col = FirebaseAdmin.instance.Firestore.collection(COLLECTION);
  let id = nanoid(ID_LENGTH);
  const docId = await FirebaseAdmin.instance.Firestore.runTransaction(
    async (transaction) => {
      async function createData(targetId: string) {
        await transaction.create(col.doc(targetId), {
          url: targetUrl,
          count: 0,
          createAt: FieldValue.serverTimestamp(),
        });
      }
      const doc = await transaction.get(col.doc(id));
      if (doc.exists === false) {
        await createData(id);
        return id;
      }
      id = nanoid(ID_LENGTH);
      const doc2nd = await transaction.get(col.doc(id));
      if (doc2nd.exists === false) {
        await createData(id);
        return id;
      }
      id = nanoid(ID_LENGTH);
      const doc3rd = await transaction.get(col.doc(id));
      if (doc3rd.exists === true) {
        throw new CreateError("지속적으로 중복 id가 생성되고 있습니다.");
      }
      await createData(id);
      return id;
    }
  );
  return docId;
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
