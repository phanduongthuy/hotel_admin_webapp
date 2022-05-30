<template>
  <div class="email">
    <el-card class="main" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="16">
          <div class="inputWarp">
            <label>
              Tiêu đề
              <span class="required"> *</span>
            </label>
            <el-input v-model="subject"></el-input>
            <div v-if="errorSubject.length > 0" class="error-input">
              {{ errorSubject }}
            </div>
          </div>
          <div class="inputWarp">
            <label>
              Nội dung
              <span class="required"> *</span>
            </label>
            <quill-editor
                class="quill-editor"
                ref="myQuillEditor"
                v-model="emailContent"
                :options="editorOption"
            />
            <div v-if="errorEmailContent.length > 0" class="error">
              {{ errorEmailContent }}
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <el-table :data="this.getNotes(this.email)" border size="medium">
            <el-table-column min-width="250" property="key" label="Từ khóa"></el-table-column>
            <el-table-column min-width="250" label="Mô tả">
              <template slot-scope="note">
                <span>{{note.row.description}}</span>
                <div>Vd: {{note.row.example}}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="btn-update">
            <el-button type="primary" @click="handleUpdateEmailTemplate">Cập nhật</el-button>
          </div>
        </el-col>

      </el-row>

    </el-card>
  </div>
</template>

