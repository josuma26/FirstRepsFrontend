import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuthStore } from "../store/authStore";

interface Post {
  id: string;
  body: string;
  type: string;
  coach: {user: {firstName: string, lastName: string}};
  createdAt: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/coaches/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-200 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-extrabold text-yellow-900 mb-2">Feed</h1>
          <p className="text-yellow-700 text-lg">
            Discover training sessions and updates from coaches
          </p>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200"
              >
                {/* Author Info */}
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-200 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <span className="text-yellow-800 font-semibold">
                      {post.coach.user.firstName?.[0]}{post.coach.user.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-900">
                      {post.coach.user.firstName} {post.coach.user.lastName}
                    </h3>
                    <p className="text-sm text-yellow-600">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-yellow-800 mb-4">{post.body}</p>
                
                {/* Post Type */}
                <div className="flex items-center">
                  <span className="bg-yellow-200 text-yellow-800 text-sm px-3 py-1 rounded-full">
                    {post.type === 'PERSONAL_SESSION' ? 'Individual' : 'Group Session'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-yellow-700">
              No posts available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}