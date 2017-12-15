import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';
import * as getterss from './getters';
import * as serverRoute from '../serverApi';
import cart from './modules/cart';
// import VuexPersist, { VuexPersistence } from 'vuex-persist';
// import createPersistedState from 'vuex-persistedstate';

const debug = process.env.NODE_ENV !== 'production';
// const vuexLocal = new VuexPersistence({
//   storage:window.localStorage
// });
Vue.use(Vuex);
Vue.config.debug = debug;

// 遍历tree 节点
let n = 0;

function getCount(menu, key) {
    console.log(n, menu, key);
    menu = menu.children || menu;
    if (menu.length > 0) {
        n += menu.length;
        for (let i = 0; i < menu.length; i++) {
            if (menu[i].key == key) {
                console.log(menu[i])
                return menu[i];
            }
            getCount(menu[i], key)
        }
    }
}
let tree = []

function buildTree(dataTree, targetTree) {
    if (targetTree === undefined) {
        targetTree = [];
    }
    for (let i = 0; i < dataTree.length; i++) {
        targetTree.push({
            title: dataTree[i].name,
            id: dataTree[i].id,
            expand: true,
            children: []
        });
        console.log(dataTree[i].children)
        if (dataTree[i].children && dataTree[i].children.length > 0) {
            buildTree(dataTree[i].children, targetTree[i].children);
        }
    }
    return targetTree;
}

// 查询tree中某个特定节点
let node = {};

function getNode(menu, key) {
    console.log(menu, key);
    menu = menu.children || menu;
    if (menu.length > 0) {
        for (let i = 0; i < menu.length; i++) {
            if (menu[i].id == key) {
                node = menu[i];
                console.log(node);
            } else {
                getNode(menu[i], key)
            }
        }
    }
}

function getHours() {
    let now = new Date().getTime();
    let cookieTime = localStorage.dateString;
    let total = (now - Number(cookieTime)) / 1000;

    var day = parseInt(total / (24 * 60 * 60));
    var afterDay = total - day * 24 * 60 * 60;
    var hour = parseInt(afterDay / (60 * 60));

    return hour;
}
// 获取ajax数据
function ajaxData(url, cookies, store, params) {
    let idName = params ? params.name : 'id';
    let id = params ? params.id : '';
    let hour = getHours();
    // store.commit('TABLEDATA', '');
    console.log(hour);
    if (hour > 0) {
        store.commit('SET_TOKEN', '');
        store.commit('ROUT_PATH', '/');
        return;
    }
    const promise = new Promise(function(resolve, reject) {
        Vue.prototype.$http({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + cookies
                },
                params: params
            }).then(response => {
                console.log(response)
                resolve(response.data.data);
            }).then(response => {
                reject(new Error('请求失败!'))
            })
            .catch(function(err) {
                reject(new Error(err));
                console.log('catch', err)
            })
    });
    return promise;
}

// 添加postdata
function postData(url, cookies, params, store) {
    let hour = getHours();

    if (hour > 0) {
        store.commit('SET_TOKEN', '');
        store.commit('ROUT_PATH', '/');
        return;
    }
    // debugger
    const promise = new Promise(function(resolve, reject) {
        Vue.prototype.$http({
                method: 'POST',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + cookies
                },
                data: params

            }).then(response => {
                console.log(response)
                    // debugger
                if (response.data.message !== '成功') {
                    resolve({
                        request: 'failure',
                        msg: response.data.message
                    });
                } else {
                    resolve(response.data.data);
                }

            }).then(response => {
                reject(new Error('请求失败!'))
            })
            .catch(function(err) {
                reject(new Error(err));
                console.log('catch', err)
            })
    });
    return promise;
}
// 格式化 日期
function formatDate(date) {
    if (date) {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        return y + "-" + m + "-" + d;
    } else {
        return '';
    }
}

// 显示详情
function show(index, data) {
    console.log(data);
    Vue.prototype.$Modal.info({
        title: "User Info",
        content: `Name：${data[index].name}<br>Status：${
      data[index].status}<br>Update: ${data[index]
        .update}`
    });
}

function setOrderColumns(result) {
    console.log(result);
    let columns = [];
    for (let k in result.order) {
        switch (k) {
            case 'id':
                columns.push({
                    title: '订单号',
                    key: 'id'
                });
                break;
            case 'createTime':
                columns.push({
                    title: '下单时间',
                    key: 'createTime'
                });
                break;
            default:
                break;
        }
    }
    for (let k1 in result.tripList[0]) {
        switch (k1) {
            case 'departureTime':
                columns.push({
                    title: '出发时间',
                    key: 'departureTime'
                });
                break;
            case 'title':
                columns.push({
                    title: '旅游产品',
                    key: 'title'
                });
                break;
            default:
                break;
        }
    }
    for (let k2 in result.orderContact) {
        switch (k2) {
            case 'mobile':
                columns.push({
                    title: '联系电话',
                    key: 'mobile'
                });
                break;
            case 'person':
                columns.push({
                    title: '联系人',
                    key: 'person'
                });
                break;
            default:
                break;
        }
    }
    for (let k3 in result.orderPayment) {
        switch (k3) {
            case 'dueAmount':
                columns.push({
                    title: '应付款项',
                    key: 'dueAmount'
                });
                break;

            default:
                break;
        }
    }
    columns.push({
        title: '状态',
    });
    return columns;

}

function setWithDraw(result) {
    let arr = [];
    for (let i = 0; i < result.length; i++) {
        arr.push({
            id: result[i].withdraw.id,
            seller: {
                id: result[i].seller.id,
                mobile: result[i].seller.mobile,
                name: result[i].seller.name
            },
            amount: result[i].withdraw.amount,
            bankType: result[i].withdraw.bankType,
            bankBranch: result[i].withdraw.bankBranch,
            accountName: result[i].withdraw.accountName,
            accountNumber: result[i].withdraw.accountNumber,
            status: result[i].withdraw.status
        });
    }
    return arr;

}

