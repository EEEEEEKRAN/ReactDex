"use client";

import { useRouter } from 'next/navigation';

const getTypeColor = (typeName) => {
  const normalizedTypeName = typeName
    ? typeName.charAt(0).toUpperCase() + typeName.slice(1).toLowerCase()
    : 'Default';

  const colors = {
    Plante: 'bg-green-500',
    Feu: 'bg-red-500',
    Eau: 'bg-blue-500',
    Électrik: 'bg-yellow-400',
    Psy: 'bg-pink-500',
    Normal: 'bg-gray-400',
    Combat: 'bg-orange-600',
    Vol: 'bg-sky-400',
    Poison: 'bg-purple-600',
    Sol: 'bg-amber-600',
    Roche: 'bg-stone-500',
    Insecte: 'bg-lime-500',
    Spectre: 'bg-indigo-600',
    Acier: 'bg-slate-500',
    Dragon: 'bg-indigo-800',
    Ténèbres: 'bg-neutral-800',
    Fée: 'bg-pink-400',
    Glace: 'bg-cyan-400',
    Default: 'bg-slate-400',
  };
  return colors[normalizedTypeName] || colors.Default;
};

export default function PokemonCard({ pokemon }) {
  const router = useRouter();

  if (!pokemon) return null;

  const primaryType =
    pokemon.types && pokemon.types.length > 0 ? pokemon.types[0].name : 'Default';
  const cardBgColor = getTypeColor(primaryType);

  const handleCardClick = () => {
    router.push(`/pokemon/${pokemon.pokedexId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        rounded-lg shadow-md p-4 flex flex-col items-center text-center 
        transition-transform duration-200 hover:scale-105 cursor-pointer
        ${cardBgColor} 
        text-white
      `}
    >
      <div className="w-28 h-28 sm:w-32 sm:h-32 relative mb-3 flex items-center justify-center">
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

      <h2 className="text-lg sm:text-xl font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] capitalize mb-2">
        #{String(pokemon.pokedexId).padStart(3, '0')} - {pokemon.name}
      </h2>

      {pokemon.types && pokemon.types.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {pokemon.types.map((type) => (
            <span
              key={type.id}
              className="px-2.5 py-0.5 bg-black bg-opacity-20 text-xs font-medium rounded-full"
            >
              {type.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}