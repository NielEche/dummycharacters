/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.ctfassets.net',
          port: '',
          pathname: '/**',
        },
      ],
      unoptimized: true, // Disable image optimization for static export
    },
    output: 'export', // Static export
  };
  
  export default nextConfig;
  