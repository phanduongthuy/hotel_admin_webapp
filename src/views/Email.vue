<template>
  <div class="email">
    <el-row>
      <el-card>
        <div class="headerContent">
          <div class="searchWarp">
            <el-input class="inputSearch" v-model="search" @clear="handleSearch"
                      @keydown.enter.native="handleSearch"
                      clearable
                      placeholder="Nhập vào tiêu đề để tìm kiếm"></el-input>
            <el-button icon="el-icon-search" @click="handleSearch">Tìm kiếm</el-button>
          </div>
        </div>
      </el-card>
    </el-row>
    <el-card class="main">
      <el-table
          v-loading="loading"
          :data="emails"
          height="calc(100vh - 255px)">
        <el-table-column type="expand">
          <template v-slot:default="props">
            <el-table
                :data="props.row.email_templates">
              <el-table-column
                  label="Cấu hình email"
                  min-width="200px">
                <template slot-scope="item">
                  <span v-if="item.row.title">{{ item.row.title }}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                  prop="created_at"
                  label="Ngày sửa đổi"
                  width="200px"
                  align="center">
                <template slot-scope="item">{{ formatDateTime(item.row.updated_at) }}</template>
              </el-table-column>
              <el-table-column
                  width="100px"
                  align="center"
                  label="Hành động">
                <template slot-scope="item">
                  <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top"
                              style="font-size: 16px !important; padding: 8px !important; cursor: pointer !important;">
                    <el-button type="primary" icon="el-icon-edit" circle plain @click="editEmail(item.row._id)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column
            label="Loại email"
            min-width="200px">
          <template slot-scope="item">
            <span v-if="item.row.name"><b style="color: #409eff">{{ item.row.name }}</b></span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
            label="Mô tả"
            min-width="200px">
          <template slot-scope="item">
            <span v-if="item.row.description">{{ item.row.description }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {mapMutations} from "vuex";
import api from "@/api";
import _ from "lodash";
import moment from "moment";

export default {
  name: "Email",
  methods: {
    ...mapMutations([
      'updateTitle'
    ]),
    ...mapMutations('home', [
      'updateActiveMenu'
    ]),
    editEmail (id) {
      this.$router.push({path:`/update-email-template/${id}`})
    },
    closePopper() {
      let control = document.getElementsByClassName('el-popper');
      control.forEach(element => {
        element.style.display = 'none'
        element.style.position = 'static'
      })
    },

    handleGetEmailTemplate(params = {}) {
      this.loading = true
      if (this.search) {
        params.q = this.search
      }
      api.getListEmails(params).then(response => {
        this.emails = _.get(response, "data.data", [])
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSearch() {
      this.handleGetEmailTemplate();
    },
    formatDateTime(value) {
      if (_.isNull(value)) {
        return '-'
      }
      return moment(value, "YYYYMMDDhhmmss").format('hh:mm | DD/MM/YYYY')
    },

  },
  mounted() {
    this.updateTitle('Cấu hình nội dung email')
    this.updateActiveMenu('14')
    this.handleGetEmailTemplate();
  },
  data() {
    return {
      search: "",
      loading: false,
      emails: [],
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
      width: 50%;

      .inputSearch {
        margin-right: 30px;
      }
    }

    .addemailWarp {
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