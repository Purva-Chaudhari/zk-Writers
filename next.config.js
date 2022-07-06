/** @type {import('next').NextConfig} */


const nextConfig = {
    env: {
        PRIVATE_KEY:process.env.PRIVATE_KEY,
        ZK_CONTRACT_ADDRESS:process.env.ZK_CONTRACT_ADDRESS,
        MATIC_URL:process.env.MATIC_URL,
        PROVIDER_URL:process.env.PROVIDER_URL,
        API_TOKEN:process.env.API_TOKEN
    },

    //pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],

    reactStrictMode: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        if (!isServer) {
            config.plugins.push(
                new webpack.ProvidePlugin({
                    global: "global"
                })
            )

            config.resolve.fallback = {
                fs: false,
                stream: false,
                crypto: false,
                os: false,
                readline: false,
                ejs: false,
                assert: require.resolve("assert"),
                path: false
            }

            return config
        }

        return config
    }
}

module.exports = nextConfig
