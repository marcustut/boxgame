import reactRefresh from '@vitejs/plugin-react-refresh'
import checker from 'vite-plugin-checker'
import ssr from 'vite-plugin-ssr/plugin'
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
    checker({
      typescript: true,
      overlay: true,
      eslint: {
        files: ['src', 'server'],
        extensions: ['.ts', '.tsx']
      }
    })
  ]
})

export default config
