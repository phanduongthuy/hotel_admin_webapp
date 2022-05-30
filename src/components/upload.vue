<template>
  <div>
    <div class="upload" @click="chooseImage"  @mouseover="showGuide=true" @mouseleave="showGuide=false">
      <input type="file" accept="image/*" id="upload" @change="uploadImage">
      <img v-if="url_image.length>0" :src="url_image" alt="">
      <img v-else src="../assets/images/default.png" alt="">
      <transition name="el-zoom-in-top">
        <div v-show="showGuide" class="guide transition-box" >
          <span class="textGuide">Click để thay ảnh <i class="el-icon-camera-solid"></i></span>
        </div>
      </transition>
    </div>
    <div class="note" id="note-upload">(Kích thước ảnh khuyên dùng tỉ lệ 1x1)</div>

    <!--<div class="icon_close" >-->
    <!--<i class="el-icon-close" @click="removeImage"></i>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: "Upload",
    props:[
      'url',
      'image'
    ],
    data (){
      return {
        base_url:'',
        url_default:'',
        url_image:'',
        file_img:'',
        showGuide:false

      }
    },
    methods:{
      removeImage(){
        this.file_img = null;
        this.url_image = this.url_default
        this.$emit('removeImage')
        this.$emit('changeImage',this.file_img)
      },
      chooseImage(){
        document.getElementById('upload').click()
      },
      uploadImage(e){
        if(e.target.files.length){
          this.file_img = e.target.files[0]
          this.url_image = URL.createObjectURL(this.file_img);
          this.$emit('changeImage',this.file_img)
        }
      },

    },
    mounted() {
      if (this.url == null || this.url.length == 0){
        this.url_image=this.url_default
      }else{
        this.url_image = this.base_url+this.url
      }
    },
    watch:{
      url(){
        if (this.url == null || this.url.length == 0){
          this.url_image=this.url_default
        }else{
          this.url_image = this.base_url+this.url
        }
      },
      image(value) {
        if (!value && !this.url) {
          this.file_img = "";
          this.url_image = ""
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .upload{
    width: 250px;
    height: 250px;
    border: 1px solid #c3c3c3;
    border-radius: 7px;
    cursor: pointer;
    position: relative;
    .guide{
      top: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      background: #00000070;
      text-align: center;
      line-height: 250px;
      .textGuide{
        color: white;
        text-shadow: 0 0 2px black, 0 0 4px , 0 0 6px black, 0 0 8px black, 0 0 10px black, 0 0 12px black, 0 0 14px black;
      }
    }
    input{
      opacity: 0;
      width: 0px;
      height: 0px;
    }
    img{
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 7px;
      object-fit: cover;
    }
  }
  .upload:hover + .icon_close{
    display: block;
  }
  .icon_close:hover{
    display: block;
  }
  .icon_close{
    display: none;
    cursor: pointer;
    i{
      position: absolute;
      top: 30px;
      left: 400px;
    }
  }
  .note{
    padding: 10px 0;
    color: gray;
    font-size: 14px;
    text-align: center;
    width: 250px;
  }
</style>