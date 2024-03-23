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
              <span>API权限</span>
            </el-col>
            <el-col :span="12" class="customButton">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="btBatchApi"
              >批量申请</el-button>
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
              <el-col :xl="5" :lg="8" :md="12" :sm="12" :xs="24">
                <el-form-item label="AccessKey">
                  <el-input
                    v-model="searchForm.accessKey"
                    placeholder="请输入内容"
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="5" :lg="8" :md="12" :sm="12" :xs="24">
                <el-form-item label="服务名">
                  <el-select
                    v-model="searchForm.serviceId"
                    clearabl
                    filterable
                    placeholder="请选择服务名"
                  >
                    <el-option
                      v-for="item in serviceOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xl="5" :lg="8" :md="12" :sm="12" :xs="24">
                <el-form-item label="启用状态">
                  <el-select
                    v-model="searchForm.status"
                    clearable
                    placeholder="请选择启用状态"
                  >
                    <el-option
                      v-for="item in statusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xl="4" :lg="8" :md="12" :sm="12" :xs="24">
                <el-form-item label="关键字">
                  <el-input
                    v-model="searchForm.keyword"
                    type="text"
                    placeholder="请输入关键字，URI、接口名称、接口描述等"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="4" :lg="8" :md="12" :sm="12" :xs="24">
                <el-button type="primary" icon="el-icon-search" @click="btSearch">查询</el-button>
              </el-col>
            </el-form>
          </el-row>
          <el-row>
            <el-table
              ref="multipleTable"
              :data="tableData"
              border
              element-loading-text="拼命加载中..."
              element-loading-spinner="el-icon-loading"
              tooltip-effect="dark"
              :scroll-x="true"
              style="width: 100%"
              :row-key="getRowKeys"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                :selectable="row =>[0,1,4].includes(row.applyStatus)"
                min-width="55px"
                align="center"
                :reserve-selection="true"
              />
              <el-table-column
                label="服务"
                fixed
                min-width="90px"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.serviceName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="URL"
                min-width="200px"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.uri }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="接口名称"
                min-width="200px"
                align="center"
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.name }}
                    <el-tooltip class="item" effect="dark" :content="'接口描述：' + scope.row.detail" placement="top-start">
                      <i class="el-icon-question" style="color: #5406C5" />
                    </el-tooltip>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="QPS"
                min-width="80px"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.maxQps }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="TPD/当前TPD"
                min-width="120px"
                align="center"
                :render-header="atteLeaveTooltip"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="f12">{{ scope.row.timesPerDay }}/{{ scope.row.timesPerDayUsed?scope.row.timesPerDayUsed:'-' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="启用费控"
                min-width="95px"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.demandCostControl===0" class="f12">否</span>
                  <span v-if="scope.row.demandCostControl===1" class="f12">是</span>
                </template>
              </el-table-column>
              <el-table-column
                label="启用状态"
                min-width="100px"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag
                    :type="(statusOptions.find(option => option.value === scope.row.status)).type"
                    class="f12"
                  >
                    {{ (statusOptions.find(option => option.value === scope.row.status)).label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="审核状态"
                min-width="100px"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag
                    :type="(applyStatusOptions.find(option => option.value === scope.row.applyStatus)).type"
                    class="f12"
                  >
                    {{ (applyStatusOptions.find(option => option.value === scope.row.applyStatus)).label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                min-width="180px"
                prop="total"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.applyStatus === 2">-</span>
                  <el-button
                    v-if="scope.row.applyStatus !== 2 && scope.row.status === 3"
                    type="text"
                    @click="btAPIClose(scope.row)"
                  >关闭</el-button>
                  <el-button
                    v-if="scope.row.applyStatus !== 2 && [0,1].includes(scope.row.status)"
                    type="text"
                    @click="btApplyOpening(scope.row)"
                  >申请开通</el-button>
                  <el-button
                    v-if="scope.row.applyStatus !== 2 && scope.row.status === 3"
                    type="text"
                    @click="btApplyAdjustment(scope.row)"
                  >申请调整</el-button>
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
    <el-dialog :title="title" :visible.sync="apiDialogFormVisible">
      <el-form
        ref="apiEnableForm"
        :model="apiEnableForm"
        :rules="apiEnableFormRules"
        label-width="100px"
      >
        <el-form-item
          label="服务"
          :label-width="apiEnableForm.formLabelWidth"
          prop="serviceId"
        >
          <el-select
            v-model="apiEnableForm.serviceId"
            clearable
            placeholder="请选择服务名"
            disabled
          >
            <el-option
              v-for="item in serviceOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="接口名称"
          :label-width="apiEnableForm.formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="apiEnableForm.name"
            type="text"
            placeholder="请输入接口名称"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="URL"
          :label-width="apiEnableForm.formLabelWidth"
          prop="URL"
        >
          <el-input
            v-model="apiEnableForm.URL"
            type="text"
            placeholder="请输入URL"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="接口描述"
          :label-width="apiEnableForm.formLabelWidth"
          prop="detail"
        >
          <el-input
            v-model="apiEnableForm.detail"
            type="text"
            placeholder="请输入接口描述"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="QPS"
          :label-width="apiEnableForm.formLabelWidth"
          prop="maxQps"
        >
          <el-input
            v-model="apiEnableForm.maxQps"
            type="text"
            placeholder="请输入QPS"
          />
        </el-form-item>
        <el-form-item
          label="每日配额"
          :label-width="apiEnableForm.formLabelWidth"
          prop="timesPerDay"
        >
          <el-input
            v-model="apiEnableForm.timesPerDay"
            type="text"
            placeholder="请输入每日配额"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="apiDialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onSubmit('apiEnableForm',title)"
        >{{ title }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="batchApiDialogFormVisible">
      <el-table
        ref="multipleTable"
        :data="multipleSelectionTable.newArry"
        row-key="key"
        border
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="服务"
          min-width="160px"
          fixed
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="f12">{{ scope.row.serviceName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="URL"
          min-width="120px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="f12">{{ scope.row.uri }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="接口名称"
          min-width="110px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="f12">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="接口描述"
          min-width="110px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="f12">{{ scope.row.detail }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="QPS"
          min-width="110px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="f12">{{ scope.row.maxQps }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="QPS"
          min-width="110px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="f12">{{ scope.row.maxQps }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-pagination
          :current-page="multipleSelectionTable.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="multipleSelectionTable.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="apiBatchCreateData.length"
          @size-change="multipleSelectionHandleSizeChange"
          @current-change="multipleSelectionHandleCurrentChange"
        />
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchApiDialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="beatchApiSubmit"
        >提交批量申请</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import {
  AKAPIManager,
  ServiceList,
  AKAPIClose,
  AKAPIOpening,
  AKAPIAdjustment
} from '@/api/page/workSpace.js'
import { mapGetters } from 'vuex'

export default {
  meta: {},
  name: 'ApiManager',
  components: {
    Pagination
  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 30,
      pageNo: 1,
      apiDialogFormVisible: false,
      apiEnableFormRules: {
        id: [{ required: true, message: '请输入备注', trigger: 'change' }],
        serviceId: [
          { required: true, message: '请选择服务名', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入接口名称', trigger: 'change' }],
        URL: [{ required: true, message: '请输入URL', trigger: 'change' }],
        detail: [
          { required: true, message: '请输入接口描述', trigger: 'change' }
        ],
        maxQps: [{ required: true, message: '请输入QPS', trigger: 'change' }],
        timesPerDay: [
          { required: true, message: '请输入每日配额', trigger: 'change' }
        ]
      },
      applyStatusOptions: [
        {
          label: '未提交',
          value: 0,
          type: 'info'
        },
        {
          label: '审批中',
          value: 2,
          type: 'warning'
        },
        {
          label: '审核通过',
          value: 3,
          type: 'success'
        },
        {
          label: '审批驳回',
          value: 4,
          type: 'danger'
        }
      ],
      statusOptions: [
        {
          label: '未开通',
          value: 0,
          type: 'info'
        },
        {
          label: '关闭',
          value: 1,
          type: 'danger'
        },
        {
          label: '已开通',
          value: 3,
          type: 'success'
        }
      ],
      serviceOptions: [],
      searchForm: {
        formLabelWidth: '120px',
        accessKey: '',
        serviceId: null,
        status: null,
        keyword: ''
      },
      title: '申请开通',
      apiEnableForm: {
        formLabelWidth: '120px',
        id: null,
        serviceId: null,
        name: '',
        URL: '',
        detail: '',
        maxQps: '',
        timesPerDay: ''
      },
      // 批量申请
      apiBatchCreateData: [],
      batchApiDialogFormVisible: false,
      multipleSelection: [],
      multipleSelectionTable: {
        newArry: [],
        total: 0,
        pageSize: 10,
        pageNo: 1
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.initData()
    this.getServiceList()
  },
  created() {
    // 判断this.$route.params如果存在赋值给this.searchForm，如果不存在，路由跳转至上一页
    if (this.$route.params.accessKey === undefined) {
      this.$router.go(-1)
    } else {
      this.searchForm.accessKey = this.$route.params.accessKey
    }
  },
  methods: {
    // 获取服务列表
    async getServiceList() {
      const res = await ServiceList()
      if (res.code === 0) {
        this.serviceOptions = res.data
      } else {
        this.$message({
          message: '获取服务列表失败',
          type: 'error'
        })
      }
    },
    // 获取ak列表
    async initData() {
      // 获取当前项目
      this.currentProject = JSON.parse(
        sessionStorage.getItem('CurrentWorkSpace')
      )
      const res = await AKAPIManager({
        credentialId: this.$route.params.id,
        serviceId: this.searchForm.serviceId,
        status: this.searchForm.status,
        keyword: this.searchForm.keyword,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      })
      this.tableData = res.data.data
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
      await this.initData()
    },
    // 申请开通
    async applyOpening(data) {
      this.$confirm(`是否要申请开通？`, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(async() => {
        const res = await AKAPIOpening(data)
        this.apiDialogFormVisible = false
        this.batchApiDialogFormVisible = false
        if (res.code === 0) {
          this.$message({
            message: '申请成功',
            type: 'success'
          })
          // 清空选中
          this.multipleSelection = []
          await this.initData()
        } else {
          this.$message({
            message: '申请失败',
            type: 'error'
          })
        }
      })
    },

    // 申请调整
    async applyAdjustment(data) {
      this.$confirm(`是否要申请调整？`, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(async() => {
        const res = await AKAPIAdjustment(data)
        this.apiDialogFormVisible = false
        if (res.code === 0) {
          this.$message({
            message: '申请成功',
            type: 'success'
          })
          await this.initData()
        } else {
          this.$message({
            message: '申请失败',
            type: 'error'
          })
        }
      })
    },
    // 表单提交,新增凭证
    onSubmit(apiEnableForm, options) {
      this.$refs[apiEnableForm].validate(async(valid) => {
        if (valid) {
          if (options === '申请开通') {
            const data = [
              {
                credentialId: this.$route.params.id,
                serviceApiId: this.apiEnableForm.id,
                maxQps: this.apiEnableForm.maxQps,
                timesPerDay: this.apiEnableForm.timesPerDay
              }
            ]
            await this.applyOpening(data)
          } else if (options === '申请调整') {
            const data = {
              credentialId: this.$route.params.id,
              serviceApiId: this.apiEnableForm.id,
              maxQps: this.apiEnableForm.maxQps,
              timesPerDay: this.apiEnableForm.timesPerDay
            }
            await this.applyAdjustment(data)
          }
        } else {
          this.$message({
            showClose: true,
            message: '请填写备注信息',
            type: 'error'
          })
          return false
        }
      })
    },

    apiDialogData(row) {
      if (row) {
        this.apiDialogFormVisible = true
        return {
          id: row.id,
          serviceId: row.serviceId,
          name: row.name,
          URL: row.uri,
          detail: row.detail,
          maxQps: row.maxQps,
          timesPerDay: row.timesPerDay
        }
      } else {
        this.$message({
          showClose: true,
          message: '请刷新后再试！',
          type: 'error'
        })
      }
    },

    btApplyOpening(row) {
      this.title = '申请开通'
      this.apiEnableForm = this.apiDialogData(row)
    },

    btApplyAdjustment(row) {
      this.title = '申请调整'
      this.apiEnableForm = this.apiDialogData(row)
    },
    async beatchApiSubmit() {
      const data = this.apiBatchCreateData.map(item => {
        return {
          credentialId: this.$route.params.id,
          serviceApiId: item.id,
          maxQps: item.maxQps,
          timesPerDay: item.timesPerDay
        }
      })
      await this.applyOpening(data)
    },
    btBatchApi() {
      // 判断this.multipleSelection如果为空，提示请选择要申请的接口
      if (this.multipleSelection.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择要申请的接口',
          type: 'warning'
        })
        return false
      } else {
        this.apiBatchCreateData = this.multipleSelection
        this.getResultsData()
        this.multipleSelectionTable.total = this.apiBatchCreateData.length
        this.multipleSelectionTable.pageNo = 1
        this.batchApiDialogFormVisible = true
      }
    },
    btAPIClose(row) {
      this.$confirm(`是否要关闭？`, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认关闭',
        cancelButtonText: '放弃修改'
      }).then(async() => {
        const res = await AKAPIClose({
          credentialId: this.$route.params.id,
          serviceApiId: row.id
        })
        this.apiDialogFormVisible = false
        if (res.code === 0) {
          this.$message({
            message: '凭证已关闭',
            type: 'success'
          })
          await this.initData()
        } else {
          this.$message({
            message: '凭证关闭失败',
            type: 'error'
          })
        }
      })
    },
    atteLeaveTooltip(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '每日配额/当前配额使用量',
              placement: 'top',
              style: 'color: #5406C5'
            }
          },
          [h('span', { class: { 'el-icon-question': true }, style: 'color: #5406C5' })]
        )
      ]
    },
    // 页面大小变化或者页码变化时触发
    handleSizeChange() {
      this.initData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    multipleSelectionHandleSizeChange(val) {
      this.multipleSelectionTable.pageSize = val
      this.getResultsData()
    },
    multipleSelectionHandleCurrentChange(val) {
      this.multipleSelectionTable.pageNo = val
      this.getResultsData()
    },
    // 批量创建前端分页
    getResultsData() {
      const list = this.multipleSelection
      // 根据页数显示相应的内容
      this.multipleSelectionTable.newArry = list.slice(
        (this.multipleSelectionTable.pageNo - 1) * this.multipleSelectionTable.pageSize,
        this.multipleSelectionTable.pageNo * this.multipleSelectionTable.pageSize
      )

      // this.multipleSelection.total = list.length
    },
    getRowKeys(row) {
      return row.id
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
