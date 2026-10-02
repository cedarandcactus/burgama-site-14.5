import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'

const require = createRequire(import.meta.url)
const constants = require('next/dist/client/components/router-reducer/router-reducer-types')
const nextRequire = createRequire(require.resolve('next/package.json'))

function loadQueue(format, environment = 'development', browser = true) {
  const path = `next/dist/${format === 'esm' ? 'esm/' : ''}client/components/use-action-queue.js`
  let source = readFileSync(require.resolve(path), 'utf8')
  const actions = []
  let reloads = 0
  const react = {
    useState: state => [state, () => {}],
    useOptimistic: state => [state, () => {}],
    useMemo: callback => callback(),
  }
  const context = {
    exports: {},
    process: { env: { NODE_ENV: environment } },
    ...(browser ? { window: { location: { reload: () => { reloads++ } } } } : {}),
    require: name => {
      if (name === 'react') return react
      if (name.endsWith('router-reducer-types')) return constants
      if (name.endsWith('is-thenable')) return { isThenable: () => false }
      if (name.endsWith('use-app-dev-rendering-indicator')) {
        return { useAppDevRenderingIndicator: () => callback => callback() }
      }
      return nextRequire(name)
    },
  }
  if (format === 'esm') {
    source = source.replace(/^import .*;\n/gm, '').replace(/export function /g, 'function ')
    Object.assign(context, constants, react, { React: react, isThenable: () => false })
    source += '\nexports.dispatchAppRouterAction = dispatchAppRouterAction; exports.useActionQueue = useActionQueue;'
  }
  vm.runInNewContext(source, context, { filename: path })
  return {
    dispatch: context.exports.dispatchAppRouterAction,
    mount: () => context.exports.useActionQueue({ state: {}, dispatch: action => actions.push(action) }),
    actions,
    reloads: () => reloads,
  }
}

for (const format of ['cjs', 'esm']) {
  test(`${format}: early HMR reloads once instead of throwing`, () => {
    const queue = loadQueue(format)
    queue.dispatch({ type: constants.ACTION_HMR_REFRESH })
    queue.dispatch({ type: constants.ACTION_HMR_REFRESH })
    assert.equal(queue.reloads(), 1)
    assert.deepEqual(queue.actions, [])
  })

  test(`${format}: mounted router still receives HMR and navigation`, () => {
    const queue = loadQueue(format)
    queue.mount()
    const hmr = { type: constants.ACTION_HMR_REFRESH }
    const navigation = { type: constants.ACTION_NAVIGATE }
    queue.dispatch(hmr)
    queue.dispatch(navigation)
    assert.deepEqual(queue.actions, [hmr, navigation])
    assert.equal(queue.reloads(), 0)
  })

  test(`${format}: real initialization errors are not suppressed`, () => {
    const queue = loadQueue(format)
    for (const type of [constants.ACTION_NAVIGATE, constants.ACTION_REFRESH]) {
      assert.throws(() => queue.dispatch({ type }), /Router action dispatched before initialization/)
    }
    assert.equal(queue.reloads(), 0)
  })

  test(`${format}: production and server behavior remain unchanged`, () => {
    for (const queue of [loadQueue(format, 'production'), loadQueue(format, 'development', false)]) {
      assert.throws(() => queue.dispatch({ type: constants.ACTION_HMR_REFRESH }), /Router action dispatched before initialization/)
      assert.equal(queue.reloads(), 0)
    }
  })
}
