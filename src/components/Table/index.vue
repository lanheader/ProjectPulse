<template>
  <el-table
    ref="multipleTable"
    :data="tableData"
    border
    element-loading-text="拼命加载中..."
    element-loading-spinner="el-icon-loading"
    tooltip-effect="dark"
    :scroll-x="true"
    style="width: 100%"
  >
    <el-table-column
      v-for="column in columns"
      :key="column.name"
      :label="column.label"
      :fixed="column.fixed"
      :align="column.align"
      :show-overflow-tooltip="column.overflow"
      :prop="column.name"
    >
      <template v-if="column.type === 'time'" v-slot="{ row }">
        <span class="f12">{{ row[column.name] | formatDate }}</span>
      </template>
      <template v-else-if="column.type === 'status'" v-slot="{ row }">
        <el-tag
          :type="
            column.statusOptions.find((option) => option.value === row[column.name]).name
          "
          class="f12"
        >
          {{
            column.statusOptions.find((option) => option.value === row[column.name]).label
          }}
        </el-tag>
      </template>
      <template v-else-if="column.type === 'select'" v-slot="{ row }">
        <span
          class="f12"
        >{{ column.selectOptions.find(item => {
          return item.value === row[column.name]
        }).label }} </span>
      </template>
      <template v-else v-slot="{ row }">
        <span class="f12">{{ row[column.name] }} </span>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" align="center">
      <template v-slot="scope">
        <slot v-bind="scope" />
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { _formatToDesiredTime } from '@/utils/validate'

export default {
  name: 'LaplaceTable',
  components: { },
  filters: {
    // 格式化时间
    formatDate(date) {
      if (date === null) {
        return ''
      } else if (date === -1) {
        return '永久'
      } else {
        return _formatToDesiredTime(date)
      }
    }
  },
  props: {
    tableData: {
      type: [Array],
      default: () => []
    },
    columns: {
      type: [Array],
      default: () => []
    }
  },
  mounted() {
  }
}
</script>
