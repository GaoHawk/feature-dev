<template>
  <div id="app" :class="{loginBg:unLogIn}">
        <Row type="flex" :class="{'layout-hide-text': spanLeft < 5}" v-if="!unLogIn">
            <Col  class="layout-menu-left" style="width:200px;overflow:auto;">
                <Menu :active-name="activeName" :open-names="open" theme="dark" width="auto"  accordion ref="left_side"
                @on-select="click" v-if="menu.length>0" >
                    <div class="layout-logo-left">鲸选旅行管理后台</div>
                    <Submenu v-for="(item,index) in menu" :name="item.title" >
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>

                            <span class="layout-text">{{item.title}}</span>
                        </template>
                        <MenuItem :name="item.title+'-'+child.title" v-if="item.children" v-for="(child,childInd) in item.children" >{{child.title}}</MenuItem>
                    </Submenu>
                </Menu>
            </Col>
            <Col  style="left:200px;overflow:auto;z-index:1;width:calc(100% - 200px);">
                <div class="layout-header">
                    <!-- <Button type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button> -->
                  <div class="layout-breadcrumb" >
                      <Breadcrumb>
                          <BreadcrumbItem href="/">首页</BreadcrumbItem>
                          <BreadcrumbItem  v-if="pagemodule && pageName" style="color:rgb(177, 177, 177)">{{pagemodule}}</BreadcrumbItem>
                          <BreadcrumbItem v-if="pageName">{{pageName}}</BreadcrumbItem>
                      </Breadcrumb>
                  </div>
                  <div class="layout-nav">
                      <!-- <MenuItem name="1" class="custom-icon">
                          <Icon type="ios-navigate"></Icon>
                      </MenuItem>
                      <MenuItem name="2" class="custom-icon">
                          <Icon type="ios-keypad"></Icon>
                      </MenuItem>
                      <MenuItem name="3" class="custom-icon">
                          <Icon type="ios-analytics"></Icon>
                      </MenuItem>
                      <MenuItem name="4" class="custom-icon">
                          <Icon type="ios-paper"></Icon>
                      </MenuItem> -->
                                        <!-- 登陆用户名 -->
                    <Dropdown  style="margin-left: 20px" @on-click="userAction">
                        <a href="javascript:void(0)">
                            {{userName}}
                            <Icon type="arrow-down-b"></Icon>
                        </a>
                        <DropdownMenu slot="list" >
                            <DropdownItem name="userCenter">个人中心</DropdownItem>
                            <DropdownItem divided name="logout">退出登陆</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div class="avatar right">
                      <Avatar  src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                  </div>

                </div>

                <!-- <div style="clear:both;"></div> -->
                <div class="layout-content">
                    <div class="layout-content-main">
                       <router-view/>
                    </div>
                </div>
                <!-- <div class="layout-copy">
                    2011-2016 &copy; TalkingData
                </div> -->
            </Col>
        </Row>
        <div v-else>
             <router-view />
        </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { LOGOUT } from "./serverApi";
