<template>
  <div class="shops">
    <el-row>
      <el-card>
        <div class="headerContent">
          <div class="searchWarp">
            <el-input class="inputSearch" v-model="search" @clear="handleSearch"
                      @keydown.enter.native="handleSearch"
                      clearable
                      placeholder="Nhập vào tên, email để tìm kiếm"></el-input>
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
          :data="employee"
          height="calc(100vh - 307px)">
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
            prop="phone"
            label="Số điện thoại"
            min-width="200px">
        </el-table-column>
        <el-table-column
            prop="address"
            label="Địa chỉ"
            min-width="200px">
          <template slot-scope="item">
            <span v-if="item.row.address">{{ item.row.address }}</span>
            <span v-else>Đang cập nhật</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
            <!--prop="date_of_birth"-->
            <!--label="Ngày sinh"-->
            <!--min-width="200px">-->
          <!--<template slot-scope="item">-->
            <!--<span v-if="item.row.date_of_birth">{{ formatDateTime(item.row.date_of_birth * 1000) }}</span>-->
            <!--<span>Đang cập nhật</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
<!--        <el-table-column
            prop="role_id"
            label="Vai trò"
            min-width="200px">
          <template slot-scope="item">
            {{ item.row.role.name }}
          </template>
        </el-table-column>-->
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
                  <li @click="openDialogResetPassword(item.row)">
                    <a><i class="el-icon-refresh"></i>Đổi mật khẩu</a>
                  </li>
                  <li @click="openDialogEdit(item.row)">
                    <a><i class="el-icon-edit"></i>Chỉnh sửa</a>
                  </li>
                  <li @click="handleDeleteUser(item.row._id)" v-if="item.row._id != authUser._id">
                    <a><i class="el-icon-delete"></i>Xóa</a>
                  </li>
                </ul>
              </div>
              <el-button slot="reference" class="actionControl"><i class="el-icon-more"></i></el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationWarp" v-if="employee.length > 0">
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
    <el-dialog width="30%" top="5vh" v-loading="loadingDialog" title="Thêm mới nhân viên" :visible.sync="dialogAdd"
               :close-on-click-modal="false"
               class="modalUser">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-row>
            <div class="inputWarp">
              <label>Tên nhân viên
                <span class="required">*</span>
              </label>
              <el-input v-model="name"></el-input>
              <div v-if="errorName !== '' " class="error">
                <span> {{ errorName }} </span>
              </div>
            </div>
          </el-row>
          <el-row>
            <div class="inputWarp" >
              <label>
                Số điện thoại
                <span class="required">*</span>
              </label>
              <el-input v-model="phone"></el-input>
              <div v-if="errorPhone !== '' " class="error">
                <span> {{ errorPhone }} </span>
              </div>
            </div>
          </el-row>
          <el-row>
            <div class="inputWarp">
              <label>
                Email
                <span class="required">*</span>
              </label>
              <el-input v-model="email"></el-input>
              <div v-if="errorEmail !== '' " class="error">
                <span> {{ errorEmail }} </span>
              </div>
            </div>
          </el-row>
          <el-row>
            <div class="inputWarp">
              <label>Mật khẩu <span class="required">*</span></label>
              <el-input type="password" v-model="password"></el-input>
              <div v-if="errorPassword !== '' " class="error">
                <span> {{ errorPassword }} </span>
              </div>
            </div>
          </el-row>
          <el-row>
            <div class="inputWarp">
              <label>Địa chỉ </label>
              <el-input v-model="address"></el-input>
            </div>
          </el-row>
<!--          <el-row>
            <div class="inputWarp">
              <label>
                Vai trò
                <span class="required">*</span>
              </label>
              <el-select v-model="roleId" placeholder="Chọn vai trò">
                <el-option
                    v-for="role in roles"
                    :key="role._id"
                    :label="role.name"
                    :value="role._id"
                >
                </el-option>
              </el-select>
              <div v-if="errorRole !== '' " class="error">
                <span> {{ errorRole }} </span>
              </div>
            </div>
          </el-row>-->
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">Đóng</el-button>
        <el-button type="primary" @click="handleCreateEmployee">Tạo mới</el-button>
      </span>
    </el-dialog>

    <el-dialog width="30%" top="5vh" v-loading="loadingDialog" title="Chỉnh sửa nhân viên" :visible.sync="dialogEdit"
               :close-on-click-modal="false"
               class="modalUser">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-row>
            <div class="inputWarp">
              <label>Tên nhân viên
                <span class="required">*</span>
              </label>
              <el-input v-model="name"></el-input>
              <div v-if="errorName !== '' " class="error">
                <span> {{ errorName }} </span>
              </div>
            </div>
          </el-row>
          <el-row>
            <div class="inputWarp" >
              <label>
                Số điện thoại
                <span class="required">*</span>
              </label>
              <el-input v-model="phone"></el-input>
              <div v-if="errorPhone !== '' " class="error">
                <span> {{ errorPhone }} </span>
              </div>
            </div>
          </el-row>
          <el-row>
            <div class="inputWarp">
              <label>
                Email
                <span class="required">*</span>
              </label>
              <el-input v-model="email"></el-input>
              <div v-if="errorEmail !== '' " class="error">
                <span> {{ errorEmail }} </span>
              </div>
            </div>
          </el-row>
          <el-row>
            <div class="inputWarp">
              <label>Địa chỉ </label>
              <el-input v-model="address"></el-input>
            </div>
          </el-row>
