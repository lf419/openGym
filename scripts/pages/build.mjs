// Reproducible, empty personal journal for static hosting. Never reads local server data or env.
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { writeFileSync } from 'node:fs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const out = resolve(root, 'frontend/dist-pages')
const env = {
  ...process.env,
  VITE_PERSONAL: '1', VITE_DEMO: '0', VITE_MOBILE: '0',
  VITE_SOURCE_URL: 'https://github.com/lf419/openGym',
  VITE_UMAMI_SRC: '', VITE_UMAMI_ID: '',
  APP_MEDIA_DIR: '', VITE_CLIP_EXT: '',
}
const run = (args, cwd) => {
  const result = spawnSync(process.execPath, args, { cwd, env, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status || 1)
}
run(['node_modules/vite/bin/vite.js', 'build', '--outDir', 'dist-pages'], resolve(root, 'frontend'))
run(['scripts/catalogue/stage-media.mjs', out], root)
writeFileSync(resolve(out, '.nojekyll'), '')
