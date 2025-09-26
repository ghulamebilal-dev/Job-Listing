// frontend/src/components/Dashboard.js
import React, { useEffect, useState } from "react";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("http://127.0.0.1:5000/stats");
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);
    if (!stats) return <div>Loading stats...</div>;
    return (
        <div style={{ padding: 12 }}>
            <h2>Dashboard</h2>
            <div><strong>Total jobs:</strong> {stats.total}</div>
            <div style={{ marginTop: 8 }}>
                <strong>Top companies</strong>
                <ul>{stats.top_companies.map((c, i) => (<li key={i}>{c.company} — {c.count}</li>))}</ul>
            </div>
            <div style={{ marginTop: 8 }}>
                <strong>Top locations</strong>
                <ul>{stats.top_locations.map((l, i) => (<li key={i}>{l.location} — {l.count}</li>))}</ul>
            </div>
        </div>
    );
}
