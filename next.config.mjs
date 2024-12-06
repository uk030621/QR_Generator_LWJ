const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/v1/create-qr-code/**",
      },
      {
        protocol: "https",
        hostname: "media.guim.co.uk",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
