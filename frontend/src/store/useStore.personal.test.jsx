// @vitest-environment happy-dom
import { beforeEach, afterEach, expect, it, vi } from 'vitest'
vi.mock('../lib/demo.js', async original => ({ ...await original(), PERSONAL: true, DEMO: false }))
vi.mock('../lib/api.js', () => ({ api: vi.fn(), setRemoteAuth: vi.fn() }))
import { api } from '../lib/api.js'
import { effectiveLang } from '../lib/default-lang.js'
import { useStore, freshState } from './useStore.js'

beforeEach(() => {
  localStorage.clear()
  api.mockClear()
  useStore.setState({ S: freshState(), user: null, ready: false, config: null })
})
afterEach(() => { localStorage.clear() })
it('boots an empty Chinese journal without a server, account or demo history', async () => {
  await useStore.getState().boot()
  const store = useStore.getState()
  expect(store.ready).toBe(true)
  expect(store.isGuest()).toBe(true)
  expect(store.user).toBe(null)
  expect(store.S.workouts).toEqual([])
  expect(store.S.bodyweight).toEqual([])
  expect(store.S.routines).toEqual([])
  expect(effectiveLang(store.S, store.config)).toBe('zh')
  expect(localStorage.getItem('gym_demo_seeded_v1')).toBe(null)
  expect(api).not.toHaveBeenCalled()
})
it('keeps real entries and the chosen language across another boot and config refresh', async () => {
  const S = { ...freshState(), lang: 'en', langAuto: false, bodyweight: [{ d: '2026-01-01', v: 70 }], workouts: [{ id: 'test-workout', entries: [] }] }
  useStore.setState({ S: structuredClone(S) })
  await useStore.getState().boot()
  await useStore.getState().boot()
  await useStore.getState().refreshConfig()
  expect(useStore.getState().S).toEqual(S)
  expect(effectiveLang(useStore.getState().S, useStore.getState().config)).toBe('en')
  expect(api).not.toHaveBeenCalled()
})

it('restores a JSON backup locally and persists it without calling the server', async () => {
  await useStore.getState().boot()
  const backup = JSON.parse(JSON.stringify({ ...freshState(), bodyweight: [{ d: '2026-01-01', v: 70 }] }))
  useStore.getState().importBackup(backup)
  expect(useStore.getState().S.bodyweight).toEqual(backup.bodyweight)
  expect(JSON.parse(localStorage.getItem('gym_state_v1')).bodyweight).toEqual(backup.bodyweight)
  await useStore.getState().boot()
  expect(useStore.getState().S.bodyweight).toEqual(backup.bodyweight)
  expect(api).not.toHaveBeenCalled()
})
