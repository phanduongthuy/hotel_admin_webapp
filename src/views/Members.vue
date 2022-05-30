<template>
  <div class="shops">
    <el-row>
      <el-card>
        <div class="headerContent">
          <div class="searchWarp">
            <el-input class="inputSearch" v-model="search" @clear="handleSearch"
              @keydown.enter.native="handleSearch"
              clearable
              placeholder="Nhập vào tên thành viên">
            </el-input>
            <el-button icon="el-icon-search" @click="handleSearch">Tìm kiếm</el-button>
            <el-col class="style-btn">
              <el-button @click="dialogAdd = true" type="primary" plain style="position: absolute; right: 20px"><i class="el-icon-plus"></i> Thêm mới</el-button>
            </el-col>
          </div>
        </div>
      </el-card>
    </el-row>
    <el-card class="main">
      <el-table
      v-loading="loading"
      :data="members"
      height="calc(100vh - 307px)">
        <el-table-column
        prop="name"
        label="Tên"
        min-width="200px">
          <template slot-scope="item">
            <span><b style="color: #409eff">{{ item.row.name }}</b></span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="email"-->
        <!--label="Email"-->
        <!--min-width="200px">-->
          <!--<template slot-scope="item">-->
            <!--<span v-if="item.row.email"><b style="color: #409eff">{{ item.row.email }}</b></span>-->
            <!--<span v-else><b style="color: #409eff">Đang cập nhật</b></span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="phone"-->
        <!--label="Số điện thoại"-->
        <!--min-width="200px">-->
          <!--<template slot-scope="item">-->
            <!--<span v-if="item.row.phone">{{ item.row.phone }}</span>-->
            <!--<span v-else>Đang cập nhật</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--prop="phone"-->
                <!--label="Địa chỉ"-->
                <!--min-width="200px">-->
          <!--<template slot-scope="item">-->
            <!--<span v-if="item.row.address">{{ item.row.address }}</span>-->
            <!--<span v-else>Đang cập nhật</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
        width="100px"
        align="center"
        label="Hành động">
          <template slot-scope="item">
            <el-popover
            placement="bottom"
            trigger="click">
              <div class="actionControls">
                <ul>
                  <li @click="openDialogEdit(item.row)">
                  <a><i class="el-icon-edit"></i>Chỉnh sửa</a>
                  </li>
                  <li @click="handleDeleteMember(item.row._id)">
                  <a><i class="el-icon-delete"></i>Xóa</a>
                  </li>
                </ul>
              </div>
              <el-button slot="reference" class="actionControl"><i class="el-icon-more"></i></el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationWarp" v-if="members.length > 0">
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
    <el-dialog width="30%" top="5vh" v-loading="loadingDialog" :visible.sync="dialogAdd" class="modalUser" :close-on-click-modal="false">
      <span v-if="!isEdit" slot="title">
        Thêm mới thành viên
      </span>
      <span v-else slot="title">
        Cập nhật thành viên
      </span>
      <el-row :gutter="24">
        <el-col :span="24" class="btn-upload-wrap">
          <Upload @changeImage="onChangeImage" :url="url" :image="image"/>
        </el-col>
        <el-col :span="24">
          <el-row>
            <div class="inputWarp">
              <label>Họ và Tên
                <span class="required">*</span>
              </label>
              <el-input v-model="name"></el-input>
              <div v-if="errorName !== '' " class="error">
                <span> {{ errorName }} </span>
              </div>
            </div>
          </el-row>
          <!--<el-row>-->
            <!--<div class="inputWarp" >-->
              <!--<label>-->
                <!--Email-->
              <!--</label>-->
              <!--<el-input v-model="email"></el-input>-->
              <!--<div v-if="errorEmail !== '' " class="error">-->
                <!--<span> {{ errorEmail }} </span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</el-row>-->
          <!--<el-row>-->
            <!--<div class="inputWarp">-->
              <!--<label>-->
                <!--Số điện thoại-->
              <!--</label>-->
              <!--<el-input v-model="phone"></el-input>-->
              <!--<div v-if="errorPhone !== '' " class="error">-->
                <!--<span> {{ errorPhone }} </span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</el-row>-->
          <!--<el-row>-->
            <!--<div class="inputWarp">-->
              <!--<label>-->
                <!--Địa chỉ-->
              <!--</label>-->
              <!--<el-input type="textarea" :rows="3" placeholder="Nhập địa chỉ" v-model="address"></el-input>-->
            <!--</div>-->
          <!--</el-row>-->
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">Đóng</el-button>
        <el-button v-if="!isEdit" type="primary" @click="handleCreateMember">Tạo mới</el-button>
        <el-button v-else type="primary" @click="handleEditMember">Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../api';
  import _ from "lodash";
  import {mapMutations} from "vuex";
  import moment from "moment";
  import { isValidPhone } from "@/utils/helper";
  import Upload from '../components/upload.vue'

  export default {
    name: "Information",
    components:{
      Upload
    },
    data() {
      return {
        search: "",
        loading: false,
        page: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          from: 0,
          to: 0
        },
        members: [],
        dialogAdd: false,
        errorName:'',
        errorEmail: '',
        errorPhone: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        image: '',
        dialogEdit: false,
        loadingDialog: false,
        isEdit: false,
        memberId: '',
        url: null
      }
    },
    created () {
      this.getMembers();
    },
    mounted() {
      this.updateTitle('Quản lý thành viên');
      this.updateActiveMenu('11')
    },
    methods: {
      ...mapMutations([
        'updateTitle'
      ]),
      ...mapMutations('home', [
        'updateActiveMenu'
      ]),
      getMembers(params = {}) {
        this.loading = true
        if (this.search) {
          params.q = this.search
        }
        api.getMembers(params).then(response => {
          this.members = _.get(response, "data.data.data", [])
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
        this.getMembers(params)
      },
      handleSearch() {
        this.getMembers();
      },
      handleDeleteMember(id) {
        this.$confirm('Dữ liệu không thể phục hồi, Bạn có muốn biếp tục?', 'Cảnh báo', {
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Đóng',
          confirmButtonClass: 'deleteConfirm',
          type: 'warning'
        }).then(() => {
          api.deleteMember(id).then(() => {
            this.$message({
              showClose: true,
              type: 'success',
              message: 'Xóa thành công'
            });
            this.closePopper()
            this.handleCurrentChange(this.page.currentPage)
          })
        })
      },
      closePopper() {
        let control = document.getElementsByClassName('el-popper');
        control.forEach(element => {
          element.style.display = 'none'
          element.style.position = 'static'
        })
      },
      formatDateTime(value) {
        return moment(value).format('DD/MM/YYYY')
      },
      handleCreateMember() {
        if (this.validateData()) {
          this.loadingDialog = true
          let data = new FormData;
          data.append("name", this.name);
          if (this.image) {
            data.append('image', this.image);
          }
          api.addMember(data).then(() => {
            this.$message({
              type: "success",
              message: "Thêm mới thành công"
            });
            this.dialogAdd = false;
            this.loadingDialog = false;
            this.getMembers()
          }).catch((error) => {
            this.dialogAdd = false
            this.loadingDialog = false
            let errors = _.get(error.response, 'data.error', {})
            if (Object.keys(errors).length === 0) {
              this.$message.error({
                type: 'error',
                message: _.get(error.response, 'data.message','')
              })
            }

            if (Object.keys(errors).length > 0) {
              this.errorName = _.get(errors, 'name[0]','')
              this.phone = _.get(errors, 'phone[0]','')
            }
          })
        }
      },
      validateData() {
        let error = false;
        if (this.name.length === 0) {
          error = true;
          this.errorName = 'Tên chủ tài khoản không được để trống';
        }
        if (this.phone.length > 0 && !isValidPhone(this.phone)) {
          error = true;
          this.errorPhone = 'Số điện thoại không đúng định dạng';
        }

        return !error
      },
      validateEditData() {
        let error = false;
        if (this.name.length === 0) {
          error = true;
          this.errorName = 'Tên chủ tài khoản không được để trống';
        }
        // if (this.phone.length > 0 && !isValidPhone(this.phone)) {
        //   error = true;
        //   this.errorPhone = 'Số điện thoại không đúng định dạng';
        // }

        return !error
      },
      openDialogEdit(data) {
        this.isEdit = true;
        this.memberId = data._id;
        this.name = data.name;
        this.email = data.email ? data.email : '';
        this.phone = data.phone ? data.phone : '';
        this.address = data.address ? data.address : '';
        this.url = data.link_image ? data.link_image : '';
        this.dialogAdd = true;
      },
      handleEditMember() {
        if (this.validateEditData()) {
          let data = new FormData;
          data.append("name", this.name);
          if (this.image) {
            data.append('image', this.image);
          }
          api.updateMember(data, this.memberId).then(() => {
            this.$message({
              type: "success",
              message: "Cập nhật thành công"
            });
            this.dialogAdd = false;
            this.isEdit = false;
            this.getMembers(this.page.currentPage)
          }).catch((error) => {
            this.dialogAdd = false;
            this.isEdit = false;
            let errors = _.get(error.response, 'data.error', {})
            if (Object.keys(errors).length === 0) {
              this.$message.error({
                type: 'error',
                message: _.get(error.response, 'data.message','')
              })
            }

            if (Object.keys(errors).length > 0) {
              this.errorName = _.get(errors, 'name[0]','')
              this.phone = _.get(errors, 'phone[0]','')
            }
          })
        }
      },
      resetForm() {
        this.name = "";
        this.email = "";
        this.phone = "";
        this.address = "";
        this.isEdit = false;
        this.image = '';
        this.url = ''
      },
      resetError() {
        this.errorName = "";
        this.errorPhone = "";
        this.errorEmail = "";
      },
      onChangeImage(img) {
        this.image = img
      },
    },
    watch: {
      name() {
        this.errorName = ""
      },
      phone() {
        this.errorPhone = ""
      },
      dialogAdd(value) {
        if (!value) {
          this.resetForm()
          this.resetError();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/assets/styles/variables";

  .box-style{
    margin-bottom: 15px;
    .box-header{
      margin-bottom: 15px;
      .title{
        color: hsl(205, 32%, 16%);
        font-size: 18px;
        margin-bottom: 10px;
        font-weight: 500;
      }
      .tip{
        color: #99a6ad;
        font-size: 14px;
      }
    }
    .box-main{
      .el-card__body{
        padding: 0;
        .form{
          padding: 20px;
        }
        .btn-infor{
          display: flex;
          justify-content: flex-end;
          padding: 15px 20px;
          background-color: #f8f9fa;
          button{
            padding: 10px 15px;
          }
        }
      }
      .btn-style{
        margin-bottom: 15px;
        .label{
          font-size: 12px;
          margin-bottom: 10px;
          color: #3f6079;
          font-weight: 600;
          .red{
            color: #dc3545;
          }
        }
        input{
          margin-bottom: 3px;
        }
        .tip{
          margin-top: 5px;
          color: #99a6ad;
          font-size: 12px;
        }
        .error {
          color: #dc3545;
          font-size: 12px;
        }
      }
    }
  }
  .el-breadcrumb{
    margin-bottom: 20px;
    display: none;
  }
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
  .modalUser {
    .el-row {
      margin-bottom: 10px;
      .btn-upload-wrap {
        display: flex;
        align-items: center;
        flex-direction: column;
      }
      .inputWarp {
        margin-bottom: 10px;

        .error {
          color: $colorRed;
          margin-top: 8px;
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

        .text-confirm {
          font-size: 18px;
          display: block;
          margin-top: 10px;

          .plus {
            color: $colorGreen;
          }

          .minus {
            color: $colorRed;
          }
        }
      }
    }
  }
</style>