// src/components/AddJob.js
import React, { useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';

const AddJob = () => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [tags, setTags] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !company || !location) {
            setMessage('All fields are required');
            return;
        }

        const payload = {
            title,
            company,
            location,
            tags: tags.split(',').map(t => t.trim()),
            job_type: 'Full-time',
            posting_date: new Date().toISOString(),
        };

        try {
            await api.post('/jobs', payload);  // ✅ clean version
            setMessage('✅ Job added!');
            setTitle('');
            setCompany('');
            setLocation('');
            setTags('');
        } catch (err) {
            console.error(err);
            setMessage('❌ Failed to add job');
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 p-4 rounded-lg shadow mb-6"
        >
            <h2 className="text-xl font-bold text-white mb-2">Add New Job</h2>
            {message && <p className="text-sm text-yellow-400 mb-2">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    type="text"
                    placeholder="Job Title"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Company"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Location"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
                >
                    Add Job
                </button>
            </form>
        </motion.div>
    );
};

export default AddJob;
