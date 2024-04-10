
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
              <span>角色管理</span>
            </el-col>
          </el-row>
        </div>
        <div class="table">
          <el-row>
            <LaplaceTable
              :columns="columns"
              :table-data="tableData"
              @initData="initData"
            />
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
  </div>
</template>
<script>
import LaplaceTable from '@/components/Table/index.vue'
import Pagination from '@/components/Pagination'
import column from '@/views/Roles/js/column'
import { RoleList } from '@/api/page/user'
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
    // 获取项目成员列表
    async initData() {
      const res = await RoleList({
        size: this.pageSize,
        page: this.pageNo
      })

      if (res.data === null) {
        this.tableData = []
      } else {
        this.tableData = res.data
      }
      // 如果data.totalSize为null 则赋值为0
      if (res.count === null) {
        res.data.totalSize = 0
      } else {
        this.total = res.count
      }
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
