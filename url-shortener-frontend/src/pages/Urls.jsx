import React, { useEffect, useState } from "react";
import { getUserUrls,createShortUrl,deleteUrl } from "../services/urlService";
import CreateUrlModal from '../components/CreateUrlModal';
import UrlRow from "../components/UrlRow";

const Urls = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getUserUrls();
            //assume backend returns array in data.urls or data — handle both
            setUrls(Array.isArray(data) ? data : data.urls || []);
        } catch (error) {
            setError(err?.message || 'Failed to fetch URLs.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (payload) => {
        try {
            const data = await createShortUrl(payload);
            // backend returns created url in data.url
            const created = data.url || data;
            setUrls((prev) => [created, ...prev]);
            setSuccessMsg('Short URL created');
            setTimeout(() => setSuccessMsg(''), 2500);
        } catch (error) {
            throw err;
        }
    };

    const handleDelete = async (id) => {
        if(!confirm('Delete this short URL?')) return;
        try {
            await deleteUrl(id);
            setUrls((prev) => prev.filter((u) => u._id !== id));
            setSuccessMsg(() => setSuccessMsg(''), 2000);
            setTimeout(() => setSuccessMsg(''), 2000);
        } catch (error) {
            setError(err?.message || 'Failed to delete');
        }
    };

    return(
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Your Shortened Links</h1>
                        <p className="text-sm text-gray-500">Manage, copy, and delete your short URLs.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                        onClick={() => fetchUrls()}
                        className="px-3 py-2 rounded-lg border hover:bg-white"
                        >
                            Refresh
                        </button>
                        <button
                        onClick={() => setOpenModal(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700"
                        >
                            + New Short URL
                        </button>
                    </div>
                </div>

                {error && <div className="mb-4 text-red-600">{error}</div>}
                {successMsg && <div className="mb-4 text-green-600">{successMsg}</div>}

                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm text-gray-600">Original URL</th>
                                <th className="text-left px-4 py-3 text-sm text-gray-600">Short URL</th>
                                <th className="text-left px-4 py-3 text-sm text-gray-600">Clicks</th>
                                <th className="text-left px-4 py-3 text-sm text-gray-600">Created</th>
                                <th className="text-left px-4 py-3 text-sm text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : urls.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-500">
                                        No URLs yet. Create your firt short link.
                                    </td>
                                </tr>
                            ) : (
                                urls.map((u) => (
                                    <UrlRow key={u._id} urlObj={u} onDelete={handleDelete}/>
                                ))
                            
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateUrlModal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            onCreate={handleCreate}
            />
        </div>
    );
};

export default Urls;