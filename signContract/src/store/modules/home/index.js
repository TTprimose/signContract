export default {
    state: {
        version: '1.0',
        langIsOpen:false,
        userCustomIsOpen:false,
        orgTreeIsHide:false,
        orgTreeWidth: 192,
        baseUrl: '',
        isFreshCarTree: false,
        timerArr: [],
        isNextMenuShow: false, //二级菜单是否显示
        device: {
            width: null,
            height: null
        },
        userInfo: {
            userName: "",
            passWord: ""
        },
        modelContentHeight: null,
        modelContentWidth:null,
        nextMenuMap: {
            myMain: [
                {
                    name: '我的主页',
                    path: '/myMain'
                }
            ],
            management: [
                {
                    name: '客户管理',
                    path: '/management'
                }
            ],
            template: [
                {
                    name: '模板管理',
                    path: '/template'
                }
            ],
            contract: [
                {
                    name: '合同管理',
                    path: '/contract'
                }
            ],
            audit: [
                {
                    name: '审计管理',
                    path: '/audit'
                }
            ],
            system: [
                {
                    name: '系统管理',
                    path: '/system'
                }
            ]
        },
        routerStatus:"",
        routerState:false
    },
    mutations: {
        setDevice(state, value){
            state.device.width = value.width
            state.device.height = value.height
            window.localStorage.setItem("device", JSON.stringify(state.device))
        },
        setNextMenuShow(state, value){
            state.isNextMenuShow = value
        },
        setModelContentHeight(state, value){
            state.modelContentHeight = value
            // console.log(state.modelContentHeight)
        },
        setModelContentWidth(state, value){
            state.modelContentWidth = value
        },
        setUserInfo(state, value){
            state.userInfo = value
            window.localStorage.setItem("userInfo", JSON.stringify(value))
            // console.log(value, 111)
        },
        setRouterStatus(state, value){
            state.routerStatus = value
        },
        setRouterState(state, value){
            state.routerState = value
        }
    }
};
