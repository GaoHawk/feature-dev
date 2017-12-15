<template>
   <div class="order">
    <div class="layout-header">
      <Input v-model="value4"  placeholder="Enter name..." style="width: 200px">
        <Button slot="append" icon="ios-search" @click="click"></Button>
      </Input>
    </div>
    <Button type="primary" @click="showAll" class="showAll">All</Button>
    <Table :border="true" :stripe="true"   :data="tableData1" :columns="tableColumns1"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
          <Page :total="100" :current="1" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<style scoped>
.showAll {
  position: absolute;
  top: 76px;
  left: 250px;
}
.custom-search i {
  color: #fff !important;
  cursor: pointer;
}
.layout-header {
  height: 40px;
  margin-bottom: 5px;
  background: #fff;
  /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); */
}
</style>
<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      value4: "",
      tableData1: this.mockTableData1(),
      columns1: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "昵称",
          key: "name"
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.status === 1 ? "blue" : row.status === 2 ? "green" : "red";
            const text =
              row.status === 1
                ? "Working"
                : row.status === 2 ? "Success" : "Fail";

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
        },
        {
          title: "属性",
          key: "portrayal",
          render: (h, params) => {
            return h(
              "Poptip",
              {
                props: {
                  trigger: "hover",
                  title: params.row.portrayal.length + "portrayals",
                  placement: "bottom"
                }
              },
              [
                h("Tag", params.row.portrayal.length),
                h(
                  "div",
                  {
                    slot: "content"
                  },
                  [
                    h(
                      "ul",
                      this.tableData1[params.index].portrayal.map(item => {
                        return h(
                          "li",
                          {
                            style: {
                              textAlign: "center",
                              padding: "4px"
                            }
                          },
                          item
                        );
                      })
                    )
                  ]
                )
              ]
            );
          }
        },
        {
          title: "人数",
          key: "people",
          render: (h, params) => {
            return h(
              "Poptip",
              {
                props: {
                  trigger: "hover",
                  title: params.row.people.length + "customers",
                  placement: "bottom"
                }
              },
              [
                h("Tag", params.row.people.length),
                h(
                  "div",
                  {
                    slot: "content"
                  },
                  [
                    h(
                      "ul",
                      this.tableData1[params.index].people.map(item => {
                        return h(
                          "li",
                          {
                            style: {
                              textAlign: "center",
                              padding: "4px"
                            }
                          },
                          item.n + "：" + item.c + "People"
                        );
                      })
                    )
                  ]
                )
              ]
            );
          }
        },
        {
          title: "持续时间",
          key: "time",
          render: (h, params) => {
            return h("div", "Almost" + params.row.time + "days");
          }
        },
        {
          title: "更新时间",
          key: "update",
          render: (h, params) => {
            return h(
              "div",
              this.formatDate(this.tableData1[params.index].update)
            );
          }
        },
        {
          title:'卡片',
          key:'card',
          width:150,
          render:(h,params) =>{
            return h('div',[
              h(
                'Card',[h('p',{domProps:{innerHTML:'title'},slot:'title'}), h('p',{'class':{foo:true},domProps:{innerHTML:'Content'}, props:{padding:10}})],
                {
                  props:{
                    bordered:true,
                    shadow:true,
                    padding:12
                  },
                  style:{
                    background:'white'
                  }
                }
              )]
            )
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
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
                      this.show(params.index);
                    }
                  }
                },
                "详情"
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
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      columns2 :[
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "管理名称",
          key: "name"
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.status === 1 ? "blue" : row.status === 2 ? "green" : "red";
            const text =
              row.status === 1 ? "Working" : row.status === 2 ? "Success" : "Fail";

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
        },
        {
          title: "管理人数",
          key: "people",
          render: (h, params) => {
            return h(
              "Poptip",
              {
                props: {
                  trigger: "hover",
                  title: params.row.people.length + "customers",
                  placement: "bottom"
                }
              },
              [
                h("Tag", params.row.people.length),
                h(
                  "div",
                  {
                    slot: "content"
                  },
                  [
                    h(
                      "ul",
                      this.tableData1[params.index].people.map(item => {
                        return h(
                          "li",
                          {
                            style: {
                              textAlign: "center",
                              padding: "4px"
                            }
                          },
                          item.n + "：" + item.c + "People"
                        );
                      })
                    )
                  ]
                )
              ]
            );
          }
        },
        {
          title: "最后操作时间",
          key: "update",
          render: (h, params) => {
            return h("div", this.formatDate(this.tableData1[params.index].update));
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
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
                      this.show(params.index);
                    }
                  }
                },
                "详情"
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
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      columns3 : [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "国家",
          key: "name"
        },
        {
          title: "城市",
          key: "portrayal",
          render: (h, params) => {
            return h(
              "Poptip",
              {
                props: {
                  trigger: "hover",
                  title: params.row.portrayal.length + "portrayals",
                  placement: "bottom"
                }
              },
              [
                h("Tag", params.row.portrayal.length),
                h(
                  "div",
                  {
                    slot: "content"
                  },
                  [
                    h(
                      "ul",
                      this.tableData1[params.index].portrayal.map(item => {
                        return h(
                          "li",
                          {
                            style: {
                              textAlign: "center",
                              padding: "4px"
                            }
                          },
                          item
                        );
                      })
                    )
                  ]
                )
              ]
            );
          }
        },
        {
          title: "人口数",
          key: "people",
          render: (h, params) => {
            return h(
              "Poptip",
              {
                props: {
                  trigger: "hover",
                  title: params.row.people.length + "customers",
                  placement: "bottom"
                }
              },
              [
                h("Tag", params.row.people.length),
                h(
                  "div",
                  {
                    slot: "content"
                  },
                  [
                    h(
                      "ul",
                      this.tableData1[params.index].people.map(item => {
                        return h(
                          "li",
                          {
                            style: {
                              textAlign: "center",
                              padding: "4px"
                            }
                          },
                          item.n + "：" + item.c + "People"
                        );
                      })
                    )
                  ]
                )
              ]
            );
          }
        },
        {
          title: "历史建成",
          key: "time",
          render: (h, params) => {
            return h("div", "Almost" + params.row.time + "days");
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
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
                      this.show(params.index);
                    }
                  }
                },
                "详情"
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
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
    };
  },
  computed: {
    ...mapState({
       tableColumns:state => state.listroute
    }),
    tableColumns1:function(){
      // switch(this.tableColumns){
      //   case 'userlist':
      //    return this.columns1;
      //    break;
      //   case 'systemlist':
      //    return this.columns2;
      //    break;
      //   case 'sourcelist':
      //    return this.columns3;
      //    break;
      // }
      return this.columns1;
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   // 在渲染该组件的对应路由被 confirm 前调用
  //   // 不！能！获取组件实例 `this`
  //   // 因为当守卫执行前，组件实例还没被创建
  //   // console.log(to);
  //   const list = to.params.list;
  //   switch(list){
  //      case 'userlist':
  //       tableColumns = 'userlist'
  //       break;
  //      case 'systemlist':
  //       tableColumns = 'systemlist'
  //       break;
  //      case 'sourcelist':
  //       tableColumns = 'sourcelist'
  //       break;
  //   }
  //   next();
  // },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`

    const list = to.params.list;
    console.log(list);
    switch(list){
       case 'userlist':
        this.$store.commit('LIST_ROUTE', 'userlist')
        break;
       case 'systemlist':
        this.$store.commit('LIST_ROUTE', 'systemlist')
        break;
       case 'sourcelist':
        this.$store.commit('LIST_ROUTE', 'sourcelist')
        break;
    }
    next();
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.tableData1[index].name}<br>Status：${this
          .tableData1[index].status}<br>Update: ${this.tableData1[index]
          .update}`
      });
    },
    remove(index) {
      this.tableData1.splice(index, 1);
    },
    showAll() {
      this.tableData1 = this.mockTableData1();
    },
    click() {
      let key = this.value4;
      const filterByName = a => b => {
        return b.name.indexOf(a) > -1;
      };
      this.tableData1 = this.mockTableData1().filter(filterByName(key));
      console.log(this.tableData1);
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
    formatDate(date) {
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    changePage() {
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      this.tableData1 = this.mockTableData1();
      this.value4 = "";
    }
  }
};
</script>

