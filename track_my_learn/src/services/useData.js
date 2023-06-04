import { useState } from "react";
import { auth, get, ref, db } from "./firebase";

// useData Hook to fetch current user data and set it to state
export const useData = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const snapshot = await get(ref(db, `users/${user.uid}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserData(data);
        setLoading(false);
      } else {
        console.log("No data available");
        setLoading(false);
      }
    }
  });
  return { userData, loading };
};
