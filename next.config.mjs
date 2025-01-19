/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: This was disabled to allow for fires to spread correctly in dev mode
  // With randomness, I couldn't figure out how to have the fire spread in an idempotent way
  // With double-rendering, it would always spread in 2 directions dictated by randomness
  // A potential solution is seeding the randomness, but I will leave that for later
  reactStrictMode: false,
};

export default nextConfig;
