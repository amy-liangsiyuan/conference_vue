module.exports = {
    publicPath: '/',
    devServer: {
        https: false,
        proxy: {
            '/api': {
                changeOrigin: true,
                target: 'http://localhost:9001',
                // secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            },

        },
    },


}
