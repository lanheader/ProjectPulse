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
              <span>识别记录</span>
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
              :status-options="statusOptions"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="btJsonDataView(scope.row)"
                >查看结果</el-button>
              </template>
            </LaplaceTable>
          </el-row>
          <el-dialog :title="title" :visible.sync="jsonViewVisible">
            <json-viewer
              :value="jsonView.jsonData"
              :expand-depth="5"
              copyable
              boxed
              sort
            />
          </el-dialog>
        </div>
      </el-card>
    </el-row>
    <el-dialog :title="title" :visible.sync="jsonViewVisible">
      <json-viewer
        :value="jsonView.jsonData"
        :expand-depth="5"
        copyable
        boxed
        sort
      />
    </el-dialog>
  </div>
</template>
<script>
import { OcrLogs } from '@/api/page/ocr'
import LaplaceTable from '@/components/Table/index.vue'
import Search from '@/views/ocr/components/searchForm.vue'
import columns from '@/views/ocr/js/column'
import { statusType } from '@/views/ocr/js/utils'

export default {
  name: 'OcrLog',
  components: {
    LaplaceTable,
    Search
  },
  data() {
    return {
      searchForm: {
        requestId: ''
      },
      tableData: [],
      statusOptions: statusType,
      columns: columns,
      title: '响应详情',
      jsonViewVisible: false,
      jsonView: {
        jsonData: {}
      }
    }
  },
  methods: {
    // 获取识别记录
    async initData() {
      // 获取当前项目
      this.currentProject = JSON.parse(sessionStorage.getItem('CurrentWorkSpace'))
      const res = await OcrLogs({
        requestId: this.searchForm.requestId
      })
      this.tableData = res.data
    },
    // 点击查看响应详情
    btJsonDataView(row) {
      try {
        this.jsonView.jsonData = JSON.parse(row.result)
      } catch (e) {
        this.jsonView.jsonData = row.result
      }

      this.jsonViewVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/page.scss';
</style>

