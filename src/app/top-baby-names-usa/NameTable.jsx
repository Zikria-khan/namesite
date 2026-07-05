"use client";

import { useMemo, useState } from "react";

function TrendBadge({ delta }) {
  if (delta === "NEW") {
    return <span className="trend trend-new">NEW</span>;
  }
  if (delta > 0) {
    return (
      <span className="trend trend-up">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M5 1 L9 7 L1 7 Z" fill="currentColor" />
        </svg>
        {delta}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="trend trend-down">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M5 9 L1 3 L9 3 Z" fill="currentColor" />
        </svg>
        {Math.abs(delta)}
      </span>
    );
  }
  return <span className="trend trend-flat">—</span>;
}

export default function NameTable({ boysNames, girlsNames }) {
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState("all");
  const [sortBy, setSortBy] = useState("rank");

  const combined = useMemo(() => {
    const rows = [
      ...boysNames.map((n) => ({ ...n, gender: "Boy" })),
      ...girlsNames.map((n) => ({ ...n, gender: "Girl" })),
    ];
    return rows;
  }, [boysNames, girlsNames]);

  const filtered = useMemo(() => {
    let rows = combined;
    if (gender !== "all") {
      rows = rows.filter((r) => r.gender.toLowerCase() === gender);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.origin.toLowerCase().includes(q) ||
          r.meaning.toLowerCase().includes(q)
      );
    }
    const sorted = [...rows];
    if (sortBy === "rank") {
      sorted.sort((a, b) => a.rank - b.rank);
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "trend") {
      sorted.sort((a, b) => {
        const av = a.delta === "NEW" ? 999 : a.delta;
        const bv = b.delta === "NEW" ? 999 : b.delta;
        return bv - av;
      });
    }
    return sorted;
  }, [combined, gender, query, sortBy]);

  return (
    <div className="name-table-wrap">
      <div className="name-table-controls">
        <label className="control">
          <span className="control-label">Search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a name, meaning, or origin…"
            aria-label="Search names"
          />
        </label>
        <label className="control">
          <span className="control-label">Gender</span>
          <select value={gender} onChange={(e) => setGender(e.target.value)} aria-label="Filter by gender">
            <option value="all">All (100)</option>
            <option value="boy">Boys (50)</option>
            <option value="girl">Girls (50)</option>
          </select>
        </label>
        <label className="control">
          <span className="control-label">Sort by</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort names">
            <option value="rank">Rank</option>
            <option value="name">Name (A–Z)</option>
            <option value="trend">Biggest riser first</option>
          </select>
        </label>
      </div>

      <p className="result-count" aria-live="polite">
        Showing {filtered.length} of 100 names
      </p>

      <div className="table-scroll">
        <table className="name-table">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Name</th>
              <th scope="col">Gender</th>
              <th scope="col">Meaning</th>
              <th scope="col">Origin</th>
              <th scope="col">Trend vs. 2024</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={`${row.gender}-${row.name}`}>
                <td className="rank-cell" data-label="Rank">
                  #{row.rank}
                </td>
                <td className="name-cell" data-label="Name">
                  {row.name}
                </td>
                <td data-label="Gender">
                  <span className={`gender-tag gender-${row.gender.toLowerCase()}`}>{row.gender}</span>
                </td>
                <td data-label="Meaning">{row.meaning}</td>
                <td data-label="Origin">{row.origin}</td>
                <td data-label="Trend">
                  <TrendBadge delta={row.delta} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="no-results">No names match “{query}.” Try a different search term.</p>
        )}
      </div>

      <style jsx>{`
        .name-table-wrap {
          margin-top: 1.5rem;
        }
        .name-table-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: var(--paper-raised, #fdfaf4);
          border: 1px solid var(--line, #e4dbcb);
        }
        .control {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          flex: 1 1 160px;
        }
        .control-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-soft, #55493f);
        }
        .control input,
        .control select {
          padding: 0.55rem 0.65rem;
          border: 1px solid var(--line, #e4dbcb);
          background: #fff;
          font-size: 0.95rem;
          color: var(--ink, #221d18);
        }
        .control input:focus,
        .control select:focus {
          outline: 2px solid var(--accent, #a63d53);
          outline-offset: 1px;
        }
        .result-count {
          font-family: var(--font-mono, monospace);
          font-size: 0.78rem;
          color: var(--ink-soft, #55493f);
          margin: 0 0 0.6rem;
        }
        .table-scroll {
          overflow-x: auto;
          border: 1px solid var(--line, #e4dbcb);
        }
        .name-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 640px;
          background: #fff;
        }
        .name-table thead th {
          text-align: left;
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.7rem 0.8rem;
          background: var(--ink, #221d18);
          color: #fdfaf4;
          position: sticky;
          top: 0;
        }
        .name-table tbody tr {
          border-bottom: 1px solid var(--line, #e4dbcb);
        }
        .name-table tbody tr:nth-child(even) {
          background: #faf6ef;
        }
        .name-table td {
          padding: 0.65rem 0.8rem;
          font-size: 0.92rem;
          vertical-align: middle;
        }
        .rank-cell {
          font-family: var(--font-mono, monospace);
          font-weight: 700;
          color: var(--accent, #a63d53);
          white-space: nowrap;
        }
        .name-cell {
          font-weight: 600;
        }
        .gender-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          letter-spacing: 0.05em;
          padding: 0.15rem 0.45rem;
          border: 1px solid currentColor;
          white-space: nowrap;
        }
        .gender-boy {
          color: #3d5a50;
        }
        .gender-girl {
          color: #a63d53;
        }
        .trend {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.82rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .trend-up {
          color: #3d5a50;
        }
        .trend-down {
          color: #a63d53;
        }
        .trend-flat {
          color: var(--ink-soft, #55493f);
        }
        .trend-new {
          color: #b8863b;
          border: 1px solid #b8863b;
          padding: 0.05rem 0.35rem;
        }
        .no-results {
          padding: 1.5rem;
          text-align: center;
          color: var(--ink-soft, #55493f);
        }
        @media (max-width: 640px) {
          .name-table thead {
            display: none;
          }
          .name-table,
          .name-table tbody,
          .name-table tr,
          .name-table td {
            display: block;
            width: 100%;
          }
          .name-table tr {
            padding: 0.75rem 0.9rem;
          }
          .name-table td {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            padding: 0.3rem 0;
            border: none;
          }
          .name-table td::before {
            content: attr(data-label);
            font-family: var(--font-mono, monospace);
            font-size: 0.68rem;
            text-transform: uppercase;
            color: var(--ink-soft, #55493f);
          }
        }
      `}</style>
    </div>
  );
}
