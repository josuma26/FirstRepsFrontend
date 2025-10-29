import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { createPost, getCoachPosts, getCoachMessages } from "../api/api";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [textValue, setTextValue] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");

  useEffect(() => {
    getCoachPosts(user?.userId).then((res) => setPosts(res));
    getCoachMessages(user?.userId).then((res) => setMessages(res));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost(user?.userId, textValue, dropdownValue);
    setTextValue("");
    setDropdownValue("");
    getCoachPosts(user?.userId).then((res) => setPosts(res)); // refresh posts
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-200 flex justify-center py-10 px-4 text-yellow-900">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* LEFT COLUMN — Posts and Form */}
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-2xl shadow-lg p-8">
            <h1 className="text-4xl font-extrabold text-yellow-900 mb-2">
              Coach Dashboard
            </h1>
            <p className="text-yellow-700 text-lg">Welcome back {user?.firstName}! Let's get started.</p>
          </div>

          {/* Create Post Form */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-yellow-900 text-center">
              Get discovered! Create a post
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Enter text..."
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                className="border border-yellow-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <select
                value={dropdownValue}
                onChange={(e) => setDropdownValue(e.target.value)}
                className="border border-yellow-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Select a type of post</option>
                <option value="PERSONAL_SESSION">Individual</option>
                <option value="GROUP_SESSION">Group session</option>
              </select>
              <button
                type="submit"
                className="bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Posts Section */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-yellow-900">
              Your Posts
            </h2>
            {posts.length > 0 ? (
              <div className="flex flex-col gap-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-5 border border-yellow-300 rounded-xl bg-white/80 shadow-md hover:shadow-lg transition-all"
                  >
                    <p className="font-semibold text-yellow-900 mb-2">
                      {post.text}
                    </p>
                    <p className="text-sm text-yellow-800 mb-1">
                      Type: <span className="font-medium">{post.type}</span>
                    </p>
                    <p className="text-sm text-yellow-800 mb-1">
                      Description: {post.body}
                    </p>
                    <p className="text-xs text-yellow-600">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-yellow-600 text-center py-6">No posts yet</p>
            )}
          </div>


          {/* Logout */}
          <div className="text-center">
            <button
              onClick={logout}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN — Chats */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl shadow-lg p-8 h-fit sticky top-8">
          <h2 className="text-2xl font-bold mb-6 text-yellow-900">Chats</h2>
          {messages.length > 0 ? (
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 border border-yellow-300 rounded-lg bg-white/80 shadow-md hover:bg-yellow-100 transition"
                >
                  <p className="font-medium text-yellow-900">
                    {msg.senderName}
                  </p>
                  <p className="text-sm text-yellow-800">{msg.content}</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    {new Date(msg.sentAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-yellow-700 text-center py-10">No chats yet</p>
          )}
        </div>
      </div>
    </div>
  );
}