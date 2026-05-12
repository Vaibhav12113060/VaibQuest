// import { useEffect, useState, useRef } from "react";
// import { X, ShieldCheck } from "lucide-react";
// import toast from "react-hot-toast";

// import {
//   getMyProfile,
//   changeProfilePicture,
//   changePassword,
// } from "../services/auth.service";

// const Profile = () => {
//   const [user, setUser] = useState<any>(() => {
//     try {
//       const savedUser = localStorage.getItem("user");
//       return savedUser ? JSON.parse(savedUser) : null;
//     } catch {
//       return null;
//     }
//   });

//   const [passwordData, setPasswordData] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmNewPassword: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [avatarLoading, setAvatarLoading] = useState(false);
//   const [imgKey, setImgKey] = useState(Date.now());

//   const [showImageModal, setShowImageModal] = useState(false);
//   const [showProfileOptions, setShowProfileOptions] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const fetchLatestProfile = async () => {
//       try {
//         const response = await getMyProfile();

//         if (response.user) {
//           setUser(response.user);
//           localStorage.setItem("user", JSON.stringify(response.user));
//         }
//       } catch (error) {
//         console.log("Could not sync profile", error);
//       }
//     };

//     fetchLatestProfile();
//   }, []);

//   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const formData = new FormData();

//       formData.append("avatar", e.target.files[0]);

//       try {
//         setAvatarLoading(true);

//         const res = await changeProfilePicture(formData);

//         toast.success(res.message);

//         localStorage.setItem("user", JSON.stringify(res.user));

//         setUser(res.user);

//         setImgKey(Date.now());
//       } catch (error: any) {
//         toast.error(error.response?.data?.message || "Failed to update avatar");
//       } finally {
//         setAvatarLoading(false);
//       }
//     }
//   };

//   const handlePasswordSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (passwordData.newPassword !== passwordData.confirmNewPassword) {
//       toast.error("New passwords do not match!");
//       return;
//     }

//     if (passwordData.newPassword.length < 6) {
//       toast.error("New password must be at least 6 characters long.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await changePassword(passwordData);

//       toast.success(res.message);

//       setPasswordData({
//         oldPassword: "",
//         newPassword: "",
//         confirmNewPassword: "",
//       });
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to change password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <p className="text-lg font-semibold text-gray-600">
//           Loading Profile...
//         </p>
//       </div>
//     );
//   }

//   const avatarUrl =
//     user?.avatar && user.avatar.trim() !== ""
//       ? `${user.avatar}?t=${imgKey}`
//       : `https://ui-avatars.com/api/?name=${encodeURIComponent(
//           user.username || "U",
//         )}&background=EBF4FF&color=1E3A8A&size=256`;

//   return (
//     <>
//       <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
//         {/* Heading */}
//         <div className="mb-4">
//           <h1 className="text-4xl font-extrabold text-gray-900">My Profile</h1>

//           <p className="text-gray-500 mt-2 text-lg">
//             Manage your account information and security settings.
//           </p>
//         </div>

//         {/* Profile Card */}
//         <div className="bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden">
//           {/* Cover Banner */}
//           <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
//             <div className="absolute inset-0 bg-black/10"></div>
//           </div>

//           <div className="px-6 sm:px-10 pb-8 sm:pb-10 flex flex-col md:flex-row gap-6 sm:gap-8 relative">
//             {/* Avatar */}
//             <div className="relative -mt-16 sm:-mt-24 z-10 flex flex-col items-center md:items-start">
//               <img
//                 src={avatarUrl}
//                 alt="avatar"
//                 onError={(e) => {
//                   e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                     user.username || "U",
//                   )}&background=EBF4FF&color=1E3A8A&size=256`;
//                 }}
//                 onClick={() => setShowProfileOptions((prev) => !prev)}
//                 className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 sm:border-[6px] border-white shadow-xl bg-gray-100 cursor-pointer hover:scale-105 transition duration-300"
//               />

//               <p className="text-xs text-center text-gray-500 mt-3 font-medium">
//                 Click profile picture
//               </p>

//               {/* OPTIONS */}
//               {showProfileOptions && (
//                 <div className="absolute top-[85%] sm:top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-3 bg-white border shadow-xl rounded-2xl overflow-hidden w-56 z-20">
//                   <button
//                     onClick={() => {
//                       setShowImageModal(true);
//                       setShowProfileOptions(false);
//                     }}
//                     className="w-full px-5 py-3 text-left hover:bg-gray-100 transition font-medium"
//                   >
//                     View Profile Picture
//                   </button>

//                   <button
//                     onClick={() => {
//                       fileInputRef.current?.click();
//                       setShowProfileOptions(false);
//                     }}
//                     className="w-full px-5 py-3 text-left hover:bg-gray-100 transition font-medium border-t"
//                   >
//                     Upload New Profile
//                   </button>
//                 </div>
//               )}

//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleAvatarChange}
//                 className="hidden"
//                 accept="image/png, image/jpeg, image/jpg"
//                 disabled={avatarLoading}
//               />
//             </div>

//             {/* User Info */}
//             <div className="flex-1 pt-2 sm:pt-4 text-center md:text-left">
//               <h2 className="text-4xl font-bold text-gray-900">
//                 {user.username}
//               </h2>

//               <p className="text-gray-500 mt-1 text-lg font-medium">
//                 {user.email}
//               </p>

