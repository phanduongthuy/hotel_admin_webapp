<template>
  <div class="productWarp">
    <el-row>
      <el-card>
        <div class="headerContent">
          <div class="searchWarp">
            <el-input v-model="searchKey" class="inputSearch style-input-search" @clear="clearHandle"
                      placeholder="Nhập vào tên nhóm phòng để tìm kiếm"
                      clearable @keydown.enter.native="handleSearch"></el-input>
            <el-button class="inputSearch" icon="el-icon-search" @click="handleSearch">Tìm kiếm</el-button>
            <el-select @change="handleChangeType" v-model="type" placeholder="Chọn hình thức">
              <el-option label="Tất cả nhóm" value=""></el-option>
              <el-option label="Nhóm nổi bật" value="1"></el-option>
              <el-option label="Nhóm bình thường" value="0"></el-option>
            </el-select>
          </div>
          <div class="excelWarp">
            <a class="el-button el-button--primary is-plain" @click="openCreateCategory">
              <i class="el-icon-plus"></i>
              <span>Tạo mới</span>
            </a>
          </div>
        </div>
      </el-card>
    </el-row>

    <el-row class="row_category">
      <el-card class="listProduct">
        <el-table
            height="calc(100vh - 155px)"
            v-loading="loading"
            :data="categories">
          <el-table-column
              prop="name"
              label="Tên danh mục phòng">
            <template slot-scope="category">
              <span><i v-if="category.row.is_highlight" class="el-icon-star-off"></i> {{ category.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="description"
              label="Mô tả">
          </el-table-column>
          <el-table-column
              label="Ngày sửa đổi">
            <template slot-scope="item">{{ formatDateTime(item.row.updated_at) }}</template>
          </el-table-column>
          <el-table-column
              width="100px"
              prop="action"
              align="center"
              label="Hành động">
            <template slot-scope="category">
              <el-popover
                  placement="bottom"
                  trigger="click">
                <div class="orderControls">
                  <ul>
                    <li>
                      <a href="#" @click="openEditCategory(category.row._id)"><i class="el-icon-edit"></i>Chỉnh sửa</a>
                    </li>
                    <li>
                      <a href="#" @click="handleDeleteCategory(category.row._id)"><i class="el-icon-delete"></i>Xóa</a>
                    </li>
                  </ul>
                </div>
                <el-button slot="reference" class="actionControl"><i class="el-icon-more"></i></el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationWarp" v-if="categories.length>0">
          <el-col :span="10" >
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
    </el-row>

    <el-dialog width="40%" top="5vh" title="Thêm mới danh mục phòng" :visible.sync="dialogAddProduct">

      <el-row :gutter="20">
        <el-col :span="24">
          <el-row>
            <div class="inputWarp">
              <label>Tên danh mục phòng <span class="required">*</span></label>
              <el-input v-model="name" :class="{'inputError':this.errorName.length > 0}"></el-input>
              <div v-if="this.errorName !== '' " class="error">
                <span> {{ errorName }} </span>
              </div>
            </div>
          </el-row>

          <el-row>
            <div class="inputWarp">
              <label>Mô tả</label>
              <el-input type="textarea" :rows="3" placeholder="" v-model="description"></el-input>
            </div>
          </el-row>

          <el-row>
            <div class="inputWarp">
              <label>Danh mục nổi bật</label>
              <el-switch v-model="isHighlight"></el-switch>
            </div>
          </el-row>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddProduct = false">Đóng</el-button>
        <el-button type="primary" @click="handleCreateCategory">Tạo mới</el-button>
      </span>
    </el-dialog>
    <el-dialog width="40%" top="5vh" title="Chỉnh sửa danh mục phòng" :visible.sync="dialogEditCategory">

      <el-row :gutter="20">
        <el-col :span="24">
          <el-row>
            <div class="inputWarp">
              <label>Tên danh mục phòng <span class="required">*</span></label>
              <el-input v-model="name" :class="{'inputError':this.errorName.length > 0}"></el-input>
              <div v-if="this.errorName !== '' " class="error">
                <span> {{ errorName }} </span>
              </div>
            </div>
          </el-row>

          <el-row>
            <div class="inputWarp">
              <label>Mô tả</label>
              <el-input type="textarea" :rows="3" placeholder="" v-model="description"></el-input>
            </div>
          </el-row>

          <el-row>
            <div class="inputWarp">
              <label>Danh mục nổi bật</label>
              <el-switch v-model="isHighlight"></el-switch>
            </div>
          </el-row>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditCategory = false">Đóng</el-button>
        <el-button type="primary" @click="handleUpdateCategory">Lưu</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {mapMutations, mapGetters} from "vuex";
import api from '../api'
import _ from 'lodash'
import moment from "moment";

export default {
  name: "Category",
  methods: {
    ...mapMutations([
      'updateTitle'
    ]),
    ...mapMutations('home', [
      'updateActiveMenu'
    ]),
    formatDateTime(value) {
      if (_.isNull(value)) {
        return '-'
      }
      return moment(value, "YYYYMMDDhhmmss").format('hh:mm | DD/MM/YYYY')
    },
    openCreateCategory() {
      this.resetForm()
      this.resetError()
      this.dialogAddProduct = true
    },
    openEditCategory(id) {
      this.resetForm()
      this.resetError()

      let categoroy = this.categories.find(item => item._id === id);

      if (categoroy) {
        this.id = _.get(categoroy, '_id')
        this.name = _.get(categoroy, 'name', '')
        this.description = _.get(categoroy, 'description', '')
        this.isHighlight = _.get(categoroy, 'is_highlight', false)
      }

      this.dialogEditCategory = true
    },
    handleUpdateCategory() {
      let isHighlight = 0;
      if (this.isHighlight === true) {
        isHighlight = 1;
      } else {
        isHighlight = 0;
      }
      if (this.isValidData()) {
        let data = {
          'name': this.name,
          'description': this.description,
          'is_highlight': isHighlight
        };
        api.updateCategory(data, this.id).then(() => {
          this.$message({
            message: 'Cập nhật thành công',
            type: 'success',
            showClose: true,
          });
          this.dialogEditCategory = false
          this.getCategoriesApi()
        }).catch((error) => {
          this.errorName = _.get(error, '.name', '')
        })
      }
    },
    handleCreateCategory() {
      let isHighlight = 0;
      if (this.isHighlight === true) {
        isHighlight = 1;
      } else {
        isHighlight = 0;
      }
      if (this.isValidData()) {
        let data = new FormData();
        data.append('name', this.name);
        data.append('description', this.description);
        data.append('is_highlight', isHighlight);
        api.addCategory(data).then(() => {
          this.$message({
            message: 'Tạo mới thành công',
            type: 'success',
            showClose: true,
          });
          this.dialogAddProduct = false
          this.getCategoriesApi()
          this.resetForm()
        }).catch(error => {
          this.errorName = _.get(error, '.name')
        })
      }
      this.searchKey = '';
      this.type = '';
    },
    handleDeleteCategory(id) {
      this.$confirm('Dữ liệu không thể phục hồi, Bạn có muốn tiếp tục?', 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Đóng',
        confirmButtonClass: 'deleteConfirm',
        type: 'warning'
      }).then(() => {

        api.deleteCategory(id).then(() => {
          this.$message({
            showClose: true,
            type: 'success',
            message: 'Xóa thành công'
          });
          this.getCategoriesApi()
          this.closePopper()
        })
      })
    },
    handleCurrentChange(val) {
      let payload = {
        page: val
      }

      if (this.searchKey.length > 0) {
        payload.q = this.searchKey
      }

      this.getCategoriesApi(payload)
    },
    handleSearch() {
      let payload = {
        q: this.searchKey
      }

      this.getCategoriesApi(payload)
    },
    clearHandle() {
      this.getCategoriesApi()
    },
    resetForm() {
      this.name = ""
      this.description = ""
      this.isHighlight = false
    },
    resetError() {
      this.errorName = ""
    },
    closePopper() {
      let control = document.getElementsByClassName('el-popper');
      control.forEach(element => {
        element.style.display = 'none'
        element.style.position = 'static'
      })
    },
    isValidData() {
      let error = false
      this.resetError()

      if (!this.name) {
        error = true;
        this.errorName = 'Tên loại phòng không được để trống';
      }
      return !error
    },
    handleChangeType(){
      let params = {
        is_highlight: this.type,
        q: this.searchKey
      }
      this.getCategoriesApi(params)
    },
    getCategoriesApi(params = null) {
      this.loading = true
      api.getCategories(params).then((res) => {
        this.page.currentPage = _.get(res, 'data.data.current_page')
        this.page.total = _.get(res, 'data.data.total',0)
        let from = _.get(res, 'data.data.from', 0)
        let to = _.get(res, 'data.data.to', 0)
        this.page.from = from ? from : 0
        this.page.to = to ? to : 0
        this.categories = _.get(res, 'data.data.data',[])
        this.loading = false
      }).catch((error) => {
        this.$router.push({name: 'Home'})
        this.$message.error({
          type: 'error',
          message: _.get(error.response, 'data.message','')
        })
      })
    },
  },
  data() {
    return {
      dialogAddProduct: false,
      dialogEditCategory: false,
      dialogExcel: false,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      searchKey: "",
      id: null,
      url: null,
      image: null,
      name: "",
      image_link: "",
      errorImageLink: "",
      errorName: "",
      error: "",
      errorFile: "",
      errorIsHighlight: "",
      file: "",
      uploadText: "Thả tệp vào đây hoặc <em style='color: #409EFF; font-style: normal;'>bấm đê tải tệp lên</em>",
      description:"",
      isHighlight: false,
      type: "",
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        from: 0,
        to: 0
      },
      loading:false,
      categories: [],
    }
  },
  mounted() {
    this.updateTitle('Danh mục phòng')
    this.updateActiveMenu('15')
    this.getCategoriesApi()
  },
  watch: {
    name() {
      this.errorName = ""
    },
  },
  computed: {
    ...mapGetters('auth', [
      'hasPermission'
    ])
  }
}
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.productWarp {
  .el-row {
    margin-bottom: 20px;

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

    .headerContent {
      display: flex;
      align-content: center;
      justify-content: space-between;

      .searchWarp {
        display: flex;
        width: 80%;

        .inputSearch {
          margin-right: 30px;
        }
        .style-input-search{
          width: 50%;
        }
      }

      .excelWarp {
        line-height: 40px;

        a {
          font-size: 14px;
          text-decoration: none;

          i {
            font-weight: 600;
            margin-right: 5px;
          }
        }
      }
    }

    .product-img {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }

    .actionControl {
      border: none;
      padding: 10px;
      color: $colorDefault !important;

      span {
        i {
          transform: rotate(90deg);
        }
      }
    }

    .actionControl:hover {
      background-color: #ececec;
    }

    .imageLink {
      font-size: 18px;
      padding: 0 5px;
      border-radius: 2px;

      i {
        color: $colorDefault;
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

    .imageLink:hover {
      background-color: #E9ECEF;
    }
  }
  .listProduct{
    .el-table{
      .el-icon-star-off{
        color: $colorOrange;
      }
    }
  }
}


.el-popover {
  padding: 0 !important;

  .orderControls {
    ul {
      margin: 0;
      padding: 0;
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

.subDownload {
  p {
    margin-top: 0;

    a {
      text-decoration: none;
      color: $colorSecondary;
    }
  }
}

.upload-excel {
  width: 100%;
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
}

.el-dialog__footer {
  padding-right: 40px !important;
}

.productWarp{
  .row_category{
    .listProduct{
      height: calc(100vh - 93px);

    }
  }
}

</style>