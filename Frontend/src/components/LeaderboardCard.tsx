const LeaderboardCard = ({ user, index }: any) => {
  const isTop3 = index < 3;

  return (
    <div
      className={`p-5 rounded-2xl border flex items-center justify-between transition hover:shadow-md ${isTop3 ? "bg-gradient-to-r from-indigo-50 to-blue-50 border-blue-200 shadow-sm" : "bg-white hover:bg-gray-50"}`}
    >
      <div className="flex items-center gap-5">
        <div
          className={`font-black text-2xl w-10 text-center ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-600" : "text-gray-400"}`}
        >
          #{index + 1}
        </div>
        <img
          src={
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=EBF4FF&color=1E3A8A`
          }
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=EBF4FF&color=1E3A8A`;
          }}
          alt="avatar"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm bg-gray-100"
        />

        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
          <p className="text-blue-600 font-semibold text-sm">
            XP: {user.totalXP}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap justify-end max-w-[50%]">
        {user.badges?.map((badge: string, i: number) => (
          <span
            key={i}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardCard;
