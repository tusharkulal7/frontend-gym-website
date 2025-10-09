import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical } from "lucide-react";
import axios from "axios";

export default function GallerySection({ token, userRole }) {
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const menuRef = useRef();

  const normalizedRole = userRole?.toLowerCase().replace(/\s+/g, "") || "none";
  const modalItems = activeTab === "photos" ? images : videos;
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  /** Fetch gallery items */
const fetchGallery = useCallback(async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/gallery`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const items = res.data.items || [];
    setImages(items.filter((i) => i.type === "image"));
    setVideos(items.filter((i) => i.type === "video"));
  } catch (err) {
    console.error("Failed to fetch gallery:", err);
  }
}, [token, BACKEND_URL]); // ✅ added BACKEND_URL

useEffect(() => { fetchGallery(); }, [fetchGallery]);


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
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    try {
      const res = await axios.post(`${BACKEND_URL}/api/gallery/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      const newItems = res.data.items || [];
      setImages((prev) => [...prev, ...newItems.filter((i) => i.type === "image")]);
      setVideos((prev) => [...prev, ...newItems.filter((i) => i.type === "video")]);
      setFiles([]);
      setMenuOpen(false);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
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
  if (!selectedItems.length) return alert("Select items to delete");
  try {
    // Delete each selected item
    await Promise.all(
      selectedItems.map((id) =>
        axios.delete(`${BACKEND_URL}/api/gallery/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    );

    // Update frontend state
    setImages((prev) => prev.filter((i) => !selectedItems.includes(i._id)));
    setVideos((prev) => prev.filter((i) => !selectedItems.includes(i._id)));

    // Reset UI
    setDeleteMode(false);
    setSelectedItems([]);
    setMenuOpen(false);
  } catch (err) {
    console.error(err);
    alert("Delete failed");
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
    setSavingEdit(true);
    try {
      const formData = new FormData();
      if (editTitle) formData.append("name", editTitle);
      if (editFile) formData.append("file", editFile);
      const res = await axios.put(`${BACKEND_URL}/api/gallery/${editingItem._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      const updated = res.data.item ?? res.data;
      setImages((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
      setVideos((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
      setEditingItem(null);
      setEditTitle("");
      setEditFile(null);
      setSelectedItems([]);
    } catch (err) {
      console.error("Modify failed:", err);
      alert("Failed to modify item.");
      try { await fetchGallery(); } catch (_) {}
    } finally {
      setSavingEdit(false);
    }
  };

  /** Swap logic */
  const handleSwapItemClick = async (item) => {
    if (!swapFirstItem) {
      setSwapFirstItem(item);
      return;
    }
    const currentItems = activeTab === "photos" ? [...images] : [...videos];
    const index1 = currentItems.findIndex((i) => i._id === swapFirstItem._id);
    const index2 = currentItems.findIndex((i) => i._id === item._id);
    if (index1 === -1 || index2 === -1 || index1 === index2) return;
    [currentItems[index1], currentItems[index2]] = [currentItems[index2], currentItems[index1]];
    activeTab === "photos" ? setImages(currentItems) : setVideos(currentItems);
    setSwapMode(false);
    setSwapFirstItem(null);
    setSelectedItems([]);
    try {
      await axios.patch(`${BACKEND_URL}/api/gallery/reorder`, {
  items: currentItems.map((i, idx) => ({ _id: i._id, position: idx })),
}, { headers: { Authorization: `Bearer ${token}` } });
  }catch (err) {
  console.error("Swap update failed:", err);
}
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
      alert("Swap mode enabled. Click first item to swap.");
    }
    setMenuOpen(false);
  };

  /** Handle gallery item click */
  const handleItemClick = (item) => {
    if (swapMode) return handleSwapItemClick(item);
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
      <section className="py-16 pt-32 px-4 text-white relative">
        {(normalizedRole === "super-admin" || normalizedRole === "admin") && (
          <div className="fixed top-[160px] right-4 z-20 md:top-[180px]" ref={menuRef}>
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

            <input id="fileInput" type="file" multiple onChange={handleFileChange} style={{ display: "none" }} />
            {files.length > 0 && (
              <button onClick={handleUpload} className="mt-2 w-full bg-red-600 text-white py-2 rounded-md">
                Upload {files.length} file(s)
              </button>
            )}
          </div>
        )}

        <h1 className="font-agency underline text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-center">
          Explore the Library
        </h1>
        <p className="font-agency text-gray-600 text-xl sm:text-2xl md:text-3xl lg:text-3xl text-slate-400 text-center mt-4 max-w-2xl mx-auto">
          A visual collection of our most recent works – better transformation and fitness.
        </p>

        {/* Tabs */}
        <div className="flex justify-center mt-10 gap-4">
          {["photos", "videos"].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedIndex(null); setPlayVideo(false); }}
              className={`px-6 md:px-8 py-2 md:py-3 font-agency text-xl md:text-2xl lg:text-3xl rounded-full border-2 transition-all duration-300 ${
                activeTab === tab ? "bg-red-600 text-white border-red-600" : "bg-transparent text-red-500 border-red-500 hover:bg-red-600 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="mt-12 max-w-6xl mx-auto">
          {modalItems.length ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {modalItems.map(item => {
                const isSwapSelected = swapFirstItem?._id === item._id;
                return (
                  <div
                    key={item._id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden ${isSwapSelected ? "neon-red-border" : ""}`}
                    onClick={() => handleItemClick(item)}
                  >
                    {(deleteMode || modifyMode) && (
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        readOnly
                        className="absolute top-2 left-2 w-6 h-6 z-10 accent-red-600"
                      />
                    )}
                    {activeTab === "photos" ? (
                      <img src={item.url} alt={item.name || "Gallery Image"} className="w-full object-cover rounded-lg hover:-translate-y-1 transition-all duration-300 h-40 sm:h-48 md:h-64 lg:h-72" />
                    ) : (
                      <div className="relative w-full h-40 sm:h-48 md:h-64 lg:h-72">
                        <video src={item.url} className="w-full h-full object-cover rounded-lg pointer-events-none" preload="metadata" playsInline muted />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full w-14 h-14 flex items-center justify-center text-white opacity-80 text-3xl">▶</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-8">No {activeTab} available.</p>
          )}
        </div>

        {/* Delete & Modify buttons */}
        {deleteMode && selectedItems.length > 0 && (
          <div className="fixed left-1/2 transform -translate-x-1/2 z-50 bottom-24 md:bottom-20">
            <button onClick={handleDeleteSelected} className="bg-red-600 text-white px-10 py-5 rounded-lg text-2xl font-bold hover:bg-red-500 shadow-lg">
              Delete Selected ({selectedItems.length})
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
                    <img src={modalItems.find(item => item._id === selectedIndex)?.url} alt="Selected" className="w-full max-h-[80vh] object-contain rounded-lg" />
                  ) : (
                    <video src={modalItems.find(item => item._id === selectedIndex)?.url} className="w-full max-h-[80vh] object-contain rounded-lg" controls autoPlay={playVideo} />
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
