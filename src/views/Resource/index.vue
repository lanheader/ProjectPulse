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
            <el-row>
              <LaplaceTable
                :columns="columns"
                :table-data="tableData"
                @initData="initData"
              />
            </el-row>
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
import { ResourceList } from '@/api/page/resource.js'
import column from '@/views/Resource/js/column'
import LaplaceTable from '@/components/Table/index.vue'

export default {
  meta: {},
  name: 'Resource',
  components: {
    LaplaceTable,
    Pagination
  },
  data() {
    return {
      currentProject: JSON.parse(sessionStorage.getItem('CurrentWorkSpace')),
      searchForm: {
        accessKey: '',
        mobile: '',
        date: [
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          new Date().getTime()
        ]
      },
      createPickerOptions: {
        disabledDate: () => false,
        // 只能选择7天的数据
        onPick: ({ maxDate, minDate }) => {
          this.createPickerOptions.disabledDate = (time) => {
            if (minDate) {
              const min = new Date(minDate).getTime()
              const sevenDaysAfter = new Date(
                min + 7 * 24 * 60 * 60 * 1000
              ).getTime()
              const sevenDaysBefore = new Date(
                min - 7 * 24 * 60 * 60 * 1000
              ).getTime()
              return (
                time.getTime() < sevenDaysBefore ||
                time.getTime() > sevenDaysAfter
              )
            }
          }
        },
        shortcuts: [
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近七天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }
        ]
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
      columns: column,
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
        return this.searchForm.date
          ? this.searchForm.date.map((date) => new Date(date))
          : []
      },
      set(value) {
        // 设置值时，将日期对象转换为时间戳
        this.searchForm.date = value ? value.map((date) => date.getTime()) : []
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化数据
    async initData() {
      const res = await ResourceList({
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
      return this.statusOptions.find(
        (option) => option.value === statusOptionsValue
      )
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
