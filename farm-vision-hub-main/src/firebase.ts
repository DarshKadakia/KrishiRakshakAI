import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "agrimotorcontrol.firebaseapp.com",
  databaseURL: "https://agrimotorcontrol-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "agrimotorcontrol",
  storageBucket: "agrimotorcontrol.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
