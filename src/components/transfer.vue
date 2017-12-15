<template>
  <div class="transfer" >
        <Row type="flex" style="height:800px">
            <Col span="10" class="layout-menu-left">
              <Tree :data="data1" show-checkbox @on-check-change="currentLeft"></Tree>
            </Col>
            <Col span="3">
              <div :style="styleObj">
                  <Button type="primary" :disabled="left"  @click="addMenu">关联目录</Button>
                  <Button type="primary" :disabled="right" style="margin-top:50px" @click="removeMenu">取消关联</Button>
              </div>
            </Col>
            <Col span="10" offset='1'>
             <Tree :data="data2" show-checkbox @on-check-change="currentRight"></Tree>
            </Col>
        </Row>
    </div>
</template>
<style scoped>

</style>
<script>
import { mapState, mapGetters } from "vuex";

export default {
  created() {
    let vm = this;
    let height = document.body.clientHeight;
    vm.bodyHeight = height - 180;
    console.log(this.roleId);
    console.log(vm.bodyHeight);

    console.log(height - 180);
    vm.styleObj.marginTop = height / 4 + "px";
    let menu = this.page;
    this.$store.dispatch("getListdataAsync", menu).then(function() {
      console.log(vm.$store.getters);
      vm.data1 = vm.$store.getters.ajaxSetRoleMenuTree.left;
      vm.data2 = vm.$store.getters.ajaxSetRoleMenuTree.right;
    });
  },
  computed: {
    ...mapState({
      roleId: "menuId",
      page: "tableName"
    }),
    ...mapGetters([
      // 'ajaxSetRoleMenuTree'
    ])
  },
  name: "transfer",
  data() {
    return {
      left: true,
      leftArr: [],
      rightArr: [],
      right: true,
      bodyHeight: "",
      data2: [],
      data1: [],
      styleObj: {
        marginTop: 100 + "px"
      }
    };
  },
  methods: {
    currentLeft(val) {
      if (val.length > 0) {
        this.left = false;
      } else {
        this.left = true;
      }
      let arr = [];
      for (let k = 0; k < val.length; k++) {
        console.log(val[k]);
        arr.push(val[k].id);
      }
      console.log(arr);
      this.leftArr = arr;
    },
    currentRight(val) {
      if (val.length > 0) {
        this.right = false;
      } else {
        this.right = true;
      }
      let arr = [];
      for (let k = 0; k < val.length; k++) {
        arr.push(val[k].id);
      }
      this.rightArr = arr;
    },
    addMenu() {
      console.log(this.leftArr);
      let params = {
        roleId: this.roleId,
        menuIdList: this.leftArr
      };
      let vm = this;
      let menu = this.page;
      this.$store
        .dispatch({
          type: "roleAddMenu",
          params: params
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
            vm.$store.dispatch("getListdataAsync", menu).then(function() {
              console.log(vm.$store.getters);
              vm.data1 = vm.$store.getters.ajaxSetRoleMenuTree.left;
              vm.data2 = vm.$store.getters.ajaxSetRoleMenuTree.right;
               vm.left = true;
              vm.right = true;
            });
          }
        });
    },
    removeMenu() {
      console.log(this.rightArr);
      let params = {
        roleId: this.roleId,
        menuIdList: this.rightArr
      };
      let menu = this.page;
      let vm = this;
      this.$store
        .dispatch({
          type: "roleRemoveMenu",
          params: params
        })
        .then(result => {
          if (result && result.request === "failure") {
            vm.$Notice.open({
              title: "请求反馈",
              desc: "删除失败, " + result.msg,
              duration: 3,
              top: 50
            });
          } else {
            vm.$store.dispatch("getListdataAsync", menu).then(function() {
              console.log(vm.$store.getters);
              vm.data1 = vm.$store.getters.ajaxSetRoleMenuTree.left;
              vm.data2 = vm.$store.getters.ajaxSetRoleMenuTree.right;
              vm.right = true;
              vm.left = true;
            });
          }
        });
    }
  }
};
</script>
