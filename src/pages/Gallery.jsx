import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Loader2 } from "lucide-react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { galleryAPI } from "../utils/api";
import { STATIC_IMAGES } from "../constants/staticImages";
import logger from "../utils/logger";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GallerySection() {
  const { user, isLoaded } = useUser();
  const { getToken, isLoaded: authLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState("photos");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [playVideo, setPlayVideo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [modifyMode, setModifyMode] = useState(false);
  const [swapMode, setSwapMode] = useState(false);
  const [swapFirstItem, setSwapFirstItem] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [touchItem, setTouchItem] = useState(null);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [draggedElement, setDraggedElement] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef();

  const normalizedRole = user?.publicMetadata?.role?.toLowerCase().replace(/\s+/g, "") || "none";
  const modalItems = activeTab === "photos" ? images : videos;

  /** Fetch gallery items */
  const fetchGallery = useCallback(async () => {
    try {
      setIsLoading(true);
      logger.info("Fetching gallery items...");
      const response = await galleryAPI.getAll();
      logger.debug("Gallery response:", response);
      const items = response.items || [];
      logger.success("Gallery items found:", items.length);
      setImages(items.filter((i) => i.type === "image"));
      setVideos(items.filter((i) => i.type === "video"));
    } catch (err) {
      logger.error("Failed to fetch gallery:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchGallery(); 
  }, [fetchGallery]);


  /** ESC key closes modals */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
        setPlayVideo(false);
        setMenuOpen(false);
        setDeleteMode(false);
        setModifyMode(false);
        setSwapMode(false);
        setSwapFirstItem(null);
        setSelectedItems([]);
        setEditingItem(null);
        setDraggedItem(null);
        setDragOverItem(null);
        setTouchItem(null);
        setDraggedElement(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /** Click outside menu closes it */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Modal navigation */
  const handleNav = (direction, type) => {
    const items = type === "image" ? images : videos;
    const currentIndex = items.findIndex((i) => i._id === selectedIndex);
    if (currentIndex === -1) return;
    const nextIndex = direction === "prev"
      ? (currentIndex - 1 + items.length) % items.length
      : (currentIndex + 1) % items.length;
    setSelectedIndex(items[nextIndex]._id);
    setPlayVideo(false);
  };

  /** File input */
  const handleFileChange = (e) => setFiles([...e.target.files]);

  /** Upload files */
  const handleUpload = async () => {
    if (!files.length) return;
    
    // Check if Clerk is fully loaded
    if (!isLoaded || !authLoaded) {
      toast.error("Please wait for the page to fully load and try again.");
      return;
    }
    
    // Check if user is authenticated
    if (!user) {
      toast.error("Please sign in to upload files");
      return;
    }

    // Check if getToken function is available
    if (!getToken || typeof getToken !== 'function') {
      logger.error("getToken is not available");
      toast.error("Authentication error. Please refresh the page and try again.");
      return;
    }

    setIsUploading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Unable to get authentication token. Please sign in again.");
        return;
      }

      logger.info("Starting upload with galleryAPI...");
      const response = await galleryAPI.upload(files, token);
      
      const newItems = response.items || [];
      setImages(prev => [...prev, ...newItems.filter(item => item.type === "image")]);
      setVideos(prev => [...prev, ...newItems.filter(item => item.type === "video")]);
      setFiles([]);
      setMenuOpen(false);
      
      logger.success("Upload successful:", newItems.length, "files uploaded");
      toast.success(`Successfully uploaded ${newItems.length} file(s)!`);
    } catch (err) {
      logger.error("Upload error:", err);
      logger.error("Error details:", err.response?.data);
      toast.error("Upload failed: " + (err.response?.data?.message || err.message || "Network error"));
    } finally {
      setIsUploading(false);
    }
  };

  /** Delete logic */
  const toggleDeleteMode = () => {
    setDeleteMode((prev) => !prev);
    setModifyMode(false);
    setSwapMode(false);
    setSelectedItems([]);
  };

  const toggleSelectItem = (id) => {
    if (modifyMode) setSelectedItems([id]);
    else if (!swapMode) setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedItems.length) return toast.error("Select items to delete");
    
    if (!getToken || typeof getToken !== 'function') {
      toast.error("Authentication error. Please refresh the page and try again.");
      return;
    }

    setIsDeleting(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Unable to get authentication token. Please sign in again.");
        return;
      }

      // Delete each selected item
      await Promise.all(
        selectedItems.map((id) => galleryAPI.delete(id, token))
      );

      // Update frontend state
      setImages((prev) => prev.filter((i) => !selectedItems.includes(i._id)));
      setVideos((prev) => prev.filter((i) => !selectedItems.includes(i._id)));

      // Reset UI
      setDeleteMode(false);
      setSelectedItems([]);
      setMenuOpen(false);
      toast.success(`Successfully deleted ${selectedItems.length} item(s)`);
    } catch (err) {
      logger.error(err);
      toast.error("Delete failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsDeleting(false);
    }
  };


  /** Modify logic */
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditTitle(item.name ?? ""); // <-- changed from item.title
    setEditFile(null);
    setModifyMode(false);
    setSwapMode(false);
    setSelectedItems([]);
  };
  const handleEditFileChange = (e) => setEditFile(e.target.files?.[0] || null);

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    if (!getToken || typeof getToken !== 'function') {
      toast.error("Authentication error. Please refresh the page and try again.");
      return;
    }

    setSavingEdit(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Unable to get authentication token. Please sign in again.");
        return;
      }

      const updateData = {};
      if (editTitle) updateData.name = editTitle;
      if (editFile) updateData.file = editFile;
      
      const res = await galleryAPI.update(editingItem._id, updateData, token);
      
      const updated = res.data.item ?? res.data;
      setImages((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
      setVideos((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
      setEditingItem(null);
      setEditTitle("");
      setEditFile(null);
      setSelectedItems([]);
    } catch (err) {
      logger.error("Modify failed:", err);
      toast.error("Modify failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSavingEdit(false);
    }
  };

  /** Drag and drop handlers */
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    setDraggedElement(e.target);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add smooth drag effects
    setTimeout(() => {
      if (e.target) {
        e.target.style.opacity = '0.5';
        e.target.style.transform = 'scale(0.95)';
        e.target.style.transition = 'all 0.2s ease';
      }
    }, 0);
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(item);
    
    // Add hover effect for drop target
    const element = e.currentTarget;
    if (element && draggedItem?._id !== item._id) {
      element.style.transform = 'scale(1.05)';
      element.style.transition = 'transform 0.2s ease';
      element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
    }
  };

  const handleDragLeave = (e) => {
    setDragOverItem(null);
    
    // Remove hover effect with robust null check
    if (e && e.currentTarget) {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.boxShadow = '';
    }
  };

  const handleDrop = async (e, dropItem) => {
    e.preventDefault();
    setDragOverItem(null);
    
    // Remove hover effect
    if (e && e.currentTarget) {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.boxShadow = '';
    }
    
    if (!draggedItem || draggedItem._id === dropItem._id) {
      // Reset dragged element styles
      if (draggedElement) {
        draggedElement.style.opacity = '';
        draggedElement.style.transform = '';
      }
      setDraggedItem(null);
      setDraggedElement(null);
      return;
    }

    const currentItems = activeTab === "photos" ? [...images] : [...videos];
    const draggedIndex = currentItems.findIndex((i) => i._id === draggedItem._id);
    const dropIndex = currentItems.findIndex((i) => i._id === dropItem._id);
    
    if (draggedIndex === -1 || dropIndex === -1) return;
    
    // Add smooth animation
    const draggedEl = document.querySelector(`[data-gallery-item="${draggedItem._id}"]`);
    const dropTargetEl = document.querySelector(`[data-gallery-item="${dropItem._id}"]`);
    
    if (draggedEl && dropTargetEl) {
      // Get positions for smooth animation
      const draggedRect = draggedEl.getBoundingClientRect();
      const dropRect = dropTargetEl.getBoundingClientRect();
      
      // Create temporary element for smooth animation
      const ghostElement = draggedEl.cloneNode(true);
      ghostElement.style.position = 'fixed';
      ghostElement.style.left = draggedRect.left + 'px';
      ghostElement.style.top = draggedRect.top + 'px';
      ghostElement.style.width = draggedRect.width + 'px';
      ghostElement.style.height = draggedRect.height + 'px';
      ghostElement.style.zIndex = '1000';
      ghostElement.style.pointerEvents = 'none';
      ghostElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      ghostElement.style.opacity = '0.8';
      document.body.appendChild(ghostElement);
      
      // Animate to drop position
      setTimeout(() => {
        ghostElement.style.left = dropRect.left + 'px';
        ghostElement.style.top = dropRect.top + 'px';
      }, 10);
      
      // Remove ghost element and update state after animation
      setTimeout(() => {
        document.body.removeChild(ghostElement);
        
        // Remove dragged item and insert it at drop position
        const [removed] = currentItems.splice(draggedIndex, 1);
        currentItems.splice(dropIndex, 0, removed);
        
        // Update state
        activeTab === "photos" ? setImages(currentItems) : setVideos(currentItems);
        
        // Update backend
        updateBackend(currentItems);
        
        // Reset dragged element styles
        if (draggedElement) {
          draggedElement.style.opacity = '';
          draggedElement.style.transform = '';
        }
      }, 300);
    }
    
    setDraggedItem(null);
    setDraggedElement(null);
  };

  const handleDragEnd = () => {
    // Reset all styles
    if (draggedElement) {
      draggedElement.style.opacity = '';
      draggedElement.style.transform = '';
    }
    
    // Remove any remaining hover effects
    document.querySelectorAll('[data-gallery-item]').forEach(element => {
      element.style.transform = '';
      element.style.boxShadow = '';
    });
    
    setDraggedItem(null);
    setDragOverItem(null);
    setDraggedElement(null);
  };

  const updateBackend = async (currentItems) => {
    try {
      if (getToken && typeof getToken === 'function') {
        const token = await getToken();
        if (token) {
          await galleryAPI.reorder(
            currentItems.map((i, idx) => ({ _id: i._id, position: idx })),
            token
          );
          toast.success("Position updated successfully");
        }
      }
    } catch (err) {
      logger.error("Reorder update failed:", err);
      toast.error("Failed to update positions");
    }
  };

  /** Touch event handlers for mobile drag and drop */
  const handleTouchStart = (e, item) => {
    if (!swapMode) return;
    
    const touch = e.touches[0];
    setTouchItem(item);
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    
    // Add visual feedback for mobile
    if (e.target) {
      e.target.style.opacity = '0.5';
      e.target.style.transform = 'scale(0.95)';
      e.target.style.transition = 'all 0.2s ease';
      e.target.style.zIndex = '1000';
    }
  };

  const handleTouchMove = (e) => {
    if (!swapMode || !touchItem) return;
    
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    
    // Find element under touch
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const galleryItem = elementBelow?.closest('[data-gallery-item]');
    
    // Remove previous hover effects
    document.querySelectorAll('[data-gallery-item]').forEach(el => {
      el.style.transform = '';
      el.style.boxShadow = '';
    });
    
    if (galleryItem) {
      const itemId = galleryItem.getAttribute('data-gallery-item');
      if (itemId !== touchItem._id) {
        setDragOverItem({ _id: itemId });
        // Add hover effect for drop target
        galleryItem.style.transform = 'scale(1.05)';
        galleryItem.style.transition = 'transform 0.2s ease';
        galleryItem.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
      }
    }
  };

  const handleTouchEnd = async (e) => {
    if (!swapMode || !touchItem) return;
    
    // Remove visual feedback
    if (e.target) {
      e.target.style.opacity = '';
      e.target.style.transform = '';
      e.target.style.zIndex = '';
    }
    
    // Remove all hover effects
    document.querySelectorAll('[data-gallery-item]').forEach(el => {
      el.style.transform = '';
      el.style.boxShadow = '';
    });
    
    // Find drop target
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const galleryItem = elementBelow?.closest('[data-gallery-item]');
    
    if (galleryItem) {
      const itemId = galleryItem.getAttribute('data-gallery-item');
      if (itemId && itemId !== touchItem._id) {
        const dropItem = { _id: itemId };
        
        // Perform the swap with animation
        const currentItems = activeTab === "photos" ? [...images] : [...videos];
        const draggedIndex = currentItems.findIndex((i) => i._id === touchItem._id);
        const dropIndex = currentItems.findIndex((i) => i._id === dropItem._id);
        
        if (draggedIndex !== -1 && dropIndex !== -1) {
          // Add smooth animation for mobile
          const draggedEl = document.querySelector(`[data-gallery-item="${touchItem._id}"]`);
          const dropTargetEl = document.querySelector(`[data-gallery-item="${dropItem._id}"]`);
          
          if (draggedEl && dropTargetEl) {
            // Get positions for smooth animation
            const draggedRect = draggedEl.getBoundingClientRect();
            const dropRect = dropTargetEl.getBoundingClientRect();
            
            // Create temporary element for smooth animation
            const ghostElement = draggedEl.cloneNode(true);
            ghostElement.style.position = 'fixed';
            ghostElement.style.left = draggedRect.left + 'px';
            ghostElement.style.top = draggedRect.top + 'px';
            ghostElement.style.width = draggedRect.width + 'px';
            ghostElement.style.height = draggedRect.height + 'px';
            ghostElement.style.zIndex = '1000';
            ghostElement.style.pointerEvents = 'none';
            ghostElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            ghostElement.style.opacity = '0.8';
            document.body.appendChild(ghostElement);
            
            // Animate to drop position
            setTimeout(() => {
              ghostElement.style.left = dropRect.left + 'px';
              ghostElement.style.top = dropRect.top + 'px';
            }, 10);
            
            // Remove ghost element and update state after animation
            setTimeout(() => {
              document.body.removeChild(ghostElement);
              
              // Remove dragged item and insert it at drop position
              const [removed] = currentItems.splice(draggedIndex, 1);
              currentItems.splice(dropIndex, 0, removed);
              
              // Update state
              activeTab === "photos" ? setImages(currentItems) : setVideos(currentItems);
              
              // Update backend
              updateBackend(currentItems);
            }, 300);
          }
        }
      }
    }
    
    // Reset touch state
    setTouchItem(null);
    setDragOverItem(null);
  };

  /** Menu actions */
  const handleMenuAction = (action) => {
    if (action === "add") document.getElementById("fileInput").click();
    else if (action === "delete") toggleDeleteMode();
    else if (action === "modify") {
      setModifyMode(true);
      setDeleteMode(false);
      setSwapMode(false);
    } else if (action === "swap") {
      setSwapMode(true);
      setSwapFirstItem(null);
      setModifyMode(false);
      setDeleteMode(false);
      setSelectedItems([]);
      setDraggedItem(null);
      setDragOverItem(null);
      setTouchItem(null);
      setDraggedElement(null);
      toast.info("Drag and drop mode enabled. Drag items to reorder.");
    }
    setMenuOpen(false);
  };

  /** Handle gallery item click */
  const handleItemClick = (item) => {
    if (deleteMode || modifyMode) {
      toggleSelectItem(item._id);
      if (modifyMode && selectedItems.length === 0) openEditModal(item);
      return;
    }
    setSelectedIndex(item._id);
    if (activeTab === "videos") setPlayVideo(true);
  };

  return (
    <>
      <section className="py-8 sm:py-12 lg:py-16 pt-20 sm:pt-24 lg:pt-32 px-3 sm:px-4 lg:px-6 text-white relative min-h-screen">
        {(normalizedRole === "super-admin" || normalizedRole === "admin") && (
          <>
            {/* 3-dot menu - fixed position */}
            <div className="fixed top-[80px] xs:top-[100px] sm:top-[120px] md:top-[140px] lg:top-[160px] right-3 sm:right-4 z-20" ref={menuRef}>
              <button onClick={() => setMenuOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-800 bg-gray-900">
                <MoreVertical size={28} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 md:w-56 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
                  {["Add", "Delete", "Modify", "Swap"].map(item => (
                    <button
                      key={item}
                      onClick={() => handleMenuAction(item.toLowerCase())}
                      className="block w-full text-left px-4 py-3 md:py-4 text-base md:text-lg hover:bg-gray-800"
                    >{item}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Upload button - separate fixed position below the menu */}
            <input id="fileInput" type="file" multiple onChange={handleFileChange} style={{ display: "none" }} />
            {files.length > 0 && (
              <div className="fixed top-[128px] xs:top-[148px] sm:top-[168px] md:top-[188px] lg:top-[208px] right-3 sm:right-4 z-20">
                <button 
                  onClick={handleUpload} 
                  className="w-full bg-red-600 text-white py-2 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading {files.length} file(s)...
                    </>
                  ) : (
                    `Upload ${files.length} file(s)`
                  )}
                </button>
              </div>
            )}
          </>
        )}

        <h1 className="font-agency underline text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center">
          Explore the Library
        </h1>

        {/* Tab Navigation */}
        <div className="mt-8 sm:mt-12 lg:mt-16 mb-6 sm:mb-8 flex justify-center px-2">
          {["photos", "videos"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 mx-1 sm:mx-2 rounded-lg font-bold text-sm sm:text-base lg:text-lg transition-all ${
                activeTab === tab
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <span className="hidden xs:inline">{tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === "photos" ? images.length : videos.length})</span>
              <span className="xs:hidden">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="mt-6 sm:mt-8 lg:mt-12 responsive-container">
          {/* Gallery Grid */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
              </div>
            )}
            <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
              {modalItems.map(item => {
                const isSwapSelected = swapFirstItem?._id === item._id;
                const isDragged = draggedItem?._id === item._id;
                const isDragOver = dragOverItem?._id === item._id;
                
                return (
                  <div
                    key={item._id}
                    data-gallery-item={item._id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                      isSwapSelected ? "neon-red-border" : ""
                    } ${
                      isDragged ? "opacity-50 scale-95" : ""
                    } ${
                      isDragOver ? "ring-4 ring-blue-500 ring-opacity-50" : ""
                    } ${
                      swapMode ? "hover:scale-105" : "hover:-translate-y-1"
                    }`}
                    onClick={() => !swapMode && handleItemClick(item)}
                    draggable={swapMode}
                    onDragStart={(e) => swapMode && handleDragStart(e, item)}
                    onDragOver={(e) => swapMode && handleDragOver(e, item)}
                    onDragLeave={() => swapMode && handleDragLeave()}
                    onDrop={(e) => swapMode && handleDrop(e, item)}
                    onDragEnd={() => swapMode && handleDragEnd()}
                    onTouchStart={(e) => handleTouchStart(e, item)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {(deleteMode || modifyMode) && (
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        readOnly
                        className="absolute top-2 left-2 w-6 h-6 z-10 accent-red-600"
                      />
                    )}
                    {swapMode && (
                      <div className="absolute top-2 right-2 z-10 bg-blue-600 rounded-full p-1">
                        <MoreVertical size={16} className="text-white" />
                      </div>
                    )}
                    {activeTab === "photos" ? (
                      <img 
                        src={item.url} 
                        alt={item.name || "Gallery Image"} 
                        className="w-full object-cover rounded-lg h-32 xs:h-36 sm:h-40 md:h-48 lg:h-56 xl:h-64"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = STATIC_IMAGES.gymBackground; // Fallback image
                        }}
                      />
                    ) : (
                      <div className="relative w-full h-32 xs:h-36 sm:h-40 md:h-48 lg:h-56 xl:h-64">
                        <video src={item.url} className="w-full h-full object-cover rounded-lg pointer-events-none" preload="metadata" playsInline muted />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-white opacity-80 text-lg sm:text-xl md:text-2xl lg:text-3xl">▶</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {modalItems.length === 0 && (
            <p className="text-center text-gray-400 mt-8">No {activeTab} available.</p>
          )}
        </div>

        {/* Swap Mode Exit Button */}
        {swapMode && (
          <div className="fixed left-1/2 transform -translate-x-1/2 z-50 bottom-24 md:bottom-20">
            <button 
              onClick={() => {
                setSwapMode(false);
                setSwapFirstItem(null);
                setSelectedItems([]);
                setDraggedItem(null);
                setDragOverItem(null);
                setTouchItem(null);
                setDraggedElement(null);
                toast.info("Drag and drop mode disabled");
              }}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-500 shadow-lg flex items-center gap-3"
            >
              Exit Swap Mode
            </button>
          </div>
        )}

        {/* Delete & Modify buttons */}
        {deleteMode && selectedItems.length > 0 && (
          <div className="fixed left-1/2 transform -translate-x-1/2 z-50 bottom-24 md:bottom-20">
            <button 
              onClick={handleDeleteSelected} 
              className="bg-red-600 text-white px-10 py-5 rounded-lg text-2xl font-bold hover:bg-red-500 shadow-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Deleting...
                </>
              ) : (
                `Delete Selected (${selectedItems.length})`
              )}
            </button>
          </div>
        )}
      </section>

      {/* Modal */}
      <AnimatePresence>
        {(selectedIndex !== null || editingItem) && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={() => { setSelectedIndex(null); setPlayVideo(false); setEditingItem(null); }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {editingItem ? (
                <div className="bg-gray-900 p-6 rounded-lg flex flex-col gap-4">
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="p-2 rounded bg-gray-800 text-white w-full" placeholder="Title / Name" />
                  <input type="file" onChange={handleEditFileChange} className="text-white" />
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">Cancel</button>
                    <button onClick={handleSaveEdit} className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white" disabled={savingEdit}>
                      {savingEdit ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : selectedIndex !== null ? (
                <>
                  {activeTab === "photos" ? (
                    <img 
                      src={modalItems.find(item => item._id === selectedIndex)?.url} 
                      alt="Selected" 
                      className="w-full max-h-[80vh] object-contain rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = STATIC_IMAGES.gymBackground;
                      }}
                    />
                  ) : (
                    <video 
                      src={modalItems.find(item => item._id === selectedIndex)?.url} 
                      className="w-full max-h-[80vh] object-contain rounded-lg" 
                      controls 
                      autoPlay={playVideo}
                      onError={(e) => {
                        logger.error('Video failed to load:', e.target.src);
                      }}
                    />
                  )}
                  <button onClick={() => { setSelectedIndex(null); setPlayVideo(false); }} className="absolute top-2 right-4 text-white text-4xl font-bold bg-black/50 rounded-full w-12 h-12 flex items-center justify-center">×</button>
                  <button onClick={() => handleNav("prev", activeTab === "photos" ? "image" : "video")} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white text-4xl p-4 rounded-full w-12 h-12 flex items-center justify-center">‹</button>
                  <button onClick={() => handleNav("next", activeTab === "photos" ? "image" : "video")} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white text-4xl p-4 rounded-full w-12 h-12 flex items-center justify-center">›</button>
                </>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
  );
}
