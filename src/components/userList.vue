<template>
  <div class="userlist" style="heigth:800px;">
    <!-- <div class="layout-header" v-for="(item,key) in searchArrBtn" style="width:172px;margin-right:5px;">
      <span style="display:inline-block;position:relative;">{{item.label}}</span>
      <DatePicker type="daterange"  placement="bottom-start"  v-model="searchArrBtn[key].value" format="yyyy-MM-dd HH:mm:ss" :placeholder="'请输入' + item.label"  v-if="key === 'createTime'  " :style="[item.label.length == 4?{width:'70%'}:item.label.length==3?{width:'77%'}:{width:'84%'}]">

      </DatePicker>
      <Select  filterable v-else-if="key === 'continent' || key === 'type'" :placeholder="'请选择' + item.label" v-model="searchArrBtn[key].value" :style="[item.label.length == 4?{width:'70%'}:item.label.length==3?{width:'77%'}:{width:'84%'}]">
            <Option v-for="itemIn in options" :value="itemIn.value" :key="itemIn.value" v-if="tableName === 'local' || tableName === 'city' || tableName ==='traffic'">{{ itemIn.label }}</Option>
      </Select>
      <DatePicker type="datetime"  placement="bottom-end"  v-model="searchArrBtn[key].value" format="yyyy-MM-dd HH:mm:ss" :placeholder="'请输入' + item.label"  v-else-if=" key === 'startTime' " :style="[item.label.length == 4?{width:'70%'}:item.label.length==3?{width:'77%'}:{width:'84%'}]">

      </DatePicker>
      <Input v-model="searchArrBtn[key].value" :style="[item.label.length == 4?{width:'70%'}:item.label.length==3?{width:'77%'}:{width:'84%'}]" :placeholder="'请输入' + item.label "  v-else >
      </Input>
    </div> -->

    <!-- <div class="action">
      <Button type="primary" icon="ios-search" @click="search()">查询</Button>
      <Button type="primary" @click="showAll" class="showAll">全部</Button>
      <Button type="primary" @click="add" class="add" v-if="tableName !=='admin' && tableName !== 'listResource' && tableName !== 'resource' && tableName !=='showResource' && tableName !=='roleResource' && tableName !=='roleToAddRes' && tableName !=='orderWithStars' && tableName !=='orderWithRefund'  && tableName !== 'order'">添加</Button>
      <Button type='ghost' @click="delSelect" class="removeSel" v-if="tableName ==='listResource' || tableName === 'resource' || tableName ==='roleResource'">删除已选</Button>
      <Button type='primary' @click="goToAdd" class="add" v-if="tableName ==='listResource' || tableName ==='roleResource'">添加资源</Button>
      <Button type='primary' @click='addSelect' class='add' v-if="tableName ==='showResource' || tableName ==='roleToAddRes'">添加已选</Button>
    </div> -->

    <!-- {{ Modal }} -->
    <Table :border="true" :stripe="true" :data="typeof tableData1 === 'string'?[]:tableData1" :columns="columns" :height="bodyHeight" @on-selection-change="selectChange"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;" v-if="pageInfo">
        <Page :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.pageSize" @on-change="changePage"></Page>
      </div>
    </div>
    <mod ref="myModal" :name="modalName"></mod>

  </div>
</template>
<style scoped>
.action {
  margin-bottom: 3px;
}
.removeSel {
  /* position: absolute; */
  top: 76px;
  left: 365px;
}
.add {
  /* position: absolute; */
  top: 76px;
  left: 300px;
  /* width: 58px; */
}
.showAll {
  /* position: absolute; */
  top: 76px;
  left: 250px;
}
.custom-search i {
  color: #fff !important;
  cursor: pointer;
}
.layout-header {
  margin-bottom: 5px;
  background: #fff;
  display: inline-block;
  margin-right: 12px;
  /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); */
}
/* .noTrip {
  display: none !important;
}
.trip {
  display: inline-block;
} */
</style>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mmodal from "./modal";
import defaultMD from "../defaultModal.js";
import searchKey from "../tableSearch";
import customOptions from "../options.js";
import Bus from "../eventBus";

