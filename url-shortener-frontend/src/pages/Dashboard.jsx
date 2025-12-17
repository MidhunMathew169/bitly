import React, {useState,useEffect} from "react";
import { toast } from "react-toastify";
import { getCurrentUser,createShortUrl,getUserUrls,deleteUrl } from "../services/api";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [urls, setUrls] = useState([]);
    const [urlInput, setUrlInput] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, urlId: null });
    const [isDeleting, setIsDeleting] = useState(false);

    //Load current user + URLs
    useEffect(() => {
        const loadData = async () => {
            try {
              const userData = await getCurrentUser();
              setUser(userData);
              
              const userUrls = await getUserUrls();
              setUrls(userUrls.urls);
            } catch (error) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        loadData();
    }, [navigate]);

    // create new shortened URL
    const handleShorten = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const newUrl = await createShortUrl(urlInput);
            setUrls(prev => [...prev, newUrl.url]);
            setUrlInput("");
            toast.success("URL shortened successfully!");
        } catch (err) {
            const errorMsg = err.message || "Failed to shorten URL";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.info("You have been logged out successfully!");
        navigate("/login");
    };

    // delete URL
    const handleDeleteUrl = async (urlId) => {
        setDeleteModal({ isOpen: true, urlId });
    };

    const confirmDelete = async () => {
        const urlId = deleteModal.urlId;
        setIsDeleting(true);

        try {
            await deleteUrl(urlId);
            setUrls(urls.filter(u => u._id !== urlId));
            toast.success("URL deleted successfully!");
            setDeleteModal({ isOpen: false, urlId: null });
        } catch (err) {
            const errorMsg = err.message || "Failed to delete URL";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setDeleteModal({ isOpen: false, urlId: null });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-10 px-2">
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                isLoading={isDeleting}
            />
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Hello, {user?.name}</h2>
                        <p className="text-gray-500 text-sm">Welcome to your dashboard</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow transition"
                    >
                        Logout
                    </button>
                </div>

                {/* URL Shortener Form */}
                <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Paste a long URL..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        required
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Shortening..." : "Shorten"}
                    </button>
                </form>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* URLs Table */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Your URLs</h3>
                    {urls.length === 0 ? (
                        <div className="text-gray-500 text-center py-8">No URLs yet. Start by shortening one!</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Short URL</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Original URL</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    {urls.map((u) => (
                                        <tr key={u._id} className="border-t">
                                            <td className="px-4 py-2">
                                                <a
                                                    href={`${import.meta.env.VITE_REDIRECT_BASE_URL}/${u.shortId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:underline font-medium break-all"
                                                >
                                                    {u.shortId}
                                                </a>
                                            </td>
                                            <td className="px-4 py-2 break-all text-gray-700">{u.originalUrl}</td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() => handleDeleteUrl(u._id)}
                                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded font-medium transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;