<template>
    <div class="app" :style="{width: $store.state.home.device.width+'px', height: $store.state.home.device.height+'px'}">
        <HQSilder :menuList = "menuList"></HQSilder>
        <HQContent></HQContent>
    </div>
</template>

<script>
import HQSilder from "views/home/slider";
import HQContent from "views/home/content";
export default {
    name: "home",
    components: {
        HQSilder,
        HQContent
    },
    data() {
        return {
            menuList: [
                { text: "我的主页", name: 'myMain', icon: "fa fa-television" },
                { text: "客户管理", name: 'management', icon: "fa fa-th" },
                { text: "模板管理", name: 'template', icon: "fa fa-server" },
                { text: "合同管理", name: 'contract', icon: "fa fa-clone" },
                { text: "审计管理", name: 'audit', icon: "fa fa-gavel" },
                { text: "系统管理", name: 'system', icon: "fa fa-cog" }
            ]

        };
    },
    computed: {

    },
    methods: {},
    created() {

    }
};
</script>