import Bus from "./eventBus";
let menu = ["概况", "系统", "用户", "资源", "订单", "分销"];
export default {
  name: "app",
  beforeCreate() {},
  mounted() {
    //  vm.activeName = '2-1'
  },
  created() {
    let vm = this;
    console.log(vm.unLogIn);
    Bus.$on("getMenu", target => {
      console.log(target);

      this.$store.dispatch("getListdataAsync", "menu").then(function(result) {
        console.log(vm.menu);
        vm.menu = vm.$store.getters.ajaxDataSetMenuTree;
      });

    });

      if (!vm.unLogIn) {
        this.$store.dispatch("getListdataAsync", "menu").then(function(result) {
          vm.menu = vm.$store.getters.ajaxDataSetMenuTree;
          console.log(vm.menu);
          vm.activeName = window.localStorage.activeName
            ? window.localStorage.activeName
            : "";
          if (window.localStorage.open) {
            vm.open.push(window.localStorage.open);
          }

          vm.$nextTick(() => {
            vm.$refs.left_side.updateOpened();
            vm.$refs.left_side.updateActiveName();
          });
          vm.handleSelect(vm.activeName);
        });
      }


    let height = document.body.clientHeight;
    console.log(height);
  },
  computed: {
    ...mapGetters({
      unLogIn: "unLogIn"
      // menu: "ajaxDataSetMenuTree"
      // menuCount: "menuCount",
      // currentMenuItme: "currentMenuItme",
      // getPageInfo: "getPageInfo",
      // getMenuTreeData: "getMenuTreeData",
      // ajaxDataSetMenuTree: "ajaxDataSetMenuTree"
    }),
    ...mapState({
      user: state => state.user,
      page: state => state.page
    }),
    userName: function() {
      return this.user;
    },
    pagemodule: function() {
      let module = this.page.path.split("/")[1];
      //  console.log(module);
      if (module) {
        switch (module) {
          case "user":
            return "用户";
            break;
          case "system":
            return "系统";
            break;
          case "source":
            return "资源";
            break;
          case "order":
            return "订单";
            break;
        }
      }
    },
    pageName: function() {
      if (!(this.page.path == "/")) {
        switch (this.page.params.list) {
          case "userlist":
            return "用户列表";
            break;
          case "systemlist":
            return "后台管理";
            break;
          case "sourcelist":
            return "资源管理";
            break;
        }
        // return this.page.name;
      } else {
        this.activeName = "";
      }
    }
  },
  filters: {
    menuItem: function(value) {
      console.log(value);
      return value;
    }
  },
  data() {
    return {
      spanLeft: 5,
      spanRight: 19,
      activeName: "",
      open: [],
      menu: ""
      // page:'',
      // pagemodule:''
    };
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    console.log(to);
  },
  methods: {
    click(val) {
      console.log(val);
      let route = "";
      this.activeName = val;
      window.localStorage.activeName = val;
      let selectMenu = val.split('-')[1];
      window.localStorage.open = val.split('-')[0];
      if (selectMenu == "后台管理员") {
        route = "/console/admin/list";

        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu == "后台角色") {
        route = "/console/role/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu == "后台菜单") {
        route = "/console/menu/tree";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu == "资源权限") {
        route = "/console/resource/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu == "城市管理") {
        route = "/console/city/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu == "酒店管理") {
        route = "/console/hotel/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu == "地点管理") {
        route = "/console/local/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu == "交通管理") {
        route = "/console/traffic/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu == "行程管理") {
        route = "/console/trip/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu == "全部订单") {
        route = "/console/order/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu == "加星订单") {
        route = "/console/orderWithStars/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu == "维权订单") {
        route = "/console/orderWithRefund/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu === "销售员管理") {
        route = "/console/seller/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu === "收入管理") {
        route = "/console/income/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu === "提现管理") {
        route = "/console/withdraw/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu === "合伙人关系") {
        route = "/console/partner/list";
        this.$store.commit("ROUT_PATH", route);
      } else if (selectMenu === "分销通知管理") {
        route = "/console/saleNotification/list";
        this.$store.commit("ROUT_PATH", route);
      }
      // else if (val == "5-1") {
      //   route = "/order/alllist";
      //   this.$store.commit("ROUT_PATH", route);
      // }
    },
    userAction(name) {
      console.log(name);
      let vm = this;
      let cookies = localStorage.cookies || "";
      if (name === "logout") {
        this.$http({
          method: "post",
          headers: { Authorization: "Bearer " + cookies },
          url: LOGOUT
        })
          .then(response => {
            console.log(response);
            vm.$store.commit("ROUT_PATH", "/");
            // localStorage.cookies = response.data.data.token;
            // let dateString = new Date().getTime();
            // localStorage.dateString = dateString;
            // // console.log(response.data.message)
            // if (response.data.message == "成功") {
            //   vm.$store.commit("LOGIN", this.formInline.user);
            //   vm.$store.commit("ROUT_PATH", "/hello");
            //   console.log(vm.$store);
            //   this.$Message.success("Success!");
            // }
          })
          .then(response => {})
          .catch(function(err) {
            console.log("catch", err);
          });
      }
    },
    handleSelect(name) {
      console.log(name);
    },
    toggleClick() {
      if (this.spanLeft === 5) {
        this.spanLeft = 2;
        this.spanRight = 22;
      } else {
        this.spanLeft = 5;
        this.spanRight = 19;
      }
    }
  }
};
</script>

<style scoped>
#app {
  height: 100%;
  width: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
#app.loginBg {
  background-image: url(http://owgjwzser.bkt.clouddn.com/5a274660659e9541116ad320.jpeg);
  background-size: cover;
  background-position: 50%;
}
/* 头像右边浮动 */
.right {
  padding: 9px 15px 0;
  float: right;
}
.right::after {
  content: "";
  clear: both;
}
.layout-hide-text .layout-text {
  display: none;
}
.layout-nav li.custom-icon {
  display: inline;
}
.layout-breadcrumb {
  padding: 10px 15px 0;
  display: inline-block;
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
.layout-nav {
  display: inline-block;
  position: absolute;
  top: 17px;
  right: 56px;
}
.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}
.layout-menu-left {
  background: #464c5b;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 21;
  transition: width 0.3s;
}
.custom-nav {
  width: 200px;
  overflow: auto;
}
.layout-header {
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  color:#eee;
  text-align: center;
  line-height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.ivu-col {
  transition: width 0.2s ease-in-out;
}
</style>
