const LeaderboardCard = ({ user, index }: any) => {
  const isTop3 = index < 3;

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between transition hover:shadow-md gap-2 ${isTop3 ? "bg-gradient-to-r from-indigo-50 to-blue-50 border-blue-200 shadow-sm" : "bg-white hover:bg-gray-50"}`}
    >
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        <div
          className={`font-black text-xl sm:text-2xl w-8 sm:w-10 text-center shrink-0 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-600" : "text-gray-400"}`}
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

        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            {user.username}
          </h2>
          <p className="text-blue-600 font-semibold text-sm">
            XP: {user.totalXP}
          </p>
        </div>
      </div>

      <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-end shrink-0">
        {user.badges?.map((badge: string, i: number) => {
          const badgeName = badge.charAt(0).toUpperCase() + badge.slice(1);
          return (
            <img
              key={i}
              src={`/${badgeName}.png`}
              alt={badgeName}
              title={badgeName}
              className="w-8 h-8 object-contain drop-shadow-sm hover:scale-110 transition-transform cursor-help"
            />
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardCard;
