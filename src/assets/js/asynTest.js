let time
let i = []
let j = []

let promise = new Promise(function (resolve, reject) {
  setInterval(() => {
    i.push(1)
    resolve(i)
    if (i.length > 5) { resolve(i); clearInterval(time) }
  }, 1000)
})

promise.then(item => {
  if (item.length > 2) {
    j.push(item[0])
    console.log(j)
  }
})
clearInterval(time)
