import React, { JSX, useEffect, useState } from "react";
import api from "../api/api";
import { useAuthStore } from "../store/authStore";
import { FaRunning, FaSwimmer, FaChess, FaPlus, FaTimes } from 'react-icons/fa';

interface Post {
  id: string;
  body: string;
  type: string;
  coach: {user: {firstName: string, lastName: string}};
  createdAt: string;
}

interface Athlete {
  sports: string[];
  goals: string;
}

const sportIcons: { [key: string]: JSX.Element } = {
  RUNNING: <FaRunning className="mr-2" />,
  SWIMMING: <FaSwimmer className="mr-2" />,
  CHESS: <FaChess className="mr-2" />,
};

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [athleteData, setAthleteData] = useState<Athlete>({ sports: [], goals: "" });


  const user = useAuthStore((state) => state.user);
  const { logout } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/coaches/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchAthleteData = async () => {
      try {
        const response = await api.get(`/athletes/${user?.userId}`);
        setAthleteData(response.data);
      } catch (error) {
        console.error("Error fetching athlete data:", error);
      }
    };

    fetchPosts();
    if (user?.userId) {
      fetchAthleteData();
    }
  }, []);

  const [showSportModal, setShowSportModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState("");

  const handleDeleteSport = async (sportToDelete: string) => {
    try {
      const updatedSports = athleteData.sports.filter(sport => sport !== sportToDelete);
      await api.put(`/athletes/${user?.userId}`, {
        ...athleteData,
        sports: updatedSports
      });
      setAthleteData(prev => ({
        ...prev,
        sports: updatedSports
      }));
    } catch (error) {
      console.error("Error deleting sport:", error);
    }
  };

  const handleAddSport = async () => {
    if (!selectedSport) return;
    try {
      const updatedSports = [...athleteData.sports, selectedSport];
      await api.put(`/athletes/${user?.userId}`, {
        ...athleteData,
        sports: updatedSports
      });
      setAthleteData(prev => ({
        ...prev,
        sports: updatedSports
      }));
      setShowSportModal(false);
      setSelectedSport("");
    } catch (error) {
      console.error("Error adding sport:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-200 p-6">
      <div className="max-w-8xl mx-auto grid grid-cols-[1fr_2fr_1fr] gap-6">
        {/* Left Column - User Profile */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl shadow-lg p-6 h-fit sticky top-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-yellow-200 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-yellow-800">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <h2 className="text-xl font-bold text-yellow-900">{user?.firstName} {user?.lastName}</h2>
          </div>
          
          <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-yellow-800">My Sports</h3>
        <button
          onClick={() => setShowSportModal(true)}
          className="text-yellow-600 hover:text-yellow-800 transition-colors"
        >
          <FaPlus />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {athleteData.sports.map((sport, index) => (
          <span
            key={index}
            className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center"
          >
            {sportIcons[sport]}
            {sport}
            <button
              onClick={() => handleDeleteSport(sport)}
              className="ml-2 hover:text-red-500 transition-colors"
            >
              <FaTimes size={12} />
            </button>
          </span>
        ))}
      </div>

      {showSportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Add Sport</h4>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Select a sport</option>
              <option value="RUNNING">Running</option>
              <option value="SWIMMING">Swimming</option>
              <option value="CHESS">Chess</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSport}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Bio</h3>
            <p className="text-yellow-700 text-sm">
              {athleteData.goals}
            </p>
          </div>
          <div className="mt-auto pt-6 border-t border-yellow-300">
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        </div>

        {/* Middle Column - Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-200 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-yellow-800 font-semibold">
                    {post.coach.user.firstName[0]}{post.coach.user.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-900">
                    {post.coach.user.firstName} {post.coach.user.lastName}
                  </h3>
                  <p className="text-sm text-yellow-600">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-yellow-800 mb-4">{post.body}</p>
              <span className="bg-yellow-200 text-yellow-800 text-sm px-3 py-1 rounded-full">
                {post.type === 'PERSONAL_SESSION' ? 'Individual' : 'Group Session'}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column - Chat */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl shadow-lg p-6 h-[calc(100vh-4rem)] sticky top-6 flex flex-col">
          <h2 className="text-xl font-bold text-yellow-900 mb-4">Messages</h2>
          <div className="flex-1 overflow-y-auto mb-4">
            {/* Chat messages will go here */}
          </div>
          <div className="border-t border-yellow-300 pt-4">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-3 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}