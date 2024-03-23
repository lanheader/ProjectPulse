<template>
  <div class="market_out">
    <el-row>
      <el-card
        class="box-card"
        style="height: 100%"
      >
        <div slot="header" class="clearfix">
          <el-row :gutter="20" justify="end">
            <el-col :span="12">
              <span>短信查询</span>
            </el-col>
          </el-row>
        </div>
        <div class="table">
          <el-row>
            <el-form
              ref="searchForm"
              :inline="true"
              :rules="searchFormRules"
              :model="searchForm"
              :show-message="false"
              class="demo-form-inline"
            >
              <el-col :xl="6" :lg="12" :md="12" :sm="12" :xs="24">
                <el-form-item label="方向" prop="type">
                  <el-select
                    v-model="searchForm.type"
                    clearable
                    filterable
                    placeholder="请选择方向"
                    @change="initData"
                  >
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="12" :md="12" :sm="12" :xs="24">
                <el-form-item label="号码" prop="mobile">
                  <el-input
                    v-model="searchForm.mobile"
                    clearable
                    fixed
                    type="text"
                    placeholder="请输入号码"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="20" :sm="20" :xs="24">
                <el-form-item label="创建时间" prop="date" />
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
              <el-col :xl="4" :lg="8" :md="4" :sm="4" :xs="24">
                <el-button type="primary" icon="el-icon-search" @click="btSearch()">查询</el-button>
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
                  <span class="f12">{{
                    scope.row.mobile
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="内容"
                prop="content"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.content }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="提供商"
                min-width="130px"
                align="center"
                prop="channelOut"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.channelOut }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.type=== 1"
                label="状态"
                min-width="100px"
                prop="status"
                align="center"
              >
                <!--     TODO status等于2，并且remark不等于空，status添加提示           -->
                <template slot-scope="scope">
                  <el-tag
                    :key="scope.row.status"
                    :type="getStatusOptions(scope.row.status).tag"
                  >{{ getStatusOptions(scope.row.status).label }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.type=== 1"
                label="操作人"
                min-width="120px"
                prop="operator"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.operator }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="送达/接收时间"
                min-width="180px"
                prop="deliverTime"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.deliverTime }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="更新时间"
                min-width="180px"
                prop="updateTime"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.updateTime }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="创建时间"
                min-width="180px"
                prop="createTime"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.createTime }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
                min-width="180px"
                show-overflow-tooltip
                prop="remark"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.remark }}</span>
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
import { SmsQuery } from '@/api/page/message.js'

export default {
  meta: {
  },
  name: 'Search',
  components: {
    Pagination
  },
  data() {
    return {
      searchForm: {
        type: 1,
        mobile: '',
        date: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date().getTime()]
      },
      searchFormRules: {
        type: [
          { required: true, message: '请选择方向', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
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
      typeOptions: [
        {
          value: 0,
          label: '上行'
        },
        {
          value: 1,
          label: '下行'
        }
      ],
      statusOptions: [
        {
          value: null,
          label: '-',
          tag: 'info'
        },
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
  methods: {
    // 获取项目成员列表
    initData() {
      this.$refs['searchForm'].validate(async(valid, object) => {
        if (valid) {
          const res = await SmsQuery(
            {
              type: this.searchForm.type,
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
        } else {
          for (const validKey in object) {
            this.$message.warning(
              object[validKey][0].message
            )
            break
          }
          return false
        }
      })
    },
    // 查询按钮
    async btSearch() {
      this.pageNo = 1
      await this.initData()
    },
    // 页面大小变化或者页码变化时触发
    handleSizeChange() {
      this.initData()
    },
    // 获取状态对象
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
.table{
  margin: 20px;
}
.customButton{
  display: flex;
  flex-direction: row-reverse;
}
</style>
