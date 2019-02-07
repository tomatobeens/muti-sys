// 输入井,用来存储作业信息,后备队列
let inputWell = [
  {
    name: 'JOB1',
    arrHours: 10, // 到达时钟
    arrMins: 0, // 到达分钟
    runTimes: 25, // 需要的运行时间
    size: 15, // 内存需要
    need: 2 // 磁带机需要
  },
  {
    name: 'JOB2',
    arrHours: 10, // 到达时钟
    arrMins: 20, // 到达分钟
    runTimes: 30, // 需要的运行时间
    size: 60, // 内存需要
    need: 1 // 磁带机需要
  },
  {
    name: 'JOB3',
    arrHours: 10, // 到达时钟
    arrMins: 30, // 到达分钟
    runTimes: 10, // 需要的运行时间
    size: 50, // 内存需要
    need: 3 // 磁带机需要
  },
  {
    name: 'JOB4',
    arrHours: 10, // 到达时钟
    arrMins: 35, // 到达分钟
    runTimes: 20, // 需要的运行时间
    size: 10, // 内存需要
    need: 2 // 磁带机需要
  },
  {
    name: 'JOB1',
    arrHours: 10, // 到达时钟
    arrMins: 40, // 到达分钟
    runTimes: 15, // 需要的运行时间
    size: 30, // 内存需要
    need: 2 // 磁带机需要
  }
]

// 就绪队列
let waiting = []
let change = false // 就绪队列有没变化，默认false状态不变

// 动态监听队列变化
waiting = listenWaiting()
console.log('change:' + change)

// 用于记录就绪队列首元素被销毁时的结束时间
let record = {endHours: 0, endMins: 0}

// 动态监听就绪队列的变化
function listenWaiting () {
  let proxyPro = Proxy(waiting, {
    get: function (target, key, receiver) {
      return target[key]
    },
    set: function (target, key, value, receiver) {
      target[key] = value
      change = true
    }
  })
  return proxyPro
}

// 内存100k,磁带机4台
let storage = 100
let tape = 4

// 作业调度
// 最小作业优先
// 为满足条件的作业分配内存和外设，添加进就绪队列
jobSchedule()
function jobSchedule () {
  let minJob = 60
  // 先对后备队列
  inputWell.map((item, index) => {
    // 先假设输入井里面的作业提交时间是递增的
    // 找到最小作业
    if (item.runTimes <= minJob) { minJob = item.runTimes }

    // 就绪队列有进程，队首的开始执行,这里用来实现实时跟踪进程运行进度
    // 执行完成后释放资源，从就绪队列删去
    (function runProcess () {
      storage += waiting[0].size
      tape += waiting[0].need
      waiting = waiting.slice(1)
    })()

    // 先对inputWell里的元素根据作业大小排序
    inputWell.sort(minFirst('runTimes'))

    // 把输入井第一个作业添加进就绪队列，并为其分配内存外设
    addFirstJobToWaiting()

    // 就绪队列有进程，队首的开始执行,执行完后删去完成的资源，释放资源
    startProcess()

    while (inputWell[0] !== null) {
      // 第一个进程的结束时间内输入井有作业
      let process = record
      let job = inputWell[0]
      if (job.arrHours < process.endHours || (job.arrHours ===
            process.endHours && job.arrMins <= process.endMins)) {
        // 从作业中找出作业最小&&有足够的内存外设分配给他
        // 作业顺序已经排好了，看条件二是否满足
        if (job.size <= storage && job.need <= tape) {
          // 建立pcb
          let newPCB = createPCB(job)
          // 添加进waiting
          waiting.push(newPCB)
        }
      } else {
        // 先假定单个作业需要内存小于100k，不然没意义
        // 把输入井第一个作业添加进就绪队列
        addFirstJobToWaiting()
      }
    }
  })
}

// 按key升序排序
function minFirst (propertyName) {
  return function (obj1, obj2) {
    let val1 = obj1[propertyName]
    let val2 = obj2[propertyName]
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}

// 建立pcb,会取得内存外设资源
function createPCB (item) {
  // 取得资源
  storage -= item.size
  tape -= item.need

  // 进程的开始时间
  let beginHours = waiting[0] === null ? item.arrHours : waiting[0].endHours
  let beginMins = waiting[0] === null ? item.arrMins : waiting[0].endMins
  // pcb
  let process = {
    name: item.name,
    runTimes: item.runTimes,
    size: item.size,
    need: item.need,
    beginHours: beginHours, // 开始运行时
    beginMins: beginMins, // 开始运行分
    runningHours: beginHours, // 实时运行时间
    runningMins: beginMins, // 实时运行时间
    endHours: beginHours + Math.floor((beginMins + this.runTimes) / 60),
    endMins: (beginMins + this.runTimes) % 60
  }

  // 删去输入井首元素
  inputWell.splice(0, 1)
  return process
}

// 把输入井的第一个作业添加进就绪队列，并为他分配内存外设
function addFirstJobToWaiting () {
  // 输入井首元素
  let firstJob = inputWell[0]
  // 建立pcb
  let newPCB = createPCB(firstJob)
  // 添加进就绪队列
  waiting.push(newPCB)
}

// 就绪队列有进程，队首的开始执行
function startProcess () {
  // 就绪队列首进程运行结束前就绪队列中是否有新进程加入
  let processing
  let running

  let promise = new Promise(function (resolve, reject) {
    running = setInterval(function () {
      processing = waiting[0]
      processing.runningHours = processing.runningHours + Math.floor((processing.runningMins + 1) / 60)
      processing.runningMins = (processing.runningMins + 1) % 60
      let hours = processing.runningHours
      let mins = process.runningMins
      let endHours = processing.endHours
      let endMins = processing.endMins
      // 进程结束标记
      let over = (hours - processing.beginHours) * 60 + mins

      // 队首进程结束前
      if (hours <= endHours && mins <= endMins) {
        // 就绪队列中有新进程加入
        if (change === true) {
          // 对waiting按优先级进行排序
          waiting.sort(minFirst('runTimes'))
          change = false
        }
      } else if (over > processing.runTimes) {
        // 队首进程结束，释放资源
        storage += processing.size
        tape += processing.need
        record.endHours = processing.runningHours
        record.endMins = processing.runningMins
        waiting.splice(0, 1)
      }
    }, 1000)
  })

  promise.then()
  clearInterval(running)
}
