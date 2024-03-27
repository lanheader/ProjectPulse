
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
              <span>成员管理</span>
            </el-col>
            <el-col :span="12" class="customButton">
              <el-button
                type="primary"
                icon="el-icon-plus"
                :loading="btnloading"
                @click="btCreateMember"
              >新增成员</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="table">
          <el-row>
            <LaplaceTable
              :columns="columns"
              :table-data="tableData"
              @initData="initData"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="btDeleteMember(scope.row)">删除</el-button>
              </template>
            </LaplaceTable>
          </el-row>
        </div>
      </el-card>
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
    <el-dialog title="添加成员" :visible.sync="userDialogFormVisible">
      <el-form ref="userForm" :model="userForm" :rules="userFormRules" label-width="100px" size="mini">
        <el-form-item label="用户" :label-width="userForm.formLabelWidth" prop="user_id">
          <el-select
            v-model="userForm.user_id"
            placeholder="请选择用户"
            filterable
            clearable
          >
            <el-option
              v-for="item in usersList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" :label-width="userForm.formLabelWidth" prop="role_id">
          <el-select
            v-model="userForm.role_id"
            placeholder="请选择角色"
            filterable
            clearable
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.role_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('userForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import LaplaceTable from '@/components/Table/index.vue'
import Pagination from '@/components/Pagination'
import column from '@/views/ProjectUsers/js/column'
import { MemberDelete, RoleUserList, RoleUserSubmit } from '@/api/page/projects'
import { UserList, RoleList } from '@/api/page/user'
import { mapGetters } from 'vuex'

export default {
  name: 'ProjectUser',
  components: {
    LaplaceTable,
    Pagination
  },
  data() {
    return {
      columns: column,
      tableData: [],
      total: 0,
      pageSize: 30,
      pageNo: 1,
      userDialogFormVisible: false,
      usersList: [],
      roleList: [],
      btnloading: false,
      userFormRules: {
        user_id: [
          { required: true, message: '请选择用户', trigger: 'change' }
        ],
        role_id: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      userForm: {
        formLabelWidth: '120px',
        id: null
      }
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 获取项目成员列表
    async initData() {
      // 获取当前项目
      this.currentProject = JSON.parse(sessionStorage.getItem('CurrentProject'))
      const res = await RoleUserList({
        projectId: this.currentProject.id,
        size: this.pageSize,
        page: this.pageNo
      })

      if (res.data.data === null) {
        this.tableData = []
      } else {
        this.tableData = res.data.data
      }
      // 如果data.totalSize为null 则赋值为0
      if (res.data.count === null) {
        res.data.totalSize = 0
      } else {
        this.total = res.data.count
      }
    },
    // 获取用户列表
    async getUserList() {
      const res = await UserList({
        size: 1000,
        page: 1
      })
      if (res.code === 20000) {
        this.usersList = res.data.data
      } else {
        this.$message({
          message: '接口错误',
          type: 'error'
        })
      }
    },
    // 获取角色列表
    async getRoleList() {
      const res = await RoleList({
        size: 1000,
        page: 1
      })
      if (res.code === 20000) {
        this.roleList = res.data.data
      } else {
        this.$message({
          message: '接口错误',
          type: 'error'
        })
      }
    },
    // 新增项目成员
    async createMember() {
      const res = await RoleUserSubmit({
        project_id: this.currentProject.id,
        user_id: this.userForm.user_id,
        role_id: this.userForm.role_id
      })
      if (res.code === 20000) {
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.userDialogFormVisible = false
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
      await this.initData()
    },
    // 新增成员，按钮点击时获取项目成员列表
    async btCreateMember() {
      this.btnloading = true
      await this.getUserList()
      await this.getRoleList()
      this.userDialogFormVisible = true
      this.userForm.id = null
      this.btnloading = false
    },
    // 表单提交,新增项目成员
    onSubmit(userForm) {
      this.$refs[userForm].validate((valid) => {
        if (valid) {
          this.createMember()
        } else {
          this.$message({
            showClose: true,
            message: '请检查选项是否完整',
            type: 'error'
          })
          return false
        }
      })
    },

    btDeleteMember(row) {
      this.$confirm(`是否要移除用户【${row.username}】在项目【${this.currentProject.project_name}】？`, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认删除',
        cancelButtonText: '放弃修改'
      })
        .then(async() => {
          const res = await MemberDelete({
            id: row.id
          })
          if (res.code === 20000) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            await this.initData()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: action === 'cancel'
              ? '放弃保存并离开页面'
              : '停留在当前页面'
          })
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
