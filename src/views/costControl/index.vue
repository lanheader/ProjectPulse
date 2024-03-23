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
              <span>租户费控</span>
            </el-col>
            <el-col :span="12" class="customButton">
              <el-button type="primary" icon="el-icon-plus" @click="btCreateTenant">添加租户</el-button>
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
              <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
                <el-form-item label="AccessKey">
                  <el-select
                    v-model="searchForm.accessKey"
                    clearable
                    filterable
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
              <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
                <el-form-item label="租户">
                  <el-input
                    v-model="searchForm.keyword"
                    type="text"
                    placeholder="请输入租户"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
                <el-button type="primary" icon="el-icon-search" @click="btSearch">查询</el-button>
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
                align="center"
                fixed
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="f12">{{
                    scope.row.tenantKey
                  }}</span>

                </template>
              </el-table-column>
              <el-table-column
                label="创建时间"
                min-width="120px"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.createAt | formatDate }} </span>
                </template>
              </el-table-column>
              <el-table-column
                label="创建人"
                min-width="110px"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.creatorUserName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                min-width="130px"
                prop="total"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="btCostControl(scope.row)">费控</el-button>
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
    <el-dialog :title="title" :visible.sync="tenantDialogFormVisible">
      <el-form
        ref="tenantForm"
        :model="tenantForm"
        :rules="tenantFormRules"
        label-width="100px"
        size="mini"
      >
        <el-form-item
          label="添加租户"
          :label-width="tenantForm.formLabelWidth"
          prop="tenantKey"
        >
          <el-input
            v-model="tenantForm.tenantKey"
            type="text"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="tenantDialogFormVisible = false"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit('tenantForm')"
        >
          保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import {
  AKList,
  TenantList,
  TenantCreate
} from '@/api/page/workSpace.js'
import { mapGetters } from 'vuex'
import { _formatDate } from '@/utils/validate.js'

export default {
  meta: {
  },
  name: 'Tenant',
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
      tenantDialogFormVisible: false,
      akList: [],
      title: '添加租户',
      tenantFormRules: {
        tenantKey: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ]
      },
      tenantForm: {
        formLabelWidth: '120px',
        id: null,
        tenantKey: ''
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 获取ak列表
    async initAKList() {
      this.currentProject = JSON.parse(sessionStorage.getItem('CurrentWorkSpace'))
      const res = await AKList({
        projectId: this.currentProject.id,
        pageSize: 500,
        pageNo: this.pageNo
      })
      this.akList = res.data.data
      if (this.searchForm.accessKey === '') {
        this.searchForm.accessKey = this.akList[0].id
      }
    },
    // 获取租户列表
    async initTenantList() {
      // 获取当前项目
      this.currentProject = JSON.parse(sessionStorage.getItem('CurrentWorkSpace'))
      const res = await TenantList({
        credentialId: this.searchForm.accessKey,
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
    // 初始化数据
    async initData() {
      await this.initAKList()
      await this.initTenantList()
    },
    // 查询按钮
    async btSearch() {
      this.pageNo = 1
      await this.initTenantList()
    },
    // 添加租户  费控
    async tenantCreate() {
      const res = await TenantCreate({
        credentialId: this.searchForm.accessKey,
        tenantKey: this.tenantForm.tenantKey
      })
      if (res.code === 0) {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        await this.initData()
        this.tenantDialogFormVisible = false
      } else {
        this.$message({
          message: '添加失败',
          type: 'error'
        })
      }
    },
    // 点击添加租户按钮
    btCreateTenant() {
      this.title = '添加租户'
      this.tenantDialogFormVisible = true
    },
    // 表单提交,新增租户
    onSubmit(tenantForm) {
      this.$refs[tenantForm].validate((valid) => {
        if (valid) {
          this.tenantCreate()
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
    // 点击跳转至api管理页面
    btCostControl(row) {
      this.$router.push({
        name: 'Control',
        params: { ...row, accessKey: this.searchForm.accessKey }
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
