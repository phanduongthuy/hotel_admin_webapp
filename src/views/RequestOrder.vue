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
                          placeholder="Nhập tên khách hàng để tìm kiếm"></el-input>
                <el-button icon="el-icon-search" @click="handleSearch">Tìm kiếm</el-button>
              </div>
            </el-col>

            <el-col :span="3">
              <el-select v-model="type" placeholder="Loại dịch vụ" @change="handleSearch" clearable>
                <el-option label="Qua đêm" value="0"></el-option>
                <el-option label="Giờ" value="1"></el-option>
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
          height="calc(100vh - 307px)">
        <el-table-column
            fixed
            prop="created_at"
            label="Ngày đặt phòng">
          <template slot-scope="item">
            <span v-if="item.row.created_at">{{ formatDateTime(item.row.created_at) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
            fixed
            label="Tên khách hàng">
          <template slot-scope="item">
             {{ item.row.customer_name }}
          </template>
        </el-table-column>
        <el-table-column
            label="Số điện thoại">
          <template slot-scope="item">
            <span v-if="item.row.user_id">{{ item.row.user.phone }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="type"
            label="Loại dịch vụ"
            align="center">
          <template slot-scope="item">
            <span v-if="item.row.type === 0">Qua đêm</span>
            <span v-else>Giờ</span>

          </template>
        </el-table-column>

        <el-table-column
            fixed="right"
            width="100px"
            align="center"
            label="Hành động">
          <template slot-scope="item">
            <el-popover
                placement="bottom"
                trigger="click">
              <div class="orderControls">
                <ul>
                  <li>
                    <a href="#" @click="confirmOrder(item.row._id)"><i class="el-icon-check"></i>Xác nhận</a>
                  </li>
                  <li >
                    <a href="#" @click="cancelOrder(item.row._id)"><i class="el-icon-delete"></i>Hủy</a>
                  </li>
                </ul>
              </div>
              <el-button slot="reference" class="actionControl"><i class="el-icon-more"></i></el-button>
            </el-popover>

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

    <el-dialog width="30%" top="5vh" title="Xác nhận yêu cầu đặt phòng"
               :visible.sync="dialogEdit" class="modalUser">
      <div v-loading="loadingDialog">
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="inputWarp">
              <label class="form-label">Chọn phòng</label>
              <el-select v-model="roomId" placeholder="Chọn phòng">
                <el-option
                    v-for="item in rooms"
                    :key="item.value"
                    :label="item.name"
                    :value="item._id">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="inputWarp">
              <label class="form-label">Ghi chú</label>
              <el-input type="textarea" :rows="5" v-model="note"> </el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">Đóng</el-button>
        <el-button type="primary" @click="handleUpdateOrder">Gửi</el-button>
      </span>
    </el-dialog>

    <el-dialog width="30%" top="5vh" title="Hủy yêu cầu đặt phòng"
               :visible.sync="dialogCancel" class="modalUser">
      <div v-loading="loadingDialog">
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="inputWarp">
              <label class="form-label">Ghi chú</label>
              <el-input type="textarea" :rows="5" v-model="note"> </el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel = false">Đóng</el-button>
        <el-button type="primary" @click="handleCancel">Hủy</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapMutations} from "vuex";
import api from "@/api";
import _ from "lodash";
import moment from "moment";
import { formatNumber, formatMoney } from "@/utils/helper";

export default {
name: "RequestOrder",
  methods: {
    ...mapMutations([
      'updateTitle'
    ]),
    ...mapMutations('home', [
      'updateActiveMenu', 'updateRequestOrder'
    ]),
    confirmOrder(id) {
      this.order_id = id
      this.dialogEdit = true
    },
    cancelOrder(id) {
      this.order_id = id
      this.dialogCancel = true
    },
    handleGetOrder(params = {}) {
      this.loading = true
      if (this.search) {
        params.q = this.search
      }

      if (this.type) {
        params.type = this.type;
      }

      api.getOrderRequest(params).then(response => {
        this.order = _.get(response, "data.data.data", [])
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

    handleCancel() {
      this.$confirm(' Chắc chắn hủy yêu cầu đặt phòng?', 'Cảnh báo', {
        confirmButtonText: 'Gửi',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        this.loadingDialog = true;
        let data = {
          note: this.note
        }
        api.cancelRequestOrder(data, this.order_id).then(() => {
          this.$message({
            type: "success",
            message: "Hủy yêu cầu thành công!"
          })
          if (this.status != 0) {
            this.updateRequestOrder(this.page.total - 1)
          }
          this.loadingDialog = false;
          this.dialogCancel = false
          this.handleCurrentChange(this.page.currentPage);
          this.order_id = ''
        })
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
          note: this.note,
          room_id: this.roomId
        }
        api.confirmRequestOrder(data, this.order_id).then(() => {
          if (this.status != 0) {
            this.updateRequestOrder(this.page.total - 1)
          }
          this.loadingDialog = false;
          this.dialogEdit = false
          this.handleCurrentChange(this.page.currentPage);
          this.$message({
            type: "success",
            message: "Cập nhật thành công"
          })
          this.order_id = ''
        }).catch(() => {
          this.loadingDialog = false;
          this.dialogEdit = false
          this.$message({
            type: "error",
            message: "Cập nhật thất bại"
          })
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

    getCountOrders() {
      api.getCountOrder().then((res) => {
        if (res) {
          this.updateRequestOrder(_.get(res, 'data.data.orderRequest'))
        }
      })
    },
    formatMoneyinput() {
      this.price_per_page = formatMoney(this.price_per_page)
    },

    getRoomsApi() {
      api.getAllRooms().then((res) => {
        this.rooms = _.get(res, 'data.data',[])
      })
    },
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
    this.updateTitle('Yêu cầu đặt phòng')
    this.updateActiveMenu('9')
    this.handleGetOrder()
    this.getCountOrders()
    this.getRoomsApi()
  },
  data() {
    return {
      search: "",
      order: [],
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 15,
        total: 0,
        from: 0,
        to: 0
      },
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
      payment_status: null,
      dialogConfirm: false,
      confirm: false,
      payment_status_confirm: null,
      dialogRequest: false,
      requestCustomer: '',
      note: '',
      dialogCancel: false,
      rooms: [],
      roomId: ''
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
.el-popover {
  padding: 0 !important;

  .orderControls {
    ul {
      margin: 0;
      padding: 10px;
      list-style-type: none;

      li {

        a {
          cursor: pointer;
          display: block;
          font-weight: 400;
          padding: 6px 12px;
          position: relative;
          margin: 0 -12px;
          font-size: 16px;
          text-decoration: none;
          color: $colorDefault;

          i {
            margin-right: 5px;
          }
        }

        a:hover {
          background-color: #f5f6f8;
        }
      }
    }
  }
}
</style>