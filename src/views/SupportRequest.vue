<template>
  <div class="support-request">
    <el-row>
      <el-card>
        <div class="headerContent">
          <div class="searchWarp">
            <el-input class="inputSearch" v-model="search" @clear="handleSearch"
                      @keydown.enter.native="handleSearch"
                      clearable
                      placeholder="Nhập vào tên, email để tìm kiếm"></el-input>
            <el-button icon="el-icon-search" @click="handleSearch">Tìm kiếm</el-button>
          </div>
        </div>
      </el-card>
    </el-row>
    <el-card class="main">
      <el-table
          v-loading="loading"
          :data="requests"
          height="calc(100vh - 307px)"
          @sort-change="sort">
        <el-table-column
            prop="name"
            label="Họ tên"
            min-width="200px">
          <template slot-scope="item">
            <span><b style="color: #409eff">{{ item.row.name }}</b></span>
          </template>
        </el-table-column>
        <el-table-column
            prop="email"
            label="Email"
            min-width="200px">
        </el-table-column>
        <el-table-column
            prop="content"
            label="Nội dung"
            min-width="200px">
          <template slot-scope="item">
            <span v-if="item.row.content">{{ item.row.content }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="Trạng thái"
            min-width="200px">
          <template slot-scope="item">
            <span v-if="item.row.status === 0" class="response-0">Chưa phản hồi</span>
            <span v-else class="response-1">Đã phản hồi</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="created_at"
            label="Thời gian gửi yêu cầu"
            min-width="200px"
            align="center"
            sortable>
          <template slot-scope="item">
            <span v-if="item.row.created_at">{{ formatDateTime(item.row.created_at) }}</span>
            <span v-else>Đang cập nhật</span>
          </template>
        </el-table-column>
        <el-table-column
            label="Hành động"
            min-width="200px"
            align="center">
          <template slot-scope="item">
            <el-button plain v-if="item.row.status === 0" type="primary" @click="openDialogResponse(item.row)">Phản hồi</el-button>
            <el-button v-else type="primary" @click="openDialogDetailResponse(item.row)">Xem phản hồi</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationWarp" v-if="requests.length > 0">
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
    <el-dialog width="50%" top="5vh" v-loading="loadingDialog" :title="dialogTitle ? dialogTitle : 'Phản hồi khách hàng'"
               :close-on-click-modal="false"
               :visible.sync="dialog"
               class="modalUser">
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="inputWarp">
            <label>
              Nội dung
              <span class="required"> *</span>
            </label>
            <quill-editor
                class="quill-editor"
                ref="myQuillEditor"
                v-model="response"
                :options="editorOption"
            />
            <div v-if="errorResponse.length > 0" class="error">
              {{ errorResponse }}
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">Đóng</el-button>
        <el-button type="primary" @click="sendResponse">Gửi</el-button>
      </span>
    </el-dialog>

    <el-dialog width="50%" top="5vh" v-loading="loadingDialog"
               :title="dialogDetailTitle ? dialogDetailTitle : 'Nội dung phản hồi khách hàng'"
               :close-on-click-modal="false"
               :visible.sync="dialogDetail"
               class="modalUser">
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="inputWarp">
            <label>
              Nội dung phản hồi
            </label>
            <el-row>
              <el-col :span="24">
                <div v-html="responseDetail"></div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDetail = false">Đóng</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../api';
import _ from "lodash";
import {mapMutations} from "vuex";
import moment from "moment";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
name: "SupportRequest",
  components: {
    quillEditor
  },
  methods: {
    ...mapMutations([
      'updateTitle'
    ]),
    ...mapMutations('home', [
      'updateActiveMenu', 'updateSupportRequest'
    ]),
    handleGetRequest(params = {}) {
      this.loading = true
      if (this.search) {
        params.q = this.search
      }
      api.getSupportRequest(params).then(response => {
        this.requests = _.get(response, "data.data.data", [])
        this.page.currentPage = _.get(response, 'data.data.current_page')
        this.page.pageSize = _.get(response, 'data.data.per_page')
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
      this.handleGetRequest(params)
    },
    handleSearch() {
      this.handleGetRequest();
    },
    formatDateTime(value) {
      return moment(value).format('hh:mm DD/MM/YYYY')
    },
    openDialogResponse(item) {
      this.dialogTitle = "Phản hồi khách hàng " + item.name + " tới email " + item.email;
      this.requestTd = item._id;
      this.response = "";
      this.errorResponse = ""
      this.dialog = true;
    },
    sort(data) {
      let order_type = data.order === "ascending" ? "ASC" : "DESC";
      let params = {
        order_type: order_type
      }
      this.handleGetRequest(params);
    },
    validateResponse() {
      let error = false;
      if (this.response.length === 0) {
        error = true;
        this.errorResponse = "Nội dung phản hồi không được bỏ trống";
      }
      return !error;
    },
    sendResponse() {
      if (this.validateResponse()) {
        this.loadingDialog = true;
        let data = {
          content: this.response
        }
        api.sendResponse(data, this.requestTd).then(() => {
          this.loadingDialog = false
          this.dialog = false
          this.$message({
            type: "success",
            message: "Gửi email thành công"
          })
          this.handleCurrentChange(this.page.currentPage);
          this.getAmountSupportRequest();
        }).catch(() => {
          this.loadingDialog = false
          this.dialog = false
          this.$message({
            type: "error",
            message: "Gửi email thất bại"
          })
        })
      }
    },
    openDialogDetailResponse(item) {
      this.dialogDetailTitle = "Nội dung phản hồi khách hàng " + item.name + " tới email " + item.email;
      this.responseDetail = item.response.content ? item.response.content : "";
      this.dialogDetail = true;
    },
    getAmountSupportRequest() {
      api.getAmountSupportRequest().then((res) => {
        if (res) {
          this.updateSupportRequest(_.get(res, 'data.data'))
        }
      })
    }
  },
  mounted() {
    this.updateTitle('Yêu cầu người dùng')
    this.updateActiveMenu('2')
    this.handleGetRequest();
    this.getAmountSupportRequest();
  },
  watch: {
    response() {
      this.errorResponse = "";
    }
  },
  data() {
    return {
      search: "",
      loading: false,
      loadingDialog: false,
      dialog: false,
      dialogTitle: "",
      dialogDetailTitle: "",
      dialogDetail: false,
      responseDetail: "",
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        from: 0,
        to: 0
      },
      requests: [],
      status: [
        {
          value: 0,
          label: 'Chưa phản hồi'
        },
        {
          value: 1,
          label: 'Đã phản hồi'
        }
      ],
      response: "",
      errorResponse: "",
      requestTd: "",
      editorOption: {
        placeholder: "Nhập nội dung phản hồi..."
      }
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
      width: 30%;

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
#selectStatus {
  font-size: 12px;
  padding: 5px 15px;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.response-0 {
  font-weight: bold;
  color: #707070;
}
.response-1 {
  font-weight: bold;
  color: #4CB050;
}

.option_status {
  color: black;
  background: white;
  border-color: white;
  outline: none;
  padding: 30px 0 !important;
}
.modalUser {
  .el-dialog__body {
    padding-top: 0 !important;
    .el-row {
      margin-bottom: 10px;

      .inputWarp {
        .error {
          color: $colorRed;
          margin-top: 75px;
          font-size: 12px;
        }

        label {
          font-size: 12px;
          font-weight: 600;
          color: #3f6079;;
          display: block;
          margin-bottom: 5px;

          .required {
            color: $colorRed;
          }
        }
        .quill-editor {
          height: 600px;
          margin-bottom: 30px;
        }
      }
    }
  }
}
</style>