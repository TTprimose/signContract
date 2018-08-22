<template>
    <div :style="{height: $store.state.home.modelContentHeight-60 + 'px', width: $store.state.home.modelContentWidth + 'px'}" class="detailBox">
        <div class="contentBox">
            <div class="contentLeft">
                <div class="blockBox">
                    <div class="contentTitle">我的签章</div>
                    <div class="contentSign"  v-for="(date, index) in formData.signatoryInfoVOList" :key="index" v-if='date.isSponsor == 1'>
                        <img v-if='date.sealImageUrl != ""' :src="date.sealImageUrl" alt="" width="100%" >
                    </div>
                    <el-checkbox v-model="checked">使用CA证书</el-checkbox>
                </div>
                <div class="blockBox">
                    <div class="contentTitle">合同信息</div>
                    <div class="info" >
                        <div>
                            <span>合同名称：</span><span>{{ formData.contractName }}</span>
                        </div>
                        <div >
                            <span>到期时间：</span><span>{{ time | time_s }}</span>
                        </div>
                        <div v-if='formData.status == 2'>
                            <span>完成时间：</span><span>{{ formData.completedSignTime | time_s }}</span>
                        </div>
                    </div>
                </div>
                <div class="blockBox">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="发起方信息" name="first">
                            <div class="info">
                                <div>
                                    <span>发起方信息：</span>
                                    <span v-for="(date, index) in formData.signatoryInfoVOList" :key="index">
                                        <span v-if='date.isSponsor == 1'>{{ date.customerName }}</span>
                                    </span>
                                </div>
                                <div >
                                    <span>证件号：</span>
                                    <span v-for="(date, index) in formData.signatoryInfoVOList" :key="index">
                                        <span v-if='date.isSponsor == 1'>{{ date.cardNo }}</span>
                                    </span>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="签约方信息" name="second">
                            <div class="info">
                                <div>
                                    <span>签约方信息：</span>
                                    <span v-for="(date, index) in formData.signatoryInfoVOList" :key="index">
                                        <span v-if='date.isSponsor == 0'>{{ date.customerName }}</span>
                                    </span>
                                </div>
                                <div >
                                    <span>证件号：</span>
                                    <span v-for="(date, index) in formData.signatoryInfoVOList" :key="index">
                                        <span v-if='date.isSponsor == 0'>{{ date.cardNo }}</span>
                                    </span>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>

            <div class="contentCenter">
                <div class="contentReturn">
                     <el-button size="small" @click="returnList" style="width:90px">返回</el-button>
                </div>
                <div class="contentPdf">
                    <!-- <embed src="http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf" type="application/pdf" width="100%" height="100%" style="border:1px solid #e3e4e6" security="restricted" > -->
                    <!-- <iframe src="http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf" width="100%" height="100%" style="border:1px solid #e3e4e6" security="restricted" ></iframe > -->
                    <iframe v-if='formData.status == 2' :src="formData.contractUrl" width="100%" height="100%" style="border:1px solid #e3e4e6" security="restricted" ></iframe >
                    <iframe v-if='formData.status != 2' :src="formData.templateUrl" width="100%" height="100%" style="border:1px solid #e3e4e6" security="restricted" ></iframe >
                </div>

            </div>

        </div>
    </div>
</template>

<script>
import api from 'api/contract'
export default {
    components: {
    },
    data(){
        return {
            totalPage:0,
            currentPage:1,
            page:{
                pageSize:'',
                pageNo:''
            },
            contractDetailId:'',
            contractDetailNum:'',
            checked:true,
            activeName: 'first',
            formData:'',
            pdfUrl:'',
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
            this.time = ''
        },
        handleSizeChange(val) {
            this.page.pageSize = val

        },
        handleCurrentChange(val) {
            this.page.pageNo = val
        },
        returnList() {
            this.clearAll()
            this.$router.go(-1)
            this.$store.commit('setRouterState', true)
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        getData() {

            api.getcontractcontractNo(this.contractDetailId, this.contractDetailNum).then((response) => {
                console.log(response)
                this.formData = response.data
                this.time = this.formData.validityTime * 24 * 60 * 60 + this.formData.created

            })
        }
    },
    created(){},
    mounted(){},
    activated() {
        this.clearAll()
        this.contractDetailId = this.$route.params.id
        this.contractDetailNum = this.$route.params.num
        // console.log(this.contractDetailId, this.contractDetailNum)
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
    padding: 20px;
    /* padding-bottom: 0 */
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
    margin-bottom: 40px;
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
    /* height: 80px; */
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
    height: 93.5%;
    /* overflow: auto; */
    /* background: blueviolet */
}
.contentReturn{
    height: 5.8%;
    /* text-align: right; */
    /* padding: 30px 0 */
}
/* .contentRight{
    width: 20%;
    background: blue
} */
</style>