export default {
  created() {
    // 实例化完成才能获得 映射的 action
    // console.log(this.getListdataAsync('sys'));
    let vm = this;

    let width = document.body.clientWidth;
    let height = document.body.clientHeight;
    if (width > 1525) {
      vm.bodyHeight = height - 202;
    } else {
      vm.bodyHeight = height - 240;
    }

    // 异步获取的ajax数据 无法通过mapstate直接同步
    this.$store
      .dispatch("getListdataAsync", vm.tableName)
      .then(function(result) {
        console.log(result);
        console.log(vm.$store.getters["cart/getRootData"]);
        // console.log(vm.setTableColumns);
        let resdata = vm.$store.getters.getPageInfo;
        let tableData = vm.$store.getters.getAjaxTableData;
        let tableColumns = vm.$store.getters.setTableColumns;
        vm.pageInfo = resdata;
        vm.tableData1 = tableData;
        vm.tableColumns1 = tableColumns;
        console.log(tableColumns);
        // 不同table search不同
        vm.searchArrBtn = searchKey[vm.tableName];
        vm.options = customOptions[vm.tableName + "Options"];

        console.log(vm.searchArrBtn);
        console.log(searchKey);
        if (tableColumns) {
          if (
            vm.tableName === "showResource" ||
            vm.tableName === "listResource" ||
            vm.tableName === "roleResource" ||
            vm.tableName === "roleToAddRes"
          ){
            Bus.$emit('buildSelection',tableColumns);
          }else{
            Bus.$emit("buildAction", tableColumns);
          }
            // vm.tableColumns1 = vm.buildActions(tableColumns, menu);
        }
        setTimeout(() => {
          vm.loading = false;
        }, 800);
      });
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      console.log(document.body.clientWidth);
      let cwidth = document.body.clientWidth;
      if (cwidth > 1525) {
        that.bodyHeight = document.body.clientHeight - 202;
      } else {
        that.bodyHeight = document.body.clientHeight - 240;
      }
    };
  },
  props:['columns'],
  data() {
    return {
      value4: "",
      pageInfo: {
        total: 30,
        pageSize: 20,
        page: 1
      },
      options: [],
      searchArrBtn: {},
      tableColumns1: [],
      tableData1: [],
      Modal: {},
      md: false,
      loading: true,
      bodyHeight: "",
      selectID: [],
      valueText: "点击星星，可以调整重要度",
      orderContent: "",
      currentOrderStar: "",
      modalName: "",
      styleObj: {
        width: "64%"
      }
    };
  },
  computed: {
    // ...mapGetters(["setTableColumns", "getPageInfo", "getAjaxTableData"]),
    ...mapState({
      menuId: "menuId",
      tableName: "tableName",
      tableColumns: state => state.listroute,
      tableready: "tableready",
      axiosData: "axiosData"
    })
  },
  components: {
    mod: mmodal
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    console.log(to);
    // menu = to.params.menu;

    next();
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    // menu = to.params.menu;
    console.log(menu);
    let vm = this;
    vm.tableData1 = "";
    vm.loading = true;
    // vm.tableColumns1 = [];
    // this.$store.dispatch("getListdataAsync", vm.tableName).then(function() {
    //   let resdata = vm.$store.getters.getPageInfo;
    //   let tableData = vm.$store.getters.getAjaxTableData;
    //   let tableColumns = vm.$store.getters.setTableColumns;
    //   vm.pageInfo = resdata;
    //   console.log(tableData);
    //   vm.tableData1 = tableData;
    //   vm.tableColumns1 = tableColumns;
    //   // 不同table search不同
    //   vm.searchArrBtn = searchKey[vm.tableName];
    //   vm.options = customOptions[vm.tableName + "Options"];
    //   let trip = false;
    //   console.log(vm.tableName);
    //   if (vm.tableName === "trip") {
    //     trip = true;
    //   }
    //   // vm.loading = false;
    //   try {
    //     setTimeout(() => {
    //       if (tableColumns) {
    //         vm.tableColumns1 = vm.buildActions(tableColumns, menu);
    //       }
    //       vm.loading = false;
    //     }, 800);
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   next();
    // });
  },
  filters: {},
  methods: {
    goToAdd() {
      console.log(this.menuId);
      console.log(this.tableName);
      let rout;
      if (this.tableName === "listResource") {
        rout = "/console/showResource/list";
      } else if (this.tableName === "roleResource") {
        rout = "/console/roleToAddRes/list";
      }
      // let rout = "/console/showResource/list";
      let menuId = this.menuId;
      // debugger;
      window.localStorage.menuId = menuId;
      this.$store.commit("MENUID", menuId);
      this.$store.commit("ROUT_PATH", rout);
    },

    disbaled() {},
    getModal() {
      console.log(this.Modal);
    },
    createModal(temp, key = [], params, index) {
      let vm = this;
      let n = 0;
      let tt;
      if (params) {
        console.log(params.id);
      }
      this.modalName = this.InfoName(this.tableName);
      let errMap = [];
      this.$store.commit("MODAL_TOGGLE", true);
      this.$store.commit({
        type: "FORM_COMP",
        index: index,
        key: key,
        label: temp
      });

      let myModal = this.$refs[`myModal`];
      myModal.rowIndex = index;
      for (let k in myModal.formValidate) {
        switch (k) {
          case "type":
            myModal.formValidate[k] = myModal.formValidate[k] + "";
            console.log(myModal.formValidate[k]);
            break;
          case "gender":
            if (!Number.isNaN(myModal.formValidate[k])) {
              if (myModal.formValidate[k] == 2) {
                myModal.radio[k] = "female";
              } else if (myModal.formValidate[k] == 1) {
                myModal.radio[k] = "male";
              } else {
                myModal.radio[k] = "";
              }
            }
            break;
          case "level":
            if (!Number.isNaN(myModal.formValidate[k])) {
              if (myModal.formValidate[k] == 0) {
                myModal.radio[k] = "open";
              } else if (myModal.formValidate[k] == 1) {
                myModal.radio[k] = "needLogin";
              } else {
                myModal.radio[k] = "";
              }
            }
            break;
          case "status":
            if (!Number.isNaN(myModal.formValidate[k])) {
              if (myModal.formValidate[k] == 0) {
                myModal.radio[k] = "disabled";
              } else if (myModal.formValidate[k] == 1) {
                myModal.radio[k] = "used";
              } else {
                myModal.radio[k] = "";
              }
            }
            break;
          default:
            break;
        }
      }
      this.$nextTick(() => {
        let myModal111 = vm.$refs[`myModal`];

        // myModal111.uploadList.image = fileList1;
        // myModal111.uploadList.introImages1 = fileList2;
        console.log(myModal111);
      });
      console.log(this);
    },
    // 订单详情
    orderInfo(params) {
      console.log(params);
    },
    // 修改备注
    remark(params, info) {
      console.log(params);
      let pa = params.row;
      let vm = this;
      if (info) {
        this.$Modal.info({
          title: "订单详情",
          ok: vm.orderRem(pa.orderId),
          render: h => {
            return h(
              "div",
              { attrs: { id: "openMd" }, style: { margin: "8px" } },
              [
                h("div", {}, `订单号: ${pa.orderId}`),
                h("div", {}, `联系人: ${pa.person}`),
                h("div", {}, `联系电话: ${pa.mobile}`),
                h("div", {}, `订单金额: ${pa.payment.dueAmount}`),
                h("div", {}, `实付金额: ${pa.payment.payed}`),
                h("div", {}, [
                  h("span", `重要度:  `),
                  h("Rate", {
                    props: {
                      count: 5,
                      value: pa.importance
                    }
                  })
                ]),
                h("div", {}, `备注： ${pa.content}`)
              ]
            );
          }
        });
      } else {
        this.$Modal.info({
          title: "订单修改",
          ok: vm.orderRem(pa.orderId),
          render: h => {
            return h(
              "div",
              { attrs: { id: "openMd" }, style: { margin: "8px" } },
              [
                h("div", {}, `订单号: ${pa.orderId}`),
                h("div", {}, `联系人: ${pa.person}`),
                h("div", {}, `联系电话: ${pa.mobile}`),
                h("div", {}, `订单金额: ${pa.payment.dueAmount}`),
                h("div", {}, `实付金额: ${pa.payment.payed}`),
                h("div", {}, [
                  h("span", `重要度:  `),
                  h("Rate", {
                    props: {
                      count: 5,
                      value: pa.importance
                    },
                    nativeOn: { click: vm.changeStar }
                  }),
                  h("span", vm.valueText)
                ]),
                h("div", {}, [
                  h("span", "写备注:  "),
                  h("textarea", {
                    style: { verticalAlign: "text-top" },
                    on: {
                      input: val => {
                        vm.orderContent = val.target.value;
                      }
                    }
                  })
                ])
              ]
            );
          }
        });
      }
    },
    orderRem(orderId) {
      console.log(this);
      let star = this.currentOrderStar;
      let content = this.orderContent;
      console.log(orderId);
    },
    changeStar(e) {
      let parent = document.querySelector("#openMd div.ivu-rate");
      console.log(parent);
      let fullStart = document.querySelectorAll(
        "#openMd div.ivu-rate .ivu-rate-star.ivu-rate-star-full"
      );
      vm.currentOrderStar = fullStart.length;
      console.log(fullStart);
      console.log(e);
    },
    modify(index) {
      let vm = this;
      vm.md = true;
      let params = this.tableData1[index];
      console.log(params);
      // vm.Modal = JSON.parse(JSON.stringify(params));
      let renderTemp = [];
      let keyTemp = [];
      for (let k in params) {
        if (
          k !== "avatar" &&
          k !== "code" &&
          k !== "updateTime" &&
          k !== "writeLog" &&
          k !== "countryEn" &&
          k !== "cityEn" &&
          k !== "name2" &&
          k !== "typeName" &&
          k !== "recommended" &&
          k !== "scoreSum" &&
          k !== "scoreAvg" &&
          k !== "scoreNum" &&
          k !== "soldNum"
        ) {
          let label = vm.chinese(k);
          // temp += `${label}: ${params[k]}<br>`;
          renderTemp.push(label);
          keyTemp.push(k);
        }
      }
      this.createModal(renderTemp, keyTemp, params, index);
    },
    add() {
      let vm = this;
      vm.md = true;
      let tableName = vm.tableName;
      console.log(vm.tableName);
      console.log(defaultMD[tableName]);

      // let params = this.tableData1[0]?this.tableData1[0]:defaultMD[this.tableName];
      let params = defaultMD[tableName];
      let renderTemp = [];
      let keyTemp = [];
      if (params) {
        for (let k in params) {
          if (
            k !== "avatar" &&
            k !== "code" &&
            k !== "updateTime" &&
            k !== "writeLog" &&
            k !== "countryEn" &&
            k !== "cityEn" &&
            k !== "name2" &&
            k !== "recommended" &&
            k !== "scoreSum" &&
            k !== "scoreAvg" &&
            k !== "scoreNum" &&
            k !== "soldNum"
          ) {
            let label = vm.chinese(k);
            // temp += `${label}: ${params[k]}<br>`;
            renderTemp.push(label);
            keyTemp.push(k);
          }
        }
      }
      this.createModal(renderTemp, keyTemp);
    },
    getResource(params) {
      console.log(params);
      let rout = "/console/roleResource/list";
      let menuId = params.row.id;
      if (!menuId) {
        this.$Notice.open({
          title: "操作提示",
          desc: "请选择菜单",
          duration: 3,
          top: 50
        });
        return;
      }
      console.log(menuId);
      window.localStorage.menuId = menuId;
      this.$store.commit("MENUID", menuId);
      this.$store.commit("ROUT_PATH", rout);
    },
    getMenu(params) {
      console.log(params);
      let id = params.row.id;
      let rout = "/console/roleListMenu/transTree";
      // this.$store.commit("TABLE_NAME", "roleListMenu");
      window.localStorage.menuId = id;
      this.$store.commit("MENUID", id);
      this.$store.commit("ROUT_PATH", rout);
    },
    addSelect() {
      console.log(this.selectID);
      console.log(this.menuId);
      console.log(this.tableName);
      let vm = this;
      if (this.tableName === "roleToAddRes") {
        this.$store
          .dispatch({
            type: "addResouce",
            params: {
              roleId: this.menuId,
              resourceIdList: this.selectID
            }
          })
          .then(result => {
            if (result && result.request === "failure") {
              vm.$Notice.open({
                title: "请求反馈",
                desc: "添加失败, " + result.msg,
                duration: 3,
                top: 50
              });
            } else {
              vm.$store.dispatch("getListdataAsync", vm.tableName).then(function() {
                let resdata = vm.$store.getters.getPageInfo;
                let tableData = vm.$store.getters.getAjaxTableData;

                vm.pageInfo = resdata;
                vm.tableData1 = tableData;
                vm.selectID = [];
              });
            }
          });
      } else {
        this.$store
          .dispatch({
            type: "addResouce",
            params: {
              menuId: this.menuId,
              resourceIdList: this.selectID
            }
          })
          .then(result => {
            if (result && result.request === "failure") {
              vm.$Notice.open({
                title: "请求反馈",
                desc: "添加失败, " + result.msg,
                duration: 3,
                top: 50
              });
            } else {
              vm.$store.dispatch("getListdataAsync", vm.tableName).then(function() {
                let resdata = vm.$store.getters.getPageInfo;
                let tableData = vm.$store.getters.getAjaxTableData;

                vm.pageInfo = resdata;
                vm.tableData1 = tableData;
                vm.selectID = [];
              });
            }
          });
      }
    },
    selectChange(val) {
      console.log(val);
      let selectId = [];
      for (let i = 0; i < val.length; i++) {
        selectId.push(val[i].id);
      }
      this.selectID = selectId;
    },
    chinese(val) {
      switch (val) {
        case "id":
          val = "ID";
          break;
        case "typeName":
          if (this.tableName === "traffic") {
            val = "交通方式";
          } else {
            val = "分类";
          }
          break;
        case "location":
          val = "经纬度";
          break;
        case "longitude":
          val = "经度";
          break;
        case "latitude":
          val = "纬度";
          break;
        case "introImages3":
          val = "预定须知";
          break;
        case "introImages2":
          val = "行程详情";
          break;
        case "introImages1":
          val = "产品介绍";
          break;
        case "type":
          if (this.tableName === "traffic") {
            val = "交通方式";
          } else if (this.tableName === "local") {
            val = "分类";
          }

          break;
        case "balance":
          val = "账户余额";
          break;
        case "frozenBalance":
          val = "冻结金额";
          break;
        case "expectedIncome":
          val = "累计收入";
          break;
        case "cumulativeCashed":
          val = "累计提现";
          break;
        case "writeLog":
          val = "记录日志";
          break;
        case "content":
          val = "内容";
          break;
        case "sellerId":
          val = "销售员ID";
          break;
        case "sellerName":
          val = "销售员名称";
          break;
        case "sellerMobile":
          val = "销售员电话";
          break;
        case "title":
          val = "标题";
          break;
        case "subtitle":
          val = "副标题";
          break;
        case "destination":
          val = "目的地";
          break;
        case "days":
          val = "天数";
          break;
        case "oldPrice":
          val = "原价";
          break;
        case "curPrice":
          val = "现价";
          break;
        case "endTime":
          val = "截止时间";
          break;
        case "password":
          val = "密码";
          break;
        case "birthday":
          val = "生日";
          break;
          0;
        case "createTime":
          val = "注册时间";
          break;
        case "email":
          val = "邮箱";
          break;
        case "gender":
          val = "性别";
          break;
        case "city":
          val = "城市";
          break;
        case "cityEn":
          val = "城市(英文)";
          break;
        case "continent":
          val = "洲";
          break;
        case "country":
          val = "国家";
          break;
        case "countryEn":
          val = "国家(英文)";
          break;
        case "address":
          val = "地址";
          break;
        case "phone":
          val = "电话";
          break;
        case "description":
          val = "简介";
          break;
        case "facility":
          val = "设施";
          break;
        case "minPrice":
          val = "最低价格";
          break;
        case "maxPrice":
          val = "最高价格";
          break;
        case "updateTime":
          val = "更新时间";
          break;
        case "image":
          val = "图片";
          break;
        case "mobile":
          val = "手机";
          break;
        case "nickname":
          val = "昵称";
          break;
        case "status":
          val = "状态";
          break;
        case "username":
          val = "账号";
          break;
        case "note":
          val = "描述";
          break;
        case "name":
          if (this.tableName === "traffic") {
            val = "班次";
          } else {
            val = "名称";
          }
          break;
        case "startCity":
          val = "出发城市";
          break;
        case "startStation":
          val = "出发车站";
          break;
        case "startTime":
          if (this.tableName === "trip") {
            val = "发售时间";
          } else {
            val = "出发时间";
          }

          break;
        case "arriveCity":
          val = "抵达城市";
          break;
        case "arriveStation":
          val = "抵达车站";
          break;
        case "arriveTime":
          val = "抵达时间";
          break;
        case "trafficTime":
          val = "乘坐时间";
          break;

        case "app":
          val = "应用";
          break;
        case "path":
          val = "路径";
          break;
        case "level":
          val = "密级";
          break;
        case "video":
          val = "视频";
          break;
        default:
          break;
      }
      return val;
    },
    ...mapActions({
      getTableData: "getListdataAsync"
    }),
    show(index) {
      let vm = this;
      let tableName = this.tableName;
      // if (tableName === "order") {
      //   return;
      // }
      console.log(this.tableData1[index]);
      let params = this.tableData1[index];
      console.log(params);
      let temp = ``;
      for (let k in params) {
        console.log(k);
        if (
          k !== "avatar" &&
          k !== "password" &&
          k !== "name2" &&
          k !== "countryEn" &&
          k !== "cityEn" &&
          k !== "image" &&
          k !== "type" &&
          k !== "video" &&
          k !== "recommended" &&
          k !== "scoreSum" &&
          k !== "scoreAvg" &&
          k !== "scoreNum" &&
          k !== "soldNum" &&
          k !== "readTime" &&
          k !== "readStatus" &&
          k !== "createTime" &&
          k !== "code"
        ) {
          let label = vm.chinese(k);
          temp += `${label}: ${params[k]}<br>`;
        } else if (k === "createTime") {
          let label = vm.chinese(k);
          if (typeof params[k] !== "String") {
            let dateString = new Date(params[k]).toLocaleString();
            temp += `${label}: ${dateString} <br>`;
          } else {
            temp += `${label}: ${params[k]}<br>`;
          }
        } else if (k === "image") {
          let label = vm.chinese(k);
          temp += `${label}: <img style="width:58px;height:48px;" src="${params[
            k
          ]}"/> <br>`;
        } else if (k === "video") {
          let label = vm.chinese(k);
          temp += `${label}: <video src="${params[
            k
          ]}" controls preload height="180" width="320" ></video><br>`;
        }
      }
      console.log(temp);
      let infoName = this.InfoName(this.tableName);
      this.$Modal.info({
        title: infoName + " 详情",
        content: temp
      });
    },
    InfoName(name) {
      switch (name) {
        case "admin":
          name = "后台管理";
          break;

        case "role":
          name = "角色";
          break;
        case "resource":
          name = "资源";
          break;
        case "city":
          name = "城市";
          break;
        case "hotel":
          name = "酒店";
          break;
        case "local":
          name = "地点";
          break;
        case "traffic":
          name = "交通";
          break;
        case "trip":
          name = "行程";
          break;
        case "seller":
          name = "销售员";
          break;
        default:
          break;
      }
      return name;
    },
    travel(id) {
      console.log(id);
      let route = "/travel/" + id;
      this.$store.commit("ROUT_PATH", route);
    },
    remove(index) {
      let vm = this;
      console.log(index);
      console.log(this.tableName);
      this.$Modal.confirm({
        title: this.tableName + " delete",
        onOk: () => {
          // console.log(vm.Modal);
          // if(errMap.length>0){
          //   this.$Message.info({
          //       content: errMap[0].message,
          //       duration: 4
          //   });
          //   return;
          // }else{
          if (typeof index !== "Number") {
            if (vm.tableName === "resource") {
              console.log(vm.tableData1);
              let id = vm.tableData1[index];
              let idList = [];
              idList.push(id);
              vm.$store.dispatch("delTable", idList);
            } else {
              vm.$store.dispatch("delTable", index);
            }
          } else {
            vm.$Message.info({
              content: "请选择要删除的节点",
              duration: 4
            });
          }
        },
        render: h => {
          return h("div", {}, "确认删除");
        }
      });
      // this.$store.dispatch("delTable", index);
      // this.tableData1.splice(index, 1);
    },
    showAll() {
      let vm = this;
      let tableName = this.tableName;
      for (let n in vm.searchArrBtn) {
        vm.searchArrBtn[n].value = "";
      }
      this.$store.dispatch("getListdataAsync", tableName).then(result => {
        let tableData = vm.$store.getters.getAjaxTableData;
        vm.tableData1 = tableData;
      });
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
    search() {
      console.log(this);
      let params = {};

      for (let k in this.searchArrBtn) {
        if (k == "startTime") {
          const dt = this.formatDate(this.searchArrBtn[k].value);
          console.log(dt);
          this.$set(params, k, dt);
        } else if (k == "createTime") {
          const minCreateTime = this.formatDate(this.searchArrBtn[k].value[0]);
          const maxCreateTime = this.formatDate(this.searchArrBtn[k].value[1]);
          console.log(minCreateTime, maxCreateTime);
          this.$set(params, "minCreateTime", minCreateTime);
          this.$set(params, "maxCreateTime", maxCreateTime);
        } else {
          this.$set(params, k, this.searchArrBtn[k].value);
        }
      }
      console.log(params);
      let vm = this;
      this.$store
        .dispatch({
          type: "searchTableAsync",
          params: params
        })
        .then(result => {
          let tableData = vm.$store.getters.getAjaxTableData;
          vm.tableData1 = tableData;
          // for(let n in vm.searchArrBtn){
          //   vm.searchArrBtn[n].value = ''
          // }
          // vm.searchArrBtn[key].value = "";
        });
      const filterByName = a => b => {
        return b.username.indexOf(a) > -1;
      };
      // this.tableData1 = this.tableData1.filter(filterByName(key));
      // console.log(this.tableData1);
    },
    mockTableData1() {
      let data = [];
      for (let i = 0; i < 10; i++) {
        data.push({
          name: "Business" + Math.floor(Math.random() * 100 + 1),
          status: Math.floor(Math.random() * 3 + 1),
          portrayal: ["City", "People", "Cost", "Life", "Entertainment"],
          people: [
            {
              n: "People" + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000)
            },
            {
              n: "People" + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000)
            },
            {
              n: "People" + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000)
            }
          ],
          time: Math.floor(Math.random() * 7 + 1),
          update: new Date()
        });
      }
      return data;
    },
    delSelect() {
      let vm = this;
      console.log(this.menuId, this.selectID);
      console.log(menu);
      if (this.menuId && this.selectID.length > 0) {
        this.$store.dispatch("delTable", this.selectID).then(result => {
          if (result && result.request === "failure") {
            vm.$Notice.open({
              title: "请求反馈",
              desc: "删除失败, " + result.msg,
              duration: 3,
              top: 50
            });
          } else {
            vm.$store.dispatch("getListdataAsync", result).then(result => {
              let resdata = vm.$store.getters.getPageInfo;
              let tableData = vm.$store.getters.getAjaxTableData;
              let tableColumns = vm.$store.getters.setTableColumns;

              vm.tableColumns1 = tableColumns;
              vm.pageInfo = resdata;
              vm.tableData1 = tableData;
              vm.selectID = [];
            });
          }
        });
      } else {
        this.$Notice.open({
          title: "操作反馈",
          desc: "请选择要删除的资源",
          duration: 3,
          top: 50
        });
      }
    },
    changePage(val) {
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      console.log(val);
      let vm = this;
      this.$store
        .dispatch({
          type: "getListdataAsync",
          params: {
            tableName: vm.tableName,
            page: val
          }
        })
        .then(result => {
          console.log(result);
          console.log(vm.$store.getters);
          vm.tableData1 = vm.$store.getters.getAjaxTableData;
        });
    }
  }
};
</script>
