// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
vi.mock('./demo.js', async original => ({ ...await original(), PERSONAL: true }))
import { api, apiBlob, apiUpload, beacon, setRemoteAuth } from './api.js'

afterEach(() => { vi.unstubAllGlobals(); setRemoteAuth('', null) })
it('personal Pages never sends API requests, files or activity beacons, even with a stale remote', async () => {
  const fetch = vi.fn(), sendBeacon = vi.fn(), XHR = vi.fn()
  vi.stubGlobal('fetch', fetch)
  vi.stubGlobal('navigator', { ...navigator, sendBeacon })
  setRemoteAuth('https://old-server.example', 'stale-test-token')
  await expect(api('/api/data', { method: 'PUT', body: '{}' })).rejects.toMatchObject({ code: 'local-only', status: 0 })
  await expect(apiBlob('/api/media/test', { fetchImpl: fetch })).rejects.toMatchObject({ code: 'local-only' })
  await expect(apiUpload('/api/media/test', new Blob(), 'image/png', { XHR })).rejects.toMatchObject({ code: 'local-only' })
  expect(beacon('/api/activity', {})).toBe(false)
  expect(fetch).not.toHaveBeenCalled()
  expect(XHR).not.toHaveBeenCalled()
  expect(sendBeacon).not.toHaveBeenCalled()
})
