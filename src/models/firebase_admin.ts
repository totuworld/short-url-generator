import * as admin from "firebase-admin";

interface Config {
  credential: {
    privateKey: string;
    clientEmail: string;
    projectId: string;
  };
}

export default class FirebaseAdmin {
  public static singleInstance: FirebaseAdmin;

  private init = false;

  public static get instance(): FirebaseAdmin {
    if (!FirebaseAdmin.singleInstance) {
      FirebaseAdmin.singleInstance = new FirebaseAdmin();
      FirebaseAdmin.singleInstance.bootstrap();
    }
    return FirebaseAdmin.singleInstance;
  }

  public static init() {
    if (!FirebaseAdmin.singleInstance) {
      FirebaseAdmin.singleInstance = new FirebaseAdmin();
      FirebaseAdmin.singleInstance.bootstrap();
    }
  }

  /** firestore */
  public get Firestore(): FirebaseFirestore.Firestore {
    if (this.init === false) {
      this.bootstrap();
    }
    return admin.firestore();
  }

  private bootstrap(): void {
    if (!!admin.apps.length === true) {
      this.init = true;
      return;
    }
    const config: Config = {
      credential: {
        privateKey: (process.env.privateKey || "").replace(/\\n/g, "\n"),
        clientEmail: process.env.clientEmail || "",
        projectId: process.env.projectId || "",
      },
    };

    admin.initializeApp({
      credential: admin.credential.cert(config.credential),
    });
    console.log("bootstrap end");
  }
}
