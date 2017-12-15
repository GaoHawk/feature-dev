<template>
   <Row style="height:500px;">
     <Col span='6'>
       <Tree :data="data1" class="systemMenu" @on-select-change="currentNode"></Tree>
     </Col>
     <Col span='18' >
       <div class='label'>父菜单ID  <span>{{Info.parentId}}</span></div>
       <div class="lable">父菜单名称  <span>{{Info.parentName}}</span></div>
       <div class="lable">菜单ID  <span>{{Info.id}}</span></div>
       <div class="lable">菜单名称  <span>{{Info.name}}</span></div>
       <div class="lable">图标  <span>{{Info.icon}}</span></div>
       <div class="lable">链接地址  <span>{{Info.url}}</span></div>
       <div class="lable">排序号  <span>{{Info.orderNum}}</span></div>
       <div class="lable" style="display:inline-block;">资源列表
          <span style="display:inline-block;">
            <ul class="custom-li">
              <li v-for="n in Info.resourceList" >
                {{n}}
              </li>
            </ul>
            <div style="clear:both;"></div>
          </span>
      </div>
     </Col>
      <div class="action-btn">
        <Button @click="openModal">添加</Button>
        <Button @click="removeNode">删除</Button>
        <Button @click="modify">修改</Button>
        <Button @click="addResource">关联资源</Button>
        <Button @click="checkResource">查看资源</Button>
      </div>
    <!-- 删除确认拟态 -->
    <Modal v-model="modal2" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>删除确认</span>
        </p>
        <div style="text-align:center">
            <p>删除此节点，此节点的子孙节点也会一并删除！</p>
            <p>是否继续删除？</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long :loading="modal_loading" @click="del">删除</Button>
        </div>
    </Modal>
    <Modal
      v-model="modal1"
      :title="title"
      @on-cancel="cancel('formItem')"
    >
      <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleItem">
        <FormItem label="父菜单" prop="parentMenu">
            <Select v-model="formItem.select">
               <Option v-for="item in options" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
        </FormItem>
         <FormItem label="名称" prop='name'>
           <Input v-model="formItem.name" placeholder="请输入菜单名称..."></Input>
         </FormItem>
        <FormItem label="图标" prop="icon">
           <Input v-model="formItem.icon" placeholder="请输入图标地址..."></Input>
         </FormItem>
        <FormItem label="排序" prop="order">
          <InputNumber :min="1" v-model="formItem.orderNum" style="width:100%;"></InputNumber>
        </FormItem>
        <FormItem label="URL" prop="url">
           <Input v-model="formItem.url" placeholder="请输入配置路由地址..."></Input>
         </FormItem>
      </Form>
      <div slot="footer">
          <Button @click="cancel('formItem')">取消</Button>
          <Button type="ghost" @click="handleReset('formItem')" style="margin-left: 8px">重置</Button>
          <Button type="primary" @click="handleSubmit('formItem')" :loading="modal_loading">提交</Button>

        </FormItem>
      </div>
    </Modal>
   </Row>


</template>
<style scoped>
.action-btn {
  position: fixed;
  top: 500px;
  left: 38%;
  right: auto;
}
.custom-li {
  float: left;
  position: absolute;
  /* bottom:-38%; */
  top: 88%;
  left: 60px;
}
.custom-li::after {
  content: "";
  clear: both;
}
.systemMenu {
  /* width: 200px; */
}
</style>

