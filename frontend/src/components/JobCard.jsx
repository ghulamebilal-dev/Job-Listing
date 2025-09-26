// src/components/JobCard.js
import React from 'react';
import { motion } from 'framer-motion';

const JobCard = ({ job }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-4 shadow-md mb-4"
        >
            <h2 className="text-xl font-semibold text-white">{job.title}</h2>
            <p className="text-sm text-gray-300">{job.company} – {job.location}</p>
            <p className="text-sm text-gray-400 mt-1">{job.job_type}</p>
            <div className="flex flex-wrap mt-2 gap-2">
                {job.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-700 text-xs px-2 py-1 rounded-full text-gray-200">
                        {tag}
                    </span>
                ))}
            </div>
        </motion.div>
    );
};

export default JobCard;
