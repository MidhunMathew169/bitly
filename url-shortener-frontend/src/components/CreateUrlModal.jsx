import React, { useState } from "react";

const CreateUrlModal = ({ isOpen, onClose, onCreate }) => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!originalUrl.trim()) {
            setError('Original URL is required.');
            return;
        }
        setLoading(true);
        try {
            await onCreate({ originalUrl: originalUrl.trim(), customeAlias: customAlias.trim() || undefined});
            setOriginalUrl('');
            setCustomAlias('');
            onClose();
        } catch (error) {
            setError(err?.message || 'Failed to create short URL.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Create Short URL</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <form action="" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="" className="block text-sm font-medium text-gray-600">Original URL</label>
                        <input 
                        type="text"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        placeholder="https://example.com/my/very/long/url"
                        className="mt-1 block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        required
                         />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Custom alias (optional)</label>
                        <input 
                        type="text"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        placeholder="e.g. my-link"
                        className="mt-1 block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" 
                        />
                        <p className="text-xs text-gray-400 mt-1">Only letters, numbers, hyphens. Leave empty for auto generation.</p>
                    </div>

                    {error && <div className="text-sm text-red-600">{error}</div>}

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUrlModal;