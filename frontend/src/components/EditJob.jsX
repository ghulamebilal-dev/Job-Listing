// src/components/EditJob.js
import React, { useState } from 'react';
import api from '../api';

const EditJob = ({ job, onUpdated }) => {
    const [title, setTitle] = useState(job.title);
    const [company, setCompany] = useState(job.company);
    const [location, setLocation] = useState(job.location);
    const [tags, setTags] = useState(job.tags || '');
    const [msg, setMsg] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/jobs/${job.id}`, {
                title,
                company,
                location,
                tags: tags.split(',').map((t) => t.trim()),
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_ADMIN_TOKEN}`,
                },
            });
            setMsg('✅ Updated!');
            onUpdated(); // refresh parent list
        } catch (err) {
            console.error(err);
            setMsg('❌ Update failed');
        }
    };

    return (
        <form onSubmit={handleUpdate} className="space-y-2 bg-gray-700 p-3 rounded">
            {msg && <p className="text-yellow-400">{msg}</p>}
            <input className="w-full p-2 rounded bg-gray-600 text-white"
                value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="w-full p-2 rounded bg-gray-600 text-white"
                value={company} onChange={(e) => setCompany(e.target.value)} />
            <input className="w-full p-2 rounded bg-gray-600 text-white"
                value={location} onChange={(e) => setLocation(e.target.value)} />
            <input className="w-full p-2 rounded bg-gray-600 text-white"
                value={tags} onChange={(e) => setTags(e.target.value)} />
            <button type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-1 rounded">
                Save
            </button>
        </form>
    );
};

export default EditJob;
