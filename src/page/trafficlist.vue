<template>
  <div>
    <div class="layout-header" v-for="(item,key) in searchArrBtn" style="width:172px;margin-right:5px;">
      <span style="display:inline-block;position:relative;">{{item.label}}</span>
      <Select  filterable v-if="key === 'type'" :placeholder="'请选择' + item.label" v-model="searchArrBtn[key].value" :style="[item.label.length == 4?{width:'70%'}:item.label.length==3?{width:'77%'}:{width:'84%'}]">
            <Option v-for="itemIn in options" :value="itemIn.value" :key="itemIn.value" >{{ itemIn.label }}</Option>
      </Select>
      <Input v-model="searchArrBtn[key].value" :style="[item.label.length == 4?{width:'70%'}:item.label.length==3?{width:'77%'}:{width:'84%'}]" :placeholder="'请输入' + item.label " v-else>
      </Input>
    </div>
    <div class="action">
      <Button type="primary" icon="ios-search" @click="search()">查询</Button>
      <Button type="primary" @click="showAll" class="showAll">全部</Button>
      <Button type="primary" @click="add" class="add">添加</Button>
    </div>
    <trafficM ref="list"> </trafficM>
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
  name: "role",
  data() {
    return {
      searchArrBtn: {},
      options:[]
    };
  },
  mixins: [mixin],
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
    trafficM: list
  },
  methods: {
    buildActions(tableColumns) {
      let vm = this;
      let tableData = vm.$store.getters.getAjaxTableData;
      if (!(tableData && tableData.length > 0)) {
        return;
      }

      tableColumns.push({
        title: "操作",
        key: "action",
        width: 220,
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
            ),
            h(
              "Button",
              {
                props: {
                  type: "error",
                  size: "small"
                },
                on: {
                  click: () => {
                    vm.$refs.list.remove(params.index);
                  }
                }
              },
              "删除"
            )
          ]);
        }
      });

      return tableColumns;
    }
  }
};
</script>
