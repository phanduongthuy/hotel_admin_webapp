<template>
  <div class="order">
    <el-row class="head">
      <el-card>
        <div class="headerContent">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="searchWarp">
                <el-input class="inputSearch" v-model="search" @clear="handleSearch"
                          @keydown.enter.native="handleSearch"
                          clearable
                          placeholder="Nhập tên file để tìm kiếm"></el-input>
                <el-button icon="el-icon-search" @click="handleSearch">Tìm kiếm</el-button>
              </div>
            </el-col>
            <el-col :span="3">
              <el-select v-model="selectedLanguage" @change="handleSearch" placeholder="Ngôn ngữ gốc" clearable>
                <el-option
                    v-for="item in language"
                    :key="item._id"
                    :label="item.description"
                    :value="item._id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-select v-model="selectedLanguageTranslate" @change="handleSearch" placeholder="Ngôn ngữ dịch" clearable>
                <el-option
                    v-for="item in language"
                    :key="item._id"
                    :label="item.description"
                    :value="item._id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-select v-model="type" placeholder="Loại đơn" @change="handleSearch" clearable>
                <el-option label="Dịch" value="0"></el-option>
                <el-option label="Review" value="1"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-row>
    <el-card class="main">
      <el-table
          v-loading="loading"
          :data="order"
          height="calc(100vh - 307px)"
          @sort-change="sort">
        <el-table-column
            fixed
            prop="created_at"
            label="Ngày đặt hàng"
            width="150px">
          <template slot-scope="item">
            <span v-if="item.row.created_at">{{ formatDateTime(item.row.created_at) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
            fixed
            prop="file_name"
            label="Tên file"
            min-width="200px">
          <template slot-scope="item">
            <span class="user_file" @click="exportFile(item.row)"><i class="el-icon-download"></i> {{ getFileName(item.row.file_name) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="type"
            label="Loại đơn"
            min-width="200px"
            align="center">
          <template slot-scope="item">
            <span v-if="item.row.type == 0">Dịch</span>
            <div>
              <span v-if="item.row.type == 0 && item.row.language_native">{{ item.row.language_native.name }}</span>
              <span v-if="item.row.type == 0 && item.row.language_native && item.row.language_translate"> - </span>
              <span v-if="item.row.type == 0 && item.row.language_translate">{{ item.row.language_translate.name }}</span>
            </div>
            <span v-if="item.row.type == 1">Review</span>
            <div>
              <span v-if="item.row.type == 1 && item.row.language_native">{{ item.row.language_native.name }}</span>
              <span v-if="item.row.type == 1 && item.row.language_native && item.row.language_translate"> - </span>
              <span v-if="item.row.type == 1 && item.row.language_translate">{{ item.row.language_translate.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="Tên người đặt"
            min-width="300px">
          <template slot-scope="item">
            <div v-if="item.row.user">
              <span v-if="item.row.user.name && item.row.user.name.length > 0" class="user_name">
                {{ item.row.user.name }}
                <span v-if="item.row.user.name !== item.row.user.user_name">
                  <span v-if="item.row.user.user_name && item.row.user.user_name.length > 0">({{item.row.user.user_name}})</span>
                </span>
              </span>
              <span v-else-if="item.row.user.user_name && item.row.user.user_name.length > 0" class="user_name">
                {{item.row.user.user_name}}
              </span>
              <span v-else>-</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
                label="Trạng thái thanh toán"
                min-width="200px">
          <template slot-scope="item">
            <div>
              <span v-if="item.row.payment_status === 0" style="color: #909399">
                <b>Chưa thanh toán</b>
              </span>
              <span v-else-if="item.row.payment_status === 1" style="color: #67c23a">
                <b>Đã thanh toán</b>
              </span>
              <span v-else-if="item.row.payment_status === 2" style="color: #e6a23c">
                <b>Chờ thanh toán</b>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="Trạng thái đơn"
            min-width="150px"
            prop="status"
        >
          <template slot-scope="item">
            <span v-if="item.row.status === 0">
              <el-button type="info" size="small">Chưa báo giá</el-button>
            </span>
            <span v-else-if="item.row.status === 1">
              <el-button type="primary" size="small">Đã báo giá</el-button>
            </span>
            <span v-else-if="item.row.status === 2">
              <el-button type="warning" size="small">Đang dịch</el-button>
            </span>
            <span v-else-if="item.row.status === 3">
              <el-button type="success" size="small">Đã dịch xong</el-button>
            </span>
            <span v-else-if="item.row.status === 4">
              <el-button type="warning" size="small">Đang review</el-button>
            </span>
            <span v-else-if="item.row.status === 5">
              <el-button type="success" size="small">Đã review</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column
            label="Hạn trả"
            width="150px"
            sortable>
          <template slot-scope="item">
            <span v-if="item.row.deadline">{{ formatDateTime(parseInt(item.row.deadline) * 1000) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            width="100px"
            align="center"
            label="Hành động">
          <template slot-scope="item">
            <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="left"
                        style="font-size: 16px !important; padding: 8px !important; cursor: pointer !important;">
              <el-button type="primary" icon="el-icon-edit" circle plain @click="openDialogEdit(item.row)"></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" placement="left"
                        :content="item.row.note !== null && item.row.note.length > 0 ? 'Yêu cầu của khách hàng' : 'Đơn hàng không có yêu cầu'"
                        style="font-size: 16px !important; padding: 8px !important;">
              <el-button type="warning" circle plain  v-if="item.row.note !== null && item.row.note.length > 0"
                         @click="openRequestCustomer(item.row)"  style="cursor: pointer">
                <i class="fa-solid fa-eye icon-eye"></i>
              </el-button>
              <el-button type="warning" circle plain class="not-allowed" v-else style="cursor: not-allowed">
                <i class="fa-solid fa-eye icon-eye"></i>
              </el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <div class="paginationWarp" v-if="order.length > 0">
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
    <el-dialog width="30%" top="5vh"
               title="Chỉnh sửa đơn hàng"
               :visible.sync="dialogEdit"
               class="modalUser"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :before-close="closeDialogEdit">
      <div v-loading="loadingDialog">
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="inputWarp">
              <label class="form-label">Trạng thái đơn</label>
              <el-select v-model="status">
                <el-option
                    v-for="item in order_type == '0' ? orderStatus : orderStatusReview"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="inputWarp">
              <el-checkbox v-if="payment_status_confirm" disabled v-model="payment_status_confirm">Đã thanh toán</el-checkbox>
              <el-checkbox v-else-if="!payment_status_confirm" @change="openConfirm" v-model="payment_status">Đã thanh toán</el-checkbox>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="inputWarp">
              <label class="form-label">
                Số trang
              </label>
              <el-input type="number" v-model="total_page"></el-input>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="inputWarp">
              <label class="form-label">
                Đơn giá / 1 trang
              </label>
              <el-input  @input="formatMoneyinput" v-model="price_per_page"></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialogEdit">Đóng</el-button>
        <el-button type="primary" @click="handleUpdateOrder">Gửi</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
      top="5vh"
      v-loading="loadingDialog"
      title="Xác nhận thanh toán"
      :visible.sync="dialogConfirm"
      class="modalUser"
    >
      Xác nhân khách hàng đã thanh toán số tiền:
      <b>{{ formatMoney(this.total_page * this.price_per_page) }}đ</b>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConfirm = false">Đóng</el-button>
        <el-button type="primary" @click="confirmPayment">Xác nhận</el-button>
      </span>
    </el-dialog>

    <el-dialog width="30%" top="5vh"
               title="Yêu cầu của khách hàng"
               :visible.sync="dialogRequest"
               class="modalUser"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div>
        {{requestCustomer}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRequest = false">Đóng</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapMutations} from "vuex";
import api from "@/api";
import _ from "lodash";
import moment from "moment";
import { formatNumber, formatMoney, formatStringtoNumber } from "@/utils/helper";

export default {
name: "RequestOrder",
  methods: {
    ...mapMutations([
      'updateTitle'
    ]),
    ...mapMutations('home', [
      'updateActiveMenu', 'RequestOrder'
    ]),
    handleGetOrder(params = {}) {
      this.loading = true
      if (this.search) {
        params.q = this.search
      }
      if (this.selectedLanguage) {
        params.native_language_id = this.selectedLanguage;
      }
      if (this.selectedLanguageTranslate) {
        params.translate_language_id = this.selectedLanguageTranslate;
      }
      if (this.type) {
        params.type = this.type;
      }
      if (this.selectedStatus !== '') {
        params.status = this.selectedStatus;
      }
      if (this.deadlineSort) {
        params.deadline = this.deadlineSort;
      }
      api.getOrderNotQuote(params).then(response => {
        this.order = _.get(response, "data.data.data", [])
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
      this.handleGetOrder(params)
    },
    handleSearch() {
      this.handleGetOrder();
    },
    formatDateTime(value) {
      return moment(value).format('DD/MM/YYYY')
    },
    formatMoney(price) {
      return formatNumber(price)
    },
    handleGetAllLanguage() {
      api.getAllLanguage().then((response) => {
        this.language = _.get(response, "data.data", []);
      })
    },
    sort(data) {
      if (data.order) {
        this.deadlineSort = data.order === "ascending" ? "ASC" : "DESC";
      } else {
        this.deadlineSort = "";
      }
      this.handleGetOrder();
    },
    openDialogEdit(item) {
      this.order_id = item._id;
      this.order_type = item.type
      this.status = parseInt(item.status);
      this.payment_status_confirm = parseInt(item.payment_status) === 1 ;
      this.payment_status = parseInt(item.payment_status) === 1 ;
      this.total_page = item.total_page;
      this.price_per_page = item.price_per_page
      this.dialogEdit = true
    },
    closeDialogEdit(done) {
      this.$confirm(' Các sửa đổi sẽ không dược cập nhật nếu có thay đổi. Bạn có chắc chắn muốn đóng?', 'Cảnh báo', {
        confirmButtonText: 'Đóng',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        done();
      }).catch(() => {
      //
      })

    },
    handleCloseDialogEdit() {
      this.$confirm(' Các sửa đổi sẽ không dược cập nhật nếu có thay đổi. Bạn có chắc chắn muốn đóng?', 'Cảnh báo', {
        confirmButtonText: 'Đóng',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        this.dialogEdit = false
      }).catch(() => {
      //
      })

    },
    handleUpdateOrder() {
      this.$confirm(' Bạn có chắc chắn muốn thay đổi thông tin đơn hàng không?', 'Cảnh báo', {
        confirmButtonText: 'Gửi',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        this.loadingDialog = true;
        let data = {
          order_id: this.order_id,
          status: this.status,
          price_per_page: formatStringtoNumber(this.price_per_page),
          total_page: this.total_page,
          payment_status: this.payment_status
        }
        api.updateOrder(data).then(() => {
          if (this.status != 0) {
            this.RequestOrder(this.page.total - 1)
          }
          this.loadingDialog = false;
          this.dialogEdit = false
          this.handleCurrentChange(this.page.currentPage);
          this.$message({
            type: "success",
            message: "Cập nhật thành công"
          })
          this.confirm = false
        }).catch(() => {
          this.loadingDialog = false;
          this.dialogEdit = false
          this.$message({
            type: "error",
            message: "Cập nhật thất bại"
          })
          this.confirm = false
        })
      })
    },
    exportFile(item) {
      api.exportFile(item.document._id).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', this.getFileName(item.file_name));
        document.body.appendChild(link);
        link.click()
      }).catch(() => {
        this.$message.error({
          type: 'error',
          message: "Có lỗi! Vui lòng thử lại sau"
        })
      })
    },
    confirmPayment() {
      this.dialogConfirm = false;
      this.confirm = true;
    },
    openConfirm(value) {
      if (value) {
        this.dialogConfirm = true
      }
    },
    getFileName(name) {
      return name.substr(13)
    },
    getCountOrders() {
      api.getCountOrder().then((res) => {
        if (res) {
          this.RequestOrder(_.get(res, 'data.data.orderNotQuote'))
        }
      })
    },
    formatMoneyinput() {
      this.price_per_page = formatMoney(this.price_per_page)
    },
    openRequestCustomer(data) {
      this.dialogRequest = true
      this.requestCustomer = data.note
    }
  },
  watch: {
    dialogConfirm(value) {
      if (value) {
        this.confirm = false
      } else {
        if (!this.confirm) {
          this.payment_status = null;
        }
      }
    }
  },
  mounted() {
    this.updateTitle('Đơn hàng chờ báo giá')
    this.updateActiveMenu('9')
    this.handleGetOrder();
    this.handleGetAllLanguage();
    this.getCountOrders();
  },
  data() {
    return {
      search: "",
      order: [],
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        from: 0,
        to: 0
      },
      language: [],
      selectedLanguage: "",
      selectedLanguageTranslate: "",
      selectedStatus: "",
      type: "",
      deadlineSort: "",
      dialogEdit: false,
      loadingDialog: false,
      status: null,
      price_per_page: 0,
      total_page: 0,
      order_id: "",
      order_type: "",
      file: null,
      uploadText: "Thả tệp vào đây hoặc <em style='color: #409EFF; font-style: normal;'>bấm đê tải tệp lên</em>",
      errorFile: "",
      orderStatus: [
        {
          label: "Chưa báo giá",
          value: 0
        },
        {
          label: "Đã báo giá",
          value: 1
        },
        {
          label: "Đang dịch",
          value: 2
        },
        {
          label: "Đã dịch xong",
          value: 3
        },
      ],
      orderStatusReview: [
        {
          label: "Chưa báo giá",
          value: 0
        },
        {
          label: "Đã báo giá",
          value: 1
        },
        {
          label: "Đang review",
          value: 4
        },
        {
          label: "Đã review",
          value: 5
        },
      ],
      payment_status: null,
      dialogConfirm: false,
      confirm: false,
      payment_status_confirm: null,
      dialogRequest: false,
      requestCustomer: ''
    }
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/variables";
.head {
  margin-bottom: 20px;

  .headerContent {

    .searchWarp {
      display: flex;

      .inputSearch {
        margin-right: 20px;
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
.user_file {
  text-decoration: none;
  font-weight: bold;
  color: #1761B0;
  cursor: pointer;
}
.user_name {
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
}

.icon-eye {
  font-weight: 100;
}
.not-allowed::v-deep {
  color: #f0c78a;

  &:hover {
    background: #f0c78a;
    border-color: #f0c78a;

  }
}
.modalUser {
  .el-dialog__body {
    padding-top: 0 !important;
    .el-row {
      margin-bottom: 20px;

      .inputWarp {
        .error {
          color: $colorRed;
          margin-top: 75px;
          font-size: 12px;
        }

        label {
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          color: #3f6079;;
          //display: block;
          margin-bottom: 5px;

          .required {
            color: $colorRed;
          }
        }
      }
    }
  }
}

.modalFile {
  .el-dialog__body {
    .upload-file {
      width: 98%;
      height: 200px;
      border: 4px dashed $colorSecondary;
      margin: 0 auto;
      text-align: center;
      position: relative;

      p {
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 170px;
        color: #ffffff;
        font-family: Arial;
      }


      i {
        font-size: 67px;
        color: #C0C4CC;
        margin: 40px 0 16px;
        line-height: 50px;
      }

      input {
        position: absolute;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        outline: none;
        opacity: 0;
        top: 0;
        left: 0;
        cursor: pointer;
      }

      .el-upload__text {
        color: #606266;
        font-size: 14px;
        text-align: center;

        em {
          color: #409EFF;
          font-style: normal;
        }
      }
      .error {
        color: $colorRed;
        font-size: 12px;
      }
    }
  }
}

.el-table__row .cell .el-button, body .el-table__header .cell .el-button {
  font-size: 11px !important;
  padding: 4px !important;
  cursor: default;
  font-weight: bold;
}

.el-button--info:focus, .el-button--info:hover {
  background-color: #909399;
  color: #FFFFFF;
}
</style>