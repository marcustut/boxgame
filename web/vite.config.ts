import reactRefresh from '@vitejs/plugin-react-refresh'
import checker from 'vite-plugin-checker'
import ssr from 'vite-plugin-ssr/plugin'
import WindiCSS from 'vite-plugin-windicss'
import { resolve } from 'path'

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir)
}

// https://vitejs.dev/config/
const config = () => ({
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: pathResolve('src') + '/'
      }
    ]
  },
  plugins: [
    reactRefresh(),
    ssr(),
    WindiCSS({
      scan: {
        // We only have to specify the file extensions we actually use.
        fileExtensions: ['js', 'jsx', 'tsx', 'html']
      }
    }),
    checker({
      typescript: true,
      overlay: true,
      eslint: {
        // files: ['src', 'server'],
        files: [],
        extensions: ['.ts', '.tsx']
      }
    })
  ]
})

export default config
