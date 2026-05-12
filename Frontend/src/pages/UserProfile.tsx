import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { getUserProfileByAdmin } from "../services/auth.service";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await getUserProfileByAdmin(userId!);

      setUser(res.user);
    } catch (error: any) {
      console.error("Error fetching user profile", error);

      toast.error(error.response?.data?.message || "Could not load profile.");

      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg font-semibold text-gray-600">
          Loading User Profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg font-semibold text-gray-600">User not found.</p>
      </div>
    );
  }

  const avatarUrl =
    user?.avatar && user.avatar.trim() !== ""
      ? user.avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.username || "U",
        )}&background=EBF4FF&color=1E3A8A&size=256`;

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline font-medium inline-block"
        >
          &larr; Back to Admin
        </button>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>

        {/* Profile Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border flex flex-col sm:flex-row items-center gap-8">
          {/* Avatar */}
          <div>
            <img
              src={avatarUrl}
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.username || "U",
                )}&background=EBF4FF&color=1E3A8A&size=256`;
              }}
              alt="avatar"
              onClick={() => setShowImageModal(true)}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-md bg-gray-100 cursor-pointer hover:scale-105 transition duration-300"
            />

            <p className="text-xs text-center text-gray-400 mt-2">
              Click to view
            </p>
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-3xl font-bold text-gray-900">
              {user.username}
            </h2>

            <p className="text-gray-500 mt-1">{user.email}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold uppercase tracking-wider rounded-md border">
                Role: {user.role || "User"}
              </span>

              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-bold rounded-md border border-blue-200 shadow-sm">
                Total XP: {user.totalXP}
              </span>
            </div>

            {/* Badges */}
            {user.badges?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="text-sm text-gray-500 font-medium py-1">
                  Badges:
                </span>

                {user.badges.map((badge: string, i: number) => (
                  <span
                    key={i}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-5 right-5 bg-white text-black p-2 rounded-full hover:scale-110 transition"
          >
            <X size={24} />
          </button>

          {/* Large Image */}
          <img
            src={avatarUrl}
            alt="Large Profile"
            className="w-[420px] h-[420px] rounded-2xl shadow-2xl object-cover bg-white"
          />
        </div>
      )}
    </>
  );
};

export default UserProfile;
