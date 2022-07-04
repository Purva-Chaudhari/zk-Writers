/** @type {import('next').NextConfig} */


const nextConfig = {
    env: {
        PRIVATE_KEY:"ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        ZK_CONTRACT_ADDRESS:"0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
        PROVIDER_URL:"http://localhost:8545",
        API_TOKEN:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk4MDU1NmE5NzM0RTkyNGJGRDFkNjA4QjA1QTk3OGIyQmY2RjhkMWMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTYyNTE1NjUxMjUsIm5hbWUiOiJaSy1Xcml0ZXJzIn0.kMlCoMmwOKS0x6UU2hi5ZBGcK_cWjfC9n2-qpfIbB_k"
    },

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
