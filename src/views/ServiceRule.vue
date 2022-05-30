<template>
  <div class="container">
    <el-card v-loading="loading">
      <ckeditor id="editor-content" name="editor-content" class="quill-editor" v-model="content" :config="editorConfig"></ckeditor>
      <div v-if="errorContent.length > 0" class="error">
        {{ errorContent }}
      </div>
      <div class="footer">
        <el-button type="primary" @click="handleCreateServiceRule">Cập nhật</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import {mapMutations} from "vuex";
import CKEditor from "ckeditor4-vue"
import api from '../api';
import _ from "lodash";

export default {
  name: "ServiceRule",
  components: {
    ckeditor: CKEditor.component
  },
  mounted() {
    this.updateTitle('Điều khoản dịch vụ')
    this.updateActiveMenu('8')
    this.handleGetServiceRule();
  },
  data() {
    return {
      content: "",
      errorContent: "",
      loading: false,
      editorConfig: {
        placeholder: "Nhập điều khoản dịch vụ..."
      }
    }
  },
  methods: {
    ...mapMutations([
      'updateTitle'
    ]),
    ...mapMutations('home', [
      'updateActiveMenu'
    ]),
    handleGetServiceRule() {
      this.loading = true
      api.getServiceRule().then(response => {
        this.content = _.get(response, "data.data.content", "");
        this.loading= false
      }).catch(() => {
        this.loading = false
      })
    },
    handleCreateServiceRule() {
      if (this.validateContent()) {
        this.loading = true
        let data = {
          content: this.content
        }
        api.createServiceRule(data).then((response) => {
          this.content = _.get(response, "data.data.content", "");
          this.$message({
            type: "success",
            message: "Cập nhật thành công"
          })
          this.loading= false
        }).catch(() => {
          this.$message({
            type: "error",
            message: "Cập nhật thất bại"
          })
          this.loading = false
        })
      }
    },
    validateContent() {
      let error = false;

      if (!this.content) {
        error = true;
        this.errorContent = "Nội dung không được bỏ trống"
      }

      return !error;
    }
  },
  watch: {
    content() {
      this.errorContent = ""
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/variables";
  .container {
    .quill-editor::v-deep {
      height: calc(100vh - 260px);
      margin-bottom: 50px;
      .cke_contents {
        height: 60vh!important;
      }
    }
    .error {
      color: $colorRed;
      font-size: 12px;
    }
    .footer {
      text-align: right;
    }
  }
</style>