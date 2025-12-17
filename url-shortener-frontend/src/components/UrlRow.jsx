import React, { useState } from "react";

const truncate = (str, n = 60) => (str.length > n ? str.slice(0, n) + '...': str);

const UrlRow = ({ urlObj, onDelete }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shortUrl = urlObj.shortUrl || `${window.location.origin}/${urlObj.code}`;

    return (
        <tr className="bg-white">
            <td className="px-4 py-3 text-sm text-gray-700 max-w-[300px]">
                <a href={urlObj.originalUrl} target ="_blank" rel="noreferrer" className="hover:underline">
                    {truncate(urlObj.originalUrl, 80)}
                </a>
            </td>
            <td className="px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                    <a href={shortUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                        {shortUrl}
                    </a>
                    <button 
                    onClick={() => handleCopy(shortUrl)}
                    className="text-sm px-2 py-1 rounded-md border hover:bg-gray-50"
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </td>
            <td className="px-4 py-3 text-sm">{urlObj.clicks ?? 0}</td>
            <td className="px-4 py-3 text-sm">{new Date(urlObj.createdAt).toLocaleString()}</td>
            <td className="px-4 py-3 text-sm">
                <button
                onClick={() => onDelete(urlObj._id)}
                className="text-sm px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700">
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default UrlRow;