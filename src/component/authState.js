import { auth } from "../utils/init";
import { useState, useEffect } from "react";

export function useAuthStateChecker() {
  const [isUserExist, setIsUserExist] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setIsUserExist(user);
      console.log("Auth state checker");
      console.log(user);
    });
  }, []);

  return isUserExist;
}
