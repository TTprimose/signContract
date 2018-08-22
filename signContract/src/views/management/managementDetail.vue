<template>
    <div>
        <!-- <div :style="{height: $store.state.home.modelContentHeight-60 + 'px'}" class="contentBox">
            <div >
               
            </div>
        </div> -->
        <div :style="{height: $store.state.home.modelContentHeight-110 + 'px'}" class="contentBox">
            <div >
                 <el-tabs v-model="activeName" >
                    <el-tab-pane label="客户详情" name="first"></el-tab-pane>
                </el-tabs>
                <div class="info" :style="{height: $store.state.home.modelContentHeight-205 + 'px'}">
                    <div class="title">客户详情</div>
                    <div style="margin-left:14px">
                        <el-row :gutter="20">
                            <el-col :span="10"><span>客户姓名</span><span>{{managementDetail.customerName}}</span></el-col>
                            <el-col :span="10"><span>证件号码</span><span>{{managementDetail.cardNo}}</span></el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10"><span>客户手机号</span><span>{{managementDetail.mobile}}</span></el-col>
                            <el-col :span="10"><span>客户邮箱</span><span>{{managementDetail.email || '--'}}</span></el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10"><span>客户类型</span><span v-if="managementDetail.customerType == '1'">企业用户</span><span v-if="managementDetail.customerType == '2'">个人用户</span></el-col>
                            <el-col :span="10"><span>法人姓名</span><span>{{managementDetail.legalPerson || '--'}}</span></el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10"><span>法人身份证号码</span><span>{{managementDetail.legalPersonIdCard || '--'}}</span></el-col>
                            <el-col :span="10"><span>认证手机号</span><span>{{managementDetail.identifyMobile || '--'}}</span></el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10"><span>银行卡账号</span><span>{{managementDetail.bankCard || '--'}}</span></el-col>
                            <el-col :span="10"><span>状态</span><span v-if="managementDetail.status == '1'">可用</span><span v-if="managementDetail.status == '0'">不可用</span></el-col>
                        </el-row>
                        <el-row :gutter="20" :style="{borderBottom:managementDetail.sealImageUrl ? '1px solid #eee': 'none'}">
                            <el-col :span="10"><span>创建时间</span><span>{{Establish || '--'}}</span></el-col>
                        </el-row>
                        <el-row :gutter="20" v-show="managementDetail.sealImageUrl" style="borderBottom:none">
                            <el-col :span="20"><span>印章图片</span><span class="img"><img :src="managementDetail.sealImageUrl" @click="dialogVisible = true"></span></el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </div>
        <div class="block">
            <el-button size="small" @click="returnList" style="width:90px" class="btn">返回</el-button>
        </div>
        <el-dialog :visible.sync="dialogVisible" class="imgDia">
            <img width="100%" :src="managementDetail.sealImageUrl" alt="">
        </el-dialog>
    </div>

</template>

<script>
import api from 'api/management'
import filter from 'utils/filters'
export default {
    components: {
    },
    data(){
        return {
            activeName: 'first',
            managementDetail:{},
            Establish: '',
            dialogVisible:false
            
        }
    },
    computed:{

    },
    methods:{
        returnList() {
            this.clearAll()
            this.$router.go(-1)
            this.$store.commit('setRouterState', true)
        },
        clearAll() {
            for (let key in this.managementDetail) {
                this.managementDetail[key] = null
            }
            this.Establish = ''
        },
        handleSizeChange(val) {
            this.page.pageSize = val

        },
        handleCurrentChange(val) {
            this.page.pageNo = val
        },
        getDetail() {
            let cardNo = this.$route.query.cardNo

            api.customerDetail(cardNo).then((response) => {
                if (response.result == '1') {
                    this.managementDetail = response.data
                    this.Establish = filter.time_s(response.data.created)
                }
            }).catch((error) => {
                this.$message({
                    message: '获取客户详情失败！',
                    type: 'warning'
                });
            })
        }
    },
    created(){},
    mounted(){},
    activated() {
        this.clearAll()
        this.getDetail()
    }
}
</script>

<style scoped>
.contentBox{ 
    background: #f5f5f5;
    padding: 20px
}
.info{
  padding:25px;
  background: #fff;
}
.title{
  border-left: 4px solid #5782d9;
  padding-left:10px;
  margin-bottom: 15px;
}
.el-row{
  height: 70px;
  line-height: 70px;
  border-bottom: 1px solid #eee;
}
.el-col :first-child{
  display: inline-block;
  width: 100px;
  color: #adadad;
  margin-right: 40px;
}
.el-col :last-child{
  color: #444;
}

.img :first-child{
  display: inline-block;
  width: 100px;
  margin-right: 10px;
}
.img{
    display: inline-block;
}
.img img{
    height: 100px;
    margin-right: 10px;
    margin-top: 10px;
}
.btn{
   margin-left: 22px; 
   margin-top: 10px;
   border: 1px solid #dcdfe6;
}
</style>
