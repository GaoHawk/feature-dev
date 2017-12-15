<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-breadcrumb {
  padding: 10px 15px 0;
}
.layout-content {
  min-height: 200px;
  margin: 15px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
}
.layout-content-main {
  padding: 10px;
}
.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}
.layout-menu-left {
  background: #fff;
}
.layout-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  /* background: #5b6270; */
  border-radius: 3px;
  margin: 15px auto;
}
.layout-ceiling-main a {
  color: #9ba7b5;
}
.layout-hide-text .layout-text {
  display: none;
}
.ivu-col {
  transition: width 0.2s ease-in-out;
}
.minus-icon {
  float: right;
  display: inline-block;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  margin-top: 13px;
  background: #b3acac;
  text-align: center;
}
</style>
<template>
    <div class="layout" >
        <Row type="flex" style="height:800px">
            <Col span="3" class="layout-menu-left">
                <Menu active-name="2" theme="light" width="auto" @on-select="changeDay">
                    <div style="text-align:center;padding:10px;">行程路线</div>
                    <MenuItem v-for="(item,index) in detailTravel" :name="index+1">
                        <Icon type="ios-navigate" :size="iconSize"></Icon>
                        <span class="layout-text">Day {{index+1}}</span>
                        <br>
                        <div style="margin-left:7px;font-size:0.3rem;display:inline-block" v-for="(citem,ind) in item.cityList" >{{citem.city}}
                          <Icon type="arrow-right-c" v-if="ind < cityList.length -1"></Icon>
                        </div>
                    </MenuItem>
                </Menu>
            </Col>
            <Col span="5">
               <div style="text-align:center;padding:10px;">日程安排 Day {{dayIndex}}</div>
               <div style="padding:6px 10px;" >
                 <div v-if="cityList.length ==0" @click="openModel">
                   <Button>请添加城市  </Button>
                 </div>
                 <div v-for="(city,cindex) in cityList" style="display:inline-block;" v-if="cindex < (cityList.length-1)" class="custom-cityList">
                     <span style="margin-left: 9px;" @mouseover="toggleShow(cindex)" @mouseout="toggleShow(cindex)" >{{city.city}}
                       <sup style="visibility:hidden;cursor:pointer" @click="removeCity(cindex)">x</sup>
                       </span>  <Icon type="arrow-right-c"></Icon>
                 </div>

                 <div v-else-if="cindex == (cityList.length-1)" style="display:inline-block;" class="custom-cityList">
                    <span style="margin-left: 9px;" @mouseover="toggleShow(cindex)" @mouseout="toggleShow(cindex)">{{city.city}} <sup style="visibility:hidden;cursor:pointer" @click="removeCity(cindex)">x</sup></span>  <span @click="openModel" style="cursor:pointer;"><Icon type="plus" ></Icon></span>
                 </div>

                 <!-- <span style="margin:0 9px;">{{2}}</span> <Icon type="plus"></Icon> -->
               </div>
                <Scroll :on-reach-bottom="handleReachBottom" :height="bodyHeight">
                  <Card dis-hover v-for="(item, index) in itemList" :key="index" style="margin: 12px 0" >
                        <img :src="item.image" width="38" height="38" >
                        <div style="float:left;position: absolute;left:60px;bottom:40%;">{{item.title}} </div>
                        <div class="minus-icon" @click="removeItem(index)">
                          <Icon type="minus" style="position:relative;bottom:2px;color:#886363;"></Icon>
                        </div>
                  </Card>

                </Scroll>
            </Col>
            <!-- <Col span = '3'>
              <div >
                  <Button type="primary"  :disabled="!left" >关联目录</Button>
                  <Button type="primary"  style="margin-top:50px" >取消关联</Button>
              </div>
            </Col> -->
            <Col span = '6' >
              <div style="text-align:center;padding:10px;">酒店</div>
              <Tabs @on-click="clickTab">
                <TabPane label="景点" icon="location"  >
                  <Input v-model="searchLocal" placeholder="搜索景点">
                    <Select v-model="localSelelctCity" slot="prepend" style="width: 80px" @on-change="changeCity">
                        <Option :value="v.city" :key="v.city" v-for="(v,index) in cityList">{{v.city}}</Option>
                        <!-- <Option value="month">Month</Option> -->
                    </Select>
                    <Button slot="append" icon="ios-search" @click="searchH"></Button>
                </Input>
                <!-- <Select v-model="model11" filterable>
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select> -->
                  <Scroll :on-reach-bottom="handleReachBottom" :height="bodyHeight" class="local" ref="right_card">
                    <Card dis-hover v-for="(item, index) in list2" :key="index" style="margin: 12px 0;" @click.native="checkTraffic(item,index,$event)" :name="item.id">
                         <img :src="item.image" width="38" height="38" >
                         <div style="float:left;position: absolute;left:60px;bottom:40%;" >{{item.name}} </div>
                        <div class="minus-icon" ><Icon type="checkmark" style="position:relative;bottom:1px;color:#eee;"></Icon></div>
                    </Card>
                  </Scroll>
                </TabPane>
                <TabPane label="酒店" icon='ios-wineglass'>
                  <Input v-model="searchHotel" placeholder="搜索酒店">
                      <Select v-model="hotelSelectCity" slot="prepend" style="width: 80px" @on-change="hotelchangeCity">
                          <Option :value="v.city" :key="v.city" v-for="(v,index) in cityList">{{v.city}}</Option>
                          <!-- <Option value="month">Month</Option> -->
                      </Select>
                      <Button slot="append" icon="ios-search" @click="searchH"></Button>
                  </Input>
                  <Scroll :on-reach-bottom="handleReachBottom" :height="bodyHeight" class="hotel" ref="right_card">
                    <Card dis-hover v-for="(item, index) in list2" :key="index" style="margin: 12px 0;" @click.native="checkTraffic(item,index,$event)" :name="item.id">
                         <img :src="item.image" width="38" height="38" >
                         <div style="float:left;position: absolute;left:60px;bottom:40%;" >{{item.name}} </div>
                        <div class="minus-icon" ><Icon type="checkmark" style="position:relative;bottom:1px;color:#eee;"></Icon></div>
                    </Card>
                  </Scroll>
                </TabPane>
                <TabPane label="交通" icon='plane'>
                  <Input v-model="searchTraffic" placeholder="搜索交通">
                      <Select v-model="trafficSelectCity" slot="prepend" style="width: 80px" @on-change="trafficChangeCity">
                          <Option :value="v.city" :key="v.city" v-for="(v,index) in cityList">{{v.city}}</Option>
                          <!-- <Option value="month">Month</Option> -->
                      </Select>
                      <Button slot="append" icon="ios-search" @click="searchH"></Button>
                  </Input>
                  <Scroll :on-reach-bottom="handleReachBottom" :height="bodyHeight" class="traffic" ref="right_card">
                    <Card dis-hover v-for="(item, index) in list2" :key="index" style="margin: 12px 0;" @click.native="checkTraffic(item,index,$event)" :name="item.id">
                         <img :src="item.image" width="38" height="38" >
                         <div style="float:left;position: absolute;left:60px;bottom:40%;" >{{item.name}} </div>
                        <div class="minus-icon" ><Icon type="checkmark" style="position:relative;bottom:1px;color:#eee;"></Icon></div>
                    </Card>
                  </Scroll>
                </TabPane>
                <!-- <Icon type="ios-wineglass"></Icon> -->
              </Tabs>


            </Col>

            <Col span ='10'>
              <!-- <el-amap vid="amapDemo":center="center" :zoom="zoom">
                <el-amap-marker v-for="marker in markers" :position="marker.position" :events="marker.events"></el-amap-marker>
                 <el-amap-info-window v-for="window in windows" :position="window.position" :content="window.content" :visible="window.visible" ></el-amap-info-window>
              </el-amap> -->
              <div class="map-container">
                <gmap-map :center="center" :zoom="zoom" style="width:700px;height:800px;" ref="gmap" @zoom_changed="zoomC">
                  <gmap-marker :position="center" @click="openInfo" ref="mark">
                  </gmap-marker>
                  <gmap-info-window :position="infoCenter"  :opened="opened" :zIndex="99" @closeclick="closeInfo" ref="infowindow">
                   {{ description }}
                  </gmap-info-window>
                </gmap-map>
              </div>
            </Col>
        </Row>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";

