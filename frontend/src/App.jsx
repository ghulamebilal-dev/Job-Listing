// src/App.js
import React from 'react';
import AddJob from './components/AddJob';
import JobList from './components/JobList';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-8">🧑‍💻 Job Listing Web App</h1>
      <div className="max-w-2xl mx-auto">
        <AddJob />
        <JobList />
      </div>
    </div>
  );
}

export default App;
