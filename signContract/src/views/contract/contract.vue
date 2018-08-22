<template>
    <div>
        <div :style="{height: $store.state.home.modelContentHeight-110 + 'px'}" class="contentBox">
            <div class="title">
                <el-tabs v-model="activeName" >
                    <el-tab-pane label="合同管理" name="first" ></el-tab-pane>
                </el-tabs>
            </div>
            <div class="content" :style="{height: $store.state.home.modelContentHeight-204 + 'px'}">
                <div class="contentTop">
                    <el-form :inline="true" :model="page" class="demo-form-inline">
                        <el-form-item label="甲方名称">
                            <el-input v-model="page.customerName" placeholder="请输入甲方名称" size='small' clearable @clear="onFind"  @keyup.enter.native='onSearch'></el-input>
                        </el-form-item>
                        <el-form-item label="合同编号">
                            <el-input v-model="page.contractNo" placeholder="请输入合同编号" size='small' clearable @clear="onFind"  @keyup.enter.native='onSearch'></el-input>
                        </el-form-item>
                        <el-form-item label="甲方手机">
                            <el-input v-model="page.mobile" placeholder="请输入甲方手机" size='small' clearable @clear="onFind"  @keyup.enter.native='onSearch'></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSearch" size='small'>搜索</el-button>
                        </el-form-item>
                        <el-form-item class="openadd">
                            <el-button type="primary" @click="openAdd" size='small' >新建合同</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="contentText">
                    <el-table
                        :data="formData"
                        style="width: 98%;margin:auto;text-align:left"
                        :header-cell-style="getRowClass"
                        :height="$store.state.home.modelContentHeight - 277">
                        <el-table-column width='30'>
                        </el-table-column>
                        <el-table-column
                            prop="contractName"
                            label="合同名称">
                        </el-table-column>
                        <el-table-column
                            prop="contractNo"
                            label="合同编号">
                        </el-table-column>
                        <el-table-column
                            prop="signatoryInfoVOList"
                            label="甲方名称">
                            <template slot-scope="scope">
                                <span v-for="(date, index) in scope.row.signatoryInfoVOList" :key="index">
                                    <span v-if='date.isSponsor == 1' >{{ date.customerName }}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="signatoryInfoVOList"
                            label="甲方手机">
                            <template slot-scope="scope">
                                <span v-for="(date, index) in scope.row.signatoryInfoVOList" :key="index">
                                    <span v-if='date.isSponsor == 1' >{{ date.mobile }}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="signatoryInfoVOList"
                            label="乙方签约人">
                            <template slot-scope="scope">
                                <span v-for="(date, index) in scope.row.signatoryInfoVOList" :key="index">
                                    <span v-if='date.isSponsor == 0' >{{ date.customerName }}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="signatoryInfoVOList"
                            label="乙方手机">
                            <template slot-scope="scope">
                                <span v-for="(date, index) in scope.row.signatoryInfoVOList" :key="index">
                                    <span v-if='date.isSponsor == 0' >{{ date.mobile }}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="created"
                            label="创建时间">
                            <template slot-scope="scope">
                                <span>{{ scope.row.created | time_s }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="签约过期时间">
                            <template slot-scope="scope">
                                <span>{{ scope.row.validityTime * 24 * 60 * 60 + scope.row.created | time_s }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="created"
                            label="状态"
                            width='70'>
                            <template slot-scope="scope">
                                <span v-if='scope.row.status == 0' style="color:#cccdd0">草稿</span>
                                <span v-if='scope.row.status == 1' style="color:#edbb7e">待签约</span>
                                <span v-if='scope.row.status == 2' style="color:#67c23b">已签约</span>
                                <span v-if='scope.row.status == 3' style="color:#f78e8e">过期</span>
                                <span v-if='scope.row.status == 4' style="color:#7a7c7f">拒签</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="other"
                            label="操作"
                            width='150%'>
                            <template slot-scope="scope">
                                <el-button @click="FDetail(scope.row)" type="text" size="small">更新</el-button>
                                <el-button @click="openDetail(scope.row)" type="text" size="small">详情</el-button>
                                <el-button type="text" size="small">
                                    <span v-if='scope.row.status == 2'><a :href="scope.row.contractUrl" download target="_blank" style="color:#409EFF;text-decoration: none">下载</a></span>
                                    <span v-if='scope.row.status != 2'><a :href="scope.row.templateUrl" download target="_blank" style="color:#409EFF;text-decoration: none">下载</a></span>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.pageNo"
                :page-sizes="[10, 30, 50, 100]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
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
            page:{
                pageSize:10,
                pageNo:1,
                customerName:'',
                contractNo:'',
                cardNo:'',
                mobile:''
            },
            activeName: 'first',
            formData:[],
            time:'',
            state:false
        }
    },
    computed:{

    },
    methods:{
        clearAll() {
            for (let key in this.formData) {
                this.formData[key] = null
            }
            for (let key in this.page) {
                this.page[key] = ''
            }
            this.page.pageSize = 10
            this.page.pageNo = 1
        },
        getData(data) {
            api.getcontractlistPage(data).then((response) => {
                // console.log(response)
                this.formData = response.data.contractList
                this.totalPage = response.data.listTotal
                this.time = this.formData.validityTime * 24 * 60 * 60 + this.formData.created
            })
        },
        handleSizeChange(val) {
            this.page.pageSize = val
            this.getData(this.page)

        },
        handleCurrentChange(val) {
            this.page.pageNo = val
            this.getData(this.page)
        },
        onSearch() {
            this.page.pageSize = 10
            this.page.pageNo = 1
            this.getData(this.page)
        },
        onFind() {
            if (this.page.customerName == '' && this.page.contractNo == '' && this.page.mobile == ''){
                this.getData(this.page)
            }
        },
        openAdd() {
            this.$router.push({
                path:'/addcontract'
            })
        },
        openDetail(data) {
            // console.log(data)
            let num = ''

            for (let i in data.signatoryInfoVOList){
                if (data.signatoryInfoVOList[i].isSponsor == 0){
                    num = data.signatoryInfoVOList[i].cardNo
                    // console.log(num)
                }
            }
            this.$router.push(
                {
                    name: '合同详情',
                    params: {
                        id: data.contractNo,
                        num: num
                    }
                }
            )
        },
        downDetail(data) {

        },
        FDetail(data) {
            // console.log(data.contractNo)
            api.getcontractreplace(data.contractNo).then((res) => {
                this.$message({
                    message: '合同更新成功！',
                    duration: 1000,
                    type: 'success'
                })
                this.getData(this.page)
            }).catch((error) => {
                this.$message({
                    message: '合同刷新失败，请检查网络或稍后重试',
                    duration: 1000,
                    type: 'error'
                })
            })
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'text-align:left'
            } else {
                return ''
            }
        }

    },
    created(){},
    mounted(){},
    activated() {
        this.state = this.$store.state.home.routerState
        if (!this.state){
            this.clearAll()
            this.getData(this.page)
            this.$store.commit('setRouterState', false)
        }
    }
}
</script>

<style scoped>
.contentBox{
    background: #f5f5f5;
    padding: 20px
}
.content{
    background: white;
    overflow: auto
}
.block{
    height: 50px;
    background: white;
    text-align: right;
    padding-right: 50px
}
.contentTop{
    width: 98%;
    margin: auto;
    padding-top: 10px;
}
.openadd{
    float:right;
    margin: 0
}
</style>
