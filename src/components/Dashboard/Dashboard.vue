<template>
  <div class="dashboard">
    <el-row>
      <el-col :xs="{span:24}" :sm="{span:8}" :md="{span:8}" :lg="{span:8}" class="item-total">
        <div class="card">
          <div class="card-header">
            <div class="card-icon card-icon-info">
              <i class="el-icon-money"></i>
            </div>
            <p class="card-category">Khách hàng</p>
            <h3 class="card-title">
              {{ countUser > 0 ? countUser : 0 }}
            </h3>
          </div>
        </div>
      </el-col>
      <el-col :xs="{span:24}" :sm="{span:8}" :md="{span:8}" :lg="{span:8}" class="item-total">
        <div class="card">
          <div class="card-header">
            <div class="card-icon card-icon-success">
              <i class="el-icon-check"></i>
            </div>
            <p class="card-category">Đơn hàng</p>
            <h3 class="card-title">
              {{ countOrder.orderAll > 0 ? countOrder.orderAll : 0 }}
            </h3>
          </div>
        </div>
      </el-col>
      <el-col :xs="{span:24}" :sm="{span:8}" :md="{span:8}" :lg="{span:8}" class="item-total">
        <div class="card">
          <div class="card-header">
            <div class="card-icon card-icon-danger">
              <i class="el-icon-coin"></i>
            </div>
            <p class="card-category">Doanh thu</p>
            <h3 class="card-title">
              {{ totalRevenue > 0 ? formatMoney(totalRevenue) : 0 }}
            </h3>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-card class="box-infor">
      <h4>Thống kê đơn đặt phòng</h4>
      <el-row>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:6}" :lg="{span:6}" class="border-right">
          <div class="tip">Tổng số đơn đặt phòng</div>
          <div class="content">
            {{ countOrder.orderAll > 0 ? countOrder.orderAll : 0 }}
          </div>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:6}" :lg="{span:6}" class="padding-lr border-right">
          <div class="tip">Yêu cầu đặt phòng</div>
          <div class="content">
            {{ countOrder.orderRequest > 0 ? countOrder.orderRequest : 0}}
          </div>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:6}" :lg="{span:6}" class="padding-lr border-right">
          <div class="tip">Đã hoàn thành</div>
          <div class="content">
            {{ countOrder.orderSuccess > 0 ? countOrder.orderSuccess : 0 }}
          </div>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:6}" :lg="{span:6}" class="padding-lr">
          <div class="tip">Đã hủy</div>
          <div class="content">
            {{ countOrder.orderCancel > 0 ? countOrder.orderCancel : 0 }}
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="list-order">
          <h4 class="tab-head">Đơn đặt phòng</h4>
          <el-table
              v-loading="loading"
              :data="orders"
              height="calc(100vh - 270px)"
              @sort-change="sort">
            <el-table-column
                prop="created_at"
                label="Ngày đặt phòng"
                width="200px"
                align="center">
              <template slot-scope="item">
                <span v-if="item.row.created_at">{{ formatDate(item.row.created_at) }}</span>
                <span v-else>Đang cập nhật</span>
              </template>
            </el-table-column>
            <el-table-column
                label="Tên khách hàng"
                min-width="200px">
              <template slot-scope="item">
                <span class="file_name">{{ item.row.customer_name}}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="type"
                label="Loại dịch vụ"
                min-width="200px"
                align="center">
              <template slot-scope="item">
                <span v-if="item.row.type == 0">Qua đêm</span>
                <span v-else>Giờ</span>

              </template>
            </el-table-column>
            <el-table-column
                label="Thời gian checkin"
                width="170px">
              <template slot-scope="item">
                <span v-if="item.row.checkin_time">{{ formatDateTime(parseInt(item.row.checkin_time) * 1000) }}</span>
                <span v-else>Đang cập nhật</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="paginationWarp" v-if="orders.length > 0">
            <el-row style="display: flex;" >
              <el-col :span="16" style="justify-content: flex-start">
                <div class="textInfo">
                  <p>Số lượng kết quả: {{ page.from }} - {{ page.to }} của {{ page.total }} </p>
                </div>
              </el-col>

              <el-col :span="8" style="justify-content: flex-end">
                <el-pagination
                    layout="prev, pager, next"
                    :total="page.total"
                    :page-size="page.pageSize"
                    :current-page="page.currentPage"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
              </el-col>
            </el-row>

          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import api from '../../api'
import _ from 'lodash'
import {formatMoneyShow} from "../../utils/helper";
import moment from "moment";

