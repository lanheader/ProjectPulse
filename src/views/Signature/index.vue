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
              <span>签名管理</span>
            </el-col>
            <el-col :span="12" class="customButton">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="btCreateSignature"
              >申请签名</el-button>
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
                <el-form-item label="提供商">
                  <el-select
                    v-model="searchForm.channelOut"
                    clearable
                    filterable
                    placeholder="请选择提供商"
                  >
                    <el-option
                      v-for="item in channelOutOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
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
                label="ID"
                min-width="60px"
                prop="id"
                align="center"
              >
                <template slot-scope="scope">
                  <span class="f12">{{
                    scope.row.id
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="签名"
                min-width="200px"
                show-overflow-tooltip
                prop="name"
                align="center"
              >
                <template slot-scope="scope">
                  <span class="f12">{{
                    scope.row.name
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="云商"
                min-width="130px"
                prop="channelOut"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.channelOut }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="申请人"
                min-width="110px"
                prop="creatorName"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.creatorName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="申请时间"
                min-width="180px"
                prop="createTime"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.createTime }}</span>
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
                    :type="(getStatusOptions(scope.row.status)).tag"
                  >{{ getStatusOptions(scope.row.status).label }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="类型"
                min-width="100px"
                prop="type"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ getTypeLabel(scope.row.type) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                min-width="120px"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.status !== 2 && scope.row.type !== 1"
                    type="text"
                    @click="btDisableSignature(scope.row)"
                  >
                    {{ scope.row.status === 0 ? '启用' : '禁用' }}
                  </el-button>
                  <span v-else>-</span>
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
import { SignatureList, SignatureEnable } from '@/api/page/message.js'

export default {
  meta: {
  },
  name: 'Signature',
  components: {
    Pagination
  },
  data() {
    return {
      searchForm: {
        channelOut: '',
        keyword: ''
      },
      statusOptions: [
        {
          value: 0,
          label: '无效',
          tag: 'danger'
        },
        {
          value: 1,
          label: '有效',
          tag: 'success'
        },
        {
          value: 2,
          label: '审批中',
          tag: 'warning'
        }
      ],
      typeOptions: [
        {
          value: 1,
          label: '公有'
        },
        {
          value: 2,
          label: '私有'
        }
      ],
      channelOutOptions: [
        {
          value: 'aliyun',
          label: '阿里云'
        },
        {
          value: 'tencent',
          label: '腾讯云'
        },
        {
          value: 'huawei',
          label: '华为云'
        }
      ],
      tableData: [],
      total: 0,
      pageSize: 30,
      pageNo: 1
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 获取项目成员列表
    async initData() {
      // 获取当前项目
      this.currentProject = JSON.parse(sessionStorage.getItem('CurrentWorkSpace'))
      const res = await SignatureList(
        {
          projectCode: this.currentProject.projectCode,
          channelOut: this.searchForm.channelOut,
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
      await this.initData()
    },

    // 新增成员，按钮点击时获取项目成员列表
    async btCreateSignature() {
      window.open('https://applink.feishu.cn/T8J4q4GREuIj')
    },

    async btDisableSignature(row) {
      const res = await SignatureEnable(row.id)
      if (res.code === 0) {
        this.$message({
          message: '操作成功',
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
    // 页面大小变化或者页码变化时触发
    handleSizeChange() {
      this.initData()
    },
    // 获取状态
    getStatusOptions(statusOptionsValue) {
      return this.statusOptions.find(option => option.value === statusOptionsValue)
    },
    // 获取类型
    getTypeLabel(typeValue) {
      const typeOption = this.typeOptions.find(option => option.value === typeValue)
      return typeOption ? typeOption.label : '-'
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
