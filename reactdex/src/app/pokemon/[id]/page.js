"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PokemonDetails({ params }) {
  const [pokemon, setPokemon] = useState(null);
  const [id, setId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    fetchParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      const fetchPokemonDetails = async (id) => {
        const response = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemon/${id}`);
        const data = await response.json();

        return {
          name: data.name || 'Inconnu',
          image: data.sprites?.front_default || '',
          stats: Array.isArray(data.stats) ? data.stats.map((stat) => ({
            name: stat.stat.name,
            value: stat.base_stat,
          })) : [],
          evolutions: Array.isArray(data.evolutions) ? data.evolutions.map((evo) => ({
            name: evo.name,
            image: evo.image || '',
          })) : [],
          types: Array.isArray(data.types) ? data.types.map((type) => ({
            name: type,
          })) : [],
        };
      };

      fetchPokemonDetails(id).then(setPokemon);
    }
  }, [id]);

  const getTypeColor = (typeName) => {
    const colors = {
      Plante: 'from-green-500 to-green-700',
      Feu: 'from-red-500 to-red-700',
      Eau: 'from-blue-500 to-blue-700',
      Électrik: 'from-yellow-400 to-yellow-600',
      Psy: 'from-pink-500 to-pink-700',
      Normal: 'from-gray-400 to-gray-600',
      Combat: 'from-orange-600 to-orange-800',
      Vol: 'from-sky-400 to-sky-600',
      Poison: 'from-purple-600 to-purple-800',
      Sol: 'from-amber-600 to-amber-800',
      Roche: 'from-stone-500 to-stone-700',
      Insecte: 'from-lime-500 to-lime-700',
      Spectre: 'from-indigo-600 to-indigo-800',
      Acier: 'from-slate-500 to-slate-700',
      Dragon: 'from-indigo-800 to-indigo-900',
      Ténèbres: 'from-neutral-800 to-neutral-900',
      Fée: 'from-pink-400 to-pink-600',
      Glace: 'from-cyan-400 to-cyan-600',
      Default: 'from-gray-500 to-gray-700',
    };
    return colors[typeName] || colors.Default;
  };

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  const primaryType = pokemon.types && pokemon.types.length > 0 ? pokemon.types[0].name : 'Default';
  const backgroundColor = getTypeColor(primaryType);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${backgroundColor} text-white p-6`}>
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-white text-blue-500 font-semibold rounded shadow hover:bg-gray-200 transition"
      >
        Retour
      </button>

      <div className="max-w-4xl mx-auto bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="w-48 h-48 flex items-center justify-center relative mb-4 md:mb-0 md:mr-6">
            {pokemon.image ? (
              <img
                src={pokemon.image}
                alt={pokemon.name || 'Pokemon image'}
                className="w-full h-full object-contain rounded-full bg-white border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                Image N/A
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold capitalize mb-2">{pokemon.name}</h1>
            <p className="text-lg text-gray-600">ID: #{String(id).padStart(3, '0')}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Statistiques</h2>
          <ul className="grid grid-cols-2 gap-4">
            {pokemon.stats.map((stat, index) => (
              <li
                key={index}
                className="bg-blue-100 text-blue-800 rounded-lg p-3 shadow-md flex justify-between items-center"
              >
                <span className="font-medium capitalize">{stat.name}</span>
                <span className="font-bold">{stat.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Évolutions</h2>
          {pokemon.evolutions.length > 0 ? (
            <ul className="flex flex-wrap gap-4">
              {pokemon.evolutions.map((evolution, index) => (
                <li
                  key={index}
                  className="bg-indigo-100 text-indigo-800 rounded-lg px-4 py-2 shadow-md flex items-center gap-2"
                >
                  {evolution.image && (
                    <img
                      src={evolution.image}
                      alt={evolution.name || 'Evolution image'}
                      className="w-10 h-10 object-contain rounded-full border border-gray-200 shadow-sm"
                    />
                  )}
                  <span>{evolution.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Aucune évolution disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
}
