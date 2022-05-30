<template>
  <div class="shops">
    <div class="box-style">
      <el-row >
        <el-col :xs="{span:24}" :sm="{span:10}" :md="{span:10}" :lg="{span:10}">
          <div class="box-header style-infor">
            <div class="title">Thông tin tài khoản ngân hàng</div>
          </div>
        </el-col>
        <el-col v-loading="loadingAccountBank" :xs="{span:24}" :sm="{span:14}" :md="{span:14}" :lg="{span:14}">
          <el-card class="box-main">
            <el-row class="form">
              <el-col :span="24">
                <div class="btn-style style-infor">
                  <div class="label">Tên ngân hàng <span class="red">*</span></div>
                  <el-input placeholder="Nhập tên ngân hàng" v-model="nameBank"></el-input>
                  <div v-if="errorNameBank !== '' " class="error">
                    <span> {{ errorNameBank }} </span>
                  </div>
                </div>
                <div class="btn-style style-infor">
                  <div class="label">Số tài khoản <span class="red">*</span></div>
                  <el-input placeholder="Nhập số tài khoản" v-model="accountNumber"></el-input>
                  <div v-if="errorAccountNumber !== '' " class="error">
                    <span> {{ errorAccountNumber }} </span>
                  </div>
                </div>
                <div class="btn-style style-infor">
                  <div class="label">Tên chủ tài khoản <span class="red">*</span></div>
                  <el-input placeholder="Nhập tên chủ tài khoản" v-model="name" ></el-input>
                  <div v-if="errorName !== '' " class="error">
                    <span> {{ errorName }} </span>
                  </div>
                </div>
                <div class="btn-style style-infor">
                  <div class="label">Nội dung chuyển khoản <span class="red">*</span></div>
                  <el-input type="textarea" :rows="3" placeholder="Nhập nội dung chuyển khoản" v-model="note"></el-input>
                  <div v-if="errorNote !== '' " class="error">
                    <span> {{ errorNote }} </span>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="btn-infor">
              <el-button @click="handleCreateOrUpdateBank()" type="primary" plain><i class="el-icon-circle-check"></i> Lưu lại</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="{span:24}" :sm="{span:10}" :md="{span:10}" :lg="{span:10}">
          <div class="box-header style-infor">
            <div class="title">Thông tin liên lạc</div>
          </div>
        </el-col>
        <el-col v-loading="loadingCommunication" :xs="{span:24}" :sm="{span:14}" :md="{span:14}" :lg="{span:14}">
          <el-card class="box-main">
            <el-row class="form">
              <el-col :span="24">
                <div class="btn-style style-infor">
                  <div class="label">Facebook</div>
                  <el-input placeholder="Nhập facebook" v-model="facebookCommunication"></el-input>
                </div>
                <div class="btn-style style-infor">
                  <div class="label">Email <span class="red">*</span></div>
                  <el-input placeholder="Nhập email" v-model="emailCommunication"></el-input>
                  <div v-if="errorEmailCommunication !== '' " class="error">
                    <span> {{ errorEmailCommunication }} </span>
                  </div>
                </div>
                <div class="btn-style style-infor">
                  <div class="label">Phone <span class="red">*</span></div>
                  <el-input placeholder="Nhập email" v-model="phoneCommunication"></el-input>
                  <div v-if="errorPhoneCommunication !== '' " class="error">
                    <span> {{ errorPhoneCommunication }} </span>
                  </div>
                </div>
                <div class="btn-style style-infor">
                  <div class="label">Địa chỉ</div>
                  <el-input type="textarea" :rows="3" placeholder="Nhập địa chỉ" v-model="addressCommunication"></el-input>
                </div>
              </el-col>
            </el-row>
            <div class="btn-infor">
              <el-button @click="handleCreateOrUpdateCommunication()" type="primary" plain><i class="el-icon-circle-check"></i> Lưu lại</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="{span:24}" :sm="{span:10}" :md="{span:10}" :lg="{span:10}">
          <div class="box-header style-infor">
            <div class="title">Về chúng tôi</div>
          </div>
        </el-col>
        <el-col v-loading="loadingCommunication" :xs="{span:24}" :sm="{span:14}" :md="{span:14}" :lg="{span:14}">
          <el-card class="box-main">
            <el-row class="form">
              <el-col :span="24">
                <div class="btn-style style-infor">
                  <div class="label">Lời giới thiệu</div>
                  <el-input type="textarea" :rows="3" placeholder="Nhập lời giới thiệu" v-model="introduce"></el-input>
                </div>
              </el-col>
            </el-row>
            <div class="btn-infor">
              <el-button @click="handleCreateOrUpdateCommunication()" type="primary" plain><i class="el-icon-circle-check"></i> Lưu lại</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="{span:24}" :sm="{span:10}" :md="{span:10}" :lg="{span:10}">
          <div class="box-header style-infor">
            <div class="title">Thông tin footer</div>
          </div>
        </el-col>
        <el-col v-loading="loadingFooterInfo" :xs="{span:24}" :sm="{span:14}" :md="{span:14}" :lg="{span:14}">
          <el-card class="box-main">
            <el-row class="form">
              <el-col :span="24">
                <div class="btn-style style-infor">
                  <div class="label">Tên công ty <span class="red">*</span></div>
                  <el-input placeholder="Tên công ty" v-model="companyFooter"></el-input>
                  <div v-if="errorCompanyFooter !== '' " class="error">
                    <span> {{ errorCompanyFooter }} </span>
                  </div>
                </div>
                <div class="btn-style style-infor">
                  <div class="label">Đại diện pháp lý <span class="red">*</span></div>
                  <el-input placeholder="Đại diện pháp lý" v-model="legalRepresentation"></el-input>
                  <div v-if="errorLegalRepresentation !== '' " class="error">
                    <span> {{ errorLegalRepresentation }} </span>
                  </div>
                </div>
                <div class="btn-style style-infor">
                  <div class="label">Giấy phép kinh doanh <span class="red">*</span></div>
                  <el-input type="textarea" :rows="2"
                            placeholder="Nhập thông tin giấy phép kinh doanh"
                            v-model="businessLicenseFooter"></el-input>
                  <div v-if="errorBusinessLicenseFooter !== '' " class="error">
                    <span> {{ errorBusinessLicenseFooter }} </span>
                  </div>
                </div>
                <div class="btn-style style-infor">
                  <div class="label">Email <span class="red">*</span></div>
                  <el-input placeholder="Nhập email" v-model="emailFooter"></el-input>
                  <div v-if="errorEmailFooter !== '' " class="error">
                    <span> {{ errorEmailFooter }} </span>
                  </div>
                </div>
                <div class="btn-style style-infor">
                  <div class="label">Số điện thoại <span class="red">*</span></div>
                  <el-input placeholder="Nhập số điện thoại" v-model="phoneFooter"></el-input>
                  <div v-if="errorPhoneFooter !== '' " class="error">
                    <span> {{ errorPhoneFooter }} </span>
                  </div>
                </div>
                <div class="btn-style style-infor">
                  <div class="label">Địa chỉ <span class="red">*</span></div>
                  <el-input type="textarea" :rows="3" placeholder="Nhập địa chỉ" v-model="addressFooter"></el-input>
                  <div v-if="errorAddressFooter !== '' " class="error">
                    <span> {{ errorAddressFooter }} </span>
                  </div>
                </div>
                <div class="btn-style style-infor">
                  <div class="label">Facebook </div>
                  <el-input placeholder="#" v-model="facebookFooter"></el-input>
                </div>

                <div class="btn-style style-infor">
                  <div class="label">Zalo </div>
                  <el-input placeholder="#" v-model="zaloFooter"></el-input>
                  <div v-if="errorZaloFooter !== '' " class="error">
                    <span> {{ errorZaloFooter }} </span>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="btn-infor">
              <el-button @click="handleCreateOrUpdateFooterInfo()" type="primary" plain>
                <i class="el-icon-circle-check"></i> Lưu lại
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import api from '../api';
  import _ from "lodash";
  import {mapMutations} from "vuex";
  import moment from "moment";
  import { isValidEmail, isValidPhone } from "@/utils/helper";

  export default {
    name: "Information",
    data() {
      return {
        search: "",
        page: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          from: 0,
          to: 0
        },
        bank: [],
        errorName:'',
        errorAccountNumber:'',
        errorNameBank:'',
        errorPhone:'',
        errorNote: '',
        name: '',
        accountNumber: '',
        nameBank: '',
        phone: '',
        note: '',
        roles: [],
        dialogEdit: false,
        bankId: "",
        bankAccount: {},
        facebookCommunication: '',
        emailCommunication: '',
        phoneCommunication: '',
        twitterCommunication: '',
        addressCommunication: '',
        introduce: '',
        errorFacebookCommunication: '',
        errorEmailCommunication: '',
        errorPhoneCommunication: '',
        errorTwitterCommunication: '',
        errorAddressCommunication: '',
        loadingAccountBank: false,
        loadingCommunication: false,
        loadingIntroduce: false,
        loadingFooterInfo: false,
        companyFooter: '',
        emailFooter: '',
        phoneFooter: '',
        addressFooter: '',
        businessLicenseFooter: '',
        legalRepresentation: '',
        facebookFooter: '',
        zaloFooter: '',
        errorCompanyFooter: '',
        errorEmailFooter: '',
        errorPhoneFooter: '',
        errorAddressFooter: '',
        errorBusinessLicenseFooter: '',
        errorLegalRepresentation: '',
        errorZaloFooter: '',
        url: null
      }
    },
    created () {
      this.handleGetDataBank();
      this.handleGetDataCommunication();
      this.handleGetDataFooterInfo();
    },
    mounted() {
      this.updateTitle('Cấu hình thông tin')
      this.updateActiveMenu('10')
      this.handleGetRoles();
    },
    methods: {
      ...mapMutations([
        'updateTitle'
      ]),
      ...mapMutations('home', [
        'updateActiveMenu'
      ]),
      handleGetDataBank() {
        this.loadingAccountBank = true;
        api.getBankAccount().then(response => {
          this.name = _.get(response, 'data.data.account_holder', '')
          this.nameBank = _.get(response, 'data.data.bank_name', '')
          this.accountNumber = _.get(response, 'data.data.account_number', '')
          this.note = _.get(response, 'data.data.note', '')
          this.loadingAccountBank = false;
        }).catch(() => {
          this.loading = false
          this.loadingAccountBank = false;
        })
      },
      handleGetDataCommunication() {
        this.loadingCommunication = true;
        api.getCommunication().then(response => {
          this.facebookCommunication = _.get(response, 'data.data.facebook', '');
          this.emailCommunication = _.get(response, 'data.data.email', '');
          this.phoneCommunication = _.get(response, 'data.data.phone', '');
          this.addressCommunication = _.get(response, 'data.data.address', '');
          this.introduce = _.get(response, 'data.data.introduce', '');
          this.loadingCommunication = false;
        }).catch(() => {
          this.loading = false
          this.loadingCommunication = false;
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
      validateCreateData() {
        let error = false
        if (this.name.length === 0) {
          error = true;
          this.errorName = 'Tên chủ tài khoản không được để trống';
        }
        if (this.accountNumber.length === 0) {
          error = true;
          this.errorAccountNumber = 'Số tài khoản không được để trống';
        }
        if (this.nameBank.length === 0) {
          error = true;
          this.errorNameBank = 'Tên ngân hàng không được để trống';
        }

        if (this.note.length === 0) {
          error = true;
          this.errorNote = 'Nội dung chuyển khoản không được để trống';
        }

        return !error
      },

      resetForm() {
        this.name = "";
        this.phone = "";
        this.accountNumber = "";
        this.nameBank = "";
      },
      resetError() {
        this.errorName = "";
        this.errorPhone = "";
        this.errorNameBank = "";
        this.errorAccountNumber = "";
        this.errorFacebookCommunication = "";
        this.errorEmailCommunication = "";
        this.errorPhoneCommunication = "";
        this.errorTwitterCommunication = "";
        this.errorAddressCommunication = "";
        this.errorBusinessLicenseFooter = ""
        this.errorAddressFooter = ""
        this.errorPhoneFooter = ""
        this.errorEmailFooter = ""
        this.errorCompanyFooter = ""
        this.errorLegalRepresentation = ""
      },
      handleCreateOrUpdateBank() {
        if (this.validateCreateData()) {
          let data = new FormData;
          data.append("name", this.name);
          data.append("account_number", this.accountNumber);
          data.append("bank_name", this.nameBank);
          data.append("note", this.note);
          api.addOrUpdateBank(data).then(() => {
            this.$message({
              type: "success",
              message: "Cập nhật thành công"
            })
            this.handleGetDataBank();
          }).catch((error) => {
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
      validateCommunication () {
        let error = false
        if (this.phoneCommunication .length > 0 && !isValidPhone(this.phoneCommunication)) {
          error = true;
          this.errorPhoneCommunication = 'Số điện thoại không đúng định dạng';
        }
        if (this.emailCommunication .length > 0 && !isValidEmail(this.emailCommunication)) {
          error = true;
          this.errorEmailCommunication = 'Email không đúng định dạng';
        }

        return !error
      },
      handleGetDataFooterInfo() {
        this.loadingFooterInfo = true;
        api.getFooterInfo().then(response => {
          this.companyFooter = _.get(response, 'data.data.company', '')
          this.phoneFooter = _.get(response, 'data.data.phone', '')
          this.emailFooter = _.get(response, 'data.data.email', '')
          this.addressFooter = _.get(response, 'data.data.address', '')
          this.businessLicenseFooter = _.get(response, 'data.data.business_license', '')
          this.legalRepresentation = _.get(response, 'data.data.legal_representation', '')
          this.facebookFooter = _.get(response, 'data.data.facebook', '')
          this.zaloFooter = _.get(response, 'data.data.zalo', '')
          this.loadingFooterInfo = false;
        }).catch(() => {
          this.loadingFooterInfo = false;
        })
      },
      handleCreateOrUpdateFooterInfo() {
        if (this.validateFooter()) {
          let data = new FormData;
          data.append("company", this.companyFooter);
          data.append("email", this.emailFooter);
          data.append("phone", this.phoneFooter);
          data.append("address", this.addressFooter);
          data.append("business_license", this.businessLicenseFooter);
          data.append("legal_representation", this.legalRepresentation);
          data.append("facebook", this.facebookFooter);
          data.append("zalo", this.zaloFooter);
          api.createOrUpdateFooterInfo(data).then(() => {
            this.$message({
              type: "success",
              message: "Cập nhật thành công"
            })
            this.handleGetDataFooterInfo();
          }).catch((error) => {
            let errors = _.get(error.response, 'data.error', {})
            if (Object.keys(errors).length === 0) {
              this.$message.error({
                type: 'error',
                message: _.get(error.response, 'data.message','')
              })
            }

            if (Object.keys(errors).length > 0) {
              this.errorCompanyFooter = _.get(errors, 'company[0]','')
              this.errorPhoneFooter = _.get(errors, 'phone[0]','')
              this.errorEmailFooter = _.get(errors, 'email[0]','')
              this.errorAddressFooter = _.get(errors, 'address[0]','')
              this.errorBusinessLicenseFooter = _.get(errors, 'business_license[0]','')
              this.errorLegalRepresentation = _.get(errors, 'legal_representation[0]','')
            }
          })
        }
      },
      validateFooter () {
        let error = false
        if (this.phoneFooter.length === 0) {
          error = true;
          this.errorPhoneFooter = 'Số điện thoại không được để trống';
        }
        if (this.emailFooter.length > 0 && !isValidEmail(this.emailFooter)) {
          error = true;
          this.errorEmailFooter = 'Email không đúng định dạng';
        }
        if (this.emailFooter.length === 0) {
          error = true;
          this.errorEmailFooter = 'Email không được để trống';
        }
        if (this.companyFooter.length === 0) {
          error = true;
          this.errorCompanyFooter = 'Tên công ty không được để trống';
        }
        if (this.addressFooter.length === 0) {
          error = true;
          this.errorAddressFooter = 'Địa chỉ công ty không được để trống';
        }
        if (this.businessLicenseFooter.length === 0) {
          error = true;
          this.errorBusinessLicenseFooter = 'Thông tin giấy phép kinh doanh công ty không được để trống';
        }
        if (this.legalRepresentation.length === 0) {
          error = true;
          this.errorLegalRepresentation = 'Tên người đại diện pháp lý không được để trống';
        }
        if (this.zaloFooter.length > 0 && !isValidPhone(this.zaloFooter)) {
          error = true;
          this.errorZaloFooter = 'Số điện thoại không đúng định dạng';
        }

        return !error
      },
      handleCreateOrUpdateCommunication() {
        this.resetError();
        if (this.validateCommunication()) {
          let data = new FormData;
          data.append("email", this.emailCommunication);
          data.append("facebook", this.facebookCommunication);
          data.append("phone", this.phoneCommunication);
          data.append("address", this.addressCommunication);
          data.append("introduce", this.introduce);
          api.addOrUpdateCommunication(data).then(() => {
            this.$message({
              type: "success",
              message: "Cập nhật thành công"
            })
            this.handleGetDataCommunication();
          }).catch((error) => {
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
    },
    watch: {
      name() {
        this.errorName = ""
      },
      phone() {
        this.errorPhone = ""
      },
      companyFooter() {
        this.errorCompanyFooter = ""
      },
      emailFooter() {
        this.errorEmailFooter = ""
      },
      phoneFooter() {
        this.errorPhoneFooter = ""
      },
      addressFooter() {
        this.errorAddressFooter = ""
      },
      businessLicenseFooter() {
        this.errorBusinessLicenseFooter = ""
      },
      legalRepresentation() {
        this.errorLegalRepresentation = ""
      },
      zaloFooter() {
        this.errorZaloFooter = ""
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