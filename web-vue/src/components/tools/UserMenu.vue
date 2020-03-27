<style lang="less" scoped>
  .user-wrapper {
    float: right;
    height: 100%;

    .action {
      cursor: pointer;
      padding: 0 14px;
      display: inline-block;
      transition: all .3s;
      height: 70%;
      line-height: 46px;

      .logout_title {
        color: inherit;
        text-decoration: none;
      }

      &.action-full {
        height: 100%;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .el-avatar--small {
        margin: 20px 10px 20px 0;
        color: #1890ff;
        background: hsla(0, 0%, 100%, .85);
        vertical-align: middle;
      }

      .icon {
        font-size: 16px;
        padding: 4px;
      }

      .anticon {
        color: white;
      }
    }

    .search-input {
      width: 180px;
      color: inherit;

      /deep/ .ant-select-selection {
        background-color: inherit;
        border: 0;
        border-bottom: 1px solid white;

        &__placeholder, &__field__placeholder {
          color: inherit;
        }
      }
    }
  }

</style>

<style scoped>

</style>
<template>
  <div class="user-wrapper" :class="theme">
    <span class="action" @click="showClick">
      <a-icon type="search"></a-icon>
    </span>
    <component :is="searchMenuComp" v-show="searchMenuVisible || isMobile()" class="borders"
               :visible="searchMenuVisible" title="搜索菜单" :footer="null" @cancel="searchMenuVisible=false">
      <a-select
        class="search-input"
        showSearch
        :showArrow="false"
        placeholder="搜索菜单"
        optionFilterProp="children"
        :filterOption="filterOption"
        :open="isMobile()?true:null"
        :getPopupContainer="(node) => node.parentNode"
        :style="isMobile()?{width: '100%',marginBottom:'50px'}:{}"
        @change="searchMethods"
        @blur="hiddenClick">
        <a-select-option v-for="(site,index) in searchMenuOptions" :key="index" :value="site.id">{{site.meta.title}}
        </a-select-option>
      </a-select>
    </component>
    <a-dropdown>
      <div class="action action-full ant-dropdown-link user-dropdown-menu">
        <el-avatar class="avatar" size="small" :src="getAvatar()"/>
        <span v-if="isDesktop()">欢迎您，{{ nickname() }}</span>
      </div>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item key="1">
          <router-link :to="{ name: 'account-settings-base' }">
            <a-icon type="setting"/>
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3" @click="systemSetting">
          <a-icon type="tool"/>
          <span>系统设置</span>
        </a-menu-item>
        <a-menu-item key="4" @click="updatePassword">
          <a-icon type="setting"/>
          <span>密码修改</span>
        </a-menu-item>
        <a-menu-item key="5" @click="updateCurrentDepart">
          <a-icon type="cluster"/>
          <span>切换部门</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <span class="action">
      <a class="logout_title" href="javascript:;" @click="handleLogout">
        <a-icon type="logout"/>
        <span v-if="isDesktop()">&nbsp;退出登录</span>
      </a>
    </span>
    <user-password ref="userPassword"></user-password>
    <depart-select ref="departSelect" :closable="true" title="部门切换"></depart-select>
    <setting-drawer ref="settingDrawer" :closable="true" title="系统设置"></setting-drawer>
  </div>
</template>

<script>
  // import HeaderNotice from './HeaderNotice'
  import UserPassword from './UserPassword'
  import SettingDrawer from "@/components/setting/SettingDrawer";
  import DepartSelect from './DepartSelect'
  import {mapActions, mapGetters, mapState} from 'vuex'
  import {mixinDevice} from '@/utils/mixin.js'

  export default {
    name: "UserMenu",
    mixins: [mixinDevice],
    data() {
      return {
        searchMenuOptions: [],
        searchMenuComp: 'span',
        searchMenuVisible: false,
      }
    },
    components: {
      // HeaderNotice,
      UserPassword,
      DepartSelect,
      SettingDrawer
    },
    props: {
      theme: {
        type: String,
        required: false,
        default: 'dark'
      }
    },
    created() {
      let lists = []
      this.searchMenus(lists, this.permissionMenuList)
      this.searchMenuOptions = [...lists]
    },
    computed: {
      ...mapState({
        // 后台菜单
        permissionMenuList: state => state.user.permissionList

      })
    },
    watch: {
      device: {
        immediate: true,
        handler() {
          this.searchMenuVisible = false
          this.searchMenuComp = this.isMobile() ? 'a-modal' : 'span'
        },
      },
    },
    methods: {
      showClick() {
        this.searchMenuVisible = true
      },
      hiddenClick() {
        this.shows = false
      },
      ...mapActions(["Logout"]),
      ...mapGetters(["nickname", "avatar", "userInfo"]),
      getAvatar() {
        console.log('url = ' + window._CONFIG['staticDomainURL'] + "/" + this.avatar())
        return window._CONFIG['staticDomainURL'] + "/" + this.avatar()
      },
      handleLogout() {
        const that = this
        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk() {
            return that.Logout({}).then(() => {
              window.location.href = "/";
              //window.location.reload()
            }).catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
          },
          onCancel() {
          },
        });
      },
      updatePassword() {
        let username = this.userInfo().username
        this.$refs.userPassword.show(username)
      },
      updateCurrentDepart() {
        this.$refs.departSelect.show()
      },
      systemSetting() {
        this.$refs.settingDrawer.showDrawer()
      },
      searchMenus(arr, menus) {
        for (let i of menus) {
          if (!i.hidden && "layouts/RouteView" !== i.component) {
            arr.push(i)
          }
          if (i.children && i.children.length > 0) {
            this.searchMenus(arr, i.children)
          }
        }
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      searchMethods(value) {
        let route = this.searchMenuOptions.filter(item => item.id === value)[0]
        if (route.meta.internalOrExternal === true || route.component.includes('layouts/IframePageView')) {
          window.open(route.meta.url, '_blank')
        } else {
          this.$router.push({path: route.path})
        }
        this.searchMenuVisible = false
      }
    }
  }
</script>
