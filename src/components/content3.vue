<template>
  <div class="content">
    <table class="table table-hover table-bordered">
      <thead>作业队列</thead>
      <tbody>
        <tr class="active">
          <td>作业名</td>
          <td>运行时间</td>
          <td>到达时间</td>
          <td>磁带机需要</td>
          <td>内存需要</td>
        </tr>
        <tr v-for="(job,index) in inputWell" :key="index">
          <td>{{job.name}}</td>
          <td>{{job.runTimes}}</td>
          <td>{{job.arrHours}}:{{job.arrMins}}</td>
          <td>{{job.need}}</td>
          <td>{{job.size}}</td>
        </tr>
      </tbody>
    </table>
    <table class="table table-hover table-bordered">
      <thead>进程队列</thead>
      <tbody>
        <tr class="active">
          <td>进程名</td>
          <td>开始时间</td>
          <td>实际运行时间</td>
          <td>磁带机需要</td>
          <td>内存需要</td>
        </tr>
        <tr v-if="waiting[0] !== undefined" v-for="(item,index) in waiting" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.beginHours}}:{{item.beginMins}}</td>
          <td>{{item.runningHours}}:{{item.runningMins}}</td>
          <td>{{item.need}}</td>
          <td>{{item.size}}</td>
        </tr>
      </tbody>
    </table>
    <table class="table table-hover table-bordered">
      <thead>平均周转时间</thead>
      <tbody>
        <tr class="active">
          <td>作业名</td>
          <td>周转时间/min</td>
          <td>平均周转时间/min</td>
        </tr>
        <tr v-if="averageTime[0] !== undefined" v-for="(item, index) in averageTime" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.turnAroundTime}}</td>
          <td>{{average}}</td>
        </tr>
      </tbody>
    </table>
    <div class="container-fluid">
          <p>提交新作业</p>
          <div class="row">
            <label for="name" class="col-md-2 control-label">作业名</label>
            <input type="text" id="name" name="" class="col-md-3" v-model="newName">
            <label for="runTimes" class="col-md-2 control-label">运行时间</label>
            <input type="number" id="runTimes" name="" class="col-md-3" v-model="newRunTimes">
          </div>
          <div class="row">
            <label for="arrHours" class="col-md-2 control-label">到达的小时</label>
            <input type="number" id="arrHours" name="" class="col-md-3 " v-model="newArrHours">
            <label for="arrMins" class="col-md-2 control-label">到达的分钟</label>
            <input type="number" id="arrMins" name="" class="col-md-3 " v-model="newArrMins">
          </div>
          <div class="row">
            <label for="size" class="col-md-2 control-label">内存需要</label>
            <input type="number" id="size" name="" class="col-md-3" v-model="newSize">
            <label for="need" class="col-md-2 control-label">磁带机需要</label>
            <input type="number" id="need" name="" class="col-md-3" v-model="newNeed">
          </div>
          <button class="btn btn-success" @click="addNewJobIntoInputWell">submit</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      inputWell: [
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
          name: 'JOB5',
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
      recordBefore: {beforeH: 0, beforeM: 0},
      // 内存100k,磁带机4台
      storage: 100,
      tape: 4,
      key: true,
      averageTime: [],
      newName: '',
      newRunTimes: 0,
      newArrHours: 0,
      newArrMins: 0,
      newNeed: 0,
      newSize: 0
    }
  },

  computed: {
    // 计算平均周转时间
    average: function () {
      let sum = this.averageTime.reduce(function (average, item) {
        return average + item.turnAroundTime
      }, 0)
      let len = this.averageTime.length
      let result = sum / len
      return result
    }
  },

  methods: {
    addNewJobIntoInputWell: function () {
      let newJob = {
        name: this.newName,
        arrHours: this.newArrHours, // 到达时钟
        arrMins: this.newArrMins, // 到达分钟
        runTimes: this.newRunTimes, // 需要的运行时间
        size: this.newSize, // 内存需要
        need: this.newNeed // 磁带机需要
      }
      this.inputWell.push(newJob)
      window.alert('提交成功')
    }
  },

  created () {
    let _this = this
    _this.$nextTick(function () {
      _this.runTime = setInterval(startProcess, 1000)
    })

    function startProcess () {
      // if (_this.waiting[0] === undefined && _this.inputWell[0] === undefined) { clearInterval(_this.runTime) }
      // 就绪队列首进程运行结束前就绪队列中是否有新进程加入
      let processing
      // let str
      // for (let i = 0; i < _this.inputWell.length; i++) {
      //   str += '-' + _this.inputWell[i].name
      // }
      // document.getElementById('well').innerHTML = str

      addJobIntoWaiting()
      processing = _this.waiting[0]

      let h = _this.recordBefore.beforeH === 0 ? processing.runningHours : _this.recordBefore.beforeH
      let m = _this.recordBefore.beforeH === 0 ? processing.runningMins : _this.recordBefore.beforeM

      console.log('m:' + m)
      processing.trueM++
      processing.runningHours = h + Math.floor((m + 1) / 60)
      processing.runningMins = (m + 1) % 60

      console.log('运行进程的runningMins:' + processing.runningMins)

      let hours = processing.runningHours
      let mins = processing.runningMins

      // document.getElementById('waiting').innerHTML = processing.name
      // document.getElementById('wRunH').innerHTML = hours
      // document.getElementById('wRunM').innerHTML = mins

      console.log('运行进程的runningHours:' + hours)
      // let endHours = processing.endHours
      // let endMins = processing.endMins
      // // 进程结束标记
      // let over = (hours - processing.beginHours) * 60 + mins

      // 队首进程结束前
      console.log('进程当前的运行时间：' + processing.trueM)
      if (processing.trueM < processing.runTimes) {
        _this.recordBefore.beforeH = hours
        _this.recordBefore.beforeM = mins
        console.log(processing.name + '进程还在运行.......' + hours + ':' + mins +
          ' trueM:' + processing.trueM + ' recordBefore.m' + _this.recordBefore.beforeM)
      } else if (processing.trueM >= processing.runTimes) {
        // 计算周转时间并且保存到averageTime
        let a = {
          name: processing.name,
          turnAroundTime: (hours - processing.beginHours) * 60 + (mins - processing.beginMins)
        }
        _this.averageTime.push(a)

        // 队首进程结束，释放资源
        _this.storage += processing.size
        _this.tape += processing.need
        processing.endHours = hours
        processing.endMins = mins
        _this.recordBefore.beforeH = hours
        _this.recordBefore.beforeM = mins
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
      console.log('waiting[0]:' + _this.waiting[0] + 'item.arrMins:' + item.arrMins)
      // 进程的开始时间
      // let record2 = _record[0]
      let beginH = _this.waiting[0] === undefined ? item.arrHours : _this.recordBefore.beforeH
      let beginM = _this.waiting[0] === undefined ? item.arrMins : _this.recordBefore.beforeM
      console.log('创建' + item.name + '的开始运行时间:' + beginM)
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
      // addFirstJobToWaiting()

      if (_this.inputWell[0] !== undefined) {
        // 第一个进程的结束时间内输入井有作业
        // let recordArr = _this.record
        // let len = recordArr.length - 1
        // let beforeProcess = record[len]
        // let inputWell0 = inputWell[0]
        // let processing = _this.waiting[0]

        if (_this.recordBefore.beforeH === 0) {
          console.log('添加首进程')
          addFirstJobToWaiting() // 添加首个进程
        } else {
          let first = 0
          let index2 = 0
          _this.inputWell.forEach((item, index) => {
            if (item.arrHours < _this.recordBefore.beforeH || (item.arrHours === _this.recordBefore.beforeH && item.arrMins <= _this.recordBefore.beforeM)) {
              if (item.size <= _this.storage && item.need <= _this.tape) {
                if (first === 0) {
                  index2 = index
                  first = item
                } else if (item.runTimes < first.runTimes) {
                  index2 = index
                  first = item
                }
              }
            }
          })
          if (first !== 0) {
            console.log('取出输入井的元素名称：' + first.name + ' 索引：' + index2)
            let newProcess = createPCB(first, index2)
            console.log('添加抢占进程:' + newProcess.name)
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
  }
}
</script>

<style>

</style>
