<template>
  <el-container class="container-body">
    <el-aside class="sideBar">
      <div class="logoWrap">
        <img src="../assets/images/logo.png" alt="">
      </div>
      <div class="menu-scroll">
        <el-menu
          :default-active="activeMenu"
          text-color="#121519"
          active-text-color="#599AF2">
          <router-link to="/">
            <el-menu-item class="menu_item mb-15" index="1">
              <i class="el-icon-c-scale-to-original"></i>
              <span>Tổng quan</span>
            </el-menu-item>
          </router-link>
          <el-menu-item-group title="QUẢN LÝ ĐẶT PHÒNG" class="mb-15">
            <router-link to="/request-order-room">
              <el-menu-item index="9" class="menu_item">
                <i class="el-icon-takeaway-box"></i>
                <el-badge :value="requestOrder" class="item">
                  <span>Yêu cầu đặt phòng</span>
                </el-badge>
              </el-menu-item>
            </router-link>
            <router-link to="/order">
              <el-menu-item index="4" class="menu_item">
                <i class="el-icon-box"></i>
                <span>Tất cả đơn đặt phòng</span>
              </el-menu-item>
            </router-link>
          </el-menu-item-group>

          <el-menu-item-group title="QUẢN LÝ" class="mb-15">
            <router-link to="/categories">
              <el-menu-item index="15" class="menu_item">
                <i class="el-icon-notebook-2"></i>
                <span>Danh mục phòng</span>
              </el-menu-item>
            </router-link>
            <router-link to="/employees">
              <el-menu-item index="3" class="menu_item">
                <i class="el-icon-user"></i>
                <span>Quản lý nhân viên</span>
              </el-menu-item>
            </router-link>
            <router-link to="/support-request">
              <el-menu-item index="2" class="menu_item">
                <i class="el-icon-document-copy"></i>
                <el-badge :value="supportRequest" class="item">
                  <span>Yêu cầu khách hàng</span>
                </el-badge>
              </el-menu-item>
            </router-link>
            <router-link to="/user">
              <el-menu-item index="5" class="menu_item">
                <i class="el-icon-coordinate"></i>
                <span>Danh sách khách hàng</span>
              </el-menu-item>
            </router-link>
            <router-link to="/service-rule">
              <el-menu-item index="8" class="menu_item">
                <i class="el-icon-document"></i>
                <span>Điều khoản dịch vụ</span>
              </el-menu-item>
            </router-link>
          </el-menu-item-group>
          <el-menu-item-group title="QUẢN LÝ NỘI DUNG" class="mb-15">
            <router-link to="/members">
              <el-menu-item index="11" class="menu_item">
                <i class="el-icon-user"></i>
                <span>Đội ngũ</span>
              </el-menu-item>
            </router-link>
          </el-menu-item-group>
          <el-menu-item-group title="CẤU HÌNH" class="mb-15">
            <router-link to="/config-email-template">
              <el-menu-item index="14" class="menu_item">
                <i class="el-icon-message"></i>
                <span>Cấu hình nội dung email</span>
              </el-menu-item>
            </router-link>
            <router-link to="/information">
              <el-menu-item index="10" class="menu_item">
                <i class="el-icon-setting"></i>
                <span>Cấu hình thông tin</span>
              </el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-menu>
      </div>
    </el-aside>

    <el-container class="content">
      <el-header class="header">
        <div class="headerLeftWrap">
          {{ title }}
        </div>
        <div class="headerRightWrap">
          <el-dropdown>
            <span class="el-avatar el-avatar--medium el-avatar--circle">
                          <img src="../assets/images/user_default.png" alt="">
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item divided @click.native="logout">
                Đăng xuất
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {mapMutations, mapActions, mapState, mapGetters} from 'vuex'
import api from '../api'
import _ from 'lodash'

