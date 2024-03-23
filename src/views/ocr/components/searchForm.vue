<template>
  <el-form
    ref="searchForm"
    :inline="true"
    :model="searchForm"
    :show-message="false"
    class="demo-form-inline"
  >
    <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item label="REQUEST_ID" prop="requestId">
        <el-input
          v-model="searchForm.requestId"
          clearable
          fixed
          type="text"
          placeholder="输入REQUEST_ID查询"
        />
      </el-form-item>
    </el-col>
    <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
      <el-button type="primary" icon="el-icon-search" @click="initData">查询</el-button>
    </el-col>
  </el-form>
</template>
<script>
export default {
  name: 'Search',
  props: {
    searchForm: {
      type: [Object],
      default: () => {}
    }
  },
  methods: {
    initData() {
      this.$emit('initData')
    }
  }
}
</script>
