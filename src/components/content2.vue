<template>
  <div class="content">
    <table>
      <tbody>
        <tr>
          <th v-if="waiting[0]">1{{waiting[0].name}}</th>
        </tr>
        <tr>
          <th v-if="waiting[0]">{{waiting[0].runningHours}}</th>
          <th v-if="waiting[0]">{{waiting[0].runningMins}}</th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <th>record</th>
          <th>{{record.endHours}}</th>
          <th>{{record.endMins}}</th>
          <th></th>
        </tr>
        <tr>
          <th>storage{{storage}}</th>
          <th>tape{{tape}}</th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </tbody>
    </table>
    <button >提交作业</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 输入井,用来存储作业信息,后备队列
      inputWell: [
        {
          name: 'JOB1',
          arrHours: 10, // 到达时钟
          arrMins: 5, // 到达分钟
          runTimes: 20, // 需要的运行时间
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
      ],
      waiting: [], // 就绪队列
      // 就绪队列有没变化，默认false状态不变
      change: false,
      // 用于记录就绪队列首元素被销毁时的结束时间
      record: [],
      // 内存100k,磁带机4台
      storage: 100,
      tape: 4,
      key: true
    }
  },
  // methods: {
  //   // 把输入井的第一个作业添加进就绪队列，并为他分配内存外设
  //   addFirstJobToWaiting () {
  //     if (this.inputWell[0] !== undefined) {
  //       // 输入井首元素
  //       let firstJob = this.inputWell[0]
  //       // 建立pcb
  //       let newPCB = this.createPCB(firstJob)
  //       // 添加进就绪队列
  //       this.waiting.push(newPCB)
  //       // waiting改变就重排
  //       this.waiting.sort(this.minFirst('runTimes'))
  //     } else {
  //       console.log('作业队列已经空')
  //     }
  //   },

  //   // 建立pcb,会取得内存外设资源
  //   createPCB (item) {
  //     // 取得资源
  //     this.storage -= item.size
  //     this.tape -= item.need
  //     console.log('this.waiting[0].h:' + this.waiting[0])
  //     // 进程的开始时间
  //     let beginH = this.waiting[0] === undefined ? item.arrHours : this.record.endHours
  //     let beginM = this.waiting[0] === undefined ? item.arrMins : this.record.endMins
  //     // pcb
  //     let process = {
  //       name: item.name,
  //       runTimes: item.runTimes,
  //       size: item.size,
  //       need: item.need,
  //       beginHours: beginH, // 开始运行时
  //       beginMins: beginM, // 开始运行分
  //       runningHours: beginH, // 实时运行时间
  //       runningMins: beginM, // 实时运行时间
  //       endHours: beginH + Math.floor((beginM + this.runTimes) / 60),
  //       endMins: (beginM + this.runTimes) % 60
  //     }

  //     // 删去输入井首元素
  //     this.inputWell.splice(0, 1)
  //     return process
  //   },

  //   // 把作业添加进就绪队列
  //   addJobIntoWaiting () {
  //     console.log('addJob')
  //     // 先对inputWell里的元素根据作业大小排序
  //     this.inputWell.sort(this.minFirst('runTimes'))

  //     // 把输入井第一个作业添加进就绪队列，并为其分配内存外设
  //     // this.addFirstJobToWaiting()

  //     if (this.inputWell[0] !== undefined) {
  //       // 第一个进程的结束时间内输入井有作业
  //       let beforeProcess = this.record
  //       let job = this.inputWell[0]
  //       console.log('job.h:' + job)

  //       // 从作业中找出作业最小&&有足够的内存外设分配给他
  //       if (job.size <= this.storage && job.need <= this.tape) {
  //         if (beforeProcess.endHours === 0) {
  //           this.addFirstJobToWaiting() // 添加首个进程
  //         } else if (job.arrHours < beforeProcess.endHours || (job.arrHours ===
  //           beforeProcess.endHours && job.arrMins <= beforeProcess.endMins)) {
  //         // 作业顺序已经排好了，看条件二是否满足
  //           // 建立pcb
  //           let newPCB = this.createPCB(job)
  //           // 添加进waiting
  //           this.waiting.push(newPCB)
  //           // waiting改变就重排
  //           this.waiting.sort(this.minFirst('runTimes'))
  //         } else {
  //         // 先假定单个作业需要内存小于100k，不然没意义
  //         // 把输入井第一个作业添加进就绪队列
  //           this.addFirstJobToWaiting()
  //         }
  //       }
  //     }
  //   },

  //   minFirst (propertyName) {
  //     return function (obj1, obj2) {
  //       let val1 = obj1[propertyName]
  //       let val2 = obj2[propertyName]
  //       if (val1 < val2) {
  //         return -1
  //       } else if (val1 > val2) {
  //         return 1
  //       } else {
  //         return 0
  //       }
  //     }
  //   }
  // },
  created () {
    let _this = this
    _this.$nextTick(function () {
      _this.runTime = setInterval(startProcess, 1000)
    })

    function startProcess () {
      // 就绪队列首进程运行结束前就绪队列中是否有新进程加入
      let processing
      addJobIntoWaiting()
      processing = _this.waiting[0]
      let beforeProcess = _this.waiting[1] ? _this.waiting[1] : undefined
      let h
      let m
      if (beforeProcess !== undefined) {
        h = beforeProcess.runningHours
        m = beforeProcess.runningMins
      }

      console.log('m:' + m)
      processing.trueM++
      console.log('processiong.trueM:' + processing.trueM)
      processing.runningHours = h ? h + Math.floor((m + 1) / 60) : processing.runningHours + Math.floor((processing.runningMins + 1) / 60)
      processing.runningMins = m ? (m + 1) % 60 : (processing.runningMins + 1) % 60

      console.log('运行进程的runningMins:' + processing.runningMins)

      let hours = processing.runningHours
      let mins = processing.runningMins
      console.log('mins:' + hours)
      // let endHours = processing.endHours
      // let endMins = processing.endMins
      // // 进程结束标记
      // let over = (hours - processing.beginHours) * 60 + mins

      // 队首进程结束前
      if (processing.trueM < processing.runTimes) {
        console.log(processing.name + '进程还在运行.......' + hours + ':' + mins + ' trueM:' + processing.trueM)
      } else if (processing.trueM > processing.runTimes) {
        // 队首进程结束，释放资源
        _this.storage += processing.size
        _this.tape += processing.need
        processing.endHours = hours
        processing.endMins = mins
        let val = _this.waiting.splice(0, 1)
        _this.record.push(val)
      }
    }

    // 把输入井的第一个作业添加进就绪队列，并为他分配内存外设
    function addFirstJobToWaiting () {
      if (_this.inputWell[0] !== undefined) {
        // 输入井首元素
        let firstJob = _this.inputWell[0]
        console.log('addFirstJob：' + firstJob.arrMins)
        // 建立pcb
        let newPCB = createPCB(firstJob, 0)
        // 添加进就绪队列
        _this.waiting.push(newPCB)
        // waiting改变就重排
        _this.waiting.sort(minFirst('runTimes'))
      } else {
        console.log('作业队列已经空')
      }
    }

    // 建立pcb,会取得内存外设资源
    function createPCB (item, index) {
      // 取得资源
      _this.storage -= item.size
      _this.tape -= item.need
      console.log('_this.waiting[0]:' + _this.waiting[0] + 'item.arrMins:' + item.arrMins)
      // 进程的开始时间
      // let record2 = _this.record[0]
      let beginH = _this.waiting[0] === undefined ? item.arrHours : _this.waiting[0].runningHours
      let beginM = _this.waiting[0] === undefined ? item.arrMins : _this.waiting[0].runningMins
      console.log('创建pcb的beginM:' + beginM)
      // pcb
      // record: {endHours: 0, endMins: 0, runHours: 0, runMins: 0}
      let process = {
        name: item.name,
        runTimes: item.runTimes,
        size: item.size,
        need: item.need,
        beginHours: beginH, // 开始运行时
        beginMins: beginM, // 开始运行分
        runningHours: beginH, // 实时运行时间
        runningMins: beginM, // 实时运行时间
        endHours: 0,
        endMins: 0,
        trueM: 0
      }

      console.log('process.runningMins:' + process.runningMins)

      // 删去输入井首元素
      _this.inputWell.splice(index, 1)
      return process
    }

    // 把作业添加进就绪队列
    function addJobIntoWaiting () {
      // 把输入井第一个作业添加进就绪队列，并为其分配内存外设
      // _this.addFirstJobToWaiting()

      if (_this.inputWell[0] !== undefined) {
        // 第一个进程的结束时间内输入井有作业
        let recordArr = _this.record
        // let len = recordArr.length - 1
        // let beforeProcess = _this.record[len]
        // let inputWell0 = _this.inputWell[0]
        let processing = _this.waiting[0]

        if (recordArr[0] === undefined && _this.key === true) {
          console.log('添加首进程')
          addFirstJobToWaiting() // 添加首个进程
          _this.key = false
        } else {
          let first = 0
          let index2
          _this.inputWell.forEach((item, index) => {
            if (item.arrHours === processing.runningHours && item.arrMins < processing.runningMins &&
              item.size <= _this.storage && item.need <= _this.tape) {
              if (first === 0) {
                first = item
                index2 = 0
              } else if (first.runTimes > item.runTimes) {
                first = item
                index2 = index
              }
            }
          })
          if (first !== 0) {
            console.log('添加抢占进程')
            let newProcess = createPCB(first, index2)
            _this.waiting.push(newProcess)
            // waiting改变就重排
            _this.waiting.sort(minFirst('runTimes'))
            console.log(_this.waiting[0].name + '是首进程')
          }
        }
      }
    }

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
  },
  beforeDestroyed () {
    if (this.runTime) { clearInterval(this.runTime) }
  }
}
</script>

<style>

</style>