<script>
import {mapMutations} from "vuex";
import api from "@/api";
import _ from "lodash";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: "UpdateEmail",
  components: {
    quillEditor
  },
  methods: {
    ...mapMutations([
      'updateTitle'
    ]),
    ...mapMutations('home', [
      'updateActiveMenu'
    ]),
    closePopper() {
      let control = document.getElementsByClassName('el-popper');
      control.forEach(element => {
        element.style.display = 'none'
        element.style.position = 'static'
      })
    },

    handleUpdateEmailTemplate () {
      if (this.validateCreateData()) {
        this.loading = true
        let data = {
          "subject": this.subject,
          "content": this.emailContent
        };
        api.updateEmailTemplate(data, this.emailId).then(() => {
          this.$message({
            type: "success",
            message: "Cập nhật thành công"
          })
          this.loading = false
          this.$router.push('/config-email-template')
        }).catch((error) => {
          this.dialog = true
          this.loading = false
          let errors = _.get(error.response, 'data.errors', {})
          if (Object.keys(errors).length === 0) {
            this.$message.error({
              type: 'error',
              message: _.get(error.response, 'data.message','')
            })
          }

          if (Object.keys(errors).length > 0) {
            this.errorSubject = _.get(errors, 'subject[0]','')
            this.errorEmailContent = _.get(errors, 'content[0]','')
          }
        })
      }
    },
    handleGetEmailTemplate() {
      this.loading = true
      this.emailId = this.$route.params.id
      api.getEmail(this.emailId).then(response => {
        this.email = _.get(response, "data.data", [])
        this.subject = this.email.subject
        this.emailContent = this.email.content
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getNotes(data) {
      let arr = []
      if(_.includes(data.name, 'email-request-translate') ) {
        arr.push(_.filter(this.notes, function(el) {
          return el.key === '{{TEN_KHACH_HANG}}' || el.key === '{{LOAI}}' || el.key === '{{YEU_CAU_CHI_TIET}}'
              || el.key === '{{NGAY}}' || el.key === '{{FILE}}' || el.key === '{{THOI_HAN_NHAN_KET_QUA}}';
        }))
      }

      if(_.includes(data.name, 'email-update-file') ) {
        arr.push(_.filter(this.notes, function(el) {
          return el.key === '{{TEN_KHACH_HANG}}' || el.key === '{{FILE_CU}}' || el.key === '{{YEU_CAU_CHI_TIET}}'
              || el.key === '{{NGAY}}' || el.key === '{{FILE_MOI}}' || el.key === '{{THOI_HAN_NHAN_KET_QUA}}'|| el.key === '{{LOAI}}';
        }))
      }

      if(_.includes(data.name, 'email-payment-with-PayPal-info') ) {
        arr.push(_.filter(this.notes, function(el) {
          return el.key === '{{TEN_KHACH_HANG}}' || el.key === '{{NGAY}}';
        }))
      }

      if(_.includes(data.name, 'email-payment-with-cash-info') ) {
        arr.push(_.filter(this.notes, function(el) {
          return el.key === '{{TEN_KHACH_HANG}}' || el.key === '{{NGAY}}'
              || el.key === '{{TEN_NGAN_HANG}}' || el.key === '{{SO_TAI_KHOAN}}'
              || el.key === '{{CHU_TAI_KHOAN}}' || el.key === '{{TONG_TIEN}}'
              || el.key === '{{NOI_DUNG_CHUYEN_KHOAN}}' || el.key === '{{MA_DON_HANG}}';
        }))
      }

      if(_.includes(data.name, 'email-respone-customer') ) {
        arr.push(_.filter(this.notes, function(el) {
          return el.key === '{{TEN_KHACH_HANG}}' || el.key === '{{NGAY}}'
              || el.key === '{{NOI_DUNG_PHAN_HOI}}';
        }))
      }

      if(_.includes(data.name, 'email-verify') ) {
        arr.push(_.filter(this.notes, function(el) {
          return el.key === '{{EMAIL}}' || el.key === '{{MA_XAC_THUC}}'  || el.key === '{{NGAY}}';
        }))
      }

      if(_.includes(data.name, 'email-admin-update-order-info') ) {
        arr.push(_.filter(this.notes, function(el) {
          return el.key === '{{TEN_KHACH_HANG}}' || el.key === '{{LOAI}}' || el.key === '{{THOI_HAN_NHAN_KET_QUA}}'
              || el.key === '{{DON_GIA}}' || el.key === '{{SO_TRANG}}' || el.key === '{{TONG_THANH_TIEN}}'
              || el.key === '{{NGAY}}' || el.key === '{{FILE}}' || el.key === '{{YEU_CAU_CHI_TIET}}' ;
        }))
      }
      if(_.includes(data.name, 'email-admin-update-confirm-payment') ) {
        arr.push(_.filter(this.notes, function(el) {
          return el.key === '{{TEN_KHACH_HANG}}' || el.key === '{{LOAI}}'
              || el.key === '{{DON_GIA}}' || el.key === '{{SO_TRANG}}' || el.key === '{{TONG_THANH_TIEN}}'
              || el.key === '{{NGAY}}' || el.key === '{{FILE}}'
              || el.key === '{{MA_DON_HANG}}';
        }))
      }
      if(_.includes(data.name, 'email-admin-update-order-result') ) {
        arr.push(_.filter(this.notes, function(el) {
          return el.key === '{{TEN_KHACH_HANG}}' || el.key === '{{NGAY}}' || el.key === '{{MA_DON_HANG}}'
              || el.key === '{{FILE}}' || el.key === '{{FILE_KET_QUA}}';
        }))
      }

      return _.uniqBy(arr[0], function (e) {
        return e.key;
      });

    },
    validateCreateData() {
      let error = false
      if (this.subject.length === 0) {
        error = true;
        this.errorSubject = "Tiêu đề không được bỏ trống"
      }
      if (this.emailContent.length === 0) {
        error = true;
        this.errorEmailContent = "Nội dung không được bỏ trống"
      }

      return !error
    },
    resetForm() {
      this.subject = "";
      this.emailContent = "";
    },
    resetError() {
      this.errorSubject = "";
      this.errorEmailContent = "";
    },
  },
  mounted() {
    this.updateTitle('Cập nhật email mẫu')
    this.updateActiveMenu('14')
    this.handleGetEmailTemplate();
  },
  data() {
    return {
      email: {},
      dialog: false,
      loading: false,
      subject: '',
      errorSubject: '',
      emailContent: '',
      errorEmailContent: '',
      editorOption: {
        placeholder: "Nhập nội dung email..."
      },
      emailId: '',
      notes: [
        {
          key: '{{TEN_KHACH_HANG}}',
          description: 'Tên khách hàng nhận email',
          example: 'Nguyễn Văn A'
        },
        {
          key: '{{LOAI}}',
          description: 'Loại yêu cầu: Dịch / Review',
          example: 'Dịch'
        },
        {
          key: '{{FILE}}',
          description: 'Tên file',
          example: 'example.docx'
        },
        {
          key: '{{FILE_KET_QUA}}',
          description: 'Tên file kết quả',
          example: 'result-example.docx'
        },
        {
          key: '{{NGAY}}',
          description: 'Ngày gửi email',
          example: '30/04/2022'
        },
        {
          key: '{{FILE_CU}}',
          description: 'Tên file cũ',
          example: 'file-old.pptx'
        },
        {
          key: '{{FILE_MOI}}',
          description: 'Tên file mới',
          example: 'file-new.pptx'
        },
        {
          key: '{{TEN_NGAN_HANG}}',
          description: 'Tên ngân hàng của người nhận',
          example: 'Vietin Bank'
        },
        {
          key: '{{SO_TAI_KHOAN}}',
          description: 'Số tài khoản người nhận',
          example: '1088888888'
        },
        {
          key: '{{CHU_TAI_KHOAN}}',
          description: 'Chủ tài khoản người nhận',
          example: 'NGUYEN VAN A'
        },
        {
          key: '{{TONG_TIEN}}',
          description: 'Tổng tiền cần thanh toán',
          example: '1,000,000'
        },
        {
          key: '{{NOI_DUNG_CHUYEN_KHOAN}}',
          description: 'Nội dung chuyển khoản',
          example: 'Thanh toán hóa đơn'
        },
        {
          key: '{{NOI_DUNG_PHAN_HOI}}',
          description: 'Nội dung phản hồi yêu cầu của khách hàng',
          example: 'Bạn cần gửi đúng file yêu cầu dịch, ...'
        },
        {
          key: '{{EMAIL}}',
          description: 'Địa chỉ email người nhận',
          example: 'example@gmail.com'
        },
        {
          key: '{{MA_XAC_THUC}}',
          description: 'Mã xác thực email',
          example: '123456'
        },
        {
          key: '{{YEU_CAU_CHI_TIET}}',
          description: 'Yêu cầu riêng của đơn hàng',
          example: 'Tôi muốn bạn gửi lại ngay khi xử lý tài liệu xong từng phần.'
        },
        {
          key: '{{MA_DON_HANG}}',
          description: 'Mã đơn hàng thanh toán',
          example: 'CODTF000000000'
        },
        {
          key: '{{THOI_HAN_NHAN_KET_QUA}}',
          description: 'Thời hạn mong muốn nhận kết quả',
          example: '05/05/2022'
        },
        {
          key: '{{SO_TRANG}}',
          description: 'Số trang',
          example: '10'
        },
        {
          key: '{{DON_GIA}}',
          description: 'Đơn giá trên 1 trang tài liệu',
          example: '10.000'
        },
        {
          key: '{{TONG_THANH_TIEN}}',
          description: 'Tổng thành tiền đơn hàng',
          example: '100.000'
        },

      ]
    }
  },
  watch: {
    subject() {
      this.errorSubject = ""
    },
    emailContent() {
      this.errorEmailContent = ""
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/variables";
.main {
  height: calc(100vh - 113px);
  .el-row {
    margin-bottom: 10px;

    .inputWarp {
      margin-bottom: 10px;
      .error {
        color: $colorRed;
        margin-top: 75px;
        font-size: 12px;
      }
      .error-input {
        color: $colorRed;
        margin-top: 10px;
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

    .el-table {
      margin-top: 20px;
    }
    .btn-update {
      margin-top: 32px;
      text-align: right;
    }
  }
}


</style>