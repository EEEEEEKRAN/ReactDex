"use client";

import React, { useState, useEffect } from "react";

export default function Navbar({ onNameFilter, onTypeFilter, types = [] }) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    if (onNameFilter && search !== "") {
      onNameFilter(search);
    }
  }, [search, onNameFilter]);

  useEffect(() => {
    if (onTypeFilter) {
      if (selectedType) {
        onTypeFilter([parseInt(selectedType)]);
      } else {
        onTypeFilter([]);
      }
    }
  }, [selectedType, onTypeFilter]);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <nav className="w-full flex flex-col sm:flex-row items-center gap-4 px-6 py-3 bg-red-500 shadow-lg border-b-4 border-yellow-400">
      <span className="text-4xl font-extrabold italic text-white tracking-tight drop-shadow-[3px_3px_0_rgba(0,0,0,0.25)] mr-auto sm:mr-6 whitespace-nowrap hover:text-yellow-300 transition-colors">
        Pokédex
      </span>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          className="px-4 py-2 rounded-full border-2 border-yellow-400 bg-white text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 w-full sm:w-auto placeholder-gray-500 shadow-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="px-4 py-2 rounded-full border-2 border-yellow-400 bg-white text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 w-full sm:w-auto shadow-md appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1.25em 1.25em",
          }}
        >
          <option value="">Tous les types</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}

Navbar.defaultProps = {
  onNameFilter: () => {},
  onTypeFilter: () => {},
  types: [],
};