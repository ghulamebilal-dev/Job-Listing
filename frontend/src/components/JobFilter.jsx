// src/components/JobFilter.js
import React from 'react';

const JobFilter = ({ onFilter }) => {
    const [keyword, setKeyword] = React.useState('');
    const [location, setLocation] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter({ keyword, location });
    };

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
            <input
                placeholder="Keyword"
                className="flex-1 p-2 rounded bg-gray-700 text-white"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <input
                placeholder="Location"
                className="flex-1 p-2 rounded bg-gray-700 text-white"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded"
            >
                Filter
            </button>
        </form>
    );
};

export default JobFilter;
