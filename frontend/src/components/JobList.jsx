import React, { useEffect, useState } from 'react';
import api from '../api';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs');
            setJobs(res.data.items);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);



    const handleDelete = async (id) => {
        if (!window.confirm('Delete this job?')) return;
        try {
            // token already in api.js headers
            await api.delete(`/jobs/${id}`);
            setJobs(jobs.filter((job) => job.id !== id));
        } catch (err) {
            console.error(err);
            alert('❌ Failed to delete job');
        }
    };


    if (loading) return <p>Loading…</p>;
    if (error) return <p className="text-red-400">{error}</p>;

    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <div
                    key={job.id}
                    className="bg-gray-800 p-4 rounded shadow flex justify-between items-center"
                >
                    <div>
                        <h3 className="font-bold text-lg">{job.title}</h3>
                        <p className="text-sm text-gray-400">
                            {job.company} — {job.location}
                        </p>
                        {job.tags && (
                            <p className="text-xs text-blue-300 mt-1">{job.tags}</p>
                        )}
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={() => alert('Open edit form here')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(job.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JobList;
