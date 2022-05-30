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
      <h4>Thống kê đơn hàng</h4>
      <el-row>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:6}" :lg="{span:6}" class="border-right">
          <div class="tip">Tổng số đơn hàng</div>
          <div class="content">
            {{ countOrder.orderAll > 0 ? countOrder.orderAll : 0 }}
          </div>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:6}" :lg="{span:6}" class="padding-lr border-right">
          <div class="tip">Chưa báo giá</div>
          <div class="content">
            {{ statisticOrder['orderNoPrice'] > 0 ? statisticOrder['orderNoPrice'] : 0}}
          </div>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:6}" :lg="{span:6}" class="padding-lr border-right">
          <div class="tip">Đang dịch/review</div>
          <div class="content">
            {{ statisticOrder['orderTranslating'] > 0 ? statisticOrder['orderTranslating'] : 0 }}
          </div>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:6}" :lg="{span:6}" class="padding-lr">
          <div class="tip">Hoàn thành</div>
          <div class="content">
            {{ statisticOrder['orderSuccess'] > 0 ? statisticOrder['orderSuccess'] : 0 }}
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="list-order">
          <h4 class="tab-head">Đơn hàng</h4>
          <el-table
              v-loading="loading"
              :data="orders"
              height="calc(100vh - 270px)"
              @sort-change="sort">
            <el-table-column
                prop="created_at"
                label="Ngày đặt hàng"
                width="150px">
              <template slot-scope="item">
                <span v-if="item.row.created_at">{{ formatDateTime(item.row.created_at) }}</span>
                <span v-else>Đang cập nhật</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="file_name"
                label="Tên file"
                min-width="200px">
              <template slot-scope="item">
                <span class="file_name" @click="exportFile(item.row)">{{ getFileName(item.row.document.path.filename)}}</span>
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
                label="Tên khách hàng"
                min-width="200px">
              <template slot-scope="item">
                <div v-if="item.row.user">
                  <span v-if="item.row.user.name && item.row.user.name.length > 0" class="user_name">{{ item.row.user.name }}</span>
                  <span v-else class="user_name">{{ item.row.user.user_name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                label="Hạn trả"
                width="150px"
                sortable>
              <template slot-scope="item">
                <span v-if="item.row.deadline">{{ formatDateTime(parseInt(item.row.deadline) * 1000) }}</span>
                <span v-else>Đang cập nhật</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="paginationWarp" v-if="orders.length > 0">
            <el-col :span="16">
              <div class="textInfo">
                <p>Số lượng kết quả: {{ page.from }} - {{ page.to }} của {{ page.total }} </p>
              </div>
            </el-col>

            <el-col :span="8">
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
      </el-col>
      <el-col :span="12">
        <el-card class="myRate">
          <h4 class="tab-head">Đánh giá khách hàng</h4>
          <el-col :span="24" v-loading="loadingFeedback">
            <el-row v-for="item in feedbacks" :key="item._id" >
              <el-col :span="24">
                <div class="feedback-warp">
                  <el-row>
                    <el-col :span="4" class="feedback-images">
                      <img src="../../assets/images/doc.png">
                    </el-col>
                    <el-col :span="20" class="feedback-info">
                      <a v-if="item.document">{{ getFileName(item.document.path.filename)}}...</a>
                      <p class="feedback-time">
                        <span>{{ formatDate(item.created_at)}}</span>
                        <span>{{ formatTime(item.created_at)}}</span>
                      </p>
                      <div>
                        <div class="star">
                          <h3 v-if="parseInt(item.rate_star) === 0">Rất tệ</h3>
                          <h3 v-if="parseInt(item.rate_star) === 1">Không hài lòng</h3>
                          <h3 v-if="parseInt(item.rate_star) === 2">Không tốt</h3>
                          <h3 v-if="parseInt(item.rate_star) === 3">Bình thường</h3>
                          <h3 v-if="parseInt(item.rate_star) === 4">Hài lòng</h3>
                          <h3 v-if="parseInt(item.rate_star) === 5">Rất hài lòng</h3>
                          <el-rate :value="parseInt(item.rate_star)" disabled></el-rate>
                        </div>
                      </div>
                      <div class="feedback-content">
                        {{ item.content }}
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </el-col>
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
        pageSize: 10,
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
    sort(data) {
      if (data.order) {
        this.deadlineSort = data.order === "ascending" ? "ASC" : "DESC";
      } else {
        this.deadlineSort = "";
      }
      this.handleGetOrder();
    },
    exportFile(item) {
      api.exportFile(item.document._id).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', item.file_name);
        document.body.appendChild(link);
        link.click()
      }).catch(() => {
        this.$message.error({
          type: 'error',
          message: "Có lỗi! Vui lòng thử lại sau"
        })
      })
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
    getStatisticOrder() {
      api.statisticOrder().then((res) => {
        if (res) {
          this.statisticOrder = _.get(res, 'data.data')
        }
      })
    },
    getFeedbacks() {
      this.loadingFeedback = true
      api.getALLFeedback().then((res) => {
        if (res) {
          this.loadingFeedback = false
          this.feedbacks = _.get(res, 'data.data')
        }
      })
    },
    formatMoney(price) {
      return formatMoneyShow(price)
    },
    formatDateTime(value) {
      return moment(value).format('DD/MM/YYYY')
    },
  },
  mounted() {
    this.updateTitle('Tổng quan')
    this.updateActiveMenu("1")
    this.getUsers()
    this.getOrders()
    this.getRevenues()
    this.getFeedbacks()
    this.handleGetOrder()
    this.getStatisticOrder()
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
