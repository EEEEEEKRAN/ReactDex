/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'raw.githubusercontent.com' },
      { hostname: 'static.wikia.nocookie.net' },
      { hostname: 'nestjs-pokedex-api.vercel.app' }, // Ajout du domaine de l'API
    ],
  }
};

module.exports = nextConfig;