<script>
import { mapState, mapGetters } from "vuex";
let menu = "";
export default {
  data() {
    return {
      modal_loading: false,
      modal2: false,
      current: {},
      parent: {},
      Info: {},
      title: "",
      formItem: {
        name: "",
        select: "",
        orderNum: 1,
        icon: "",
        url: ""
      },
      ruleItem: {
        name: [{ required: true, message: "菜单名称是必须的", trigger: "blur" }],
        url: [{ required: true, message: "必须有配置的路由地址", trigger: "blur" }]
      },
      modal1: false
    };
  },
  mounted() {
    // console.log(this.menuCount);
  },
  created() {
    // if (vm.getPageInfo) vm.pageInfo = vm.getPageInfo;
    // if (vm.getAjaxTableData) vm.tableData1 = vm.getAjaxTableData;
    setTimeout(() => {
      console.log(this.options);
      console.log(this.ajaxDataSetMenuTree);
    }, 1000);
  },
  computed: {
    ...mapGetters([
      "currentMenuItme",
      "getPageInfo",
      "getMenuTreeData",
      "ajaxDataSetMenuTree"
    ]),
    ...mapState({
      // options: "options",
      tableName: "tableName",
      tableready: "tableready",
      axiosData: "axiosData"
    }),
    options() {
      let vm = this;
      var res = vm.ajaxDataSetMenuTree;
      console.log(res);
      // if(!res.length) return;
      let arr = [];
      arr.push({ value: 0, label: "无" });
      for (let i = 0; i < res.length; i++) {
        arr.push({
          value: res[i].id,
          label: res[i].title
        });
      }
      return arr;
    },
    data1: function() {
      var obj = {};
      //this.dataBase 从vuex 获取的树结构
      obj = JSON.parse(JSON.stringify(this.ajaxDataSetMenuTree));
      return obj;
    }
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    console.log(to);
    menu = to.params.backend;

    next();
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    let menu = to.params.backend;
    console.log(menu);
    let vm = this;
    // this.$store.dispatch("getListdataAsync", "menu").then(function(result) {
    //   console.log(vm.ajaxDataSetMenuTree);
    //     var res = vm.ajaxDataSetMenuTree;
    //     console.log(res);
    //     // if(!res.length) return;
    //     let arr = [];
    //     arr.push({ value: 0, label: "无" });
    //     for (let i = 0; i < res.length; i++) {
    //       arr.push({
    //         value: res[i].id,
    //         label: res[i].name
    //       });
    //     }
    //     vm.$store.commit('SET_OPTIONS',arr);
    // });
    // vm.tableData1 = "";
    // vm.loading = true;
    // vm.tableColumns1 = '';

    next();
  },
  methods: {
    del() {
      const child = this.current[0];
      const parent = this.parent;
      let index;
      // console.log(child,parent);
      this.modal_loading = true;
      let id = child.id;
      console.log(id);
      let vm = this;
      setTimeout(() => {
        this.$store
          .dispatch({
            type: "delTree",
            id: id
          })
          .then(result => {
            if (result && result.request === "failure") {
              vm.$Notice.open({
                title: "请求反馈",
                desc: "删除失败, " + result.msg,
                duration: 3,
                top: 50
              });
              vm.modal_loading = false;
              vm.modal2 = false;
            } else {
              vm.$store
                .dispatch("getListdataAsync", "menu")
                .then(function(result) {
                  // console.log(vm.menu);
                  // vm.data1 = JSON.parse(JSON.stringify(vm.ajaxDataSetMenuTree));
                  vm.modal_loading = false;
                  vm.modal2 = false;
                });
            }
          });
      }, 1200);

      // setTimeout(() => {
      //   this.modal_loading = false;
      //   this.modal2 = false;
      //   if (parent && parent.children) {
      //     index = parent.children.indexOf(child);
      //     // console.log(index,child,parent)
      //     parent.children.splice(index, 1);
      //   } else if (parent) {
      //     index = parent.indexOf(child);
      //     // console.log(index,child,parent)
      //     parent.splice(index, 1);
      //   }
      //   // 删除一个节点后修改state数据
      //   // this.$store.commit("SET_MENU", this.data1);
      //   console.log(this.$store);
      //   this.$Message.success("Successfully delete");
      // }, 2000);
    },
    openModal() {
      console.log(this);
      this.title = "添加新菜单";
      this.modal1 = true;
    },
    ok(name) {},
    addResource() {
      let rout = "/console/showResource/list";
      let menuId = this.Info.id;
      if (!menuId) {
        this.$Notice.open({
          title: "操作提示",
          desc: "请选择菜单",
          duration: 3,
          top: 50
        });
        return;
      }
      window.localStorage.menuId = menuId;
      this.$store.commit("MENUID", menuId);
      this.$store.commit("ROUT_PATH", rout);
    },
    checkResource() {
      let rout = "/console/listResource/list";
      let menuId = this.Info.id;
      if (!menuId) {
        this.$Notice.open({
          title: "操作提示",
          desc: "请选择菜单",
          duration: 3,
          top: 50
        });
        return;
      }
      window.localStorage.menuId = menuId;
      this.$store.commit("MENUID", menuId);
      this.$store.commit("ROUT_PATH", rout);
    },
    cancel(name) {
      this.$Message.info("点击取消");
      this.$refs[name].resetFields();
      this.modal1 = false;
    },
    isEmptyObject(obj) {
      var t;
      for (t in obj) return !1;
      return !0;
    },
    modify() {
      console.log(this.formItem, this.Info);
      console.log(this.Info.length === undefined);
      this.title = "菜单修改";
      if (this.isEmptyObject(this.Info)) {
        this.modal1 = false;
        return;
      } else {
        this.formItem.icon = this.Info.icon;
        this.formItem.name = this.Info.name;
        this.formItem.orderNum = this.Info.orderNum;
        this.formItem.url = this.Info.url;
        this.formItem.select = this.Info.parentId;
        this.modal1 = true;
      }
    },
    getNode(menu, key) {
      let vm = this;
      menu = menu.children || menu;
      if (menu.length > 0) {
        for (let i = 0; i < menu.length; i++) {
          if (menu[i].id == key) {
            vm.current = menu[i];
            console.log(vm.current );
          } else {
            vm.getNode(menu[i], key);
          }
        }
      }
    },
    handleSubmit(name) {
      this.modal_loading = true;
      let vm = this;
      let id = this.Info.id;
      if (id) {
        this.$store
          .dispatch({
            type: "updateTable",
            params: {
              id: id,
              name: vm.formItem.name,
              icon: vm.formItem.icon,
              url: vm.formItem.url,
              orderNum: vm.formItem.orderNum
            }
          })
          .then(result => {
            if (result && result.request === "failure") {
              vm.$Notice.open({
                title: "请求反馈",
                desc: "更新失败, " + result.msg,
                duration: 3,
                top: 50
              });
              vm.modal_loading = false;
              vm.modal1 = false;
            } else {
              vm.$refs[name].validate(valid => {
                if (valid) {
                  vm.$Message.success("成功!");
                  // vm.appendnode(name);
                  // this.$refs[name].resetFields();
                  vm.$store
                    .dispatch("getListdataAsync", "menu")
                    .then(function(result) {
                      const menu = vm.$store.state.ajaxTree
                      vm.getNode(menu,id);
                      console.log(vm.current);
                      vm.Info = vm.current;
                      vm.modal1 = false;
                    });
                } else {
                  vm.$Message.error("验证失败!");
                }
              });
            }
          });
      } else {
        this.$store
          .dispatch({
            type: "addTable",
            params: {
              parentId: vm.formItem.select,
              name: vm.formItem.name,
              icon: vm.formItem.icon,
              url: vm.formItem.url,
              orderNum: vm.formItem.orderNum
            }
          })
          .then(function(result) {
            if (result && result.request === "failure") {
              vm.$Notice.open({
                title: "请求反馈",
                desc: "添加失败, " + result.msg,
                duration: 3,
                top: 50
              });
              vm.modal_loading = false;
              vm.modal1 = false;
            } else {
              vm.$refs[name].validate(valid => {
                if (valid) {
                  vm.$Message.success("成功!");
                  vm.$store
                    .dispatch("getListdataAsync", "menu")
                    .then(function(result) {
                      vm.modal_loading = false;
                      vm.modal1 = false;
                    });
                  // this.$refs[name].resetFields();
                } else {
                  vm.$Message.error("验证错误");
                }
              });
            }
          });
      }

      // setTimeout(() => {
      //   this.$refs[name].validate(valid => {
      //     if (valid) {
      //       this.$Message.success("Success!");
      //       this.appendnode(name);
      //       // this.$refs[name].resetFields();
      //       this.modal_loading = false;
      //       this.modal1 = false;
      //     } else {
      //       this.$Message.error("Fail!");
      //     }
      //   });
      // }, 2000);
    },
    handleReset(name) {
      console.log("reset");
      this.$refs[name].resetFields();
    },
    appendnode(name) {
      console.log(name);
      debugger;
      let formItem = this.formItem;
      let parentNode;
      let root = this.data1;
      console.log(formItem);
      console.log(typeof formItem.select);
      if (typeof formItem.select === "string") {
        this.$Notice.open({
          title: "操作提示",
          desc: "请选择父节点",
          duration: 3,
          top: 50
        });
        return;
      }

      for (let i = 0; i < root.length; i++) {
        if (root[i].id == formItem.select) {
          parentNode = root[i];
        } else {
          parentNode = root;
        }
      }
      console.log(formItem);
      console.log(parentNode);

      if (!parentNode.length) {
        const children = parentNode.children || [];
        children.push({
          title: formItem.name,
          id: formItem.id
        });
        this.$set(parentNode, "children", children);
      } else {
        parentNode.push({
          title: formItem.name,
          id: formItem.id,
          expand: true,
          children: []
        });
      }
      this.$refs[name].resetFields();
      // 将修改后的菜单添加到state数据中
      // this.$store.commit("SET_MENU", this.data1);
      console.log(this.$store);
    },
    removeNode() {
      const node = this.current;
      const root = this.data1;
      let parent, index;
      // debugger
      let vm = this;
      console.log(typeof root);

      if (node.length > 0) {
        this.factorial();
        parent = this.parent;
        console.log(parent);
      } else {
        this.$Notice.open({
          title: "操作提示",
          desc: "请选择要删除的菜单",
          duration: 3,
          top: 50
        });
        return;
      }
      vm.modal2 = true;

      // if(parent && parent.children){
      //    index = parent.children.indexOf(node);
      //    parent.children.splice(index,1)
      // }else if(parent){
      //    index = parent.indexOf(node);
      //    parent.splice(index,1)
      // }
    },
    // 递归查找父节点
    factorial(a, b) {
      let vm = this;
      const node = b || this.current[0];
      let root = a || this.data1;
      let target;
      if (!root.children && root.length) {
        target = root.find(el => el.id === node.id);
      } else if (root.children) {
        target = root.children.find(el => el.id === node.id);
      }

      if (target) {
        vm.parent = root;
        // return root;
      } else {
        let i = 0;
        if (root.length > 0) {
          for (; i < root.length; i++) {
            vm.factorial(root[i], node);
          }
        } else if (!root.length && root.children && root.children.length > 0) {
          for (; i < root.children.length; i++) {
            vm.factorial(root.children[i], node);
          }
        }
      }
    },
    currentNode(val) {
      console.log(val);
      let id = val[0].id;

      let node = this.currentMenuItme(id);
      console.log(node);
      this.Info = node;
      this.current = val;
    }
  }
};
</script>
