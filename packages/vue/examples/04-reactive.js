function isObject(val) {
  return val !== null && typeof val === 'object'
}

// 避免重复代理
const toProxy = new WeakMap() // obj: observed
const toRaw = new WeakMap() // observed: obj

function reactive(obj) {
  if (typeof obj !== 'object' && obj != null) return obj

  if (toProxy.has(obj)) {
    return toProxy.get(obj) // 返回代理对象observed
  }
  if (toRaw.has(obj)) {
    return obj
  }
  const observed = new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      console.log(`获取${key}:${res}`)
      return isObject(res) ? reactive(res) : res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      console.log(`设置${key}:${value}`)
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      console.log(`删除${key}:${res}`)
      return res
    }
  })

  toProxy.set(obj, observed)
  toRaw.set(observed, obj)

  return observed
}

const state = reactive({
  foo: 'foo',
  baz: { a: 1 },
  arr: [1, 2, 3]
})

console.log(reactive(state) === state)

state.foo
state.foo = 'fooo'
state.bar = 'baz'
state.bar
delete state.foo

state.baz.a = 2

state.arr
state.arr.push(4)
