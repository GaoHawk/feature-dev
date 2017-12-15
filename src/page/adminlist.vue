<template>
  <div class="admin">
    <div class="layout-header" v-for="(item,key) in searchArrBtn" style="width:172px;margin-right:5px;">
      <span style="display:inline-block;position:relative;">{{item.label}}</span>
      <Input v-model="searchArrBtn[key].value" :style="[item.label.length == 4?{width:'70%'}:item.label.length==3?{width:'77%'}:{width:'84%'}]" :placeholder="'请输入' + item.label ">
      </Input>
    </div>
    <div class="action">
      <Button type="primary" icon="ios-search" @click="search()">查询</Button>
      <Button type="primary" @click="showAll" class="showAll">全部</Button>
    </div>
    <adminn ref="list" :columns="tableColumns"></adminn>
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
</style>

<script>
import list from "../components/userList";

import { mapState, mapActions, mapGetters } from "vuex";

import mixin from "../mixins/listMix";

export default {
  name: "admin",
  created() {
    let tableData = this.axiosData;
    let data1 = this.$store.getters.getAjaxTableData;
    console.log(tableData);
    console.log(data1);
    this.tableColumns = this.buildActions();
  },
  data() {
    return {
      searchArrBtn: {},
      tableColumns: []
    };
  },
  mixins: [mixin],
  computed: {
    // ...mapGetters(["setTableColumns", "getPageInfo", "getAjaxTableData"]),
    ...mapState({
      menuId: "menuId",
      tableName: "tableName",
      tableready: "tableready",
      axiosData: "axiosData"
    })
  },
  components: {
    adminn: list
  },
  methods: {
    buildActions(tableColumns) {
      let vm = this;
      // let tableData = vm.$store.getters.getAjaxTableData;
      // if (!(tableData && tableData.length > 0)) {
      //   return;
      // }
      let columns = [];
      columns.push(
        {
          title: "ID",
          key: "id"
        },
        {
          title: "账号",
          key: "username"
        },
        {
          title: "昵称",
          key: "nickname"
        },
        {
          title: "手机",
          key: "mobile"
        },
        {
          title: "头像",
          key: "avatar",
          render: (h, params) => {
            const row = params.row;
            const imgSrc = row.avatar ? row.avatar : "";
            return h("img", {
              attrs: {
                src: imgSrc
              },
              style: {
                maxWidth: "48px",
                maxHeight: "48px"
              }
            });
          }
        },

        {
          title: "生日",
          key: "birthday"
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "性别",
          key: "gender",
          render: (h, params) => {
            const row = params.row;
            const text = row.gender === 1 ? "男" : row.gender === 2 ? "女" : "";
            return h("div", text);
          }
        },
        {
          title: "注册时间",
          key: "createTime",
          render: (h, params) => {
            if (params === undefined) {
              return "";
            } else {
              console.log(params.index);
              return h("div", this.formatDate(new Date(params.row.createTime)));
            }
          }
        },

        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            const row = params.row;
            const color = row.status === 1 ? "green" : "red";
            const text = row.status === 1 ? "已启用" : "禁用";

            return h(
              "Tag",
              {
                props: {
                  type: "dot",
                  color: color
                }
              },
              text
            );
          }
        }
      );

      columns.push({
        title: "操作",
        key: "action",
        width: 180,
        align: "center",
        render: (h, params) => {
          // debugger

          return h("div", [
            h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    vm.$refs.list.show(params.index);
                  }
                }
              },
              "详情"
            ),
            h(
              "Button",
              {
                props: {
                  type: "ghost",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    vm.$refs.list.modify(params.index);
                  }
                }
              },
              "修改"
            )
          ]);
        }
      });

      return columns;
    }
  }
};
</script>