export default {
  name: 'AdminLayout',
  methods: {
    ...mapMutations('auth', ['updateAuthUser','updatePermissions']),
    ...mapMutations('home', ['updateUnread', 'updateActiveMenu', 'updateRequestOrder', 'updateSupportRequest']),
    ...mapActions('auth', ['logout']),
    getAuthUser() {
      api.getAuthUser().then((res) => {
        this.updateAuthUser(_.get(res, 'data'));
      });
    },
    getOrders() {
      api.getCountOrder().then((res) => {
        if (res) {
          this.orderAll = _.get(res, 'data.data.orderAll')
          this.updateRequestOrder(_.get(res, 'data.data.requestOrder'))
        }
      })
    },
    getAmountSupportRequest() {
      api.getAmountSupportRequest().then((res) => {
        if (res) {
          this.updateSupportRequest(_.get(res, 'data.data'))
        }
      })
    }
  },
  data(){
    return{
      role: {},
      endTimeCurrentPack: '',
      statusCurrentPack: null,
      orderAll: 0,
    }
  },
  computed: {
    ...mapState([
      'title'
    ]),
    ...mapState('home', [
      'unread', 'activeMenu', 'requestOrder', 'supportRequest'
    ]),
    ...mapState('auth', [
      'authUser'
    ]),
    ...mapGetters('auth', [
      'hasPermission'
    ])
  },
  mounted() {
    this.getAuthUser();
    this.getOrders();
    this.getAmountSupportRequest();
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/variables";
.container-body{
  height: 100vh;
}
.sideBar {
  width: 250px !important;
  height: 100vh;
  background: #FFFFFF;
  position: relative;
  outline: none;
  overflow: hidden;

  .logoWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    flex-shrink: 0;
    min-height: 58px;
    width: 230px;

    img {
      width: 150px;
    }
  }
  .menu-scroll {
    background-color: #FFFFFF;
    height: 85%;
    outline: none;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: #C0C4CC;
      border-radius: 8px;
    }

    &::-webkit-scrollbar-track {
      background-image: linear-gradient(to right, #F8F8F8 , #EAEAEA);
    }

    &:hover {
      overflow-y: scroll;

      .el-menu {
        box-shadow: inset -10px 0 10px -14px rgba(0, 0, 0, 0.1);
      }
    }
    .el-menu {
      padding-bottom: 50px;
      border: none;
      background-color: #FFFFFF;

      a {
        color: rgb(255, 255, 255);
        text-decoration: none;

        i {
          color: #121519;
        }

        .menu_item:hover {
          background-color: #C5D9FF !important;
          color: #599AF2 !important;
          i {
            color: #599AF2 !important;
          }
        }
      }
    }
  }

  .is-active {
    background-color: #035392 !important;
  }

  .customBadge {
    background-color: #f56c6c;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff;
    margin-left: 5px;
  }
}

.content {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $colorStroke;
    height: 60px;
    background: #599AF2;
    padding: 0 24px;

    .headerLeftWrap {
      display: flex;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
    }

    .headerRightWrap {
      display: flex;
      align-items: center;

      .notification {
        margin-right: 40px;
        font-size: 24px;
        color: gray;
      }

      .notification:hover {
        color: $colorSecondary;
      }
    }
  }
}

.el-main {
  overflow-x: scroll;
  overflow-y: auto;
  max-height: calc(100vh - 66px);
  padding: 20px 20px 15px 20px;

}

.el-main::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.el-main::-webkit-scrollbar-thumb {
  background-color: #C0C4CC;
  border-radius: 8px;
}

.profileUser {
  color: rgb(255, 255, 255);
  text-decoration: none;
}

.mb-15 {
  margin-bottom: 15px;
}
.pb-0 {
  padding-bottom: 0;
}
.footer{
  position: fixed;
  bottom: 0;
  text-align: center;
  background-color: white;
  padding: 5px 20px;
  box-shadow: inset -10px 0 10px -5px rgb(0 0 0 / 10%);
  width: 210px;
  p{
    margin: 5px 0;
    color: #9da1a8;
    font-size: 14px;
    a{
      text-decoration: none;
      color: #F05A24;
    }
  }
}
.el-menu-item-group::v-deep .el-menu-item:focus{
  background-color: #ffffff00 !important;
}
.sideBar .menu-scroll .el-menu a .is-active{
  i {
    color: #599AF2 !important;
  }
  background-color: #C5D9FF !important;
}

.el-badge::v-deep {
  .el-badge__content.is-fixed {
    top: 50%;
    right: -10px;
  }
}
</style>