<!--          <el-row>
            <div class="inputWarp">
              <label>
                Vai trò
                <span class="required">*</span>
              </label>
              <el-select v-model="roleId" placeholder="Chọn vai trò">
                <el-option
                    v-for="role in roles"
                    :key="role._id"
                    :label="role.name"
                    :value="role._id"
                >
                </el-option>
              </el-select>
              <div v-if="errorRole !== '' " class="error">
                <span> {{ errorRole }} </span>
              </div>
            </div>
          </el-row>-->
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">Đóng</el-button>
        <el-button type="primary" @click="handleEditEmployee">Cập nhật</el-button>
      </span>
    </el-dialog>

    <el-dialog width="30%" title="Đặt lại mật khẩu" :visible.sync="dialogResetPassword" :close-on-click-modal="false">
      <div class="inputWarp">
        <label>Mật khẩu mới <span class="required">*</span></label>
        <el-input show-password v-model="password"></el-input>
        <div v-if="this.errorPassword !== '' " class="error">
          <span> {{ errorPassword }} </span>
        </div>
      </div>
      <div class="inputWarp">
        <label>Nhập lại mật khẩu mới <span class="required">*</span></label>
        <el-input show-password v-model="passwordConfirm"></el-input>
        <div v-if="this.errorPasswordConfirm !== '' " class="error">
          <span> {{ errorPasswordConfirm }} </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogResetPassword = false">Đóng</el-button>
      <el-button type="primary" @click="handleResetPassword">Lưu</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../api';
import _ from "lodash";
import {mapMutations, mapState} from "vuex";
import moment from "moment";
import { isValidEmail, isValidPhone } from "@/utils/helper";

