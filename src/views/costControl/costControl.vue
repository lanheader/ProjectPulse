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
              <span>费控</span>
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
              <el-col :span="12">
                <el-form-item label="AccessKey">
                  <el-select
                    v-model="searchForm.accessKey"
                    clearable
                    filterable
                    disabled
                    placeholder="请选择服务名"
                  >
                    <el-option
                      v-for="item in akList"
                      :key="item.id"
                      :label="item.accessKey"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="租户">
                  <el-input
                    v-model="searchForm.tenantKey"
                    type="text"
                    placeholder="请输入租户"
                    disabled
                  />
                </el-form-item>
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
                label="租户"
                min-width="160px"
                fixed
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="f12">{{
                    scope.row.tenantKey
                  }}</span>

                </template>
              </el-table-column>
              <el-table-column
                label="服务"
                min-width="140px"
                align="center"
                show-overflow-tooltip
                prop="serviceName"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.serviceName }} </span>
                </template>
              </el-table-column>
              <el-table-column
                label="余额"
                min-width="110px"
                prop="credit"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.credit }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="总额"
                min-width="110px"
                prop="totalCredit"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.totalCredit }}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                min-width="180px"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.totalCredit === -1"
                    type="text"
                    @click="btOpenControl(scope.row)"
                  >
                    开启费控
                  </el-button>
                  <el-button
                    v-if="scope.row.totalCredit !== -1"
                    type="text"
                    @click="btCloseControl(scope.row)"
                  >
                    关闭费控
                  </el-button>
                  <el-button
                    v-if="scope.row.totalCredit !== -1"
                    type="text"
                    @click="btPay(scope.row)"
                  >
                    充值
                  </el-button>
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
    <el-dialog :title="title" :visible.sync="controlDialogFormVisible">
      <el-form ref="controlForm" :model="controlForm" :rules="controlFormRules" label-width="100px">
        <el-form-item
          v-if="title==='充值'"
          label="租户"
          :label-width="controlForm.formLabelWidth"
          prop="id"
        >
          <el-input
            v-model="controlForm.tenantKey"
            type="text"
            disabled
            placeholder="请输入租户"
          />
        </el-form-item>
        <el-form-item
          label="服务"
          :label-width="controlForm.formLabelWidth"
          prop="serviceId"
        >
          <el-select
            v-model="controlForm.serviceId"
            clearable
            :disabled="title!=='充值'"
            placeholder="请选择服务名"
          >
            <el-option
              v-for="item in serviceList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="title!=='关闭费控'"
          label="余额"
          :label-width="controlForm.formLabelWidth"
          prop="credit"
        >
          <el-input
            v-model="controlForm.credit"
            type="number"
            placeholder="请输入内容"
            maxlength="6"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="controlDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('controlForm')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import {
  AKList,
  ServiceList,
  ControlList,
  Recharge,
  CloseTenant
} from '@/api/page/projects.js'
import { mapGetters } from 'vuex'
import { _formatDate } from '@/utils/validate.js'

