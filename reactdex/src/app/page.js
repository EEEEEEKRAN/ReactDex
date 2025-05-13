"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import PokemonCard from "../components/PokemonCard";

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("https://nestjs-pokedex-api.vercel.app/types");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllTypes(data);
      } catch (e) {
        console.error("Failed to fetch types:", e);
      }
    };
    fetchTypes();
  }, []);

  const fetchPokemonsData = useCallback(async (currentPage, isInitialLoad = false) => {
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }
    setError(null);

    try {
      const response = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons?limit=${limit}&page=${currentPage}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const newPokemons = (data.data || data || []).map(pokemon => ({
        ...pokemon,
        sprites: pokemon.sprites || { front_default: null },
      }));

      setPokemons(prevPokemons => isInitialLoad ? newPokemons : [...prevPokemons, ...newPokemons]);
      setHasMore(newPokemons.length === limit);

    } catch (e) {
      console.error("Failed to fetch pokemons:", e);
      setError(e.message);
      setHasMore(false);
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      } else {
        setIsFetchingMore(false);
      }
    }
  }, [limit]);


  useEffect(() => {
    fetchPokemonsData(1, true);
  }, [fetchPokemonsData]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 &&
        hasMore &&        
        !isFetchingMore && 
        !isLoading        
      ) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isFetchingMore, isLoading]);

  useEffect(() => {
    if (page > 1) {
      fetchPokemonsData(page, false);
    }
  }, [page, fetchPokemonsData]);

  useEffect(() => {
    if (nameFilter === "" && typeFilter.length === 0) {
      console.log("Aucun filtre actif");
    }
  }, [nameFilter, typeFilter]);

  useEffect(() => {
    if (error) {
      alert("Une erreur est survenue : " + error);
    }
  }, [error]);

  const handleNameFilterChange = useCallback((name) => {
    setNameFilter(name.toLowerCase());
  }, []);

  const handleTypeFilterChange = useCallback((types) => {
    setTypeFilter(types);
  }, []);

  const filteredPokemons = pokemons.filter(pokemon => {
    const nameMatch = pokemon.name.toLowerCase().includes(nameFilter);
    const typeMatch = typeFilter.length === 0 ||
                      (pokemon.types && pokemon.types.some(pt => typeFilter.includes(pt.id)));
    return nameMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        onNameFilter={handleNameFilterChange}
        onTypeFilter={handleTypeFilterChange}
        types={allTypes}
      />
      <main className="p-4 sm:p-6 md:p-8">
        {isLoading && ( 
          <div className="flex justify-center items-center h-64">
            <p className="text-2xl font-semibold text-gray-700">Chargement des Pokémon...</p>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-64">
            <p className="text-2xl font-semibold text-red-600">Erreur: {error}</p>
          </div>
        )}

        {}
        {!isLoading && !error && (
          <>
            {filteredPokemons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
                {filteredPokemons.map((pokemon) => (
                  <PokemonCard key={`${pokemon.pokedexId}-${pokemon.name}`} pokemon={pokemon} />
                ))}
              </div>
            ) : (
              !isFetchingMore &&
              <div className="col-span-full flex justify-center items-center h-64">
                <p className="text-2xl font-semibold text-gray-700">
                  {pokemons.length === 0 ? "Aucun Pokémon trouvé pour le moment." : "Aucun Pokémon ne correspond à votre recherche."}
                </p>
              </div>
            )}
          </>
        )}

        {isFetchingMore && (
          <div className="flex justify-center items-center py-8">
            <p className="text-xl font-semibold text-gray-700">Chargement de plus de Pokémon...</p>
          </div>
        )}
        {!hasMore && !isLoading && !isFetchingMore && pokemons.length > 0 && (
           <div className="flex justify-center items-center py-8">
            <p className="text-xl font-semibold text-gray-500">Vous avez atteint la fin de la liste.</p>
          </div>
        )}
      </main>
      <footer className="text-center py-8 text-gray-600 text-sm">
        Pokédex App - Créé avec Next.js et Tailwind CSS
      </footer>
    </div>
  );
}