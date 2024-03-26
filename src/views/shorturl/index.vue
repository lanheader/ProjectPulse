<template>
  <div class="market_out">
    <el-card
      class="box-card"
      style="height: 100%"
    >
      <div slot="header" class="clearfix">
        <el-row :gutter="20" justify="end">
          <el-col :span="12">
            <span>短链</span>
          </el-col>
          <el-col :span="12" class="customButton">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="btCreateShortUrl"
            >生成短链</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table">
        <el-row>
          <Search
            :search-form="searchForm"
            :access-key-list="accessKeyList"
            @initData="initData"
          />
        </el-row>
        <el-row>
          <LaplaceTable
            :columns="columns"
            :table-data="tableData"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status ===1"
                type="text"
                @click="btDisableData(scope.row)"
              >失效</el-button>
              <el-button
                v-if="scope.row.status ===1"
                type="text"
                @click="btUpdateExpire(scope.row)"
              >修改有效期</el-button>
            </template>
          </LaplaceTable>
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
    <el-dialog :title="title" :visible.sync="updateExpireFormVisible">
      <el-form
        ref="updateExpireForm"
        :model="updateExpireForm"
        :rules="updateExpireFormRules"
        label-width="100px"
      >
        <el-form-item
          label="是否永久"
          label-width="120px"
          prop="radio"
        >
          <el-radio v-model="radio" :label="-1" @click.native.prevent="clickItem(-1)">{{ '' }}</el-radio>
        </el-form-item>
        <el-form-item
          label="失效时间"
          label-width="120px"
          prop="expire"
        >
          <el-date-picker
            v-model="updateExpireFormDate"
            :disabled="dateDisable"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="expirePickerOptions"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateExpireFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updateData()"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="生成短链" :visible.sync="createShortFormVisible">
      <el-form
        ref="createShortForm"
        :model="createShortForm"
        :rules="createShortFormRules"
        label-width="100px"
      >
        <el-form-item
          label="AccessKey"
          prop="accessKey"
          label-width="120px"
        >
          <el-select
            v-model="createShortForm.accessKey"
            clearable
            filterable
            placeholder="请选择服务名"
          >
            <el-option
              v-for="item in accessKeyList"
              :key="item.id"
              :label="item.accessKey"
              :value="item.accessKey"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="源地址"
          prop="originUrl"
          label-width="120px"
        >
          <el-input
            v-model="createShortForm.originUrl"
            placeholder="请输入源地址"
          />
        </el-form-item>
        <el-form-item
          label="是否永久"
          label-width="120px"
          prop="radio"
        >
          <el-radio v-model="createRadio" :label="-1" @click.native.prevent="createClickItem(-1)">{{ '' }}</el-radio>
        </el-form-item>
        <el-form-item
          label="失效时间"
          label-width="120px"
          prop="expire"
        >
          <el-date-picker
            v-model="createExpireFormDate"
            :disabled="createDateDisable"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="expirePickerOptions"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createShortFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="createSubmitData()"
        >确定</el-button>
      </div>
    </el-dialog>

  </div>

</template>
<script>
import LaplaceTable from '@/components/Table/index.vue'
import Pagination from '@/components/Pagination'
import column from '@/views/shorturl/js/column'
import { expirePickerOptions, createPickerOptions } from '@/views/shorturl/js/utils'
import Search from '@/views/shorturl/components/searchForm.vue'