export default {
  name: "User",
  methods: {
    ...mapMutations([
      'updateTitle'
    ]),
    ...mapMutations('home', [
      'updateActiveMenu'
    ]),
    handleGetEmployee(params = {}) {
      this.loading = true
      if (this.search) {
        params.q = this.search
      }
      api.getEmployee(params).then(response => {
        this.employee = _.get(response, "data.data.data", [])
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
      this.handleGetEmployee(params)
    },
    handleSearch() {
      this.handleGetEmployee();
    },
    handleDeleteUser(id) {
      this.$confirm('Dữ liệu không thể phục hồi, Bạn có muốn biếp tục?', 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Đóng',
        confirmButtonClass: 'deleteConfirm',
        type: 'warning'
      }).then(() => {

        api.deleteEmployee(id).then(() => {
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
    handleGetRoles() {
      api.getAllRoles().then(response => {
        this.roles = _.get(response, "data.data", []);
      })
    },
    handleCreateEmployee() {
      if (this.validateCreateData()) {
        this.loadingDialog = true
        let data = new FormData;
        data.append("name", this.name);
        data.append("email", this.email);
        data.append("phone", this.phone);
        data.append("password", this.password);
        data.append("role_id", this.roleId);
        data.append("address", this.address);
        api.addEmployee(data).then(() => {
          this.$message({
            type: "success",
            message: "Thêm mới thành công"
          })
          this.dialogAdd = false
          this.loadingDialog = false
          this.handleGetEmployee();
        }).catch((error) => {
          this.dialogAdd = true
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
            this.errorPassword = _.get(errors, 'password[0]','')
            this.errorEmail = _.get(errors, 'email[0]','')
            this.errorRole = _.get(errors, 'role[0]','')
          }
        })
      }
    },
    validateCreateData() {
      let error = false
      if (this.password.length === 0) {
        error = true;
        this.errorPassword = 'Mật khẩu không được để trống';
      }
      if (this.password.length < 6) {
        error = true;
        this.errorPassword = 'Mật khẩu phải lớn hơn 6 ký tự';
      }
      if (this.phone.length === 0) {
        error = true;
        this.errorPhone = 'Số điện thoại không được để trống';
      }
      if (this.phone.length > 0 && !isValidPhone(this.phone)) {
        error = true;
        this.errorPhone = 'Số điện thoại sai định dạng, vui lòng nhập lại';
      }
      if (this.email.length === 0) {
        error = true;
        this.errorEmail = 'Email không được để trống';
      }
      if (this.email && !isValidEmail(this.email)) {
        error = true;
        this.errorEmail = 'Email sai định dạng, vui lòng nhập lại';
      }
      if (this.name.length === 0) {
        error = true;
        this.errorName = "Tên không được để trống"
      }
      /*if (this.roleId.length === 0) {
        error = true;
        this.errorRole = "Vui lòng chọn vai trò"
      }*/

      return !error
    },
    openDialogEdit(data) {
      this.employeeId = data._id
      this.name = data.name;
      this.phone = data.phone;
      this.email = data.email;
      this.address = data.address;
      this.roleId = data.role_id
      this.dialogEdit = true;
    },
    handleEditEmployee() {
      if (this.validateEditData()) {
        this.loadingDialog = true
        let data = new FormData;
        data.append("name", this.name);
        data.append("email", this.email);
        data.append("phone", this.phone);
        data.append("role_id", this.roleId);
        data.append("address", this.address);
        api.updateEmployee(data, this.employeeId).then(() => {
          this.$message({
            type: "success",
            message: "Cập nhật thành công"
          })
          this.dialogEdit = false
          this.loadingDialog = false
          this.handleGetEmployee(this.page.currentPage);
        }).catch((error) => {
          this.dialogEdit = true
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
            this.errorRole = _.get(errors, 'role[0]','')
            this.errorEmail = _.get(errors, 'email[0]','')
          }
        })
      }
    },
    handleResetPassword() {
      if (this.isValidResetPassword()) {
        let data = {
          password: this.password,
          password_confirmation: this.passwordConfirm,
        }

        api.resetPasswordUser(data, this.employeeId).then(() => {
          this.$message({
            type: "success",
            message: "Cập nhật thành công"
          });
          this.dialogResetPassword = false
        }).catch(error => {
          let errors = _.get(error.response, 'data.error', {})
          if (Object.keys(errors).length === 0) {
            this.$message.error({
              type: 'error',
              message: _.get(error.response, 'data.message', '')
            })
          }
          if (Object.keys(errors).length > 0) {
            this.errorPassword = _.get(errors, 'password[0]', '')
          }
        })
      }
    },
    validateEditData() {
      let error = false
      if (this.phone.length === 0) {
        error = true;
        this.errorPhone = 'Số điện thoại không được để trống';
      }
      if (this.phone.length > 0 && !isValidPhone(this.phone)) {
        error = true;
        this.errorPhone = 'Số điện thoại sai định dạng, vui lòng nhập lại';
      }
      if (this.email.length === 0) {
        error = true;
        this.errorEmail = 'Email không được để trống';
      }
      if (this.email && !isValidEmail(this.email)) {
        error = true;
        this.errorEmail = 'Email sai định dạng, vui lòng nhập lại';
      }
      if (this.name.length === 0) {
        error = true;
        this.errorName = "Tên không được để trống"
      }
      /*if (this.roleId.length === 0) {
        error = true;
        this.errorRole = "Vui lòng chọn vai trò"
      }*/

      return !error
    },
    isValidResetPassword() {
      let error = false
      this.resetError()

      if (this.password.length < 6) {
        error = true;
        this.errorPassword = 'Mật khẩu phải lớn hơn 6 ký tự';
      }
      if (this.password.length === 0) {
        error = true;
        this.errorPassword = 'Mật khẩu không được để trống';
      }

      if (this.password !== this.passwordConfirm) {
        error = true;
        this.errorPasswordConfirm = "Mật khẩu không trùng khớp"
      }

      return !error;
    },
    resetForm() {
      this.name = "";
      this.email = "";
      this.phone = "";
      this.address = "";
      this.password = "";
      this.roleId = "";
      this.passwordConfirm = "";
    },
    resetError() {
      this.errorName = "";
      this.errorEmail = "";
      this.errorPhone = "";
      this.errorPassword = "";
      this.errorRole = "";
      this.errorConfirmPassword = "";
    },

    openDialogResetPassword(data) {
      this.employeeId = data._id
      this.dialogResetPassword = true;
    },
  },
  mounted() {
    this.updateTitle('Quản lý nhân viên')
    this.updateActiveMenu('3')
    this.handleGetEmployee();
    this.handleGetRoles();
  },
  computed: {
    ...mapState('auth', ['authUser']),
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
      employee: [],
      dialogAdd: false,
      errorName:'',
      errorPhone:'',
      errorEmail:'',
      errorPassword:'',
      errorPasswordConfirm: '',
      errorRole: "",
      password:'',
      passwordConfirm: '',
      name: '',
      email: '',
      phone: '',
      gender: "",
      address: "",
      date_of_birth: "",
      roleId: "",
      roles: [],
      loadingDialog: false,
      dialogEdit: false,
      employeeId: "",
      dialogResetPassword: false
    }
  },
  watch: {
    name() {
      this.errorName = ""
    },
    email() {
      this.errorEmail = ""
    },
    phone() {
      this.errorPhone = ""
    },
    password() {
      this.errorPassword = ""
    },
    passwordConfirm() {
      this.errorConfirmPassword = ""
    },
    roleId() {
      this.errorRole = ""
    },
    dialogAdd(value) {
      if (value) {
        this.resetForm();
        this.resetError();
      }
    },
    dialogResetPassword () {
      this.resetForm();
      this.resetError();
    }
  }
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
.modalUser {
  .el-row {
    margin-bottom: 10px;
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
}
</style>