"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket, disconnectSocket } from "@/lib/socket";

export default function Dashboard() {
    const socket = getSocket();
    const router = useRouter();
    const [user, setUser] = useState();
    const [users, setUsers] = useState([]);
    const [usersChat, setUsersChat] = useState([]); //{receiverId, status: false}
    const [usersRequest, setUsersRequest] = useState([]); //{senderId, status: false}
    console.log(users);
    const [roomId, setRoomId] = useState("");
    // const [requestMessage, setRequestMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        socket.on("request-chat", (message) => {
            console.log("Request chat from", message);
        });
        socket.on("receive-request-chat", (senderId) => {
            console.log("Response chat from", senderId);

            console.log(users);

            const user = users.find((user) => user.id === senderId);
            if (!user) {
                console.error("User not found:", senderId);
                return;
            }
            if (user.isReceive) return;

            user.isReceive = true;
            setUsers((prev) => [...prev]);
        });
        socket.on("receive-accept-chat", (data) => {
            const { receiverId, room } = data;
            console.log("Receive accept chat from", receiverId, room);

            const user = users.find((user) => user.id === receiverId);
            if (!user) {
                console.error("User not found:", receiverId);
                return;
            }
            if (user.isChat) return;
            user.isChat = true;
            user.room = room;
            setUsers((prev) => [...prev]);
        });
        socket.on("decline-chat", (receiver_id) => {
            alert("Declined chat from", receiver_id);
            const newUsers = usersChat.filter(
                (user) => user.id !== receiver_id
            );
            setUsersChat(newUsers);
        });
        return () => {
            socket.off("request-chat");
            socket.off("receive-request-chat");
            socket.off("decline-chat");
        };
    }, [users]);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/auth/login");
                return;
            }
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const user = res.data;
                if (user.statusCode === 200) {
                    setUser(user);
                    localStorage.setItem("user", JSON.stringify(user));
                }
                const getUsersOnline = async () => {
                    const res = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/users/online`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (res.data.statusCode === 200) {
                        setUsers(
                            res.data.users
                                ?.filter((item) => item.id !== user.id)
                                ?.map((item) => ({
                                    ...item,
                                    isRequest: false,
                                    isReceive: false,
                                    isChat: false,
                                    room: {},
                                }))
                        );
                    }
                };
                getUsersOnline();
                socket.emit("me", user);
                return () => {
                    socket.off("me");
                };
            } catch (error) {
                router.push("/auth/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // const getRoom = async (senderId, receiverId) => {};

    const handleChat = (receiverId) => {
        const user = users.find((user) => user.id === receiverId);

        router.push(`/chat/${user.room.id}`);
    };

    const handleRequest = (receiverId) => {
        const user = users.find((user) => user.id === receiverId);
        if (user?.isRequest) {
            alert("You already have a chat request with this user.");
            return;
        }
        console.log(user);

        user.isRequest = true;
        socket.emit("request-chat", receiverId);
        setUsers((prev) => [...prev]);
    };

    const handleAccept = (senderId) => {
        // TODO: Accept chat request
        console.log("Accept chat request");
        socket.emit("accept-chat", senderId);

        // router.push(`/chat/${roomId}`);
    };

    const handleDecline = (senderId) => {
        const newUser = usersRequest.filter(
            (user) => user.senderId !== senderId
        );
        setUsersRequest(newUser);
        socket.emit("decline-chat", senderId);
    };

    const logout = () => {
        socket.emit("logout");
        disconnectSocket();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/auth/login");
    };

    // if (loading) return <p>Loading...</p>;

    return (
        <main className="max-w-4xl p-8 mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                    <h1 className="text-3xl font-bold text-white text-center">
                        🎯 Dashboard
                    </h1>
                    <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <p className="text-xl text-white">
                            Welcome,{" "}
                            <span className="font-semibold">{user?.name}</span>!
                        </p>
                        <button
                            onClick={logout}
                            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg 
                                     hover:bg-red-600 transform hover:scale-105 
                                     transition-all duration-200 font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Chat Requests Section */}
                {users && users.some((u) => u.isReceive) && (
                    <div className="p-6 border-b">
                        <div className="bg-yellow-50 rounded-xl overflow-hidden">
                            <div className="bg-yellow-100 px-4 py-2">
                                <h3 className="text-yellow-800 font-medium">
                                    📬 New Chat Requests
                                </h3>
                            </div>
                            <ul className="divide-y divide-yellow-100">
                                {users
                                    .filter((u) => u.isReceive)
                                    .map((u) => (
                                        <li
                                            key={u.id}
                                            className="p-4 flex items-center justify-between"
                                        >
                                            <span className="text-gray-700">
                                                {u.display_name} wants to chat
                                                with you
                                            </span>
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleAccept(u.id)
                                                    }
                                                    className="px-4 py-1.5 bg-green-500 text-white rounded-lg
                                                             hover:bg-green-600 transition-colors"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDecline(u.id)
                                                    }
                                                    className="px-4 py-1.5 bg-gray-500 text-white rounded-lg
                                                             hover:bg-gray-600 transition-colors"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Online Users Section */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        🟢 Online Users
                    </h2>
                    {users.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                            <p className="text-gray-500 italic">
                                No users online
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100 bg-gray-50 rounded-xl overflow-hidden">
                            {users.map((u) => (
                                <li
                                    key={u.id}
                                    className="flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-green-500 text-lg">
                                            ●
                                        </span>
                                        <span className="font-medium text-gray-700">
                                            {u.display_name}
                                        </span>
                                    </div>
                                    {u.isChat ? (
                                        <button
                                            onClick={() => handleChat(u.id)}
                                            className="px-4 py-1.5 bg-blue-500 text-white rounded-lg
                                                     hover:bg-blue-600 transition-all duration-200
                                                     transform hover:scale-105"
                                        >
                                            Chat
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleRequest(u.id)}
                                            className={`px-4 py-1.5 rounded-lg transition-all duration-200
                                                      transform hover:scale-105 ${
                                                          u.isRequest
                                                              ? "bg-gray-500 text-white hover:bg-gray-600"
                                                              : "bg-blue-500 text-white hover:bg-blue-600"
                                                      }`}
                                        >
                                            {u.isRequest
                                                ? "Requested"
                                                : "Request"}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
}

