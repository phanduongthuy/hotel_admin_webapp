<template>
  <div class="user">
    <el-row>
      <el-card>
        <div class="headerContent">
          <div class="searchWarp">
            <el-input class="inputSearch" v-model="search" @clear="handleSearch"
                      @keydown.enter.native="handleSearch"
                      clearable
                      placeholder="Nhập vào tên, email, số điện thoại hoặc tài khoản để tìm kiếm"></el-input>
            <el-button icon="el-icon-search" @click="handleSearch">Tìm kiếm</el-button>
          </div>
        </div>
      </el-card>
    </el-row>
    <el-card class="main">
      <el-table
          v-loading="loading"
          :data="users"
          height="calc(100vh - 307px)">
        <el-table-column
            prop="name"
            label="Họ tên"
            min-width="200px">
          <template slot-scope="item">
            <span v-if="item.row.name"><b style="color: #409eff">{{ item.row.name }}</b></span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="email"
            label="Email"
            min-width="200px">
          <template slot-scope="item">
            <span v-if="item.row.email">{{ item.row.email }}</span>
            <span v-else>Đang cập nhật</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="phone"
            label="Số điện thoại"
            min-width="200px">
          <template slot-scope="item">
            <span v-if="item.row.phone">{{ item.row.phone }}</span>
            <span v-else>Đang cập nhật</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="user_name"
            label="Tài khoản"
            min-width="200px">
          <template slot-scope="item">
            <span v-if="item.row.user_name">{{ item.row.user_name }}</span>
            <span v-else>Đang cập nhật</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="date_of_birth"
            label="Ngày sinh"
            min-width="200px"
            align="center">
          <template slot-scope="item">
            <span v-if="item.row.date_of_birth">{{ formatDateTime(item.row.date_of_birth) }}</span>
            <span v-else>Đang cập nhật</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationWarp" v-if="users.length > 0">
        <el-col :span="10">
          <div class="textInfo">
            <p>Số lượng kết quả: {{ page.from }} - {{ page.to }} của {{ page.total }} </p>
          </div>
        </el-col>

        <el-col :span="14">
          <el-pagination
              layout="prev, pager, next"
              :total="page.total"
              :page-size="page.pageSize"
              :current-page="page.currentPage"
              @current-change="handleCurrentChange"
          >
          </el-pagination>
        </el-col>
      </div>
    </el-card>
  </div>
</template>

<script>
import {mapMutations} from "vuex";
import api from "@/api";
import _ from "lodash";
import moment from "moment";

export default {
name: "User",
  methods: {
    ...mapMutations([
      'updateTitle'
    ]),
    ...mapMutations('home', [
      'updateActiveMenu'
    ]),
    handleGetUser(params = {}) {
      this.loading = true
      if (this.search) {
        params.q = this.search
      }
      api.getUser(params).then(response => {
        this.users = _.get(response, "data.data.data", [])
        this.page.currentPage = _.get(response, 'data.data.current_page')
        this.page.total = _.get(response, 'data.data.total', 0)
        let from = _.get(response, 'data.data.from', 0)
        let to = _.get(response, 'data.data.to', 0)
        this.page.from = from ? from : 0
        this.page.to = to ? to : 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      let params = {
        page: val
      }
      this.handleGetUser(params)
    },
    handleSearch() {
      this.handleGetUser();
    },
    formatDateTime(value) {
      return moment(value).format('DD/MM/YYYY')
    }
  },
  mounted() {
    this.updateTitle('Danh sách khách hàng')
    this.updateActiveMenu('5')
    this.handleGetUser();
  },
  data() {
    return {
      search: "",
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 15,
        total: 0,
        from: 0,
        to: 0
      },
      users: []
    }
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/variables";
.el-row {
  margin-bottom: 20px;

  .headerContent {
    display: flex;
    align-content: center;
    justify-content: space-between;

    .searchWarp {
      display: flex;
      width: 40%;

      .inputSearch {
        margin-right: 30px;
      }
    }

    .addUserWarp {
      line-height: 40px;


    }
  }
}
.paginationWarp {
  padding: 5px 20px;
  margin-bottom: 35px;

  .el-pagination {
    float: right;
  }

  .textInfo {
    p {
      font-size: .92857rem;
      margin: 10px 0;
    }
  }
}
.user_name {
  text-decoration: none;
  font-weight: bold;
  color: #1761B0;
}
</style>