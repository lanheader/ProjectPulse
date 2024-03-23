
<template>
  <el-form
    ref="searchForm"
    :inline="true"
    :model="searchForm"
    class="demo-form-inline"
    :rules="searchFormRules"
  >
    <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item label="AccessKey" prop="accessKey">
        <el-select
          v-model="searchForm.accessKey"
          clearable
          filterable
          placeholder="请选择服务名"
        >
          <el-option
            v-for="item in accessKeyList"
            :key="item.id"
            :label="item.accessKey"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item label="源地址">
        <el-input
          v-model="searchForm.originUrl"
          placeholder="请输入源地址"
        />
      </el-form-item>
    </el-col>
    <el-col :xl="8" :lg="8" :md="8" :sm="12" :xs="24">
      <el-form-item label="短地址">
        <el-input
          v-model="searchForm.shortUrl"
          placeholder="请输入短地址"
        />
      </el-form-item>
    </el-col>
    <el-col :xl="16" :lg="16" :md="16" :sm="12" :xs="24">
      <el-form-item label="创建时间" prop="date" />
      <el-date-picker
        v-model="searchFormDate"
        type="datetimerange"
        :picker-options="createPickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      />
    </el-col>
    <el-col :xl="4" :lg="4" :md="24" :sm="24" :xs="24">
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
    },
    accessKeyList: {
      type: [Array],
      default: () => []
    },
    createPickerOptions: {
      type: [Array],
      default: () => []
    }
  },
  data() {
    return {
      searchFormRules: {
        accessKey: [
          { required: true, message: '请选择accessKey', trigger: 'change' }
        ]
      }
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