export default {
  name: 'Dashboard',
  props: {
    msg: String
  },
  data() {
    return {
      loading: false,
      loadingFeedback: false,
      dashboard: {},
      countUser: 0,
      countOrder: 0,
      totalRevenue: 0,
      statisticOrder: [],
      feedbacks: [],
      orders: [],
      page: {
        currentPage: 1,
        pageSize: 15,
        total: 0,
        from: 0,
        to: 0
      },
    }
  },
  computed: {
    ...mapState('auth', [
      'authUser', 'isAuthenticated'
    ])
  },
  methods: {
    ...mapMutations([
      'updateTitle'
    ]),
    ...mapMutations('home', [
      'updateActiveMenu'
    ]),
    getFileName(name) {
      return name.substr(13, 35)
    },
    formatDate(data) {
      return moment(data).format("DD/MM/YYYY");
    },
    formatTime(data) {
      return moment(data).format("hh:mm:ss");
    },
    handleGetOrder(params = {}) {
      this.loading = true
      api.getOrder(params).then(response => {
        this.orders = _.get(response, "data.data.data", [])
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
    sort(data) {
      if (data.order) {
        this.deadlineSort = data.order === "ascending" ? "ASC" : "DESC";
      } else {
        this.deadlineSort = "";
      }
      this.handleGetOrder();
    },

    getUsers() {
      api.getCountUser().then((res) => {
        if (res) {
          this.countUser = _.get(res, 'data.data')
        }
      })
    },
    getOrders() {
      api.getCountOrder().then((res) => {
        if (res) {
          this.countOrder = _.get(res, 'data.data')
        }
      })
    },
    getRevenues() {
      api.getSumRevenue().then((res) => {
        if (res) {
          this.totalRevenue = _.get(res, 'data.data')
        }
      })
    },

    formatMoney(price) {
      return formatMoneyShow(price)
    },
    formatDateTime(value) {
      return moment(value).format('hh:mm:ss | DD/MM/YYYY')
    },
  },
  mounted() {
    this.updateTitle('Tổng quan')
    this.updateActiveMenu("1")
    this.getUsers()
    this.getOrders()
    this.getRevenues()
    this.handleGetOrder()
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/variables";

.dashboard {
  .item-total{
    padding: 0 40px;
    &:first-of-type{
      padding: 0 40px 0 0;
    }
    &:last-of-type{
      padding: 0 0 0 40px;
    }
  }
  .box-infor{
    margin-bottom: 15px;
    border-radius: 6px;
    h4{
      margin: 0;
      font-weight: 300;
      color: #1c2b36;
      font-size: 20px;
      margin-bottom: 13px;
    }
    .el-row{
      .el-col{
        .tip{
          margin-bottom: 3px;
          color: #99a6ad;
          font-size: 14px;
        }
        .content{
          margin-top: 10px;
          margin-bottom: 3px;
          font-size: 20px;
          color: #1c2b36;
        }
      }
      .border-right{
        border-right: 1px solid #e9ecef;
      }
      .padding-lr{
        padding: 0px 15px;
      }
    }
    .tip {
      margin: 0;
      margin-top: 25px;
      .code{
        font-weight: 800;
        color: $colorMain;
      }
    }
    .fl-left {
      text-align: right;
      .el-link {
        margin-right: 10px;
      }
    }
  }
  .card {
    border: 0;
    margin-bottom: 30px;
    margin-top: 30px;
    border-radius: 6px;
    color: #333;
    background: #fff;
    width: 100%;
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 14%);
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;

    .card-header {
      margin: 0 15px;
      padding: 0;
      position: relative;
      text-align: right;

      .card-icon {
        border-radius: 3px;
        background-color: #999;
        padding: 15px;
        margin-top: -20px;
        margin-right: 15px;
        float: left;
        color: #fff;
        font-size: 28px;

        &.card-icon-warning {
          background: linear-gradient(60deg,#ffa726,#fb8c00);
          box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(255 152 0 / 40%)
        }

        &.card-icon-success {
          background: linear-gradient(60deg,#66bb6a,#43a047);
          box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(76 175 80 / 40%)
        }

        &.card-icon-danger {
          background: linear-gradient(60deg,#ef5350,#e53935);
          box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(244 67 54 / 40%)
        }

        &.card-icon-info {
          background: linear-gradient(60deg,#26c6da,#00acc1);
          box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(0 188 212 / 40%)
        }
      }

      .card-category {
        color: #999;
        font-size: 14px;
      }
    }
  }
  .el-row{
    margin-bottom: 15px;
  }
  .myRate {
    width: 100%;
    height: calc(100vh - 180px);
    overflow-y: auto;

    .feedback-warp {
      padding: 34px 0 20px 10px;
      border-bottom: 2px solid #B2CEEB;
      .feedback-images {
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .feedback-info {
        padding-left: 30px;
        a {
          color: #1761B0;
          cursor: pointer;
        }
        .feedback-time {
          margin: 5px 0 0 0;
          font-size: 14px;
          color: #707070;
          span {
            margin-right: 20px;
          }
        }
        .star {
          display: flex;
          align-items: center;
          h3 {
            margin: 8px 10px 8px 0;
          }
        }
        .feedback-content {
          font-size: 14px;
        }
      }
    }
  }
  .myRate::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  .myRate::-webkit-scrollbar-thumb {
    background: #e1e1e1;
    border-radius: 8px;
  }
  .list-order {
    width: 100%;
    height: calc(100vh - 180px);
    overflow-y: auto;
  }
  .file_name {
    color: #1761B0;
    cursor: pointer;

  }
  .file_name:hover {
    cursor: pointer;
   }
  .tab-head {
    margin: 0;
  }
}
@media only screen and (max-width: 992px) {
  .dashboard {
    .card{
      margin-bottom: 0px !important;
    }
    .box-infor{
      .el-row{
        .border-right{
          border-right: none;
        }
        .padding-lr{
          padding: 0px;
        }
      }
    }
  }
}
@media only screen and (max-width: 767px) {

  .dashboard {
    .card{
      margin: 40px;
      margin-bottom: 0px !important;
    }
    .box-infor{
      .el-row{
        .border-right{
          border-right: none;
        }
        .padding-lr{
          padding: 0px;
        }
      }
    }
  }
}
.left{
  width: 125px;
}
.number{

}
@media only screen and (max-width: 500px){
  .title{
    font-size: 12px!important;
  }
  .left{
    width: 100px!important;
  }

  table{
    tr{
      td{
        padding: 4px 0!important;
      }
    }

  }
}
@media only screen and (max-width: 600px) {


}
@media only screen and (max-width: 350px) {
  .el-button--text{
    position: absolute!important;
    right: 10px!important;
  }

}
</style>
