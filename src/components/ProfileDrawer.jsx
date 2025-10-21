import { LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";

export default function ProfileDrawer({ open, onClose }) {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    onClose?.();
    navigate("/");
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-gray-900 shadow-xl transform transition-transform duration-300 z-50 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 flex flex-col h-full text-lg">
        <button
          onClick={onClose}
          className="self-end text-white text-4xl font-extrabold hover:text-red-400 transition-colors"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold mt-4 mb-6 text-white">Profile</h2>

        {!isLoaded ? (
          <div className="text-center py-10">
            <p className="text-lg mb-4 text-white">Loading...</p>
          </div>
        ) : !user ? (
          <div className="text-center py-10">
            <p className="text-lg mb-4 text-white">
              You need to sign in to view your profile
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 bg-green-500 rounded text-white font-semibold"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <>
            {/* Profile Photo */}
            <div className="flex justify-center mb-6">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-red-500"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center border-4 border-red-500">
                  <span className="text-2xl font-bold text-white">
                    {user.firstName?.[0] || user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>

            <p className="text-white">
              <strong>Name:</strong> {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim()}
            </p>
            <p className="text-white">
              <strong>Email:</strong>{" "}
              {user.primaryEmailAddress?.emailAddress}
            </p>
            <p className="text-white">
              <strong>Role:</strong>{" "}
              {user.publicMetadata?.role || "user"}
            </p>

            {["admin", "super-admin"].includes(user.publicMetadata?.role) && (
              <button
                onClick={() => {
                  onClose?.();
                  navigate("/allusers");
                }}
                className="mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded text-lg font-semibold hover:bg-blue-700"
              >
                <Users size={22} /> View Users
              </button>
            )}

            <button
              onClick={handleLogout}
              className="mt-auto flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded text-lg font-semibold hover:bg-red-700"
            >
              <LogOut size={22} /> Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
