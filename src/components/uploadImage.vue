<template>
  <div class="uploadImg">
    <div class="demo-upload-list" v-for="item in uploadList[refName]">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>

        <Circle :percent="item.percentage" :stroke-color="item.percentage == 100?'#5cb85c':'#2db7f5'" v-if="item.showProgress" :size="55">
          <Icon v-if="item.percentage == 100" type="ios-checkmark-empty" size="28" style="color:#5cb85c"></Icon>
          <span v-else style="font-size:18px">{{ Number.parseInt(item.percentage) }}%</span>
        </Circle>
      </template>
    </div>
    <Upload :ref="refName" :multiple="!(refName ==='image')" :show-upload-list="false" :on-success="handleSuccess" :max-size="2048" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" :data="{key:uploadKey,token:uploadToken}" type="drag" action="http://upload.qiniu.com/" style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="camera" size="20"></Icon>
      </div>
    </Upload>
    <!-- {{refName}} -->
  </div>
</template>
<style scoped>
.hide {
  display: none !important;
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>

<script>
export default {
  name: "uploadImage",
  data() {
    return {
      uploadToken: "",
      uploadKey: "",
      uploadList: {
        image: [],
        introImages1: [],
        introImages2: [],
        introImages3: []
      }
    };
  },
  props: ["refName", "imgStr"],
  methods: {
    handleView(url) {
      this.$store.commit("imgView", {
        open: true,
        url: url
      });
      // this.imgVisible = true;

      // this.imgName = url;
    },
    handleRemove(file) {
      // console.log(e);
      let vm = this;
      const fileList = this.$refs[vm.refName].fileList;
      fileList.splice(fileList.indexOf(file), 1);
    },
    hasClass(className, cls) {
      let class_list = className.split(/\s+/);
      var x = 0;
      for (x in class_list) {
        if (class_list[x] === cls) {
          return true;
        }
      }
      return false;
    },
    uploadVideo(res, file) {
      let vm = this;
      let src = "http://" + this.domain + "/" + res.key;
      vm.formValidate.video = src;
      file.url = url;
      file.name = res.key;
    },
    handleSuccess(res, file) {
      console.log(res);
      let vm = this;
      let url = "http://" + this.domain + "/" + res.key;
      // this.formValidate.image = url;
      file.url = url;
      file.name = res.key;
    },
    handleFormatError(file) {
      // this.$Notice.warning({
      //   title: "The file format is incorrect",
      //   desc:
      //     "File format of " +
      //     file.name +
      //     " is incorrect, please select jpg or png."
      // });
    },
    handleVideoFormatError(file) {},
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件格式过大",
        desc: "图片  " + file.name + " 太大已经超过2M."
      });
    },
    // 上传图片
    handleBeforeUpload(file) {
      let vm = this;
      const check = this.uploadList[vm.refName].length;
      console.log(check);

      if(vm.refName === 'image' && check >= 1){
        this.$Notice.warning({
          title: "超出范围",
          desc: '首页图片只需上传一张'
        });
        return false;
      }

      let type = file.type.split("/")[0];
      let imgFix = file.type.split("/")[1];
      if (type !== "image") {
        this.$Notice.warning({
          title: "文件格式错误",
          desc: file.name + "格式错误, 请选择图片文件."
        });
        return false;
      }

      // return false;
      let promise = this.$store.dispatch("uploadFile", imgFix).then(result => {
        // console.log(result);
        vm.uploadToken = result.uploadToken;
        vm.uploadKey = result.key;
        vm.domain = result.domain;
      });
      return promise;
      // return check;
    }
  },
  mounted() {
    console.log(this);
    let vm = this;
    console.log(this.imgStr);
    const fileList = vm.$refs[vm.refName].fileList;
    fileList.splice(0);
    let ImagesList = "";
    if (
      this.imgStr &&
      typeof this.imgStr == "string"
    ) {
      ImagesList = this.imgStr.split(",");
    }
    if (ImagesList.length > 0) {
      for (let i = 0; i < ImagesList.length; i++) {
        fileList.push({
          name: ImagesList[i].split("/")[3].split(".")[0],
          url: ImagesList[i],
          status: "finished"
        });
      }
    }

    switch (this.refName) {
      case "image":
        vm.uploadList.image = fileList;
        break;
      case "introImages1":
        vm.uploadList.introImages1 = fileList;
        break;
      case "introImages2":
        vm.uploadList.introImages2 = fileList;
        break;
      case "introImages3":
        vm.uploadList.introImages3 = fileList;
        break;
      default:
        break;
    }
    // this.uploadList = this.$refs.upload.fileList;
  }
};
</script>
