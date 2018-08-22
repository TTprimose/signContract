<template>
    <div>
        <div :style="{height: $store.state.home.modelContentHeight - 110 + 'px'}" class="contentBox">
            <div class="today_bulletin">
                <div class="title">今日简报</div>
                <ul  class="today_bulletin_ul">
                    <li>
                        <img src="../../../static/img/index/customer.png">
                        <span>个人客户 <b>{{SignTotal.personalTotal || 0}}</b></span>
                    </li>
                    <li>
                        <img src="../../../static/img/index/company.png">
                        <span>企业客户 <b>{{SignTotal.enterpriseTotal || 0}}</b></span>
                    </li>
                    <li>
                        <img src="../../../static/img/index/contractInfo.png">
                        <span>签约总数 <b>{{SignTotal.signTotal || 0}}</b></span>
                    </li>
                    <li>
                        <img src="../../../static/img/index/overdue.png">
                        <span>已过期签约 <b>{{SignTotal.overTimeTotal || 0}}</b></span>
                    </li>
                </ul>
            </div>
            <div  style="margin:36px 0px 15px;font-weight:bold">数据统计</div>
            <div class="list" :style="{height: $store.state.home.modelContentHeight-419 + 'px'}">
                <el-table
                    :data="tableData"
                    style="width:98%;margin:auto;text-align:left"
                    :header-cell-style="getRowClass"
                    height="100%"
                    >
                    <el-table-column
                        width="30"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="customerName"
                        label="客户名称"
                        >
                    </el-table-column>
                    <el-table-column label="客户类型" >
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.customerType == '1'">企业用户</span>
                                <span v-if="scope.row.customerType == '2'">个人用户</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="signTatol"
                        label="当日签约数"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="notSignTatol"
                        label="当日未签约数"
                        >
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 30, 50, 100]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </div>
    </div>


</template>

<script>
import api from 'api/myMain'
export default {
    components: {
    },
    data(){
        return {
            tableData : [],
            totalPage:0,
            currentPage:1,
            page:{
                pageSize:10,
                pageNo:1
            },
            SignTotal:{}
        }
    },
    computed:{
    },
    methods:{
        handleSizeChange(val) {
            this.page.pageSize = val
            this.getList(this.page)
        },
        handleCurrentChange(val) {
            this.page.pageNo = val
            this.getList(this.page)
        },
        clearAll() {
            for (let key in this.FormData) {
                this.FormData[key] = null
            }
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'background:#fff;text-align:left'
            } else {
                return ''
            }
        },
        getTotal() {
            api.homeIndex().then((response) => {
                if (response.result == '1') {
                    this.SignTotal = response.data
                }
            }).catch((error) => {
                this.$message({
                    message: '获取统计信息失败！',
                    type: 'warning'
                });
            })
        },
        getList() {
            let that = this

            // this.tableData = []
            let params

            params = {
                pageNo: that.page.pageNo,
                pageSize: that.page.pageSize
            }
            api.homeList(params).then((response) => {
                let data = response

                if (response.result == '1') {
                    this.tableData = data.data.homeDataList || []
                    this.totalPage = data.data.homeDataTotal || 0
                }
            }).catch((error) => {
                this.$message({
                    message: '获取签约表失败！',
                    type: 'warning'
                });
            })
        }
    },
    created(){},
    mounted(){},
    activated() {
        this.clearAll()
        this.getTotal()
        this.getList()
    }
}
</script>

<style scoped>
.contentBox{
    background: #f5f5f5;
    padding: 20px
}
.today_bulletin{
    width: 100%;
}
.title{
    font-weight: bold;
    margin:20px 0px 18px;
}
.today_bulletin_ul{
    list-style-type: none;
    width: 100%;
    height: 140px;
    padding: 0px;
}
.today_bulletin_ul li{
    float: left;
    width: calc(25% - 15px);
    height: 100%;
    background: #fff;
    border-radius: 5px;
    position: relative;
    display: flex;
    margin-left: 20px;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}
.today_bulletin_ul li:first-child{
    margin-left: 0px;
}
.today_bulletin_ul li img{
    height: 40px;
    margin: 0 auto 10px;
}
.today_bulletin_ul li span{
    font-size: 14px;
    color: #333333;
    font-family: MicrosoftYaHei;
}
.today_bulletin_ul li b{
    font-weight: normal;
    color: #409eff;
    margin-left: 21px;
}
.list{
    padding-top: 5px;
    background: white;
    overflow: auto
}
.block{
    height: 50px;
    background: white;
    text-align: right;
    padding-right: 50px
}
</style>