import { AKList } from '@/api/page/projects'
import { ShortUrlDisable, ShortUrlList, ShortUrlUpdate, ShortUrlCreate } from '@/api/page/shorturl'
import { mapGetters } from 'vuex'
export default {
  name: 'ShortUrl',
  components: {
    LaplaceTable,
    Search,
    Pagination
  },
  data() {
    return {
      // 搜索选项
      searchForm: {
        accessKey: '',
        date: [new Date().getTime() - 3600 * 1000 * 24 * 30, new Date().getTime()],
        shortUrl: '',
        originUrl: ''
      },
      // 新增相关
      createShortFormVisible: false,
      createShortForm: {
        accessKey: '',
        originUrl: '',
        expire: null
      },
      createRadio: 0,
      createDateDisable: false,
      createShortFormRules: {
        expire: [
          { required: true, message: '请选则有效期', trigger: 'change' }
        ],
        accessKey: [
          { required: true, message: '请选择accessKey', trigger: 'change' }
        ],
        originUrl: [
          { required: true, message: '请输入源地址', trigger: 'change' }
        ]
      },
      // 更新相关
      updateExpireFormVisible: false,
      updateExpireFormRules: {
        expire: [
          { required: true, message: '请选则有效期', trigger: 'change' }
        ]
      },
      title: '修改有效期',
      updateExpireForm: {
        id: null,
        expire: null
      },
      radio: 0,
      dateDisable: false,
      expirePickerOptions: expirePickerOptions,
      createPickerOptions: createPickerOptions,
      accessKeyList: [],
      tableData: [],
      columns: column,
      total: 0,
      pageSize: 30,
      pageNo: 1
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    updateExpireFormDate: {
      get() {
        // 获取值时，将时间戳转换为日期对象
        return this.updateExpireForm.expire ? new Date(this.updateExpireForm.expire) : null
      },
      set(value) {
        // 设置值时，将日期对象转换为时间戳
        this.updateExpireForm.expire = value ? value.getTime() : null
      }
    },
    createExpireFormDate: {
      get() {
        // 获取值时，将时间戳转换为日期对象
        return this.createShortForm.expire ? new Date(this.createShortForm.expire) : null
      },
      set(value) {
        // 设置值时，将日期对象转换为时间戳
        this.createShortForm.expire = value ? value.getTime() : null
      }
    }
  },
  mounted() {
    this.getAKList()
  },
  methods: {

    // 获取ak列表
    async getAKList() {
      // 获取当前项目
      this.currentProject = JSON.parse(sessionStorage.getItem('CurrentWorkSpace'))
      const res = await AKList({
        projectId: this.currentProject.id,
        pageSize: 500,
        pageNo: 1
      })
      this.accessKeyList = res.data.data
    },

    // 获取短链列表
    async initData() {
      if (this.searchForm.accessKey === '') {
        this.$message({
          message: '请选择accessKey',
          type: 'warning'
        })
        return
      }
      const params = {
        credentialId: this.searchForm.accessKey,
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      // 删除params中为空的参数
      if (this.searchForm.originUrl) {
        params.originUrl = this.searchForm.originUrl
      }
      if (this.searchForm.shortUrl) {
        params.shortUrl = this.searchForm.shortUrl
      }
      const res = await ShortUrlList(params)
      this.tableData = res.data.data
      // 如果data.totalSize为null 则赋值为0
      if (res.data.totalSize === null) {
        res.data.totalSize = 0
      } else {
        this.total = res.data.totalSize
      }
    },

    // 提交
    createSubmitData() {
      this.$refs['createShortForm'].validate(async(valid, object) => {
        if (valid) {
          const res = await ShortUrlCreate(this.createShortForm)
          if (res.code === 0) {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.createShortFormVisible = false
            await this.initData()
          } else {
            this.$message({
              message: '新增失败',
              type: 'error'
            })
          }
        } else {
          for (const validKey in object) {
            this.$message.warning(
              object[validKey][0].message
            )
            break
          }
          return false
        }
      })
    },
    // 生成短链取消按钮
    // 取消选中
    createClickItem(e) {
      e === this.createRadio ? this.createRadio = 0 : this.createRadio = e
      if (this.createRadio === -1) {
        this.createShortForm.expire = -1
        this.createDateDisable = true
      } else {
        this.createShortForm.expire = null
        this.createDateDisable = false
      }
    },

    // 生成短链
    async btCreateShortUrl() {
      if (this.searchForm.accessKey !== '') {
        this.createRadio = 0
        this.createDateDisable = false
        this.createShortForm.accessKey = this.accessKeyList.find(item => item.id === this.searchForm.accessKey).accessKey
        this.createShortForm.originUrl = ''
        this.createShortForm.expire = null
      } else {
        this.createRadio = 0
        this.createShortForm.accessKey = ''
        this.createShortForm.originUrl = ''
        this.createShortForm.expire = null
        this.createDateDisable = false
      }
      this.createShortFormVisible = true
    },
    // 更新失效时间
    updateData() {
      this.$refs['updateExpireForm'].validate(async(valid, object) => {
        if (valid) {
          const res = await ShortUrlUpdate(this.updateExpireForm)
          if (res.code === 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.updateExpireFormVisible = false
            await this.initData()
          } else {
            this.$message({
              message: '修改失败',
              type: 'error'
            })
          }
        } else {
          for (const validKey in object) {
            this.$message.warning(
              object[validKey][0].message
            )
            break
          }
          return false
        }
      })
    },

    // 更新失效时间弹窗按钮
    btUpdateExpire(row) {
      this.updateExpireFormVisible = true
      this.updateExpireForm.id = row.id
      this.updateExpireForm.expire = null
    },

    // 失效按钮
    btDisableData(row) {
      this.$confirm(`确定要将此短链置为失效吗？失效后将无法访问该短链。`, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '关闭'
      }).then(async() => {
        const res = await ShortUrlDisable(row.id)
        this.apiDialogFormVisible = false
        if (res.code === 0) {
          this.$message({
            message: '短链已失效',
            type: 'success'
          })
          await this.initData()
        } else {
          this.$message({
            message: '短链未失效',
            type: 'error'
          })
        }
      })
    },

    // 取消选中
    clickItem(e) {
      e === this.radio ? this.radio = 0 : this.radio = e
      if (this.radio === -1) {
        this.updateExpireForm.expire = -1
        this.dateDisable = true
      } else {
        this.updateExpireForm.expire = null
        this.dateDisable = false
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
