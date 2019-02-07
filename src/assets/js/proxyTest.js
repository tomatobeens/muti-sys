let obj1 = []
let change = false
function proxyT () {
  var obj = new Proxy(obj1, {
    get: function (target, key, receiver) {
      return target[key]
    },
    set: function (target, key, value, receiver) {
      target[key] = value
      change = true
      console.log('push')
      // return true
    }
  })
  return obj
}

obj1 = proxyT()
obj1[0] = {a: 'hey'}
console.log(`${obj1[0].a}`)
console.log(change)
