<template>
  <div class="navbar">
    <div class="left-menu">
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <el-tooltip class="item" effect="dark" :content="tips" placement="top-start">
        <el-select
          v-model="project.id"
          placeholder="请选择项目"
          filterable
          style="width: 200px"
          class="project"
          @change="handleCommand"
        >
          <el-option
            v-for="(item, index) in projects"
            :key="index"
            :label="item.project_name"
            :value="item.id"
          />
        </el-select>
      </el-tooltip>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar
            v-if="userinfo"
            size="small"
            style="font-size: 12px; position: relative; top: -3px; left: 5px"
          >
            {{ userinfo? userinfo.username : userinfo.username }}
          </el-avatar>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">你想干嘛？退出？不可能的</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Hamburger
  },
  data() {
    return {
      project: {},
      tips: JSON.parse(sessionStorage.getItem('CurrentProject'))
        ? JSON.parse(sessionStorage.getItem('CurrentProject')).name
        : ''
    }
  },
  computed: {
    ...mapGetters(['userinfo', 'sidebar', 'avatar', 'projects'])
  },
  mounted() {
    // 判断workSpace不为空并且是数组
    if (this.projects && Array.isArray(this.projects)) {
      if (this.projects.length > 0) {
        // 判断sessionStorage中是否有项目，并且项目是否存在于workSpaces中
        if (
          sessionStorage.getItem('CurrentProject') &&
          this.projects.filter(
            (item) =>
              item.project_name ===
              JSON.parse(sessionStorage.getItem('CurrentProject')).project_name
          ).length > 0
        ) {
          this.project = JSON.parse(
            sessionStorage.getItem('CurrentProject')
          )
        } else {
          this.project = this.projects[0]
          // 将当前项目存入sessionStorage
          sessionStorage.setItem(
            'CurrentProject',
            JSON.stringify(this.project)
          )
        }
      } else {
        this.$message({
          message: '您还没有项目！！！',
          type: 'warning'
        })
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleCommand(value) {
      this.project = this.projects.find((item) => item.id === value)
      this.$message({
        message: '切换项目至 ' + this.project.project_name,
        type: 'success'
      })
      sessionStorage.setItem(
        'CurrentProject',
        JSON.stringify(this.project)
      )
      location.reload()
    },
    async logout() {
      console.log('sso登录的，别退出了。没用！')
      // await this.$store.dispatch('user/logout')
      // await this.$store.dispatch('user/login')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left-menu {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .project {
    .el-select-dropdown__item {
      text-align: center;
    }
    ::v-deep .el-input__inner {
      border: 1px;
    }
  }
  .right-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    float: right;
    height: 100%;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
