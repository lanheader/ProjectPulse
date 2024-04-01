
<template>
  <el-form
    ref="searchForm"
    :inline="true"
    :model="searchForm"
    class="demo-form-inline"
  >
    <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="searchForm.username"
          placeholder="请输入用户名"
        />
      </el-form-item>
    </el-col>
    <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24">
      <el-form-item label="源地址">
        <el-input
          v-model="searchForm.display"
          placeholder="请输入姓名"
        />
      </el-form-item>
    </el-col>
    <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24">
      <el-form-item label="手机号">
        <el-input
          v-model="searchForm.phone"
          placeholder="请输入手机号"
        />
      </el-form-item>
    </el-col>
    <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24">
      <el-button type="primary" icon="el-icon-search" @click="initData">搜索</el-button>
    </el-col>
  </el-form>
</template>
<script>
export default {
  name: 'Search',
  props: {
    searchForm: {
      type: [Object],
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  computed: {
    searchFormDate: {
      get() {
        // 获取值时，将时间戳转换为日期对象
        return this.searchForm.date ? this.searchForm.date.map(date => new Date(date)) : []
      },
      set(value) {
        // 设置值时，将日期对象转换为时间戳
        this.searchForm.date = value ? value.map(date => date.getTime()) : []
      }
    }
  },
  methods: {
    initData() {
      this.$emit('initData')
    }
  }
}
</script>

<style scoped lang="scss">
</style>
