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
              <span>模板管理</span>
            </el-col>
            <el-col :span="12" class="customButton">
              <el-button type="primary" icon="el-icon-plus" @click="btCreateTemplate">申请模板</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="table">
          <el-row>
            <el-form
              :inline="true"
              :model="searchForm"
              class="demo-form-inline"
              label-width="auto"
            >
              <el-col :xl="6" :lg="12" :md="12" :sm="12" :xs="24">
                <el-form-item label="类型">
                  <el-select
                    v-model="searchForm.type"
                    clearable
                    filterable
                    placeholder="请选择提类型"
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
              <el-col :xl="8" :lg="12" :md="12" :sm="12" :xs="24">
                <el-form-item label="关键字">
                  <el-input
                    v-model="searchForm.keyword"
                    type="text"
                    clearable
                    placeholder="请输入关键字"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="4" :lg="12" :md="12" :sm="12" :xs="24">
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
                label="模板CODE"
                min-width="100px"
                show-overflow-tooltip
                prop="templateId"
                align="center"
              >
                <template slot-scope="scope">
                  <span class="f12">{{
                    scope.row.templateId
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="模板名称"
                min-width="180px"
                prop="name"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="模板内容"
                min-width="200px"
                prop="content"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    class="f12"
                  >{{ scope.row.content }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="模板类型"
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
                label="状态"
                min-width="100px"
                prop="status"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag
                    v-if="searchForm.type===0"
                    :key="scope.row.status"
                    :type="getStatusOptions(scope.row.status).tag"
                  >{{ getStatusOptions(scope.row.status).value }}</el-tag>
                  <span v-else class="f12">
                    -
                  </span>
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
                  <span v-if="scope.row.status === 2">-</span>
                  <el-button
                    v-else
                    type="text"
                    @click="btDisableTemplate(scope.row)"
                  >
                    {{ scope.row.status === 0 ? '启用' : '停用' }}
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
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { TemplateEnable, TemplateList } from '@/api/page/message.js'

export default {
  meta: {
  },
  name: 'Template',
  components: {
    Pagination
  },
  filters: {

  },
  data() {
    return {
      searchForm: {
        type: null,
        channelOut: '',
        keyword: ''
      },
      typeOptions: [
        {
          value: 1,
          label: '验证码'
        },
        {
          value: 2,
          label: '通知短信'
        },
        {
          value: 3,
          label: '推广短信'
        },
        {
          value: 4,
          label: '语音短信'
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
      const res = await TemplateList(
        {
          projectCode: this.currentProject.projectCode,
          type: this.searchForm.type,
          channelOut: this.searchForm.channelOut,
          keyword: this.searchForm.keyword,
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
    async btCreateTemplate() {
      window.open('https://applink.feishu.cn/T8J4q4GREuIj')
    },

    async btDisableTemplate(row) {
      const res = await TemplateEnable(row.id)
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
    getStatusOptions(statusOptionsValue) {
      return this.statusOptions.find(option => option.value === statusOptionsValue)
    },
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
