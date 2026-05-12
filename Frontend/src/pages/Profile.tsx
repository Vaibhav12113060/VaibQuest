import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import {
  getMyProfile,
  changeProfilePicture,
  changePassword,
} from "../services/auth.service";

const Profile = () => {
  const [user, setUser] = useState<any>(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [imgKey, setImgKey] = useState(Date.now());

  const [showImageModal, setShowImageModal] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const response = await getMyProfile();

        if (response.user) {
          setUser(response.user);
          localStorage.setItem("user", JSON.stringify(response.user));
        }
      } catch (error) {
        console.log("Could not sync profile", error);
      }
    };

    fetchLatestProfile();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();

      formData.append("avatar", e.target.files[0]);

      try {
        setAvatarLoading(true);

        const res = await changeProfilePicture(formData);

        toast.success(res.message);

        localStorage.setItem("user", JSON.stringify(res.user));

        setUser(res.user);

        setImgKey(Date.now());
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to update avatar");
      } finally {
        setAvatarLoading(false);
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);

      const res = await changePassword(passwordData);

      toast.success(res.message);

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg font-semibold text-gray-600">
          Loading Profile...
        </p>
      </div>
    );
  }

  const avatarUrl =
    user?.avatar && user.avatar.trim() !== ""
      ? `${user.avatar}?t=${imgKey}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.username || "U",
        )}&background=EBF4FF&color=1E3A8A&size=256`;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Heading */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">My Profile</h1>

          <p className="text-gray-500 mt-2">
            Manage your account information and security settings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-md p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={avatarUrl}
                alt="avatar"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.username || "U",
                  )}&background=EBF4FF&color=1E3A8A&size=256`;
                }}
                onClick={() => setShowProfileOptions((prev) => !prev)}
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl bg-gray-100 cursor-pointer hover:scale-105 transition duration-300"
              />

              <p className="text-xs text-center text-gray-400 mt-2">
                Click profile picture
              </p>

              {/* OPTIONS */}
              {showProfileOptions && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border shadow-xl rounded-2xl overflow-hidden w-56 z-20">
                  <button
                    onClick={() => {
                      setShowImageModal(true);
                      setShowProfileOptions(false);
                    }}
                    className="w-full px-5 py-3 text-left hover:bg-gray-100 transition font-medium"
                  >
                    View Profile Picture
                  </button>

                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowProfileOptions(false);
                    }}
                    className="w-full px-5 py-3 text-left hover:bg-gray-100 transition font-medium border-t"
                  >
                    Upload New Profile
                  </button>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                disabled={avatarLoading}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-bold text-gray-900">
                {user.username}
              </h2>

              <p className="text-gray-500 mt-2 text-lg">{user.email}</p>

              <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
                <span className="px-4 py-2 rounded-xl bg-gray-100 border text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Role: {user.role || "User"}
                </span>

                <span className="px-4 py-2 rounded-xl bg-blue-100 border border-blue-200 text-blue-800 text-sm font-bold shadow-sm">
                  Total XP: {user.totalXP || 0}
                </span>
              </div>

              {user.badges && user.badges.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start items-center">
                  <span className="text-sm text-gray-500 font-medium">
                    Badges:
                  </span>

                  {user.badges.map((badge: string, i: number) => (
                    <span
                      key={i}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase shadow-md"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Security Settings
          </h2>

          <p className="text-gray-500 mb-8">
            Update your password to keep your account secure.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>

              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                placeholder="Enter current password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>

              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={passwordData.confirmNewPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmNewPassword: e.target.value,
                  })
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-5 right-5 bg-white text-black p-2 rounded-full hover:scale-110 transition"
          >
            <X size={24} />
          </button>

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

export default Profile;