//               <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
//                 <span className="px-4 py-2 rounded-xl bg-gray-100 border text-sm font-semibold text-gray-700 uppercase tracking-wide">
//                   Role: {user.role || "User"}
//                 </span>

//                 <span className="px-4 py-2 rounded-xl bg-blue-100 border border-blue-200 text-blue-800 text-sm font-bold shadow-sm">
//                   Total XP: {user.totalXP || 0}
//                 </span>
//               </div>

//               {user.badges && user.badges.length > 0 && (
//                 <div className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start items-center">
//                   <span className="text-sm text-gray-500 font-medium">
//                     Badges:
//                   </span>

//                   {user.badges.map((badge: string, i: number) => {
//                     const badgeName =
//                       badge.charAt(0).toUpperCase() + badge.slice(1);
//                     return (
//                       <img
//                         key={i}
//                         src={`/${badgeName}.png`}
//                         alt={badgeName}
//                         title={badgeName}
//                         className="w-10 h-10 object-contain drop-shadow-sm hover:scale-110 transition-transform cursor-help"
//                       />
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Password Section */}
//         <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-8 sm:p-10 relative overflow-hidden">
//           {/* Background Watermark Icon */}
//           <div className="absolute -top-10 -right-10 text-gray-100/50 pointer-events-none">
//             <ShieldCheck size={280} />
//           </div>

//           <div className="relative z-10">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">
//               Security Settings
//             </h2>

//             <p className="text-gray-500 mb-8 text-lg">
//               Update your password to keep your account secure.
//             </p>

//             <form
//               onSubmit={handlePasswordSubmit}
//               className="space-y-6 max-w-xl"
//             >
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Current Password
//                 </label>

//                 <input
//                   type="password"
//                   value={passwordData.oldPassword}
//                   onChange={(e) =>
//                     setPasswordData({
//                       ...passwordData,
//                       oldPassword: e.target.value,
//                     })
//                   }
//                   className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
//                   placeholder="Enter current password"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   New Password
//                 </label>

//                 <input
//                   type="password"
//                   value={passwordData.newPassword}
//                   onChange={(e) =>
//                     setPasswordData({
//                       ...passwordData,
//                       newPassword: e.target.value,
//                     })
//                   }
//                   className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
//                   placeholder="Enter new password"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Confirm New Password
//                 </label>

//                 <input
//                   type="password"
//                   value={passwordData.confirmNewPassword}
//                   onChange={(e) =>
//                     setPasswordData({
//                       ...passwordData,
//                       confirmNewPassword: e.target.value,
//                     })
//                   }
//                   className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
//                   placeholder="Confirm new password"
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:bg-gray-400"
//               >
//                 {loading ? "Updating..." : "Update Password"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* IMAGE MODAL */}
//       {showImageModal && (
//         <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
//           <button
//             onClick={() => setShowImageModal(false)}
//             className="absolute top-5 right-5 bg-white text-black p-2 rounded-full hover:scale-110 transition"
//           >
//             <X size={24} />
//           </button>

//           <img
//             src={avatarUrl}
//             alt="Large Profile"
//             className="w-full max-w-[420px] aspect-square rounded-2xl shadow-2xl object-cover bg-white"
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default Profile;

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
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // OUTSIDE CLICK CLOSE DROPDOWN (FIX)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowProfileOptions(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
      toast.error("Passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
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
        <p className="text-gray-600 font-semibold">Loading Profile...</p>
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
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-2">
            Manage your account, avatar and security settings.
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white border rounded-3xl shadow-md overflow-visible relative">
          {/* BANNER */}
          <div className="h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden rounded-t-3xl">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="px-6 sm:px-10 pb-10 flex flex-col md:flex-row gap-8">
            {/* AVATAR */}
            <div
              ref={dropdownRef}
              className="relative -mt-14 flex flex-col items-center md:items-start z-20"
            >
              <img
                src={avatarUrl}
                alt="avatar"
                onClick={() => setShowProfileOptions((v) => !v)}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md cursor-pointer hover:shadow-lg transition"
              />

              <p className="text-xs text-gray-500 mt-2">Click avatar to edit</p>

              {/* DROPDOWN */}
              {showProfileOptions && (
                <div className="absolute top-full mt-3 bg-white border shadow-xl rounded-xl w-52 overflow-hidden z-[9999]">
                  <button
                    onClick={() => {
                      setShowImageModal(true);
                      setShowProfileOptions(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 text-sm"
                  >
                    View Image
                  </button>

                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowProfileOptions(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 border-t text-sm"
                  >
                    Upload New
                  </button>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/* INFO */}
            <div className="flex-1 pt-4 text-center md:text-left">
              <h2 className="text-3xl font-semibold text-gray-900">
                {user.username}
              </h2>

              <p className="text-gray-500 text-sm">{user.email}</p>

              <div className="flex gap-3 mt-5 justify-center md:justify-start">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-800">
                  {user.role || "User"}
                </span>

                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                  XP: {user.totalXP || 0}
                </span>
              </div>

              {/* BADGES */}
              {user.badges?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
                  {user.badges.map((b: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PASSWORD */}
        <div className="bg-white border rounded-3xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-xl">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-100"
              required
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-100"
              required
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirmNewPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmNewPassword: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-100"
              required
            />

            <button
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-5 right-5 bg-white p-2 rounded-full"
          >
            <X />
          </button>

          <img
            src={avatarUrl}
            className="w-[400px] h-[400px] object-cover rounded-2xl"
          />
        </div>
      )}
    </>
  );
};

export default Profile;
