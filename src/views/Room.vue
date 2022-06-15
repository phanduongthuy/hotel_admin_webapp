<template>
  <div class="productWarp">
    <el-row>
      <el-card>
        <div class="headerContent">
          <div class="searchWarp">
            <el-input v-model="searchKey" class="inputSearch style-input-search" @clear="clearHandle"
                      placeholder="Nhập vào tên phòng để tìm kiếm"
                      clearable @keydown.enter.native="handleSearch"></el-input>
            <el-button class="inputSearch" icon="el-icon-search" @click="handleSearch">Tìm kiếm</el-button>
            <el-select @change="handleChangeType" v-model="type" placeholder="Chọn hình thức">
              <el-option label="Tất cả phòng" value=""></el-option>
              <el-option label="Phòng nổi bật" value="1"></el-option>
              <el-option label="Phòng bình thường" value="0"></el-option>
            </el-select>
            <el-select @change="handleChangeType" v-model="typeCategory" placeholder="Chọn hình thức" style="margin-left: 30px">
              <el-option label="Tất cả loại phòng" value=""></el-option>
              <el-option v-for="(item) in categories" :key="item._id" :label="item.name" :value="item._id">
                <span><i v-if="item.is_highlight" class="el-icon-star-off"></i> {{ item.name }}</span>
              </el-option>
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
            :data="rooms">
          <el-table-column
              prop="name"
              label="Tên phòng">
            <template slot-scope="room">
              <span><i v-if="room.row.is_highlight" class="el-icon-star-off"></i> {{ room.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="Loại phòng">
            <template slot-scope="room">
              <span v-if="room.row.category"> {{ room.row.category.name }}</span>
              <span v-else> Đang cập nhật</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="Giá 1 giờ">
            <template slot-scope="room">
              <span> {{ formatMoney(room.row.priceOneHour) }}</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="Giá qua đêm">
            <template slot-scope="room">
              <span>{{formatMoney(room.row.priceOneNight) }}</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="Ngày sửa đổi">
            <template slot-scope="item">{{ formatDateTime(item.row.updated_at) }}</template>
          </el-table-column>
          <el-table-column
              prop="is_active"
              align="center"
              min-width="100px"
              label="Trạng thái">
            <template slot-scope="room">
              <el-switch
                  @change="handleChangeStatus(room.row._id, room.row.is_active)"
                  v-model="room.row.is_active"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
              </el-switch>
            </template>
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
        <div class="paginationWarp" v-if="rooms.length>0">
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

    <el-dialog width="60%" top="5vh" title="Thêm mới phòng" :visible.sync="dialogAddProduct">

      <el-row :gutter="20">
        <el-col :span="24">
          <el-row>
            <div class="inputWarp">
              <label>Tên phòng <span class="required">*</span></label>
              <el-input v-model="name" :class="{'inputError':this.errorName.length > 0}"></el-input>
              <div v-if="this.errorName !== '' " class="error">
                <span> {{ errorName }} </span>
              </div>
            </div>
          </el-row>
           <el-row>
            <div class="inputWarp">
              <label>Loại phòng <span class="required">*</span></label>
              <el-select  v-model="category" placeholder="Chọn loại phòng" style="width: 100%;">
                <el-option v-for="(item) in categories" :key="item._id" :label="item.name" :value="item._id">
                  <span><i v-if="item.is_highlight" class="el-icon-star-off"></i> {{ item.name }}</span>
                </el-option>
              </el-select>
            </div>
          </el-row>
          <el-row>
            <div class="inputWarp">
              <label>Giá 1 giờ </label>
              <el-input v-model="priceOneHour" @input="formatPriceOneHour"></el-input>
            </div>
          </el-row>
          <el-row>
            <div class="inputWarp">
              <label>Giá qua đêm </label>
              <el-input v-model="priceOneNight" @input="formatPriceOneNight"></el-input>
            </div>
          </el-row>

          <el-row>
            <div class="inputWarp">
              <label>Mô tả</label>
              <ckeditor id="editor-content" name="editor-content" class="quill-editor" v-model="description" :config="editorConfig"></ckeditor>
            </div>
          </el-row>

          <el-row>
            <div class="inputWarp">
              <label>Phòng nổi bật</label>
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
    <el-dialog width="60%" top="5vh" title="Chỉnh sửa thông tin phòng" :visible.sync="dialogEditRoom">

      <el-row :gutter="20">
        <el-col :span="24">
          <el-row>
            <div class="inputWarp">
              <label>Tên phòng <span class="required">*</span></label>
              <el-input v-model="name" :class="{'inputError':this.errorName.length > 0}"></el-input>
              <div v-if="this.errorName !== '' " class="error">
                <span> {{ errorName }} </span>
              </div>
            </div>
          </el-row>
          <el-row>
            <div class="inputWarp">
              <label>Loại phòng <span class="required">*</span></label>
              <el-select  v-model="category" placeholder="Chọn loại phòng" style="width: 100%;">
                <el-option v-for="(item) in categories" :key="item._id" :label="item.name" :value="item._id">
                  <span><i v-if="item.is_highlight" class="el-icon-star-off"></i> {{ item.name }}</span>
                </el-option>
              </el-select>
            </div>
          </el-row>
          <el-row>
            <div class="inputWarp">
              <label>Giá 1 giờ </label>
              <el-input v-model="priceOneHour" @input="formatPriceOneHour"></el-input>
            </div>
          </el-row>
          <el-row>
            <div class="inputWarp">
              <label>Giá qua đêm </label>
              <el-input v-model="priceOneNight" @input="formatPriceOneNight"></el-input>
            </div>
          </el-row>

          <el-row>
            <div class="inputWarp">
              <label>Mô tả</label>
              <ckeditor id="editor-content" name="editor-content" class="quill-editor" v-model="description" :config="editorConfig"></ckeditor>
            </div>
          </el-row>

          <el-row>
            <div class="inputWarp">
              <label>Phòng nổi bật</label>
              <el-switch v-model="isHighlight"></el-switch>
            </div>
          </el-row>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditRoom = false">Đóng</el-button>
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
import { formatNumber, formatMoney, formatStringtoNumber } from "../utils/helper";
import CKEditor from "ckeditor4-vue"

export default {
  name: "Room",
  components: {
    ckeditor: CKEditor.component
  },
  methods: {
    ...mapMutations([
      'updateTitle'
    ]),
    ...mapMutations('home', [
      'updateActiveMenu'
    ]),
    formatMoney(price) {
      return formatNumber(price)
    },
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

      let room = this.rooms.find(item => item._id === id);

      if (room) {
        this.id = _.get(room, '_id')
        this.name = _.get(room, 'name', '')
        this.priceOneHour = _.get(room, 'priceOneHour', '')
        this.priceOneNight = _.get(room, 'priceOneNight', '')
        this.category = _.get(room, 'category_id', '')
        this.description = _.get(room, 'description', '')
        this.isHighlight = _.get(room, 'is_highlight', false)
      }

      this.dialogEditRoom = true
    },
    handleChangeStatus(id, is_active) {
      let data = {
        is_active: is_active
      }
      api.changeStatusRoom(id, data).then(() => {
        this.$message({
          type: 'success',
          message: 'Cập nhật trạng thái thành công',
        })
      }).catch((error) => {
        let errors = _.get(error.response, 'data.error', {})
        if (Object.keys(errors).length === 0) {
          this.$message.error({
            type: 'error',
            message: _.get(error.response, 'data.message','')
          })
        }
      })
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
          'priceOneHour': formatStringtoNumber(this.priceOneHour),
          'priceOneNight': formatStringtoNumber(this.priceOneNight),
          'description': this.description,
          'category_id': this.category,
          'is_highlight': isHighlight

        }
        api.updateRoom(data, this.id).then(() => {
          this.$message({
            message: 'Cập nhật thành công',
            type: 'success',
            showClose: true,
          });
          this.dialogEditRoom = false
          this.getRoomsApi()
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
        data.append('priceOneHour', formatStringtoNumber(this.priceOneHour));
        data.append('priceOneNight', formatStringtoNumber(this.priceOneNight));
        data.append('description', this.description);
        data.append('category_id', this.category);
        data.append('is_highlight', isHighlight);
        api.addRoom(data).then(() => {
          this.$message({
            message: 'Tạo mới thành công',
            type: 'success',
            showClose: true,
          });
          this.dialogAddProduct = false
          this.getRoomsApi()
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

        api.deleteRoom(id).then(() => {
          this.$message({
            showClose: true,
            type: 'success',
            message: 'Xóa thành công'
          });
          this.getRoomsApi()
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

      this.getRoomsApi(payload)
    },
    handleSearch() {
      let payload = {
        q: this.searchKey
      }

      this.getRoomsApi(payload)
    },
    clearHandle() {
      this.getRoomsApi()
    },
    resetForm() {
      this.name = ""
      this.priceOneHour = 0
      this.priceOneNight = 0
      this.category = ''
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
        q: this.searchKey,
        category_id: this.typeCategory
      }
      this.getRoomsApi(params)
    },
    getRoomsApi(params = null) {
      this.loading = true
      api.getRooms(params).then((res) => {
        this.page.currentPage = _.get(res, 'data.data.current_page')
        this.page.total = _.get(res, 'data.data.total',0)
        let from = _.get(res, 'data.data.from', 0)
        let to = _.get(res, 'data.data.to', 0)
        this.page.from = from ? from : 0
        this.page.to = to ? to : 0
        this.rooms = _.get(res, 'data.data.data',[])
        this.loading = false
      }).catch((error) => {
        this.$router.push({name: 'Home'})
        this.$message.error({
          type: 'error',
          message: _.get(error.response, 'data.message','')
        })
      })
    },
    getAllCategory() {
      api.getAllCategories().then((res) => {
        this.categories = _.get(res, 'data.data',[])
      })
    },
    formatPriceOneNight() {
      this.priceOneNight = formatMoney(this.priceOneNight)
    },
    formatPriceOneHour() {
      this.priceOneHour = formatMoney(this.priceOneHour)
    },
    formatStringNumber(data) {
      return formatStringtoNumber(data)
    },
  },
  data() {
    return {
      dialogAddProduct: false,
      dialogEditRoom: false,
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
      rooms: [],
      options: [],
      categories: [],
      editorConfig: {
        placeholder: "Nhập mô tả..."
      },
      priceOneHour: 0,
      priceOneNight: 0,
      category: '',
      typeCategory: ''
    }
  },
  mounted() {
    this.updateTitle('Danh sách phòng')
    this.updateActiveMenu('16')
    this.getRoomsApi()
    this.getAllCategory()
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