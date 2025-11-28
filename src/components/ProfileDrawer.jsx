import { LogOut, Users, Pencil, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

export default function ProfileDrawer({ open, onClose }) {
  const { signOut, user: clerkUser } = useClerk();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleLogout = async () => {
    await signOut();
    onClose?.();
    navigate("/");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);

      // Upload the image to Clerk
      const formData = new FormData();
      formData.append('file', file);
      
      await clerkUser.setProfileImage({ file });
      
      toast.success('Profile picture updated successfully!');
      
      // Clear the preview after successful upload (Clerk will handle the update)
      setTimeout(() => setPreviewImage(null), 1000);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile picture. Please try again.');
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeProfileImage = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }
    
    try {
      setIsUploading(true);
      await clerkUser.setProfileImage({ file: null });
      toast.success('Profile picture removed successfully!');
    } catch (error) {
      console.error('Error removing profile image:', error);
      toast.error('Failed to remove profile picture. Please try again.');
    } finally {
      setIsUploading(false);
      setPreviewImage(null);
    }
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
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-red-600 rounded text-white font-semibold hover:bg-red-700 transition-colors"
            >
              Sign In with Google
            </button>
          </div>
        ) : (
          <>
            {/* Profile Photo with Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {previewImage ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-500">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : user.imageUrl ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-500">
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center border-4 border-red-500">
                    <span className="text-5xl font-bold text-white">
                      {user.firstName?.[0] || user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                
                {/* Edit Button - Bottom right of the profile picture */}
                <button
                  onClick={handleImageClick}
                  disabled={isUploading}
                  className="absolute -bottom-2 -right-2 p-2 bg-white text-gray-700 rounded-full shadow-md hover:bg-gray-100 transition-all border-2 border-gray-300 z-10"
                  title="Change profile picture"
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Pencil className="w-5 h-5" />
                  )}
                </button>
                
                {/* Remove Button - Top right of the profile picture */}
                {user.imageUrl && !isUploading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProfileImage();
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                    title="Remove profile picture"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
              
              {isUploading && (
                <p className="mt-2 text-sm text-gray-300">Updating profile picture...</p>
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
