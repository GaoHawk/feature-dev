<template>
<div class="modal">
  <Modal
        v-model="modall"
        :title="name">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" v-for="(item,key,index) in formValidate" slot>
            <!-- <FormItem label="名称" prop="name">
                <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
            </FormItem> -->
            <!-- {{index}}
            <div>{{formComp[index].label}}</div> -->
            <FormItem label="密码" prop="passwd" v-if="key ==='password'" >
                <Input type="password" v-model="formValidate[key]"></Input>
            </FormItem>
            <FormItem label="性别"  v-else-if="key === 'gender'">
                <RadioGroup v-model="radio.gender" @on-change="radioChange">
                    <Radio label="male" >男</Radio>
                    <Radio label="female">女</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="状态" v-else-if="key === 'status'">
                <RadioGroup v-model="radio.status">
                    <Radio label="used">启用</Radio>
                    <Radio label="disabled">禁用</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="密级" v-else-if="key === 'level'">
                <RadioGroup v-model="radio.level">
                    <Radio label="open">公开</Radio>
                    <Radio label="needLogin">需登录</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="视频" v-else-if="key === 'video'">
                <Upload action="http://upload.qiniu.com/"

                        :data="{key:uploadKey,token:uploadToken}"

                        accept="video/*"
                        :before-upload="handleVBeforeUpload"
                        :on-success="uploadVideo"
                        >
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传视频文件</Button>
                </Upload>
            </FormItem>
            <FormItem :label="formComp[index].label"  v-else-if="key === 'image'  || key === 'introImages1' || key === 'introImages2' || key === 'introImages3'" >
              <up-Image :refName="key" ref='uploadCompoment' :imgStr="formValidate[key]" v-if="modall"></up-Image>

            </FormItem>
            <FormItem label="描述" v-else-if="key === 'note'">
              <Input v-model="formValidate[key]" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem :label="formComp[index].label"  v-else-if="key === 'startTime' || key ==='endTime' || key ==='arriveTime'">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placement="top-end" placeholder="Select date and time" v-model="formValidate[key]"></DatePicker>
            </FormItem>
            <FormItem label="生日" v-else-if="key ==='birthday'">
                <FormItem prop="birthday">
                    <DatePicker type="date" placeholder="Select date" v-model="formValidate[key]"></DatePicker>
                </FormItem>
            </FormItem>
            <FormItem label="洲" prop="continent" v-else-if="key ==='continent'">
                <Select v-model="formValidate[key]" placeholder="选择洲">
                    <Option value="亚洲">亚洲</Option>
                    <Option value="欧洲">欧洲</Option>
                    <Option value="南美洲">南美洲</Option>
                    <Option value="北美洲">北美洲</Option>
                    <Option value="大洋洲">大洋洲</Option>
                    <Option value="非洲">非洲</Option>
                </Select>
            </FormItem>
            <FormItem :label="formComp[index].label" v-else-if="key === 'type'">

               <Select v-model="formValidate[key]" placeholder="选择交通方式" v-if ="tableName =='traffic'">
                  <Option value="1">火车</Option>
                  <Option value="2">汽车</Option>
                  <Option value="3">轮船</Option>
                  <Option value="4">飞机</Option>
               </Select>
               <Select v-model="formValidate[key]" placeholder="选择分类" v-else-if ="tableName =='local'">
                  <Option value="1">餐饮</Option>
                  <Option value="2">购物</Option>
                  <Option value="3">娱乐</Option>
                  <Option value="4">景点</Option>
               </Select>
            </FormItem>
            <FormItem :label="formComp[index].label" v-else>
                <Input v-model="formValidate[key]" placeholder=""></Input>
            </FormItem>
            <!-- <FormItem label="密码" prop="passwd">
                <Input type="password" v-model="formValidate.passwd"></Input>
            </FormItem> -->
            <!-- <FormItem label="邮箱" prop="mail">
                <Input v-model="formValidate.mail" placeholder="Enter your e-mail"></Input>
            </FormItem> -->
            <!-- <FormItem label="城市级联" prop="city">
                <Select v-model="formValidate.city" placeholder="Select your city">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                </Select>
            </FormItem> -->
            <!-- <FormItem label="生日">
                <Row>
                    <Col span="11">
                        <FormItem prop="date">
                            <DatePicker type="date" placeholder="Select date" v-model="formValidate.date"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <FormItem prop="time">
                            <TimePicker type="time" placeholder="Select time" v-model="formValidate.time"></TimePicker>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem> -->
            <!-- <FormItem label="性别" prop="gender">
                <RadioGroup v-model="formValidate.gender">
                    <Radio label="male">Male</Radio>
                    <Radio label="female">Female</Radio>
                </RadioGroup>
            </FormItem> -->
            <!-- <FormItem label="复选框" prop="interest">
                <CheckboxGroup v-model="formValidate.interest">
                    <Checkbox label="Eat"></Checkbox>
                    <Checkbox label="Sleep"></Checkbox>
                    <Checkbox label="Run"></Checkbox>
                    <Checkbox label="Movie"></Checkbox>
                </CheckboxGroup>
            </FormItem> -->
            <!-- <FormItem label="描述" prop="desc">
                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
            </FormItem> -->
        </Form>
        <div slot="footer">
          <Button type="ghost"    @click="cancel()">取消</Button>
          <Button  @click="reset()">重置</Button>
          <Button type="primary"   :loading="loading" @click="ok()">提交</Button>
        </div>
    </Modal>

    <Modal title="View Image" v-model="imgVis" >
        <img :src="imgUrl" v-if="imgVis" style="width: 100%">
    </Modal>
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
import { mapState, mapGetters } from "vuex";
import Store from "../store/index";
import uploadImg from './uploadImage'
export default {
  beforeCreate() {
    console.log(Store);
  },
  created() {
    let vm = this;
    console.log(this);
    // let formComp = this.formComp;
    // this.$set(this.formValidate,'nname','11111')
    // console.log(formComp);

    // for(let i=0;i<formComp.length;i++){
    //   console.log(formComp[i])
    //   this.$set(this.formValidate,formComp[i],'')
    // }
    // console.log(this);
  },
  props: ["name"],
  data() {
    return {
      imgVisible: false,
      domain: "",
      imgName: "",
      uploadToken: "",
      uploadKey: "",
      rowIndex: "",
      loading: false,
      radio: {
        gender: "",
        levle: "",
        status: ""
      },
      uploadList: {},
      defaultList: [
        {
          name: "a42bdcc1178e62b4694c830f028db5c0",
          url:
            "https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar"
        },
        {
          name: "bc7521e033abdd1e92222d733590f104",
          url:
            "https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar"
        }
      ],
      ruleValidate: {
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        mail: [
          {
            required: true,
            message: "Mailbox cannot be empty",
            trigger: "blur"
          },
          { type: "email", message: "Incorrect email format", trigger: "blur" }
        ],
        city: [
          {
            required: true,
            message: "Please select the city",
            trigger: "change"
          }
        ],
        gender: [
          { required: true, message: "Please select gender", trigger: "change" }
        ],
        interest: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "Choose at least one hobby",
            trigger: "change"
          },
          {
            type: "array",
            max: 2,
            message: "Choose two hobbies at best",
            trigger: "change"
          }
        ],
        birthday: [
          {
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
          }
        ],
        // time: [
        //   {
        //     required: true,
        //     type: "date",
        //     message: "Please select time",
        //     trigger: "change"
        //   }
        // ],
        desc: [
          {
            required: true,
            message: "Please enter a personal introduction",
            trigger: "blur"
          },
          {
            type: "string",
            min: 20,
            message: "Introduce no less than 20 words",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      // formValidate: "getFormComp"
    }),
    ...mapState({
      tableName: "tableName",
      formComp: "formCommpose",
      imgUrl: 'imgUrl',
      imgOpen:'imgOpen'
    }),
    formValidate() {
      return JSON.parse(JSON.stringify(this.$store.getters.getFormComp));
    },
    imgVis:{
      get() {
        return JSON.parse(JSON.stringify(this.imgOpen));
      },
      set (newValue) {
        console.log(newValue)
        this.$store.commit('imgView',{
            open:newValue,
            url:''
        })
      }
    },
    modall: {
      get() {
        return this.$store.state.modal;
      },
      set(newValue) {
        this.$store.commit("MODAL_TOGGLE", newValue);
      }
    }
  },
  components:{
    'up-Image':uploadImg
  },
  methods: {

    raChange(val) {
      console.log(val);
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


    handleVideoFormatError(file) {},

    // 上传视频
    handleVBeforeUpload(file) {
      let vm = this;
      let type = file.type.split("/")[0];
      let vdFix = file.type.split("/")[1];
      if (type !== "video") {
        this.$Notice.warning({
          title: "文件格式错误",
          desc: file.name + "格式错误, 请选择视频文件."
        });
        return;
      }
      let promise = this.$store.dispatch("uploadFile", vdFix).then(result => {
        console.log(result);
        vm.uploadToken = result.uploadToken;
        vm.uploadKey = result.key;
        vm.domain = result.domain;
      });
    },

    radioChange(val) {
      console.log(val);
      console.log(this.radio);
      // let getValue = Object.entries(this.radio);
      // console.log(getValue)
      // for(let i=0;i<getValue.length;i++){
      //   console.log(getValue[i][0])
      //   console.log(this.formValidate[getValue[i][0]])
      //   if(this.formValidate[getValue[i][0]] !== 'undefined'){
      //     // this.formValidate[getValue[i][0]] = getValue[i][1]
      //     this.$set(this.formValidate,getValue[i][0],getValue[i][1])
      //   }
      // }
      console.log(this.formValidate);
    },
    formatDate(date) {
      console.log(date);
      if (date) {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        let hh = date.getHours();
        hh = hh < 10 ? "0" + hh : hh;
        let MM = date.getMinutes();
        MM = MM < 10 ? "0" + MM : MM;
        let ss = date.getSeconds();
        ss = ss < 10 ? "0" + ss : ss;

        return y + "-" + m + "-" + d + " " + hh + ":" + MM + ":" + ss;
      } else {
        return "";
      }
    },
    computedUpImg(imagesList){
      let comp = true;
      for(let i=0;i<imagesList.length;i++){
        if(imagesList[i].status !== 'finished'){
          comp = false;
        }
      }
      return comp;
    },
    buildImgStr(list){
      let str = '';
      for(let i=0;i<list.length;i++){
        if(i<list.length-1){
          str += list[i].url + ',';
        }else{
          str += list[i].url;
        }

      }
      // str.substring(0,str.length-1)
      return str
    },
    ok(name) {
      this.$Message.info("Clicked ok");
      let vm = this;
      let uploadable;
      console.log(vm);

      const image = vm.$refs.uploadCompoment[0].uploadList.image;
      let imageF = vm.computedUpImg(image);
      const imgStr = vm.buildImgStr(image);

      const introImages1 = vm.$refs.uploadCompoment[1].uploadList.introImages1;
      let introImages1F = vm.computedUpImg(introImages1);
      const introImg1Str = vm.buildImgStr(introImages1)

      const introImages2 = vm.$refs.uploadCompoment[2].uploadList.introImages2;
      let introImages2F = vm.computedUpImg(introImages2);
      const introImg2Str = vm.buildImgStr(introImages2)

      const introImages3 = vm.$refs.uploadCompoment[3].uploadList.introImages3;
      let introImages3F = vm.computedUpImg(introImages3);
      const introImg3Str = vm.buildImgStr(introImages3)

      uploadable = imageF && introImages1F && introImages2F && introImages3F
      console.log(introImg2Str);
      if(!uploadable){
        his.$Notice.info({
          title: "文件上传中",
          desc: '文件正在上传,请稍等...',
          duration: 3
        })
        return;
      }
      vm.formValidate.image = imgStr;
      vm.formValidate.introImages1 = introImg1Str
      vm.formValidate.introImages2 = introImg2Str
      vm.formValidate.introImages3 = introImg3Str

      console.log(vm.formValidate)

      this.loading = true;
      let index = this.rowIndex;
      for (let key in vm.formValidate) {
        if (key === "startTime" || key === "endTime" || key === "arriveTime") {
          // const dt = ;
          // vm.$set(vm.formValidate,key,dt)
          vm.formValidate[key] = vm.formatDate(new Date(vm.formValidate[key]));
          // console.log(dt)
          console.log(vm.formValidate);
        }
      }
      // vm.formValidate['startTime'] = 0;
      for (let k in vm.radio) {
        switch (k) {
          case "gender":
            if (vm.radio[k] == "female") {
              vm.formValidate[k] = 2;
            } else if (vm.radio[k] === "male") {
              vm.formValidate[k] = 1;
            }
            break;
          case "level":
            if (vm.radio[k] == "open") {
              vm.formValidate[k] = 0;
            } else if (vm.radio[k] === "needLogin") {
              vm.formValidate[k] = 1;
            }
            break;
          case "status":
            if (vm.radio[k] == "disabled") {
              vm.formValidate[k] = 0;
            } else if (vm.radio[k] === "used") {
              vm.formValidate[k] = 1;
            }
            break;
          default:
            break;
        }
      }
      if (typeof index === "number") {
        console.log(vm.formValidate);
        vm.$store
          .dispatch({
            type: "updateTable",
            params: vm.formValidate,
            index: index
          })
          .then(result => {
            vm.loading = false;
            if (result && result.request === "failure") {
              vm.$Notice.open({
                title: "请求反馈",
                desc: "更新失败, " + result.msg,
                duration: 3,
                top: 50
              });
            } else {
              this.$store.commit("MODAL_TOGGLE", false);
              // this.reset();
              this.$Message.success("Successfully Submit！");
              // location.reload();
            }
          });
      } else {
        vm.$store
          .dispatch({
            type: "addTable",
            params: vm.formValidate
          })
          .then(result => {
            vm.loading = false;
            if (result && result.request === "failure") {
              vm.$Notice.open({
                title: "请求反馈",
                desc: "添加失败, " + result.msg,
                duration: 3,
                top: 50
              });
            } else {
              this.$store.commit("MODAL_TOGGLE", false);
              // this.reset();
              this.$Message.success("Successfully Submit！");
              // location.reload();
            }
            console.log(result);
          });
      }

      // this.$store.commit("MODAL_TOGGLE", false);
      console.log(this);
    },
    reset() {
      let radio = this.radio;
      let form = this.formValidate;
      for (let k in radio) {
        radio[k] = "";
      }
      for (let kk in form) {
        form[kk] = "";
      }
    },
    cancel(name) {
      console.log(name);
      console.log(this.$refs[name]);
      let vm = this;

      vm.$store.commit("MODAL_TOGGLE", false);
      this.$Message.success("Click Cancel");
    }
  },
  mounted() {
    console.log(this);
    // this.uploadList = this.$refs.upload.fileList;
  }
};
</script>
