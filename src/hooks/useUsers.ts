"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useUsers: Starting to fetch users...");
    
    try {
      const unsub = onSnapshot(
        collection(db, "users"), 
        (snap) => {
          console.log("useUsers: Received snapshot with", snap.docs.length, "users");
          const userData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          console.log("useUsers: Processed users:", userData);
          setUsers(userData);
          setLoading(false);
        },
        (err) => {
          console.error("useUsers: Error fetching users:", err);
          setError(err.message);
          setLoading(false);
        }
      );
      
      return () => unsub();
    } catch (err) {
      console.error("useUsers: Setup error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }, []);

  console.log("useUsers: Current state - users:", users.length, "loading:", loading, "error:", error);
  return users;
}