export default {
  meta: {
  },
  name: 'Control',
  components: {
    Pagination
  },
  filters: {
    // 格式化时间
    formatDate(date) {
      if (date === null) {
        return ''
      } else {
        return _formatDate(date)
      }
    }
  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 30,
      pageNo: 1,
      searchForm: {
        accessKey: '',
        keyword: ''
      },
      controlDialogFormVisible: false,
      akList: [],
      tenantList: [],
      serviceList: [],
      title: '',
      controlFormRules: {
        serviceId: [
          { required: true, message: '请选则服务', trigger: 'change' }
        ],
        credit: [
          { required: true, message: '请输入余额', trigger: 'change' },
          { min: 0, message: '最小值为0', trigger: 'change' },
          { max: 1000000, message: '最大值为100万', trigger: 'change' }
        ]
      },
      controlForm: {
        formLabelWidth: '120px',
        id: null,
        tenantKey: null,
        serviceId: null,
        credit: null
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.initData()
  },
  created() {
    // 判断this.$route.params如果存在赋值给this.searchForm，如果不存在，路由跳转至上一页
    if (this.$route.params.accessKey === undefined || this.$route.params.tenantKey === undefined) {
      this.$router.go(-1)
    } else {
      this.searchForm.accessKey = this.$route.params.accessKey
    }
  },
  methods: {
    // 获取服务列表
    async initServiceList() {
      const res = await ServiceList({
        pageSize: 100,
        pageNo: 1
      })
      this.serviceList = res.data
    },
    // 获取ak列表
    async initAKList() {
      this.currentProject = JSON.parse(sessionStorage.getItem('CurrentWorkSpace'))
      const res = await AKList({
        projectId: this.currentProject.id,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      })
      if (res.data.totalSize === null) {
        res.data.totalSize = 0
        res.data.data = []
        this.searchForm.accessKey = null
      } else {
        this.akList = res.data.data
        if (this.akList.length > 0) {
          this.searchForm.accessKey = this.akList[0].id
        }
      }
    },
    // 费控列表
    async initConsoleList() {
      // 获取当前项目
      this.currentProject = JSON.parse(sessionStorage.getItem('CurrentWorkSpace'))
      const res = await ControlList({
        tenantId: this.$route.params.id,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      })

      // 如果data.totalSize为null 则赋值为0
      if (res.data.totalSize === null) {
        res.data.totalSize = 0
        res.data.data = []
      }
      this.total = res.data.totalSize
      this.tableData = res.data.data
    },
    // 初始化数据
    async initData() {
      this.searchForm.accessKey = this.$route.params.accessKey
      this.searchForm.tenantKey = this.$route.params.tenantKey
      await this.initConsoleList()
      await this.initAKList()
      await this.initServiceList()
    },
    // 充值
    async recharge() {
      const res = await Recharge({
        id: this.controlForm.id,
        credit: this.controlForm.credit
      })
      if (res.code === 0) {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        await this.initData()
        this.controlDialogFormVisible = false
      } else {
        this.$message({
          message: '添加失败',
          type: 'error'
        })
      }
    },
    // 关闭费控
    async closeTenant() {
      const res = await CloseTenant({
        id: this.controlForm.id
      })
      if (res.code === 0) {
        this.$message({
          message: '关闭成功',
          type: 'success'
        })
        await this.initData()
        this.controlDialogFormVisible = false
      } else {
        this.$message({
          message: '关闭失败',
          type: 'error'
        })
      }
    },
    // 开启费控按钮
    btOpenControl(row) {
      this.title = '开启费控'
      this.controlForm.id = row.id
      this.controlForm.serviceId = row.serviceId
      this.controlForm.credit = null
      this.controlDialogFormVisible = true
    },
    // 关闭费控按钮
    btCloseControl(row) {
      this.title = '关闭费控'
      this.controlForm.id = row.id
      this.controlForm.credit = null
      this.controlForm.serviceId = row.serviceId
      this.controlDialogFormVisible = true
    },
    // 充值按钮
    btPay(row) {
      this.title = '充值'
      this.controlForm.id = row.id
      this.controlForm.credit = null
      this.controlForm.tenantKey = row.tenantKey
      this.controlForm.serviceId = row.serviceId
      this.controlDialogFormVisible = true
    },
    // 表单提交,关闭或充值
    onSubmit(controlForm) {
      this.$refs[controlForm].validate((valid) => {
        if (valid) {
          if (this.title === '关闭费控') {
            this.closeTenant()
          } else {
            this.recharge()
          }
        } else {
          this.$message({
            showClose: true,
            message: '请填写相关信息',
            type: 'error'
          })
          return false
        }
      })
    },
    // 页面大小变化或者页码变化时触发
    handleSizeChange() {
      this.initData()
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