function setOrderTable(result) {
    let arr = [];
    for (let i = 0; i < result.length; i++) {
        arr.push({
            orderId: result[i].tripList[0].orderId,
            createTime: result[i].order.createTime,
            departureTime: result[i].tripList[0].departureTime,
            production: {
                image: result[i].tripList[0].image,
                title: result[i].tripList[0].title
            },
            mobile: result[i].orderContact.mobile,
            person: result[i].orderContact.person,
            payment: {
                payed: result[i].orderPayment.price,
                dueAmount: result[i].orderPayment.dueAmount
            },
            status: {
                status: result[i].order.status,
                statusDesc: result[i].order.statusDesc
            },
            content: result[i].tripList[0].content,
            importance: result[i].order.importance

        });
    }
    return arr;
}

function sellerTable(result) {
    let arr = [];
    for (let i = 0; i < result.length; i++) {
        arr.push({
            id: result[i].seller.id,
            avatar: result[i].seller.avatar,
            name: result[i].seller.name,
            mobile: result[i].seller.mobile,
            balance: result[i].account.balance,
            frozenBalance: result[i].account.frozenBalance,
            expectedIncome: result[i].account.expectedIncome,
            cumulativeCashed: result[i].account.cumulativeCashed,
            status: result[i].seller.status,
            createTime: result[i].seller.createTime
        })
    }

    return arr;
}

