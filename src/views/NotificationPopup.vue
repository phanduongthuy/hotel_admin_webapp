<template>
  <div class="notification-popup">
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
          :data="notifications"
          height="calc(100vh - 255px)">
        <el-table-column type="expand">
          <template v-slot:default="props">
            <el-table
                :data="props.row.notification_popups">
              <el-table-column
                  label="Thông báo"
                  min-width="200px">
                <template slot-scope="item">
                  <span v-if="item.row.description">{{ item.row.description }}</span>
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
                    <el-button type="primary" icon="el-icon-edit" circle plain @click="editNotification(item.row)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column
            label="Trang"
            min-width="200px">
          <template slot-scope="item">
            <span v-if="item.row.name"><b style="color: #409eff">{{ item.row.name }}</b></span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
            label="Mô tả"
            min-width="250px">
          <template slot-scope="item">
            <span v-if="item.row.description">{{ item.row.description }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog width="50%" top="5vh"
               :close-on-click-modal="false"
               v-loading="loadingDialog"
               :title="dialogTitle"
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
                v-model="notifyContent"
                :options="editorOption"
            />
            <div v-if="errorNotifyContent.length > 0" class="error">
              {{ errorNotifyContent }}
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">Đóng</el-button>
        <el-button type="primary" @click="handleUpdateNotifyPopup">Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapMutations} from "vuex";
import _ from "lodash";
import moment from "moment";
import api from "@/api";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: "NotificationPopup",
  components: {
    quillEditor
  },
  data() {
    return {
      search: "",
      loading: false,
      notifications: [],
      dialog: false,
      dialogTitle: '',
      loadingDialog: false,
      editorOption: {
        placeholder: "Nhập nội dung thông báo..."
      },
      notifyContent: '',
      errorNotifyContent: '',
      notifyId: ''

    }
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

    handleGetNotifications(params = {}) {
      this.loading = true
      if (this.search) {
        params.q = this.search
      }
      api.getListNotifications(params).then(response => {
        this.notifications = _.get(response, "data.data", [])
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSearch() {
      this.handleGetNotifications();
    },
    editNotification(data) {
      this.notifyId = data._id
      this.dialog = true
      this.dialogTitle = 'Cập nhật ' + data.description.toLowerCase()
      this.notifyContent = data.content
    },
    handleUpdateNotifyPopup() {
      if (this.validateData()) {
        this.loadingDialog = true
        let data = {
          "content": this.notifyContent
        };
        api.updateNotifyPopup(data, this.notifyId).then(() => {
          this.$message({
            type: "success",
            message: "Cập nhật thành công!"
          })
          this.dialog = false
          this.loadingDialog = false
          this.handleGetNotifications();
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
            this.errorNotifyContent = _.get(errors, 'content[0]','')
          }
        })
      }
    },
    validateData() {
      let error = false
      if (this.notifyContent.length === 0) {
        error = true;
        this.errorNotifyContent = "Nội dung thông báo không được bỏ trống"
      }

      return !error
    },
    formatDateTime(value) {
      if (_.isNull(value)) {
        return '-'
      }
      return moment(value, "YYYYMMDDhhmmss").format('hh:mm | DD/MM/YYYY')
    },
  },
  mounted() {
    this.updateTitle('Cấu hình thông báo')
    this.updateActiveMenu('15')
    this.handleGetNotifications()
  },
  watch: {
    notifyContent() {
      this.errorNotifyContent = ""
    },
  }
}
</script>

<style scoped lang="scss">
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
.modalUser {
  .el-dialog__body {
    padding-top: 0 !important;
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
          height: 50vh;
          margin-bottom: 30px;
        }
      }
    }
  }
}
</style>