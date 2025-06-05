const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    historyApiFallback: true, // ← permite refresh pe rute gen /harta-anunturi
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // backendul tău
        changeOrigin: true
      }
    }
  }
});
