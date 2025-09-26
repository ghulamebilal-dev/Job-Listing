// frontend/src/components/JobForm.jsx
import React, { useState } from "react";

function JobForm({ onAdd }) {
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "Remote",
        job_type: "Full-time",
        tags: "",
        url: "",
    });

    const [adding, setAdding] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            const jobPayload = {
                ...formData,
                tags: formData.tags.split(",").map((tag) => tag.trim()),
                posting_date: new Date().toISOString(),
            };
            await onAdd(jobPayload);
            setFormData({
                title: "",
                company: "",
                location: "Remote",
                job_type: "Full-time",
                tags: "",
                url: "",
            });
        } catch (err) {
            console.error("Failed to add job:", err);
        } finally {
            setAdding(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-card border border-muted p-4 rounded-lg mb-6"
        >
            <h2 className="text-xl font-semibold text-primary mb-4">Add Job</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Job Title"
                    required
                    className="p-2 rounded bg-background text-white border border-muted"
                />
                <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company"
                    required
                    className="p-2 rounded bg-background text-white border border-muted"
                />
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="p-2 rounded bg-background text-white border border-muted"
                />
                <input
                    type="text"
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleChange}
                    placeholder="Job Type (e.g., Full-time)"
                    className="p-2 rounded bg-background text-white border border-muted"
                />
                <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Tags (comma separated)"
                    className="p-2 rounded bg-background text-white border border-muted"
                />
                <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="Original Job URL"
                    className="p-2 rounded bg-background text-white border border-muted"
                />
            </div>

            <button
                type="submit"
                disabled={adding}
                className="mt-4 px-4 py-2 bg-primary text-black rounded hover:bg-white transition"
            >
                {adding ? "Adding..." : "Add Job"}
            </button>
        </form>
    );
}

export default JobForm;
