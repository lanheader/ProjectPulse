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
              <span>AccessKey管理</span>
            </el-col>
            <el-col :span="12" class="customButton">
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="btCreateMember">创建</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="table">
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
                label="AccessKey"
                min-width="200px"
                fixed
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="f12">{{
                    scope.row.accessKey
                  }}</span>

                </template>
              </el-table-column>
              <el-table-column
                label="SecretKey"
                min-width="180px"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.secretKey | capitalize }} </span>
                  <el-button icon="el-icon-document-copy" type="text" @click="handleClipboard(scope.row.secretKey,$event)" />
                </template>
              </el-table-column>
              <el-table-column
                label="创建人"
                min-width="100px"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.creatorName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="创建时间"
                min-width="180px"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.createAt | formatDate }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="最后使用时间"
                min-width="180px"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.lastAccessAt | formatDate }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
                min-width="180px"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.comment }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                min-width="100px"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-tag
                    :key="scope.row.name"
                    :type="scope.row.status === 1 ? 'success' : 'danger'"
                  >
                    {{ scope.row.status === 1 ? '启用' : '禁用' }}
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
                  <el-button type="text" size="mini" @click="btApiManager(scope.row)">API管理</el-button>
                  <el-button type="text" size="mini" @click="btDisable(scope.row)">{{ scope.row.status === 1 ? '禁用' : '启用' }}</el-button>
                  <el-button type="text" size="mini" @click="btUpdate(scope.row)">修改</el-button>
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
    <el-dialog :title="title" :visible.sync="akDialogFormVisible">
      <el-form ref="akForm" :model="akForm" :rules="akFormRules" label-width="100px" size="mini">
        <el-form-item label="备注" :label-width="akForm.formLabelWidth" prop="comment">
          <el-input
            v-model="akForm.comment"
            type="textarea"
            placeholder="请输入内容"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="akDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('akForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import {
  AKList,
  AKDisable,
  AKCreate,
  AKUpdate
} from '@/api/page/workSpace.js'
import { mapGetters } from 'vuex'
import { _formatDate } from '@/utils/validate.js'
import clipboard from '@/utils/clipboard'
export default {
  meta: {
  },
  name: 'Member',
  components: {
    Pagination
  },
  filters: {
    capitalize: function(value) {
      if (!value) return ''
      value = value.toString()
      return value.substring(0, 4) + '*****' + value.substring(value.length - 4)
    },
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
      akDialogFormVisible: false,
      akList: [],
      title: '添加凭证',
      akFormRules: {
        comment: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ]
      },
      akForm: {
        formLabelWidth: '120px',
        id: null,
        comment: ''
      },
      showSensitiveData: false
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
    async initData() {
      // 获取当前项目
      this.currentProject = JSON.parse(sessionStorage.getItem('CurrentWorkSpace'))
      const res = await AKList({
        projectId: this.currentProject.id,
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

    // 新增凭证
    async createAK() {
      const res = await AKCreate({
        projectId: this.currentProject.id,
        comment: this.akForm.comment
      })
      if (res.code === 0) {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        await this.initData()
        this.akDialogFormVisible = false
      } else {
        this.$message({
          message: '添加失败',
          type: 'error'
        })
      }
    },
    // 更新凭证
    async updateAK() {
      const res = await AKUpdate({
        id: this.akForm.id,
        comment: this.akForm.comment
      })
      if (res.code === 0) {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        await this.initData()
        this.akDialogFormVisible = false
      } else {
        this.$message({
          message: '修改失败',
          type: 'error'
        })
      }
    },

    // 新增凭证按钮
    btCreateMember() {
      this.title = '添加凭证'
      this.akDialogFormVisible = true
    },

    // 表单提交,新增凭证
    onSubmit(userForm) {
      this.$refs[userForm].validate((valid) => {
        if (valid) {
          if (this.title === '添加凭证') {
            this.createAK()
          } else {
            this.updateAK()
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
    // 点击跳转至api管理页面
    btApiManager(row) {
      this.$router.push({
        name: 'apiManager',
        params: { ...row }
      })
    },

    async btDisable(row) {
      const res = await AKDisable({
        id: row.id
      })
      if (res.code === 0) {
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        await this.initData()
      } else {
        this.$message({
          message: '操作失败',
          type: 'error'
        })
      }
    },

    btUpdate(row) {
      this.title = '更新凭证'
      this.akForm.comment = row.comment
      this.akForm.id = row.id
      this.akDialogFormVisible = true
    },
    // 页面大小变化或者页码变化时触发
    handleSizeChange() {
      this.initData()
    },
    handleClipboard(text, event) {
      clipboard(text, event)
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
