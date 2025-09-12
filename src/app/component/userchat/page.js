"use client";

import { useState, useRef, useEffect } from "react";
import { FiSend, FiMic, FiX, FiSearch } from "react-icons/fi";
import { db } from "../../../lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import {
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useMessages } from "../../../hooks/useMessages";
import {
  generateUrl,
  getCommands,
  API_BASE,
  API_HOST,
} from "../../../Api/AllApi";

import Loader from "../../../utils/loader";

const ADMIN_ID = "689edec7c67887dc81f51934";

export default function ChatPage() {
  const { role, branches } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [commands, setCommands] = useState([]); // Dynamic commands from API
  const [filteredCommands, setFilteredCommands] = useState([]);

  const messagesEndRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState(
    "68a865b5e8bdc5659057f397_689edec7c67887dc81f51934"
  );
  const messages = useMessages(chatId);
  const messageInputRef = useRef(null);

  useEffect(() => {
    console.log("Commands fetched:", commands);
  }, [commands]);

  // Normalize audio URL to always resolve under /api/v1/uploads
  const resolveAudioUrl = (input) => {
    if (!input) return input;
    if (typeof input === "object") {
      const candidate =
        input.url ||
        input.path ||
        input.fileUrl ||
        input.Location ||
        (input.data && (input.data.url || input.data.path)) ||
        null;
      if (candidate) input = candidate;
    }
    let url = String(input).trim().replace(/\\/g, "/");
    if (/^https?:\/\//i.test(url)) return url;

    // If backend gave '/api/v1/uploads/...'
    if (/^\/?api\/v1\/uploads\//i.test(url)) {
      const rel = url.startsWith("/") ? url : `/${url}`;
      return `${API_HOST}${rel}`; // add host in front
    }

    // If string contains '/uploads/' anywhere, force under API_BASE (keeps /api/v1)
    const uploadsIdx = url.toLowerCase().indexOf("/uploads/");
    if (uploadsIdx !== -1) {
      const relFromUploads = url.slice(uploadsIdx); // starts with '/uploads/...'
      return `${API_BASE.replace(/\/$/, "")}${relFromUploads}`;
    }

    // If it starts with 'uploads/' (no leading slash)
    if (/^uploads\//i.test(url)) {
      return `${API_BASE.replace(/\/$/, "")}/${url}`;
    }

    // Bare filename -> put under /api/v1/uploads
    const lastSlash = url.lastIndexOf("/");
    const fileOnly = lastSlash !== -1 ? url.slice(lastSlash + 1) : url;
    return `${API_BASE.replace(/\/$/, "")}/uploads/${fileOnly}`;
  };

  // Fetch commands from API
  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const data = await getCommands(); // call your existing function
        setCommands(data); // set the commands in state
      } catch (err) {
        console.error("Failed to fetch commands:", err);
      }
    };
    fetchCommands();
  }, []);

  // Load users from chats collection
  useEffect(() => {
    const loadUsersAndSelect = async () => {
      try {
        setLoading(true);
        const chatsSnapshot = await getDocs(collection(db, "chats"));
        const chatDocs = chatsSnapshot.docs;

        const userMap = new Map();
        chatDocs.forEach((chatDoc) => {
          const chatData = chatDoc.data();
          if (chatData.userId && chatData.userName) {
            userMap.set(chatData.userId, {
              id: chatData.userId,
              name: chatData.userName,
              role: chatData.userArea || "User",
              email: chatData.userEmail || "",
              lastMessage: chatData.lastMessage,
              updatedAt: chatData.updatedAt,
            });
          }
        });

        let usersList = Array.from(userMap.values());
        // If subadmin, filter by branch if chat data includes branch info
        if (role === "subadmin" && Array.isArray(branches) && branches.length) {
          usersList = usersList.filter((u) => {
            // chatData may carry userBranchId on chats; fallback to allow if unknown
            return !u.branchId || branches.includes(u.branchId);
          });
        }
        setUsers(usersList);

        const currentChat = await getDoc(doc(db, "chats", chatId));
        const currentChatData = currentChat.data();
        if (currentChatData && currentChatData.userId) {
          const currentUser = usersList.find(
            (u) => u.id === currentChatData.userId
          );
          setSelectedUser(
            currentUser || {
              id: currentChatData.userId,
              name: currentChatData.userName || "User",
              role: currentChatData.userArea || "User",
            }
          );
        }
        setLoading(false);
      } catch (e) {
        console.error("Error loading users:", e);
        setLoading(false);
      }
    };
    loadUsersAndSelect();
  }, []);

  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.role].some((val) =>
      val?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (value.startsWith("/")) {
      setShowSuggestions(true);
      const searchTerm = value.slice(1).toLowerCase(); // Remove '/'
      setFilteredCommands(
        commands.filter((cmd) => cmd.title?.toLowerCase().includes(searchTerm))
      );
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectCommand = async (cmd) => {
    console.log("audioUrl:", cmd.audioUrl);
    console.log("cmd:", cmd);
    if (cmd.type === "text") {
      setNewMessage("/" + cmd.title + " ");
      messageInputRef.current?.focus(); // Focus input so user can continue typing
    } else if (cmd.type === "audio") {
      if (cmd.audioUrl) {
        // Send audio directly (already implemented)
        const nowMs = Date.now();
        const messageId = `${nowMs}${Math.floor(Math.random() * 1000)}`;
        const chatRef = doc(db, "chats", chatId);

        const msg = {
          id: messageId,
          chatId,
          senderId: ADMIN_ID,
          senderName: "You",
          type: "voice",
          text: null,
          audioUrl: resolveAudioUrl(cmd.audioUrl),
          duration: null,
          status: "sent",
          uploadProgress: 100,
          createdAt: nowMs,
        };
        console.log("audioUrl---------msg---------:", msg.audioUrl);
        await addDoc(collection(chatRef, "messages"), msg);
        await updateDoc(chatRef, { lastMessage: msg, updatedAt: nowMs });
      } else {
        startVoiceRecording();
      }
    }
    setShowSuggestions(false);
  };

  // Send Voice Message
  const sendVoiceMessage = async () => {
    if (!audioBlob || !selectedUser || isSending) return;
    const nowMs = Date.now();
    const messageId = `${nowMs}${Math.floor(Math.random() * 1000)}`;
    const chatRef = doc(db, "chats", chatId);

    try {
      setIsSending(true);
      const formData = new FormData();
      formData.append("image", audioBlob, `voice_message_${messageId}.webm`);
      const audioUrl = resolveAudioUrl(await generateUrl(formData));

      const msg = {
        id: messageId,
        chatId,
        senderId: ADMIN_ID,
        senderName: "You",
        type: "voice",
        text: null,
        audioUrl,
        duration: null,
        status: "sent",
        uploadProgress: 100,
        createdAt: nowMs,
      };

      await addDoc(collection(chatRef, "messages"), msg);
      await updateDoc(chatRef, { lastMessage: msg, updatedAt: nowMs });

      setAudioBlob(null);
    } catch (err) {
      console.error("Voice send error:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Send Text Message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    const nowMs = Date.now();
    const messageId = `${nowMs}${Math.floor(Math.random() * 1000)}`;
    const chatRef = doc(db, "chats", chatId);

    const msg = {
      id: messageId,
      chatId,
      senderId: ADMIN_ID,
      senderName: "You",
      type: "text",
      text: newMessage,
      audioUrl: null,
      duration: null,
      status: "sending",
      uploadProgress: 1,
      createdAt: nowMs,
    };

    setNewMessage("");

    await addDoc(collection(chatRef, "messages"), msg);
    await updateDoc(chatRef, { lastMessage: msg, updatedAt: nowMs });
  };

  // Recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime =
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus") &&
        "audio/webm;codecs=opus";
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      recorder.onstop = () => {
        setAudioBlob(new Blob(chunks, { type: mime }));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setIsListening(true);
    } catch (err) {
      setPermissionError(true);
    }
  };

  const stopVoiceRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
    setIsListening(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[100%] bg-gradient-to-r from-yellow-50 mx-18 via-yellow-100 to-yellow-50">
      {/* Sidebar */}
      <div className="w-[28%] bg-white shadow-lg flex flex-col overflow-hidden">
        <div className="py-6 px-4">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 p-2 rounded-full border border-yellow-300 focus:ring-2 focus:ring-yellow-400 text-sm shadow-sm transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <Loader />
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  setChatId(`${user.id}_${ADMIN_ID}`);
                }}
                className={`flex items-center gap-4 p-3 my-3  cursor-pointer rounded-xl mx-3 mb-2 transition-all duration-200 ${
                  selectedUser?.id === user.id
                    ? "bg-yellow-100 shadow-inner"
                    : "hover:bg-yellow-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                    selectedUser?.id === user.id
                      ? "bg-yellow-500"
                      : "bg-gradient-to-br from-yellow-400 to-yellow-600"
                  }`}
                >
                  {user.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.lastMessage?.type === "voice"
                      ? "🎤 Voice message"
                      : user.lastMessage?.text || "No messages"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-gray-400">No users found</p>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-md border-b border-yellow-200">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-xl">
                  {selectedUser.name[0]}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">{selectedUser.name}</p>
                <p className="text-xs text-gray-600">{selectedUser.role}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === ADMIN_ID
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative px-4 py-6 rounded-2xl shadow-md max-w-[70%] transition-all duration-300 ${
                        msg.senderId === ADMIN_ID
                          ? "bg-gradient-to-r from-yellow-200 to-primary text-gray-900 hover:shadow-lg"
                          : "bg-gray-100 text-gray-900 hover:shadow-sm"
                      }`}
                    >
                      {msg.type === "voice" ? (
                        <audio
                          src={resolveAudioUrl(msg.audioUrl)}
                          controls
                          className="max-w-full rounded-lg"
                        />
                      ) : (
                        <p className="text-sm break-words">{msg.text}</p>
                      )}
                      <span
                        className={`absolute text-[10px] text-gray-500 bottom-1 right-2 ${
                          msg.senderId === ADMIN_ID ? "text-right" : "text-left"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm">
                  No messages yet
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center p-4 gap-3 border-t bg-yellow-50">
              <button
                onClick={recording ? stopVoiceRecording : startVoiceRecording}
                className={`p-3 rounded-full transition-all duration-200 ${
                  recording
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "hover:bg-yellow-200"
                }`}
              >
                <FiMic size={22} />
              </button>
              <div className="relative w-full">
                <input
                  ref={messageInputRef}
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 p-3 rounded-full bg-white border border-yellow-300 focus:ring-2 focus:ring-yellow-400 text-sm w-full shadow-sm transition-all placeholder-gray-400"
                />

                {showSuggestions && (
                  <div className="absolute bottom-14 left-0 w-full bg-white border border-yellow-200 rounded-xl shadow-lg max-h-52 overflow-y-auto animate-fade-in origin-top transform transition-all">
                    {filteredCommands.length > 0 ? (
                      filteredCommands.map((cmd, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectCommand(cmd)}
                          className="p-3 cursor-pointer hover:bg-yellow-50 hover:pl-4 transition-all duration-200 ease-out border-b last:border-none border-gray-100"
                        >
                          <p className="font-medium text-sm text-gray-800">
                            {cmd.title} {cmd.type === "audio" && "🎤"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {cmd.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="p-3 text-sm text-gray-500">
                        No matching commands
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={audioBlob ? sendVoiceMessage : sendMessage}
                disabled={isSending || (!audioBlob && !newMessage.trim())}
                className={`p-3 rounded-full text-white transition-all duration-200 ${
                  audioBlob
                    ? "bg-yellow-400 hover:bg-yellow-500"
                    : newMessage.trim()
                    ? "bg-yellow-400 hover:bg-yellow-500"
                    : "bg-gray-300"
                }`}
              >
                <FiSend size={22} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-gray-400 gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M21 16.5a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5V7a2.5 2.5 0 012.5-2.5h13A2.5 2.5 0 0121 7v9.5z"
              />
            </svg>
            <p className="text-lg font-medium">
              Select a user to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
