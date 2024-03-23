<template>
  <div class="market_out">
    <el-row>
      <el-card class="box-card" style="height: 100%">
        <div slot="header" class="clearfix">
          <el-row :gutter="20" justify="end">
            <el-col :span="12">
              <span>计费明细</span>
            </el-col>
          </el-row>
        </div>
        <div class="table">
          <el-row>
            <el-form
              :inline="true"
              :model="searchForm"
              class="demo-form-inline"
            >
              <el-col :xl="6" :lg="12" :md="12" :sm="12" :xs="24">
                <el-form-item label="AccessKey">
                  <el-select
                    v-model="searchForm.accessKey"
                    clearable
                    filterable
                    placeholder="请选择AccessKey"
                    @change="initBiliData"
                  >
                    <el-option
                      v-for="item in akList"
                      :key="item.accessKey"
                      :label="item.accessKey"
                      :value="item.accessKey"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="12" :md="12" :sm="12" :xs="24">
                <el-form-item label="号码">
                  <el-input
                    v-model="searchForm.mobile"
                    clearable
                    type="text"
                    placeholder="请输入号码"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="20" :md="20" :sm="20" :xs="24">
                <el-form-item label="创建时间" />
                <el-date-picker
                  v-model="searchFormDate"
                  type="datetimerange"
                  :picker-options="createPickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                />
              </el-col>
              <el-col :xl="4" :lg="4" :md="4" :sm="4" :xs="24">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="btSearch"
                >查询</el-button>
              </el-col>
            </el-form>
          </el-row>
          <el-row>
            <el-table
              ref="multipleTable"
              :data="tableData"
              row-key="key"
              border
              element-loading-text="拼命加载中..."
              element-loading-spinner="el-icon-loading"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column
                label="号码"
                min-width="100px"
                show-overflow-tooltip
                align="center"
                prop="mobile"
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.mobile }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="AccessKey"
                min-width="200px"
                prop="accessKey"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.accessKey }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="租户"
                min-width="100px"
                align="center"
                prop="tenant"
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.tenant }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="内容"
                prop="content"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.content }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="提供商"
                min-width="130px"
                prop="channelOut"
                align="center"
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.channelOut }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                min-width="100px"
                prop="status"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag
                    :key="scope.row.status"
                    :type="getStatusOptions(scope.row.status).tag"
                  >{{ getStatusOptions(scope.row.status).label }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="操作人"
                min-width="120px"
                prop="operator"
                align="center"
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.operator }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="送达/接收时间"
                min-width="180px"
                prop="deliverTime"
                align="center"
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.deliverTime }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="创建时间"
                min-width="180px"
                prop="createTime"
                align="center"
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.createTime }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row>
            <pagination
              :hidden="total <= 0"
              :total="total"
              :page.sync="pageNo"
              :limit.sync="pageSize"
              @pagination="handleSizeChange"
            />
          </el-row>
        </div>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { SmsDetail } from '@/api/page/message.js'
import {
  AKList
} from '@/api/page/workSpace.js'

export default {
  meta: {
  },
  name: 'Billing',
  components: {
    Pagination
  },
  data() {
    return {
      currentProject: JSON.parse(sessionStorage.getItem('CurrentWorkSpace')),
      searchForm: {
        accessKey: '',
        mobile: '',
        date: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date().getTime()]
      },
      createPickerOptions: {
        disabledDate: () => false,
        // 只能选择7天的数据
        onPick: ({ maxDate, minDate }) => {
          this.createPickerOptions.disabledDate = time => {
            if (minDate) {
              const min = new Date(minDate).getTime()
              const sevenDaysAfter = new Date(min + 7 * 24 * 60 * 60 * 1000).getTime()
              const sevenDaysBefore = new Date(min - 7 * 24 * 60 * 60 * 1000).getTime()
              return time.getTime() < sevenDaysBefore || time.getTime() > sevenDaysAfter
            }
          }
        },
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近七天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      akList: [],
      statusOptions: [
        {
          value: 0,
          label: '已接收',
          tag: 'warning'
        },
        {
          value: 1,
          label: '成功',
          tag: 'success'
        },
        {
          value: 2,
          label: '失败',
          tag: 'danger'
        }
      ],
      tableData: [],
      total: 0,
      pageSize: 30,
      pageNo: 1
    }
  },
  computed: {
    searchFormDate: {
      get() {
        // 获取值时，将时间戳转换为日期对象
        return this.searchForm.date ? this.searchForm.date.map(date => new Date(date)) : []
      },
      set(value) {
        // 设置值时，将日期对象转换为时间戳
        this.searchForm.date = value ? value.map(date => date.getTime()) : []
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化数据
    async initData() {
      await this.initAKList()
      await this.initBiliData()
    },
    // 获取ak列表
    async initAKList() {
      const res = await AKList({
        projectId: this.currentProject.id,
        pageSize: 500,
        pageNo: this.pageNo
      })
      if (res.data.totalSize === null) {
        res.data.totalSize = 0
        res.data.data = []
        this.searchForm.accessKey = null
      } else {
        this.akList = res.data.data
        if (this.akList.length > 0) {
          this.searchForm.accessKey = this.akList[0].accessKey
        }
      }
    },
    async initBiliData() {
      const res = await SmsDetail(
        {
          projectCode: this.currentProject.projectCode,
          accessKey: this.searchForm.accessKey,
          mobile: this.searchForm.mobile,
          startTime: this.searchForm.date[0],
          endTime: this.searchForm.date[1],
          pageSize: this.pageSize,
          pageNo: this.pageNo
        })

      if (res.data.data === null) {
        this.tableData = []
      } else {
        this.tableData = res.data.data
      }
      // 如果data.totalSize为null 则赋值为0
      if (res.data.totalSize === null) {
        res.data.totalSize = 0
      } else {
        this.total = res.data.totalSize
      }
    },
    // 查询按钮
    async btSearch() {
      this.pageNo = 1
      await this.initBiliData()
    },
    // 页面大小变化或者页码变化时触发
    handleSizeChange() {
      this.initData()
    },
    getStatusOptions(statusOptionsValue) {
      return this.statusOptions.find(option => option.value === statusOptionsValue)
    }
  }
}
</script>

<style scoped lang="scss">
.market_out {
  margin: 0 20px 20px 20px;
}
.form-header {
  margin: 10px 0 10px 0;
}
.table {
  margin: 20px;
}
.customButton {
  display: flex;
  flex-direction: row-reverse;
}
</style>
