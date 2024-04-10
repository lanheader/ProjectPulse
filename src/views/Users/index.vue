<template>
  <div class="market_out">
    <el-card
      class="box-card"
      style="height: 100%"
    >
      <div slot="header" class="clearfix">
        <el-row :gutter="20" justify="end">
          <el-col :span="12">
            <span>用户管理</span>
          </el-col>
          <el-col :span="12" class="customButton">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="btCreateUser"
            >新增用户</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table">
        <el-row>
          <Search
            :search-form="searchForm"
            @initData="initData"
          />
        </el-row>
        <el-row>
          <LaplaceTable
            :columns="columns"
            :table-data="tableData"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="btDisableData(scope.row)"
              >{{ scope.row.is_active? '禁用':'启用' }}</el-button>
              <el-button
                type="text"
                @click="btUpdateUsers(scope.row)"
              >编辑</el-button>
            </template>
          </LaplaceTable>
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
    <el-dialog :title="title" :visible.sync="createUserFormVisible">
      <el-form
        ref="createUserForm"
        :model="createUserForm"
        :rules="createUserFormRules"
        label-width="100px"
      >
        <el-form-item
          label="用户名"
          prop="username"
          label-width="120px"
        >
          <el-input
            v-model="createUserForm.username"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item
          v-if="title !== '编辑用户' "
          label="密码"
          prop="password"
          label-width="120px"
        >
          <el-input
            v-model="createUserForm.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item
          label="姓名"
          label-width="120px"
          prop="display"
        >
          <el-input
            v-model="createUserForm.display"
            placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          label-width="120px"
          prop="email"
        >
          <el-input
            v-model="createUserForm.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item
          label="手机号"
          label-width="120px"
          prop="phone"
        >
          <el-input
            v-model="createUserForm.phone"
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createUserFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import LaplaceTable from '@/components/Table/index.vue'
import Pagination from '@/components/Pagination'
import column from '@/views/Users/js/column'
import Search from '@/views/Users/components/searchForm.vue'

import { UserDisable, UserList, UserSubmit, UserUpdate } from '@/api/page/user'
import { mapGetters } from 'vuex'
export default {
  name: 'UserInfo',
  components: {
    LaplaceTable,
    Search,
    Pagination
  },
  data() {
    return {
      // 搜索选项
      searchForm: {
        username: '',
        display: '',
        phone: ''
      },
      // 新增相关
      createUserFormVisible: false,
      createUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        password: this.title !== '编辑用户' ? [
          { required: true, message: '请输入密码', trigger: 'change' }
        ] : [],
        display: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' }
        ]
      },
      createUserForm: {
        username: '',
        password: '',
        display: '',
        email: '',
        phone: '',
        is_active: true
      },
      title: '',
      // table相关
      tableData: [],
      columns: column,
      total: 0,
      pageSize: 30,
      pageNo: 1
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  mounted() {
    this.initData()
  },
  methods: {

    // 获取用户列表
    async initData() {
      const params = {
        username: this.searchForm.username,
        display: this.searchForm.display,
        phone: this.searchForm.phone,
        size: this.pageSize,
        page: this.pageNo
      }
      const res = await UserList(params)
      this.tableData = res.data
      // 如果data.totalSize为null 则赋值为0
      if (res.count === null) {
        res.data.totalSize = 0
      } else {
        this.total = res.count
      }
    },

    // 创建
    async createSubmitData() {
      const res = await UserSubmit(this.createUserForm)
      if (res.code === 20000) {
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.createUserFormVisible = false
        await this.initData()
      } else {
        this.$message({
          message: '新增失败',
          type: 'error'
        })
      }
    },
    // 更新
    async updateSubmitData() {
      const res = await UserUpdate({ id: this.createUserForm.id, data: this.createUserForm })
      if (res.code === 20000) {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.createUserFormVisible = false
        await this.initData()
      } else {
        this.$message({
          message: '编辑失败',
          type: 'error'
        })
      }
    },
    // form表单提交
    submitForm() {
      this.$refs['createUserForm'].validate(async(valid, object) => {
        if (valid) {
          if (this.title === '新增用户') {
            await this.createSubmitData()
          } else {
            await this.updateSubmitData()
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
    // 生成短链
    btCreateUser() {
      this.title = '新增用户'
      this.createUserFormVisible = true
    },
    // 更新失效时间弹窗按钮
    btUpdateUsers(row) {
      this.title = '编辑用户'
      this.createUserFormVisible = true
      this.createUserForm = row
    },

    // 禁用按钮
    btDisableData(row) {
      let msg = ''
      let res_msg = ''
      if (row.is_active) {
        msg = '确定要将此用户置为失效吗？失效后将无法登录。'
        res_msg = '用户已失效'
      } else {
        msg = '确定要启用此用户吗？'
        res_msg = '用户已启用'
      }
      this.$confirm(`${msg}`, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '关闭'
      }).then(async() => {
        await UserDisable(row.id)
        this.apiDialogFormVisible = false
        this.$message({
          message: `${res_msg}`,
          type: 'success'
        })
        await this.initData()
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
@import '@/styles/page.scss';
.customButton{
  display: flex;
  flex-direction: row-reverse;
}
</style>
