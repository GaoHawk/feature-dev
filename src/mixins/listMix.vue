<template>

</template>
<script>
import searchKey from "../tableSearch";
import Bus from "../eventBus";
import customOptions from "../options.js";

export default {
  mounted () {
    let vm = this;
    vm.searchArrBtn = searchKey[vm.tableName];
    vm.options = customOptions[vm.tableName + "Options"];
    console.log(vm.tableName);
    // 异步获取的ajax数据 无法通过mapstate直接同步
    // Bus.$on("buildAction", tableColumns => {
    //   console.log(tableColumns);
    //   let bl = true;
    //   for (let k in tableColumns) {
    //     if (tableColumns[k].key === "action") {
    //       tableColumns.splice(tableColumns.length - 1);
    //     }
    //   }
    //   let columns = vm.buildActions(tableColumns);
    //   console.log(columns);
    // });

    // Bus.$on("buildSelection", tableColumns => {

    //   for (let k in tableColumns) {
    //     if (tableColumns[k].type === "selection") {
    //       tableColumns.shift();
    //     }
    //   }
    //   vm.$nextTick(() => {
    //     console.log(this);
    //     console.log(vm);

    //   });
    //   let columns = vm.buildSelection(tableColumns);
    // });
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
  data() {
    return {};
  },
  methods: {
    buildSelection(){
      console.log('this is mixin')
    },
    buildActions(){
      console.log('this is mixin')
    },
    addSelect() {
      this.$refs.list.addSelect();
    },
    goToAdd() {
      this.$refs.list.goToAdd();
    },
    delSelect() {
      this.$refs.list.delSelect();
    },
    add() {
      this.$refs.list.add();
    },
    showAll() {
      let vm = this;
      let tableName = this.tableName;
      for (let n in vm.searchArrBtn) {
        vm.searchArrBtn[n].value = "";
      }

      this.$store.dispatch("getListdataAsync", tableName).then(result => {
        let tableData = vm.$store.getters.getAjaxTableData;
        vm.$refs.list.tableData1 = tableData;
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
      let params = {};

      for (let k in this.searchArrBtn) {
        if (k == "startTime") {
          const dt = this.formatDate(this.searchArrBtn[k].value);
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
          console.log(result);
          console.log(vm.$refs);
          let tableData = vm.$store.getters.getAjaxTableData;
          vm.$refs.list.tableData1 = tableData;
          // vm.tableData1 = tableData;
          // for(let n in vm.searchArrBtn){
          //   vm.searchArrBtn[n].value = ''
          // }
          // vm.searchArrBtn[key].value = "";
        });
    }
  }
};
</script>
