import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  // Die Dev-Anzeige („N" / „Compiling …") taucht je nach Timing in Screenshots auf
  // und macht die Visual-Tests aus Übung 15 instabil.
  devIndicators: false,
};

export default nextConfig;
