import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../components/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setMessages,
  setUsers,
  setError,
} from "../store/slices/messageSlice";

function Message() {
  const dispatch = useDispatch();
  const { messages, users, loading } = useSelector((state) => state.messages);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUsers = async (currentUserId) => {
    try {
      const usersCollection = collection(db, "Users");
      const snapshot = await getDocs(usersCollection);
      const usersList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.id !== currentUserId);
      dispatch(setUsers(usersList));
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching users:", error);
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUsers(user.uid);
      } else {
        setCurrentUser(null);
        dispatch(setLoading(false));
      }
    });

    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const messagesCollection = collection(db, "messages");
    const q = query(
      messagesCollection,
      where("participants", "array-contains", currentUser.uid),
      orderBy("timestamp", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (msg) =>
            (msg.senderId === currentUser.uid &&
              msg.receiverId === selectedUser.id) ||
            (msg.senderId === selectedUser.id &&
              msg.receiverId === currentUser.uid),
        );
      dispatch(setMessages(messagesList));

      messagesList.forEach(async (msg) => {
        if (msg.receiverId === currentUser.uid && !msg.read) {
          const msgRef = doc(db, "messages", msg.id);
          await updateDoc(msgRef, { read: true });
        }
      });
    });

    return unsubscribe;
  }, [selectedUser, currentUser, dispatch]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    try {
      const messagesCollection = collection(db, "messages");

      await addDoc(messagesCollection, {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        receiverId: selectedUser.id,
        receiverName: selectedUser.name || selectedUser.email,
        text: messageText,
        timestamp: serverTimestamp(),
        read: false,
        participants: [currentUser.uid, selectedUser.id],
      });

      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please log in to access messages
          </h2>
          <a href="/login" className="btn btn-primary">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[90vh] bg-base-100">
      <div className="w-80 border-r border-base-300 flex flex-col">
        <div className="p-4 border-b border-base-300">
          <h1 className="text-2xl font-bold text-primary">Messages</h1>
        </div>

        <div className="p-4 border-b border-base-300">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-4 border-b border-base-200 text-left transition hover:bg-base-200 ${
                  selectedUser?.id === user.id
                    ? "bg-primary text-primary-content"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-10">
                      <span className="text-xs">
                        {(user.name || user.email)[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs opacity-70 truncate">{user.email}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-base-300 bg-base-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10">
                    <span className="text-xs">
                      {(selectedUser.name ||
                        selectedUser.email)[0].toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-lg">
                    {selectedUser.name || selectedUser.email}
                  </h2>
                  <p className="text-xs opacity-70">Active now</p>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm btn-circle">
                <Icon icon="mdi:information-outline" width="24" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === currentUser.uid
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.senderId === currentUser.uid
                          ? "bg-primary text-primary-content rounded-br-none"
                          : "bg-base-200 text-base-content rounded-bl-none"
                      }`}
                    >
                      <p className="break-words">{message.text}</p>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {new Date(
                          message.timestamp?.toDate(),
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-base-300 bg-base-100">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="input input-bordered flex-1"
                />
                <button type="submit" className="btn btn-primary btn-square">
                  <Icon icon="mdi:send" width="24" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Icon
                icon="mdi:message-outline"
                width="64"
                className="mx-auto mb-4 opacity-50"
              />
              <p className="text-lg">Select a user to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
