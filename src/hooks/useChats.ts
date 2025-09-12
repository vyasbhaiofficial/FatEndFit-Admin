"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useChats() {
  const [chats, setChats] = useState<any[]>([]);
  console.log("userchat-------------------------------------------",chats);
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) =>
      setChats(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);
  console.log("userchat1111111111111111111-------------------------------------------",chats);
  return chats;
}
