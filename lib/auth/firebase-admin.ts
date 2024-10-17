import admin from "firebase-admin";
import { cookies } from 'next/headers';
import { decrypt } from "../cookie";
import serviceAccount from "./serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key
    })
  });
}

export default admin;

export const getUserByToken = async (token?: string) => {
  let idToken: string | undefined = token;
  if (!idToken) {
    const cookieStore = cookies();
    idToken = cookieStore.get('firebaseToken')?.value;
  }

  if (!idToken) {
    return;
  }

  const sessionCookie = decrypt(idToken);

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    console.log('verifySessionCookie', decodedClaims)
    return decodedClaims;
  } catch (error) {
    return;
  }
}