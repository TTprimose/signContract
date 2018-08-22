<template>
    <div :style="{height: $store.state.home.modelContentHeight-60 + 'px', width: $store.state.home.modelContentWidth + 'px'}" class="detailBox">
        <div class="contentBox">
            <div class="contentLeft">
                <div class="blockBox">
                    <div class="contentTitle">合同模板信息</div>
                    <div class="info">
                        <div>
                            <span>合同模板名称：</span><span>{{ formData.templateName }}</span>
                        </div>
                        <div >
                            <span>创建时间：</span>{{time}}<span></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="contentCenter">
                <div class="contentPdf">
                    <iframe :src="formData.templateFileUrl" width="100%" height="100%" style="border:1px solid #e3e4e6" security="restricted" ></iframe >
                </div>
                <div class="contentReturn">
                     <el-button size="small" @click="returnList" style="width:90px">返回</el-button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import api from 'api/template'
import filter from 'utils/filters'
export default {
    components: {
    },
    data(){
        return {
            formData:'',
            time:''
        }
    },
    computed:{

    },
    methods:{
        clearAll() {
            for (let key in this.formData) {
                this.formData[key] = null
            }
        },
        returnList() {
            this.clearAll()
            this.$router.go(-1)
            this.$store.commit('setRouterState', true)
        },
        getData() {
            api.templateDetail(this.$route.query.templateCode).then((response) => {
                console.log(response)
                this.formData = response.data
                this.time = filter.time_s(response.data.created)
            })
        }
    },
    created(){},
    mounted(){},
    activated() {
        this.clearAll()
        this.getData()
    }
}
</script>

<style scoped>
.detailBox{
    background: #f5f5f5;
    position: fixed;
    left: 0;
    top:60px;
    padding: 40px
}
.contentBox{
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    justify-content: space-between
}
.blockBox{
    padding-right: 30px;
    margin-bottom: 60px;
}
.contentLeft{
    width: 20%;
    overflow: auto;
}
.contentTitle{
    margin-bottom: 20px;
    font-size: 16px;
    text-align: left;
    text-indent: 16px;
    border-left: 4px solid #6994ea;
}
.contentSign{
    background: #fffbef;
    padding: 14px 32px;
    border: 1px dashed #e5d37f;
    margin-top: 28px;
    margin-bottom: 20px;
    text-align: center
}
.info{
    margin-top: 15px;
    padding: 8px;
    height: 80px;
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid #e3e4e6;
    font-size: 12px;

}
.info>div{
    padding: 5px
}
/* .contentCenter{
    width: 60%;
} */
.contentCenter{
    width: 80%;
}
.contentPdf{
    width: 100%;
    height: 90%;
    /* overflow: auto; */
    /* background: blueviolet */
}
.contentReturn{
    height: 10%;
    text-align: right;
    padding: 30px 0
}
/* .contentRight{
    width: 20%;
    background: blue
} */
</style>