export default new Vuex.Store({

    state: {
        token: '',
        user: window.localStorage.username ? window.localStorage.username : '',
        path: '',
        prevPath: '',
        page: window.localStorage.currentPage ? window.localStorage.currentPage : '',
        listroute: '',
        modal: false,
        formCommpose: [],
        currentColumInd: '',
        axiosData: [],
        tableready: false,
        tableName: '',
        options: '',
        ajaxTree: '',
        roleMenuTree: '',
        menuId: window.localStorage.menuId ? window.localStorage.menuId : '',
        travelId: '',
        uploadToken: '',
        imgUrl: '',
        imgOpen: false
    },
    modules: {
        cart,
    },
    getters: {
        getPath: getterss.getPath,
        getFormComp: (state, getters) => {
            let comp = state.formCommpose;
            let data = state.axiosData || [];
            let obj = {};
            // todo 刷新页面会执行 2次menu  路由
            // if(state.tableName === 'seller'){
            //   data = getters.getAjaxTableData;
            // }
            for (let i = 0; i < comp.length; i++) {
                if (state.currentColumInd !== undefined && data.list && data.list.length > 0) {
                    console.log(data.list[state.currentColumInd]);

                    let value = data.list[state.currentColumInd][comp[i].key];
                    // 分销数据
                    if (!value) {
                        value = getters.getAjaxTableData[state.currentColumInd][comp[i].key];
                    }
                    console.log(value);
                    Vue.set(obj, comp[i].key, value);
                } else {
                    // debugger
                    Vue.set(obj, comp[i].key, '');
                }
            }
            return obj;
        },
        setTableColumns: (state, getters) => {
            // console.log(vm);
            let columns = [];
            let result;
            if (state.tableName === 'listResource') {
                result = state.axiosData.length > 0 ? state.axiosData[0] : {};
            } else if (state.tableName === 'showResource' || state.tableName === 'roleResource' || state.tableName === 'roleToAddRes') {
                if (state.axiosData.pageList) {
                    result = state.axiosData.pageList.list.length > 0 ? state.axiosData.pageList.list[0] : {};
                }

            } else if (state.tableName === 'order' || state.tableName === 'seller' || state.tableName === 'orderWithStars' || state.tableName === 'orderWithRefund' || state.tableName === 'withdraw') {
                result = getters.getAjaxTableData.length > 0 ? getters.getAjaxTableData[0] : {};
            }
            // else if (state.tableName === 'withdraw' ){
            //   result = getters.
            // }
            else {
                result = state.axiosData.list.length > 0 ? state.axiosData.list[0] : {};
            }

            let tableName = state.tableName;
            console.log(tableName, state.axiosData);
            for (let k in result) {

                switch (k) {
                    case 'id':
                        columns.push({
                            title: 'ID',
                            key: 'id'
                        })
                        break;
                    case 'seller':
                        columns.push({
                            title: '销售员',
                            key: 'seller',
                            render: (h, params) => {
                                const row = params.row;
                                console.log(row);
                                return h('div', '[' + row.seller.id + '] ' + row.seller.mobile + ' ' + row.seller.name)
                            }
                        });
                        break;
                    case 'amount':
                        columns.push({
                            title: '金额',
                            key: 'amount'
                        });
                        break;
                    case 'bankType':
                        columns.push({
                            title: '银行',
                            key: 'bankType'
                        });
                        break;
                    case 'bankBranch':
                        columns.push({
                            title: '银行支行',
                            key: 'bankBranch'
                        });
                        break;
                    case 'accountName':
                        columns.push({
                            title: '账户名称',
                            key: 'accountName'
                        });
                        break;
                    case 'accountNumber':
                        columns.push({
                            title: '账户号码',
                            key: 'accountNumber'
                        });
                        break;
                    case 'app':
                        columns.push({
                            title: '应用',
                            key: 'app'
                        });
                        break;
                    case 'avatar':
                        columns.push({
                            title: '头像',
                            key: 'avatar',
                            render: (h, params) => {

                                const row = params.row;
                                const imgSrc = row.avatar ?
                                    row.avatar :
                                    '';
                                return h('img', {
                                    attrs: {
                                        src: imgSrc
                                    },
                                    style: {
                                        maxWidth: '48px',
                                        maxHeight: '48px'
                                    }
                                });
                            }
                        });
                        break;
                    case 'balance':
                        columns.push({
                            title: '账户余额',
                            key: 'balance'
                        });
                        break;
                    case 'frozenBalance':
                        columns.push({
                            title: '冻结金额',
                            key: 'frozenBalance'
                        });
                        break;
                    case 'expectedIncome':
                        columns.push({
                            title: '累计收入',
                            key: 'expectedIncome'
                        });
                        break;
                    case 'cumulativeCashed':
                        columns.push({
                            title: '累计提现',
                            key: 'cumulativeCashed'
                        });
                        break;
                    case 'image':
                        columns.push({
                            title: '图片',
                            key: 'image',
                            render: (h, params) => {
                                console.log(params);
                                const row = params.row;
                                const imgSrc = row.image ?
                                    row.image :
                                    '';
                                return h('img', {
                                    attrs: {
                                        src: imgSrc
                                    },
                                    style: {
                                        maxWidth: '49px',
                                        maxHeight: '78px',
                                        margin: 'auto',
                                        position: 'relative',
                                        left: '-15px'
                                    }
                                });
                            }
                        });
                        break;
                    case 'payment':
                        columns.push({
                            title: '应付款项',
                            key: 'payment',
                            render: (h, params) => {
                                const row = params.row.payment;

                                return h('div', [
                                    h('div', {
                                        style: {}
                                    }, '总金额: ' + row.dueAmount),
                                    h('div', {
                                        style: {
                                            color: 'green'
                                        }
                                    }, '实付: ' + row.payed),
                                ])
                            }
                        });
                        break;
                        // case 'importance':
                        //   columns.push({
                        //     title: '重要程度',
                        //     key: 'importance',
                        //     width: 175,
                        //     render: (h, params) => {
                        //       const imp = params.row.importance;
                        //       return h('Rate', {
                        //         props: {
                        //           count: 5,
                        //           value: imp ? imp : 0,
                        //           disabled: true
                        //         }
                        //       });
                        //     }
                        //   });
                        //   break;
                    case 'production':
                        columns.push({
                            title: '产品',
                            key: 'production',
                            render: (h, params) => {
                                const row = params.row;
                                const imgSrc = row.production.image ?
                                    row.production.image :
                                    '';
                                return h('div', {
                                    style: {
                                        height: '110px',
                                        lineHeight: '110px'
                                    }
                                }, [
                                    h('img', {
                                        attrs: {
                                            src: imgSrc
                                        },
                                        style: {
                                            display: 'inline-block',
                                            maxWidth: '100px',
                                            maxHeight: '100px',
                                            verticalAlign: 'middle'
                                        }
                                    }),
                                    h('div', {
                                        style: {
                                            display: 'inline-block',
                                            marginLeft: '3px'
                                        }
                                    }, row.production.title)
                                ]);
                            }
                        });
                        break;
                    case 'title':
                        columns.push({
                            title: '标题',
                            key: 'title',
                            render: (h, params) => {
                                const row = params.row;
                                const title = row.title;
                                const subT = row.subtitle;
                                return h('div', [
                                    h('div', title),
                                    h('div', {
                                        style: {
                                            color: '#a2a4a9'
                                        },
                                        domProps: {
                                            innerHTML: subT
                                        },
                                    })
                                ]);
                            }
                        });
                        break;
                    case 'destination':
                        columns.push({
                            title: '目的地',
                            key: 'destination',

                        })
                        break;
                        // case 'days':
                        //   columns.push({
                        //     title: '天数',
                        //     key: 'days'
                        //   });
                        //   break;

                    case 'soldNum':
                        columns.push({
                            title: '售出',
                            key: 'soldNum'
                        });
                        break;
                    case 'recommended':
                        columns.push({
                            title: '推荐',
                            key: 'recommended',
                            render: (h, params) => {
                                const row = params.row;
                                const text =
                                    row.recommended === 0 ?
                                    "未推荐" :
                                    row.recommended === 1 ? "已推荐" : "";
                                const color =
                                    row.recommended === 0 ?
                                    "#a2a4a9" :
                                    row.recommended === 1 ? '#26c326' : '';
                                return h('div', {
                                    style: {
                                        color: color
                                    }
                                }, text);
                            }
                        });
                        break;
                    case 'level':
                        if (tableName !== 'trip') {
                            columns.push({
                                title: '密级',
                                key: 'level',
                                render: (h, params) => {
                                    const row = params.row;
                                    const text =
                                        row.level === 0 ?
                                        "公开" :
                                        row.level === 1 ? "需要登录" : "";
                                    return h('div', text);
                                }
                            });
                        }

                        break;
                    case 'writeLog':
                        columns.push({
                            title: '记录日志',
                            key: 'writeLog',
                            render: (h, params) => {
                                const row = params.row;
                                const text =
                                    row.writeLog === 0 ?
                                    "否" :
                                    '有' + writeLog + '条记录';
                                return h('div', text);
                            }
                        });
                        break;
                    case 'city':
                        columns.push({
                            title: '城市',
                            key: 'city'
                        });
                        break;
                    case 'continent':
                        columns.push({
                            title: '洲',
                            key: 'continent'
                        });
                        break;
                    case 'country':
                        columns.push({
                            title: '国家',
                            key: 'country'
                        });
                        break;
                    case 'path':
                        columns.push({
                            title: '路径',
                            key: 'path'
                        });
                        break;
                    case 'person':
                        columns.push({
                            title: '联系人',
                            key: 'person'
                        });
                        break;
                    case 'orderId':
                        columns.push({
                            title: '订单号',
                            key: 'orderId'
                        });
                        break;
                    case 'content':
                        if (tableName === 'saleNotification') {
                            columns.push({
                                title: '内容',
                                key: 'content'
                            });
                        }
                        break;
                    case 'type':
                        if (tableName === 'saleNotification') {
                            columns.push({
                                title: '类型',
                                key: 'type'
                            });
                        }
                        break;
                    case 'sellerId':
                        columns.push({
                            title: '销售员',
                            key: 'sellerId'
                        });
                        break;
                    case 'sellerName':
                        columns.push({
                            title: '销售员名称',
                            key: 'sellerName'
                        });
                        break;
                    case 'status':
                        if (tableName === 'trip') {
                            columns.push({
                                title: "状态",
                                key: "status",
                                render: (h, params) => {
                                    const row = params.row;
                                    const color =
                                        row.status === 1 ? "green" : "#a2a4a9";
                                    const text =
                                        row.status === 1 ?
                                        "已上架" :
                                        "未上架";

                                    return h(
                                        "div", {
                                            style: {
                                                color: color
                                            }
                                        },
                                        text
                                    );
                                }
                            });
                        } else if (tableName === 'order' || tableName === 'orderWithStars' || tableName === 'orderWithRefund') {
                            columns.push({
                                title: '状态',
                                key: 'status',
                                render: (h, params) => {
                                    const row = params.row;
                                    const color =
                                        row.status.status < 90 ?
                                        'green' :
                                        'red';
                                    const text =
                                        row.status.status < 90 ?
                                        "已完成" :
                                        "已关闭";
                                    const content = row.status.statusDesc;
                                    return h('div', [
                                        h('div', {
                                            style: {
                                                color: color,
                                                cursor: 'pointer'
                                            },
                                            on: {
                                                click: () => {

                                                    console.log(params);
                                                }
                                            }
                                        }, text),
                                        h('div', {
                                            style: {
                                                color: color
                                            }
                                        }, content),
                                    ])
                                }
                            });
                        } else {
                            columns.push({
                                title: "状态",
                                key: "status",
                                render: (h, params) => {
                                    const row = params.row;
                                    const color =
                                        row.status === 1 ? "green" : "red";
                                    const text =
                                        row.status === 1 ?
                                        "已启用" :
                                        "禁用";

                                    return h(
                                        "Tag", {
                                            props: {
                                                type: "dot",
                                                color: color
                                            }
                                        },
                                        text
                                    );
                                }
                            });
                        }

                        break;
                        // case 'avatar':
                        //   columns.push({
                        //     title: '头像',
                        //     key: 'avatar',

                        //   })
                        //   break;
                    case 'birthday':
                        columns.push({
                            title: '生日',
                            key: 'birthday'
                        })
                        break;
                    case 'note':
                        columns.push({
                            title: '描述',
                            key: 'note'
                        });
                        break;
                    case 'arriveTime':
                        columns.push({
                            title: '行驶时间',
                            key: 'arriveTime',
                            render: (h, params) => {
                                if (params === undefined) {

                                } else {
                                    const row = params.row;
                                    let startTime = row.startTime;
                                    let arriveTime = row.arriveTime;
                                    return h('div', [
                                        h('div', '始: ' + formatDate(new Date(startTime))),
                                        h('div', '止: ' + formatDate(new Date(arriveTime)))
                                    ])
                                }
                            }
                        })
                        break;
                    case 'startTime':
                        if (tableName !== 'traffic') {
                            columns.push({
                                title: '销售时间',
                                key: 'startTime',
                                render: (h, params) => {
                                    console.log(params);
                                    if (params === undefined) {
                                        return '';
                                    } else {
                                        const row = params.row;
                                        let startTime = row.startTime;
                                        let endTime = row.endTime;
                                        return h('div', [
                                            h('div', "始: " + formatDate(new Date(startTime))),
                                            h('div', "止: " + formatDate(new Date(endTime)))
                                        ])
                                    }
                                }
                            })
                        }

                        break;
                    case 'departureTime':
                        columns.push({
                            title: '出发时间',
                            key: 'departureTime',
                            render: (h, params) => {
                                if (params === undefined) {
                                    return '';
                                } else {
                                    console.log(params.index);
                                    return h('div', formatDate(new Date(params.row.createTime)))
                                }

                            }
                        });
                        break;
                    case 'createTime':
                        let label = '注册时间'
                        if (tableName === 'order' || tableName === 'orderWithStars' || tableName === 'orderWithRefund') {
                            label = '下单时间';
                        } else if (tableName === 'saleNotification') {
                            label = '创建时间'
                        } else if (tableName === 'traffic') {
                            label = '购票时间'
                        };

                        if (tableName === 'trip') {

                        } else {

                            columns.push({
                                title: label,
                                key: 'createTime',
                                render: (h, params) => {
                                    if (params === undefined) {
                                        return '';
                                    } else {
                                        console.log(params.index);
                                        return h('div', formatDate(new Date(params.row.createTime)))
                                    }

                                }
                            });

                        }
                        break;
                    case 'email':
                        columns.push({
                            title: '邮箱',
                            key: 'email'
                        });
                        break;
                    case 'gender':
                        columns.push({
                            title: '性别',
                            key: 'gender',
                            render: (h, params) => {
                                const row = params.row;
                                const text =
                                    row.gender === 1 ?
                                    "男" :
                                    row.gender === 2 ? "女" : "";
                                return h('div', text);
                            }
                        });
                        break;
                    case 'mobile':
                        columns.push({
                            title: '手机',
                            key: 'mobile'
                        })
                        break;
                    case 'name':
                        columns.push({
                            title: '名称',
                            key: 'name'
                        });
                        break;
                    case 'nickname':
                        columns.push({
                            title: '昵称',
                            key: 'nickname'
                        })
                        break;
                    case 'username':
                        columns.push({
                            title: '账号',
                            key: 'username'
                        });
                        break;
                    default:
                        break;
                }
            }

            // if (tableName === 'resource') {
            //     columns.unshift({
            //         type: 'selection',
            //         width: 60,
            //         align: 'center'
            //     })
            // }

            return columns;
        },
        getPageInfo: state => {
            if (state.tableName === 'listResource') {

                return '';
            } else if (state.tableName === 'showResource') {
                return state.axiosData.pageList.pageInfo;
            } else {
                return state.axiosData.pageInfo;
            }
        },
        getAjaxTableData: state => {

            if (state.tableName === 'listResource') {
                return state.axiosData;

            } else if (state.tableName === 'showResource' || state.tableName === 'roleResource' || state.tableName === 'roleToAddRes') {
                if (state.axiosData.pageList) {
                    return state.axiosData.pageList.list
                } else {
                    return '';
                }

            } else if (state.tableName === 'order' || state.tableName === 'orderWithStars' || state.tableName === 'orderWithRefund') {
                return setOrderTable(state.axiosData.list)
            } else if (state.tableName === 'seller') {
                return sellerTable(state.axiosData.list)
            } else if (state.tableName === 'withdraw') {
                return setWithDraw(state.axiosData.list);
            } else {
                return state.axiosData.list;
            }

        },
        getMenuTreeData: state => {
            return state.ajaxTree;
        },
        getRoleMenu: state => {
            return state.roleMenuTree;
        },
        unLogIn: state => {
            // let bl =
            return !state.token;
        },
        currentMenuItme: (state, getters) => (key) => {
            let menu = state.ajaxTree;
            console.log(key);
            if (!menu.length) return;
            //  debugger
            getNode(menu, key);
            return node;
        },
        menuCount: (state, getters) => {
            let menu = getters.ajaxDataSetMenuTree;
            // debugger
            // tree 长度为0 没有数据返回undefined
            if (!menu.length) return;
            // n += menu.length;
            n = 0;
            getCount(menu);
            return n
        },
        ajaxSetRoleMenuTree: (state, getters) => {
            console.log(getters.getRoleMenu)
            let tree1 = buildTree(getters.getRoleMenu.menuList1)
            let tree2 = buildTree(getters.getRoleMenu.menuList2)
            let treeObj = {
                left: tree1,
                right: tree2
            }
            return treeObj;
        },
        ajaxDataSetMenuTree: (state, getters) => {

            let tree = buildTree(getters.getMenuTreeData);
            console.log(tree);
            return tree;
        }
    },
    actions: {
        // 获得上传文件的token
        uploadFile({
            commit
        }, type) {
            let url = serverRoute.UPLOAD_TOKEN + type;
            let cookies = localStorage.cookies || '';
            let store = this;
            // debugger
            return new Promise(function(resolve, reject) {
                resolve(
                    ajaxData(url, cookies, store).then(function(json) {
                        console.log(json)
                        return json
                            // commit('TABLEDATA', json);
                            // commit('TABLE_NAME', page);
                    }, function(error) {
                        console.log('出错了', error);
                    })
                )
            })
        },
        // 行程设计查询
        searchTripDetail({
            commit
        }, params) {
            let cookies = localStorage.cookies || '';
            let methods = params.methods;
            let url = '';
            let store = this;
            return new Promise(function(resolve, reject) {
                switch (methods) {
                    case 'local':
                        url = serverRoute.LOCAL_LIST
                        break;
                    case 'hotel':
                        url = serverRoute.HOTEL_LIST
                        break;
                    case 'traffic':
                        url = serverRoute.TARFFIC_LIST
                        break;
                    default:
                        break;
                }
                resolve(
                    ajaxData(url, cookies, store, params.params).then(function(json) {
                        console.log(json);
                        return json;
                        // commit('TABLEDATA', json);
                        // commit('TABLE_NAME', tableName);
                    }, function(error) {
                        console.log('出错了', error);
                    })
                )
            })
        },
        // 搜索table数据
        searchTableAsync({
            commit
        }, params) {
            let cookies = localStorage.cookies || '';
            let tableName = this.state.tableName;
            let url = '';
            let store = this;
            return new Promise(function(resolve, reject) {
                switch (tableName) {
                    case 'admin':
                        url = serverRoute.ADMIN_LIST;
                        break;
                    case 'role':
                        url = serverRoute.ROLE_LIST;
                        break;
                    case 'resource':
                        url = serverRoute.RES_LIST;
                        break;
                    case 'roleResource':
                        url = serverRoute.ROLE_LISTRES;
                        break;
                    case 'showResource':
                        url = serverRoute.MENU_RESTA
                        break;
                    case 'city':
                        url = serverRoute.CITY_LIST
                        break;
                    case 'hotel':
                        url = serverRoute.HOTEL_LIST
                        break;
                    case 'local':
                        url = serverRoute.LOCAL_LIST
                        break;
                    case 'traffic':
                        url = serverRoute.TARFFIC_LIST
                        break;
                    case 'trip':
                        url = serverRoute.TRIP_LIST
                        break;
                    case 'order':
                        url = serverRoute.ORDER_LIST;
                        break;
                    default:
                        break;
                }
                resolve(
                    ajaxData(url, cookies, store, params.params).then(function(json) {
                        console.log(json);
                        commit('TABLEDATA', json);
                        // commit('TABLE_NAME', tableName);
                    }, function(error) {
                        console.log('出错了', error);
                    })
                )

            })
        },
        // 异步获取列表数据
        getListdataAsync({
            commit
        }, page) {
            console.log(this.state.tableName);
            let cookies = localStorage.cookies || '';
            let url = '';
            let store = this;
            let params;
            let tableName = '';
            if (page.params) {
                tableName = page.params.tableName
                params = {
                    page: page.params.page
                }
            } else {
                tableName = page;
            }
            // debugger
            return new Promise(function(resolve, reject) {
                switch (tableName) {
                    case 'admin':
                        url = serverRoute.ADMIN_LIST;
                        break;
                    case 'role':
                        url = serverRoute.ROLE_LIST;
                        break;
                    case 'menu':
                        url = serverRoute.MENU_LIST;
                        resolve(
                            ajaxData(url, cookies, store, params).then(function(json) {
                                commit('TREEDATA', json);

                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'order':
                        url = serverRoute.ORDER_LIST;
                        break;
                    case 'orderWithStars':
                        url = serverRoute.ORDER_LISTWS;
                        break;
                    case 'orderWithRefund':
                        url = serverRoute.ORDER_LISTWR
                        break;
                    case 'seller':
                        url = serverRoute.SELLER_LIST;
                        break;
                    case 'income':
                        url = serverRoute.INCOME_LIST;
                        break;
                    case 'withdraw':
                        url = serverRoute.WITHDRAW_LIST;
                        break;
                    case 'partner':
                        url = serverRoute.PARTNER_LIST;
                        break;
                    case 'saleNotification':
                        url = serverRoute.SALE_NOTICE;
                        break;
                    case 'listResource':
                        url = serverRoute.MENU_LISTRES;
                        console.log(store.state.menuId);
                        let menuid = store.state.menuId;
                        resolve(
                            ajaxData(url, cookies, store, {
                                menuId: menuid
                            }).then(function(json) {
                                console.log(json)
                                commit('TABLEDATA', json);

                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'showResource':
                        url = serverRoute.MENU_RESTA;

                        console.log(store.state.menuId);
                        let menuId = store.state.menuId;
                        resolve(
                            ajaxData(url, cookies, store, {
                                menuId: menuId
                            }).then(function(json) {
                                console.log(json)
                                commit('TABLEDATA', json);

                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'roleListMenu':
                        url = serverRoute.ROLE_LISTMENU;
                        var roleID = store.state.menuId;
                        resolve(
                            ajaxData(url, cookies, store, {
                                roleId: roleID
                            }).then(function(json) {
                                console.log(json)
                                commit('ROLE_MENU', json);

                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'roleToAddRes':
                        url = serverRoute.ROlE_RESTA;
                        let roleID = store.state.menuId;
                        resolve(
                            ajaxData(url, cookies, store, {
                                roleId: roleID
                            }).then(function(json) {
                                console.log(json)
                                commit('TABLEDATA', json);

                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'roleResource':
                        url = serverRoute.ROLE_LISTRES;
                        let roleId = store.state.menuId;
                        resolve(
                            ajaxData(url, cookies, store, {
                                roleId: roleId
                            }).then(function(json) {
                                console.log(json)
                                commit('TABLEDATA', json);

                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'resource':
                        url = serverRoute.RES_LIST;

                        break;
                    case 'city':
                        url = serverRoute.CITY_LIST;

                        break;
                    case 'hotel':
                        url = serverRoute.HOTEL_LIST;

                        break;
                    case 'travel':
                        url = serverRoute.TRIP_DETAIL_INFO;
                        let travelId = store.state.travelId;
                        resolve(
                            ajaxData(url, cookies, store, {
                                id: travelId
                            }).then(function(json) {
                                return json;
                            })
                        )
                        break;
                    case 'local':
                        url = serverRoute.LOCAL_LIST;

                        break;
                    case 'traffic':
                        url = serverRoute.TARFFIC_LIST;

                        break;
                    case 'trip':
                        url = serverRoute.TRIP_LIST;

                        break;
                    default:
                        break;
                }
                if (page !== 'travel' && page !== 'roleResource' && page !== 'roleToAddRes' && page !== 'roleListMenu' && page !== 'menu' && page !== 'listResource' && page !== 'showResource' &&
                    page !== 'roleListMenu' && page !== 'roleResource' && page !== 'roleToAddRes' && page !== 'travel') {

                    resolve(
                        ajaxData(url, cookies, store, params).then(function(json) {

                            commit('TABLEDATA', json);
                            return json;
                        }, function(error) {
                            console.log('出错了', error);
                        })
                    );

                }

            })
        },
        roleAddMenu({
            commit
        }, params) {
            let tableName = this.state.tableName;
            let cookies = localStorage.cookies || '';
            let url = '';
            let store = this;
            return new Promise(function(resolve, reject) {
                url = serverRoute.ROLE_ADDMENU;
                resolve(
                    postData(url, cookies, params.params, store).then(function(json) {
                        console.log(json)
                        if (json.request && json.request === 'failure') {
                            return json;
                        } else {
                            // location.reload();
                        }
                        // commit('TABLE_ADD', json);
                        // commit('TABLE_READY', true);
                        // commit('TABLE_NAME', page);
                    }, function(error) {
                        console.log('出错了', error);
                    })
                )
            })
        },
        roleRemoveMenu({
            commit
        }, params) {
            let tableName = this.state.tableName;
            let cookies = localStorage.cookies || '';
            let url = '';
            let store = this;
            return new Promise(function(resolve, reject) {
                url = serverRoute.ROLE_REMOVE;
                resolve(
                    postData(url, cookies, params.params, store).then(function(json) {
                        console.log(json)
                        if (json.request && json.request === 'failure') {
                            return json;
                        } else {
                            // location.reload();
                        }

                        // router.go(-1)
                        // commit('TABLE_ADD', json);
                        // commit('TABLE_READY', true);
                        // commit('TABLE_NAME', page);
                    }, function(error) {
                        console.log('出错了', error);
                    })
                )
            })

        },
        // 添加资源和 菜单
        addResouce({
            commit
        }, params) {
            let tableName = this.state.tableName;
            let cookies = localStorage.cookies || '';
            let url = '';
            let store = this;
            return new Promise(function(resolve, reject) {
                switch (tableName) {
                    case 'showResource':
                        url = serverRoute.MENU_ADD_RES;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    // router.go(-1)
                                }

                                // commit('TABLE_ADD', json);
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'roleToAddRes':
                        url = serverRoute.ROLE_ADDRES;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    // router.go(-1)
                                }
                                // router.go(-1)
                                // commit('TABLE_ADD', json);
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    default:
                        break;
                }
            })
        },
        // 添加数据
        addTable({
            commit
        }, params) {
            console.log(params);
            console.log(this);
            let tableName = this.state.tableName;
            let cookies = localStorage.cookies || '';
            let url = '';
            let store = this;
            return new Promise(function(resolve, reject) {
                switch (tableName) {
                    case 'role':
                        url = serverRoute.ROLE_CREATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_ADD', json);
                                }
                                // location.reload()
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);

                            })
                        )
                        break;
                    case 'menu':
                        url = serverRoute.MENU_CREATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    // commit('TABLE_ADD', json);
                                }
                                // location.reload();
                                // commit('TABLE_ADD', json);
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);

                            })
                        )
                        break;
                    case 'city':
                        url = serverRoute.CITY_CREATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_ADD', json);
                                }
                                // location.reload()
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);

                            })
                        )
                        break;
                    case 'hotel':
                        url = serverRoute.HOTEL_CREATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)

                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_ADD', json);
                                }
                                // location.reload()
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);

                            })
                        )
                        break;
                    case 'local':
                        url = serverRoute.LOCAL_CREATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_ADD', json);
                                }

                                // location.reload()
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'traffic':
                        url = serverRoute.TRAFFIC_CREATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_ADD', json);
                                }
                                // location.reload()
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'trip':
                        url = serverRoute.TRIP_CREATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_ADD', json);
                                }
                                // commit('TABLE_ADD', json);
                                // location.reload()
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    default:
                        break;
                }
            })
        },
        delTripDetail({
            commit
        }, params) {
            let cookies = localStorage.cookies || '';
            let methods = params.methods;
            let url = '';
            let store = this;
            return new Promise(function(resolve, reject) {
                switch (methods) {
                    case 'city':
                        url = serverRoute.TRIP_DEL_CITY;
                        break;
                    case 'local':
                        url = serverRoute.TRIP_DEL_LOCAL;
                        break;
                    case 'hotel':
                        url = serverRoute.TRIP_DEL_HOTEL;
                        break;
                    case 'traffic':
                        url = serverRoute.TRIP_DEL_TRAFFIC;
                        break;
                    default:
                        break;
                }
                resolve(
                    postData(url, cookies, params.params, store).then(function(json) {
                        console.log(json)
                        if (json.request && json.request === 'failure') {
                            return json;
                        } else {

                        }
                        // router.go(-1)
                        // commit('TABLE_ADD', json);
                        // commit('TABLE_READY', true);
                        // commit('TABLE_NAME', page);
                    }, function(error) {
                        console.log('出错了', error);
                    })
                )
            })
        },
        // 行程设计添加城市， 添加酒店 ， 添加景点
        addTripDetail({
            commit
        }, params) {
            let cookies = localStorage.cookies || '';
            let methods = params.methods;
            let url = '';
            let store = this;
            return new Promise(function(resolve, reject) {
                switch (methods) {
                    case 'city':
                        url = serverRoute.TRIP_ADD_CITY;
                        break;
                    case 'local':
                        url = serverRoute.TRIP_ADD_LOCAL;
                        break;
                    case 'hotel':
                        url = serverRoute.TRIP_ADD_HOTEL;
                        break;
                    case 'traffic':
                        url = serverRoute.TRIP_ADD_TRAFFIC;
                        break;
                    default:
                        break;
                }
                resolve(
                    postData(url, cookies, params.params, store).then(function(json) {
                        console.log(json)

                        return json;
                        // router.go(-1)
                        // commit('TABLE_ADD', json);
                        // commit('TABLE_READY', true);
                        // commit('TABLE_NAME', page);
                    }, function(error) {
                        console.log('出错了', error);
                    })
                )
            })
        },
        // 修改数据
        updateTable({
            commit
        }, params) {
            // debugger
            console.log(params);
            let index = params.index;
            let cookies = localStorage.cookies || '';
            let tableName = this.state.tableName;
            let url = '';
            let store = this;
            return new Promise(function(resolve, reject) {
                switch (tableName) {
                    case 'admin':
                        url = serverRoute.ADMIN_UPDATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_UPDATE', {
                                        index: index,
                                        params: params.params
                                    });
                                }

                                // debugger
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'role':
                        url = serverRoute.ROLE_UPDATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_UPDATE', {
                                        index: index,
                                        params: params.params
                                    });
                                }

                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);

                            })
                        )
                        break;
                    case 'menu':
                        url = serverRoute.MENU_UPDATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    // location.reload();
                                }

                                // commit('TABLE_UPDATE', {
                                //   index: index,
                                //   params: params.params
                                // });
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);

                            })
                        )
                        break;
                    case 'city':
                        url = serverRoute.CITY_UPDATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_UPDATE', {
                                        index: index,
                                        params: params.params
                                    });
                                }

                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);

                            })
                        )
                        break;
                    case 'hotel':
                        url = serverRoute.HOTEL_UPDATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_UPDATE', {
                                        index: index,
                                        params: params.params
                                    });
                                }

                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'local':
                        url = serverRoute.LOCAL_UPDATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_UPDATE', {
                                        index: index,
                                        params: params.params
                                    });
                                }

                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'traffic':
                        url = serverRoute.TRAFFIC_UPDATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_UPDATE', {
                                        index: index,
                                        params: params.params
                                    });
                                }

                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'trip':
                        url = serverRoute.TRIP_UPDATE;
                        resolve(
                            postData(url, cookies, params.params, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    commit('TABLE_UPDATE', {
                                        index: index,
                                        params: params.params
                                    });
                                }

                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    default:
                        break;
                }
            })
        },
        // 删除树节点
        delTree({
            commit
        }, params) {
            let cookies = localStorage.cookies || '';
            let tableName = this.state.tableName;
            let url = '';
            let store = this;
            // debugger
            return new Promise((resolve, reject) => {
                switch (tableName) {
                    case 'menu':
                        url = serverRoute.MENU_DEL;
                        resolve(
                            postData(url, cookies, {
                                id: params.id
                            }, store).then(function(json) {
                                console.log(json);
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {

                                }
                                // commit('TABLE_DEL', index);
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    default:
                        break;
                }
            })
        },
        // 删除数据
        delTable({
            commit
        }, index) {
            // debugger
            let id;
            let cookies = localStorage.cookies || '';
            let tableName = this.state.tableName;
            let url = '';
            let store = this;
            let menuId = this.state.menuId;
            return new Promise(function(resolve, reject) {
                switch (tableName) {
                    case 'role':
                        id = store.state.axiosData.list[index].id;
                        url = serverRoute.ROLE_DEL;
                        resolve(
                            postData(url, cookies, {
                                id: id
                            }, store).then(function(json) {
                                console.log(json)
                                    // debugger
                                commit('TABLE_DEL', index);
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'resource':
                        url = serverRoute.RES_DEL;
                        resolve(
                            postData(url, cookies, {
                                idList: index
                            }, store).then(function(json) {
                                console.log(json)
                                    // commit('TABLE_DEL', index);
                                    // commit('TABLE_READY', true);
                                    // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'listResource':
                        url = serverRoute.MENU_REMOVE_RES;
                        resolve(
                            postData(url, cookies, {
                                menuId: menuId,
                                resourceIdList: index
                            }, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    return 'listResource'
                                }
                                // router.go(-1)
                                // commit('TABLE_DEL', index);
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'roleResource':
                        url = serverRoute.ROLE_RE_RES;
                        resolve(
                            postData(url, cookies, {
                                roleId: menuId,
                                resourceIdList: index
                            }, store).then(function(json) {
                                console.log(json)
                                if (json.request && json.request === 'failure') {
                                    return json;
                                } else {
                                    return 'roleResource'
                                }
                                // router.go(-1)
                                // commit('TABLE_DEL_RES', index);
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'city':
                        id = store.state.axiosData.list[index].id;
                        url = serverRoute.CITY_DEL;
                        resolve(
                            postData(url, cookies, {
                                id: id
                            }, store).then(function(json) {
                                console.log(json)
                                commit('TABLE_DEL', index);
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'local':
                        id = store.state.axiosData.list[index].id;
                        url = serverRoute.LOCAL_DEL;
                        resolve(
                            postData(url, cookies, {
                                id: id
                            }, store).then(function(json) {
                                console.log(json)
                                commit('TABLE_DEL', index);
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'hotel':
                        id = store.state.axiosData.list[index].id;
                        url = serverRoute.HOTEL_DEL;
                        resolve(
                            postData(url, cookies, {
                                id: id
                            }, store).then(function(json) {
                                console.log(json)
                                commit('TABLE_DEL', index);
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'traffic':
                        // debugger
                        id = store.state.axiosData.list[index].id;
                        url = serverRoute.TRAFFIC_DEL;
                        resolve(
                            postData(url, cookies, {
                                id: id
                            }, store).then(function(json) {
                                console.log(json)
                                commit('TABLE_DEL', index);
                                // commit('TABLE_READY', true);
                                // commit('TABLE_NAME', page);
                            }, function(error) {
                                console.log('出错了', error);
                            })
                        )
                        break;
                    case 'trip':
                        id = store.state.axiosData.list[index].id;
                        url = serverRoute.TRAFFIC_DEL;
                        break;
                    default:
                        break;
                }
            })
        },
        // 登陆cookie
        setToken({
            commit
        }, token) {
            commit('SET_TOKEN', token)
        },
        setUser({
            commit
        }, user) {
            commit('LOGIN', user);
        },
        // 动态配置侧边导航栏
        setMenu({
            commit
        }, tree) {
            commit('SET_MENU', tree)
        },
        // 路由分页面控制
        setListRouter({
            commit
        }, list) {
            commit('LIST_ROUTE', list);
        },
        // 控制路由状态
        setRouter({
            commit
        }, path) {
            commit('ROUT_PATH', path)
        },
        //  次级页面
        setPage({
            commit
        }, page) {
            commit('SET_PAGE', page);
        }
    },
    mutations: {
        // 控制圖片預覽
        imgView(state, params) {
            console.log(params);
            state.imgUrl = params.url;
            state.imgOpen = params.open;
        },
        // 行程id
        TRAVELID(state, id) {
            state.travelId = id;
        },
        // 关联资源获得 菜单id
        MENUID(state, id) {
            state.menuId = id;
        },
        // 角色管理菜单 数据不和menu 共用同一数据源
        ROLE_MENU(state, tree) {
            state.roleMenuTree = tree;
        },
        // menu 数据单独保存
        TREEDATA(state, tree) {
            state.ajaxTree = tree;
        },
        // 设置下拉框的选项
        SET_OPTIONS(state, options) {
            state.options = options
        },
        // 要构成的 form 弹窗 元素
        FORM_COMP(state, stack) {
            console.log(stack);
            let key = stack.key;
            let label = stack.label;
            let index = stack.index;
            state.currentColumInd = index;
            // 清空元弹出层的数据
            state.formCommpose.splice(0);
            for (let i = 0; i < key.length; i++) {
                state.formCommpose.push({
                    key: key[i],
                    label: label[i]
                })
            }


        },

        // modal 组件
        MODAL_TOGGLE(state, status) {
            state.modal = status;
        },
        // 修改数据update
        TABLE_UPDATE(state, stack) {
            console.log(stack)
            Vue.set(state.axiosData.list, stack.index, stack.params);
            // state.axiosData.list[stack.index] = stack.params;
        },
        TABLE_ADD(state, json) {
            state.axiosData.list.push(json);
            console.log(state.axiosData.list);
        },

        TABLE_DEL(state, index) {
            state.axiosData.list.splice(index, 1);
            // this.tableData1.splice(index, 1);
        },
        TABLE_NAME(state, name) {
            state.tableName = name;
        },
        TABLE_READY(state, ready) {
            state.tableready = ready
        },

        TABLEDATA(state, tabledata) {
            state.axiosData = tabledata
        },
        SET_TOKEN(state, token) {
            state.token = token;
        },
        LOGIN(state, user) {
            state.user = user;
        },
        SET_MENU(state, tree) {
            state.Menu = tree;
        },
        LIST_ROUTE(state, list) {
            state.listroute = list;
        },
        SET_PAGE(state, page) {
            state.page = page;
        },
        ROUT_PATH(state, path) {
            router.push({
                path: path
            })
            state.path = path;
        },
    },
    strict: debug
})