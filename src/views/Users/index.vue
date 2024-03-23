
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
    <el-dialog title="添加成员" :visible.sync="userDialogFormVisible">
      <el-form ref="userForm" :model="userForm" :rules="userFormRules" label-width="100px" size="mini">
        <el-form-item label="用户" :label-width="userForm.formLabelWidth" prop="id">
          <el-select
            v-model="userForm.id"
            placeholder="请选择用户"
            filterable
            clearable
          >
            <el-option
              v-for="item in usersList"
              :key="item.id"
              :label="item.name"
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
import column from '@/views/Users/js/column'
import { MemberCreate, MemberDelete, MemberList, UserList } from '@/api/page/workSpace'
import { mapGetters } from 'vuex'
export default {
  components: {
    LaplaceTable
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
      userFormRules: {
        id: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ]
      },
      userForm: {
        formLabelWidth: '120px',
        id: null
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
    // 获取项目成员列表
    async initData() {
      // 获取当前项目
      this.currentProject = JSON.parse(sessionStorage.getItem('CurrentWorkSpace'))
      const res = await MemberList({
        projectId: this.currentProject.id,
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
    // 新增项目成员
    async createMember() {
      const res = await MemberCreate({
        projectId: this.currentProject.id,
        userId: this.userForm.id
      })
      if (res.code === 0) {
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.userDialogFormVisible = false
      } else {
        this.$message({
          message: '新增失败',
          type: 'error'
        })
      }
      await this.initData()
    },
    // 新增成员，按钮点击时获取项目成员列表
    async btCreateMember() {
      this.userDialogFormVisible = true
      this.userForm.id = null
      const res = await UserList()
      if (res.code === 0) {
        this.usersList = res.data
      } else {
        this.$message({
          message: '接口错误',
          type: 'error'
        })
      }
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
      this.$confirm(`是否要移除用户【${row.name}】在项目【${this.currentProject.name}】？`, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认删除',
        cancelButtonText: '放弃修改'
      })
        .then(async() => {
          const res = await MemberDelete({
            projectId: this.currentProject.id,
            userId: row.id
          })
          if (res.code === 0) {
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
    }
  },
  handleSizeChange() {
    this.initData()
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