let menu;
let id;

export default {
  name: "travel",
  data() {
    return {
      markers: [],
      opened: false,
      place: null,
      windows: [],
      zoom: 10,
      description: "",
      center: { lat: 1.38, lng: 103.8 },
      // [121.5273285, 31.21515044],
      model11: "",
      list1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      list2: [],
      cityList: [],
      dayIndex: window.localStorage.tripDayIndex
        ? window.localStorage.tripDayIndex
        : 0,
      itemList: [],
      tabs: [
        { label: "景点", icon: "location" },
        { label: "酒店", icon: "ios-wineglass" },
        { label: "交通", icon: "plane" }
      ],
      searchHotel: "",
      searchLocal: "",
      searchTraffic: "",
      trafficSelectCity: "",
      localSelelctCity: "",
      hotelSelectCity: "",
      inputCity: "",
      spanLeft: 5,
      spanRight: 19,
      detailTravel: [],
      checkedLeft: [],
      left: false,
      bodyHeight: "",
      // itemIndex: 1,
      tripId: ""
    };
  },
  description: "Autocomplete Example (#164)",
  created() {
    let vm = this;
    this.$store.commit("TRAVELID", id);
    let height = document.body.clientHeight;
    vm.bodyHeight = height - 293;

    this.$store.dispatch("getListdataAsync", menu).then(function(result) {
      console.log(result);
      console.log(vm.dayIndex);

      vm.tripId = result.trip.id;
      vm.detailTravel = result.dayList;
      vm.cityList = vm.detailTravel[Number(vm.dayIndex) - 1].cityList;
      vm.itemList = vm.detailTravel[Number(vm.dayIndex) - 1].itemList;
    });
  },
  mounted() {
    console.log(this.$refs);
    let infoWindow = this.$refs.infowindow;
    let mark = this.$refs.mark;
    let map = this.$refs.gmap;
    // infoWindow.position = mark.position;
    // map.addListener('zoom_changed',function(val){
    //   console.log(val)
    // })
  },
  computed: {
    iconSize() {
      return this.spanLeft === 5 ? 14 : 24;
    },
    infoCenter() {
      let center = {
        lat:
          this.center.lat +
          Math.pow(10, 10 - this.zoom - 2) * 4 / Math.pow(5.06, 10 - this.zoom),
        lng: this.center.lng
      };
      return center;
    }
    // left(){
    //   return this.checkedLeft.length > 0;
    // }
  },
  watch: {
    checkedLeft(val) {
      console.log(val.length > 0);
      if (val.length > 0) {
        this.left = true;
      } else {
        // debugger;
        this.left = false;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    console.log(to);
    console.log(to.params.id);
    id = to.params.id;
    menu = to.name;
    next();
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to);
    next();
  },
  methods: {
    clickTab(val) {
      console.log(val);
      switch (val) {
        case 0:
          this.list2 = [];
          this.hotelSelectCity = "";
          break;
        case 1:
          this.list2 = [];
          this.localSelelctCity = "";
          break;
        case 2:
          this.list2 = [];
          this.trafficSelectCity = "";
        default:
          break;
      }
    },
    trafficChangeCity(val) {
      let vm = this;
      if (val === "") {
        vm.list2 = [];
        return;
      }
      this.trafficSelectCity = val;
      this.localSelelctCity = "";
      this.hotelSelectCity = "";
      this.$store
        .dispatch({
          type: "searchTripDetail",
          methods: "traffic",
          params: {
            city: val
          }
        })
        .then(result => {
          console.log(result);
          const list1 = [];
          const list2 = [];
          let indexArr;
          if (result && result.request === "failure") {
            vm.$Notice.open({
              title: "请求反馈",
              desc: "添加失败, " + result.msg,
              duration: 3,
              top: 50
            });
          } else {
            for (let i = 0; i < vm.itemList.length; i++) {
              if (vm.itemList[i].itemType == 300) {
                list1.push(vm.itemList[i].itemId);
              }
            }
            for (let j = 0; j < result.list.length; j++) {
              list2.push(result.list[j].id);
            }
            indexArr = vm.correlation(list1, list2);

            vm.list2 = result.list;
          }

          // console.log(content);
          vm.$nextTick(() => {
            let content = document.querySelectorAll(
              ".traffic .ivu-scroll-content .ivu-card-body"
            );
            vm.renderScrollRight(content, indexArr);
            // console.log(content);
          });
        });
    },
    hotelchangeCity(val) {
      let vm = this;
      if (val === "") {
        vm.list2 = [];
        return;
      }
      this.hotelSelectCity = val;
      this.localSelelctCity = "";
      this.trafficSelectCity = "";
      this.$store
        .dispatch({
          type: "searchTripDetail",
          methods: "hotel",
          params: {
            city: val
          }
        })
        .then(result => {
          console.log(result);

          const list1 = [];
          const list2 = [];
          let indexArr;
          if (result && result.request === "failure") {
            vm.$Notice.open({
              title: "请求反馈",
              desc: "添加失败, " + result.msg,
              duration: 3,
              top: 50
            });
          } else {
            for (let i = 0; i < vm.itemList.length; i++) {
              if (vm.itemList[i].itemType == 200) {
                list1.push(vm.itemList[i].itemId);
              }
            }
            for (let j = 0; j < result.list.length; j++) {
              list2.push(result.list[j].id);
            }
            indexArr = vm.correlation(list1, list2);

            vm.list2 = result.list;
          }

          // console.log(content);
          vm.$nextTick(() => {
            let content = document.querySelectorAll(
              ".hotel .ivu-scroll-content .ivu-card-body"
            );
            vm.renderScrollRight(content, indexArr);
            // console.log(content);
          });
        });
    },
    closeInfo() {
      this.opened = false;
    },
    zoomC(val) {
      console.log(val);
      this.zoom = val;
    },
    openInfo() {
      console.log(this);
      // let infoWindow = this.$refs.infowindow;
      // let mark = this.$refs.mark;
      let map = this.$refs.gmap;
      let vm = this;
      let center = vm.center;
      this.$nextTick(() => {
        vm.zoom = 10;
        // vm.center = center;
      });
      // // const zoom = map.getZoom();
      // // console.log(zoom);
      // // infoWindow.position = mark.position;
      // infoWindow.openInfoWindow(map,mark);
      this.opened = !this.opened;
    },
    changeCity(val) {
      let vm = this;
      if (val === "") {
        vm.list2 = [];
        return;
      }
      this.localSelelctCity = val;
      this.hotelSelectCity = "";
      this.trafficSelectCity = "";
      this.$store
        .dispatch({
          type: "searchTripDetail",
          methods: "local",
          params: {
            city: val
          }
        })
        .then(result => {
          console.log(result);

          const list1 = [];
          const list2 = [];
          let indexArr;
          if (result && result.request === "failure") {
            vm.$Notice.open({
              title: "请求反馈",
              desc: "添加失败, " + result.msg,
              duration: 3,
              top: 50
            });
          } else {
            for (let i = 0; i < vm.itemList.length; i++) {
              if (vm.itemList[i].itemType == 100) {
                list1.push(vm.itemList[i].itemId);
              }
            }
            for (let j = 0; j < result.list.length; j++) {
              list2.push(result.list[j].id);
            }
            indexArr = vm.correlation(list1, list2);

            vm.list2 = result.list;
          }

          // console.log(content);
          vm.$nextTick(() => {
            let content = document.querySelectorAll(
              ".local .ivu-scroll-content .ivu-card-body"
            );
            vm.renderScrollRight(content, indexArr);
            // console.log(content);
          });
        });
      // 选择城市
      console.log(val);
    },
    // 重新渲染右侧 酒店，景点， 交通
    renderScrollRight(nodeList, arr) {
      console.log(nodeList, arr);
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < nodeList.length; j++) {
          console.log(nodeList[j].parentElement.attributes.name.value);
          if (nodeList[j].parentElement.attributes.name.value == arr[i]) {
            console.log(nodeList[j]);
            nodeList[j].style.outline = "skyblue outset thin";
            nodeList[j].lastChild.style.background = "#57a3f3";
          }
        }
      }
    },
    //搜索本城市同名酒店
    searchH() {},
    //关联 行程已经选中的景点，酒店，交通
    correlation(list1, list2) {
      console.log(list1, list2);
      let intersection = list2.filter(v => list1.includes(v));
      console.log(intersection);
      return intersection;
    },
    openModel() {
      let vm = this;
      this.$Modal.confirm({
        onOk: () => {
          const addCity = this.inputCity;
          this.cityList.push({
            city: addCity
          });
          // this.detailTravel[Number(dayIndex)-1].cityList.push({
          //   city:addCity
          // })
          vm.$store
            .dispatch({
              type: "addTripDetail",
              params: {
                tripId: vm.tripId,
                dayIndex: vm.dayIndex,
                city: addCity
              },
              methods: "city"
            })
            .then(result => {
              if (result && result.request === "failure") {
                vm.$Notice.open({
                  title: "请求反馈",
                  desc: "添加失败, " + result.msg,
                  duration: 3,
                  top: 50
                });
              }
            });
        },
        render: h => {
          return h("Input", {
            props: {
              value: "",
              autofocus: true,
              placeholder: "请输入城市..."
            },
            on: {
              input: val => {
                this.inputCity = val;
              }
            }
          });
        }
      });
    },
    confirmCity() {
      console.log(this.inputCity);
    },
    removeCity(index) {
      let vm = this;
      console.log(index);
      let city = this.cityList[index].city;
      this.$store
        .dispatch({
          type: "delTripDetail",
          params: {
            tripId: vm.tripId,
            dayIndex: vm.dayIndex,
            city: city
          },
          methods: "city"
        })
        .then(result => {
          if (result && result.request === "failure") {
            vm.$Notice.open({
              title: "请求反馈",
              desc: "删除失败, " + result.msg,
              duration: 3,
              top: 50
            });
          }
        });

      this.cityList.splice(index, 1);
    },
    toggleShow(index) {
      let list = document.querySelectorAll(".custom-cityList");
      console.log(list);
      let targetSpan = list[index].children[0];
      const sup = targetSpan.children[0];
      if (sup.style.visibility === "hidden") {
        sup.style.visibility = "visible";
      } else {
        sup.style.visibility = "hidden";
      }
    },
    addItem(item) {
      console.log(item);
      console.log(this.tripId);
      console.log(this.dayIndex);
      debugger;
      let vm = this;
      // return;
      if (this.localSelelctCity) {
        this.$store
          .dispatch({
            type: "addTripDetail",
            params: {
              tripId: vm.tripId,
              dayIndex: vm.dayIndex,
              localeId: item.id
            },
            methods: "local"
          })
          .then(result => {
            if (result.request && result.request === "failure") {
              this.$Notice.error({
                title: "添加失败",
                desc: result.msg
              });
            } else {
              vm.itemList.push(result);
            }
          });
      } else if (this.hotelSelectCity) {
        this.$store
          .dispatch({
            type: "addTripDetail",
            params: {
              tripId: vm.tripId,
              dayIndex: vm.dayIndex,
              hotelId: item.id
            },
            methods: "hotel"
          })
          .then(result => {
            if (result.request && result.request === "failure") {
              this.$Notice.error({
                title: "添加失败",
                desc: result.msg
              });
            } else {
              vm.itemList.push(result);
            }
          });
      } else if (this.trafficSelectCity) {
        this.$store
          .dispatch({
            type: "addTripDetail",
            params: {
              tripId: vm.tripId,
              dayIndex: vm.dayIndex,
              trafficId: item.id
            },
            methods: "traffic"
          })
          .then(result => {
            if (result.request && result.request === "failure") {
              this.$Notice.error({
                title: "添加失败",
                desc: result.msg
              });
            } else {
              vm.itemList.push(result);
            }
          });
      }

      // this.itemList.push(item);
    },
    removeItem(index) {
      let vm = this;
      let item = this.itemList[index];
      const itemType = item.itemType;
      console.log(item);
      let methods = "";
      switch (itemType) {
        case 100:
          methods = "local";
          this.$store
            .dispatch({
              type: "delTripDetail",
              params: {
                tripId: vm.tripId,
                dayIndex: vm.dayIndex,
                localeId: item.itemId ? item.itemId : item.id
              },
              methods: methods
            })
            .then(result => {
              if (result && result.request === "failure") {
                vm.$Notice.open({
                  title: "请求反馈",
                  desc: "删除失败, " + result.msg,
                  duration: 3,
                  top: 50
                });
              }
            });
          break;
        case 200:
          methods = "hotel";
          this.$store
            .dispatch({
              type: "delTripDetail",
              params: {
                tripId: vm.tripId,
                dayIndex: vm.dayIndex,
                hotelId: item.itemId ? item.itemId : item.id
              },
              methods: methods
            })
            .then(result => {
              if (result && result.request === "failure") {
                vm.$Notice.open({
                  title: "请求反馈",
                  desc: "删除失败, " + result.msg,
                  duration: 3,
                  top: 50
                });
              }
            });
          break;
        case 300:
          methods = "traffic";
          this.$store
            .dispatch({
              type: "delTripDetail",
              params: {
                tripId: vm.tripId,
                dayIndex: vm.dayIndex,
                trafficId: item.itemId ? item.itemId : item.id
              },
              methods: methods
            })
            .then(result => {
              if (result && result.request === "failure") {
                vm.$Notice.open({
                  title: "请求反馈",
                  desc: "删除失败, " + result.msg,
                  duration: 3,
                  top: 50
                });
              }
            });
          break;
        default:
          break;
      }
      // return ;

      this.resetRight(item);
      this.itemList.splice(index, 1);
    },
    resetRight(item) {
      let indexArr = [];
      debugger;
      for (let i = 0; i < this.list2.length; i++) {
        indexArr.push(this.list2[i].id);
      }
      var index = indexArr.findIndex(function(value, ind, arr) {
        if (item.itemId) {
          return value === item.itemId;
        } else {
          return value === item.id;
        }
      });

      if (index >= 0) {
        let type = "";
        switch (item.itemType) {
          case 100:
            type = "local";
            break;
          case 200:
            type = "hotel";
            break;
          case 300:
            type = "traffic";
            break;
          default:
            break;
        }
        let hotelList = document.querySelectorAll(
          "." + type + " .ivu-scroll-content .ivu-card"
        );

        console.log(hotelList[index]);
        let target = hotelList[index].children[0];
        let outline = target.style.outline;
        if (outline) {
          target.style.outline = "";
          console.log(target.children[0]);
          target.children[2].style.background = "#b3acac";
          // target.children[0].children[2].style.background = 'inherit';
        }
      }
    },
    checkTraffic(item, index, e) {
      console.log(item);
      let center;
      if (typeof item.latitude !== "number") {
        this.$Notice.warning({
          title: "信息错误",
          desc: item.name + "没有上传地址信息"
        });
      } else {
        this.description = item.description;
        center = {
          lat: item.latitude,
          lng: item.longitude
        };
        this.center = center;
      }
      // center.push(item.longitude);
      // center.push(item.latitude);

      console.log(index);
      console.log(e);
      let target = e.target.children[2]
        ? e.target
        : e.target.nextSibling
          ? e.target.parentElement
          : e.target.parentElement.parentElement;
      let children = e.target.children[2]
        ? e.target.lastChild
        : e.target.nextSibling
          ? e.target.parentElement.lastChild
          : e.target.parentElement;
      // console.log(e.target.lastChild)
      // console.log(e.target.nextSibling)
      // console.log(children);
      // console.log(target);
      let outline = target.style.outline;
      if (outline) {
        return;
        target.style.outline = "";
      } else {
        target.style.outline = "skyblue outset thin";
        children.style.background = "#57a3f3";
      }
      // this.list1.splice(index,1);
      this.addItem(item);
      // this.checkedLeft.push(index);
    },
    handleReachBottom() {
      return new Promise(resolve => {
        setTimeout(() => {
          const last = this.list1[this.list1.length - 1];
          for (let i = 1; i < 11; i++) {
            this.list1.push(last + i);
          }
          resolve();
        }, 2000);
      });
    },
    changeDay(val) {
      this.dayIndex = val;
      let vm = this;
      window.localStorage.tripDayIndex = val;
      this.$set(vm, "itemList", vm.detailTravel[Number(val) - 1].itemList);
      this.$set(vm, "cityList", vm.detailTravel[Number(val) - 1].cityList);
      // vm.itemList = vm.detailTravel[Number(val) - 1].itemList;
      // vm.cityList = vm.detailTravel[Number(val) - 1].cityList;
      console.log(val);
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    setDescription(description) {
      this.description = description;
    },
    setPlace(place) {
      this.place = place;
    },
    usePlace(place) {
      if (this.place) {
        this.markers.push({
          position: {
            lat: this.place.geometry.location.lat(),
            lng: this.place.geometry.location.lng()
          }
        });
        this.place = null;
      }
    }
  }
};
</script>
