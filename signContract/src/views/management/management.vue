<template>
    <div>
        <div :style="{height: $store.state.home.modelContentHeight-110 + 'px'}" class="contentBox">
            <div class="title">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="客户管理" name="first"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="content" :style="{height: $store.state.home.modelContentHeight-204 + 'px'}">
                <div class="contentTop" v-on:keyup.enter="searchList">
                    <el-form :inline="true" ref="form" :model="searchFormData" label-width="70px" >
                        
                        <el-form-item label="客户名称">
                            <el-input v-model="searchFormData.customerName" placeholder="请输入客户名称" size="small" clearable @clear="searchList" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="客户类型" >
                            <el-select v-model="searchFormData.customerType" placeholder="请选择客户类型" size="small" clearable @clear="searchList" >
                                <el-option
                                v-for="item in customerTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="证件号码" >
                            <el-input v-model="searchFormData.cardNo" size="small" clearable placeholder="请输入证件号码" @clear="searchList" ></el-input>
                        </el-form-item>
                        <el-form-item label="客户手机" style="margin-right:10px">
                            <el-input v-model="searchFormData.mobile" size="small" clearable placeholder="请输入客户手机" @clear="searchList" ></el-input>
                        </el-form-item>
                        <el-form-item  >
                            <el-button type="primary" size="small" @click="searchList">搜索</el-button>
                        </el-form-item>
                        <el-form-item  style="float:right">
                            <el-button type="primary" size="small" @click="goNew()">新增客户</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="contentText">
                    <el-table
                        :data="tableData"
                        style="width:98%;text-align:left;margin:auto;background:#fff;"
                        :height="$store.state.home.modelContentHeight - 325"
                        :header-cell-style="getRowClass"
                        @sort-change="sortChange"
                        :default-sort="{prop: 'Establish', order: 'descending'}"
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
                        <el-table-column label="客户类型">
                            <template slot-scope="scope">
                                <div>
                                    <span v-if="scope.row.customerType == '1'">企业用户</span>
                                    <span v-if="scope.row.customerType == '2'">个人用户</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="cardNo"
                            label="证件号码"
                            >
                        </el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <div>
                                    <span v-if="scope.row.status == '1'">可用</span>
                                    <span v-if="scope.row.status == '0'">不可用</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column  label="创建时间"  sortable="custom"  prop="Establish" width="200%">
                        </el-table-column>
                        <el-table-column label="操作" width="80%" >
                            <template slot-scope="scope">
                                <el-button @click="openDetail(scope.row.cardNo)" type="text" size="small">详情</el-button>
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
import api from 'api/management'
import filter from 'utils/filters'

export default {
    components: {
    },
    data(){
        return {
            searchFormData : {
                customerName:'',
                customerType:'',
                cardNo:'',
                mobile:'',
                sort:0
            },
            customerTypeList: [
                {
                    label:'企业用户',
                    value:'1'
                },
                {
                    label:'个人用户',
                    value:'2'
                }
            ],
            tableData : [{create:''}],
            totalPage:0,
            currentPage:1,
            page:{
                pageSize:10,
                pageNo:1
            },
            activeName: 'first'
        }
    },
    computed:{

    },
    methods:{
        /**
         * 搜索
         */
        searchList(){
            this.totalPage = 0
            this.page.pageNo = 1;
            this.sort = 0
            this.getList()
        },
        /**
         * 清空
         */
        clearAll() {
            for (let key in this.searchFormData) {
                this.searchFormData[key] = null
            }
            this.tableData = [{create:''}]
        },
        /**
         * 打开详情
         */
        openDetail(data) {
            this.$router.push('/managementDetail?cardNo=' + data)
        },
        handleSizeChange(val) {
            this.page.pageSize = val
            this.getList(this.page)

        },
        handleCurrentChange(val) {
            this.page.pageNo = val
            this.getList(this.page)
        },
        /**
         * 表格表头居中
         */
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'background:#fff;text-align:left;'
            } else {
                return ''
            }
        },
        /**
         * 获取列表
         */
        getList() {
            let that = this

            // this.tableData = []
            let params

            params = {
                pageNo: that.page.pageNo,
                pageSize: that.page.pageSize,
                customerName:that.searchFormData.customerName,
                customerType:that.searchFormData.customerType,
                cardNo:that.searchFormData.cardNo,
                mobile:that.searchFormData.mobile,
                sort:that.searchFormData.sort || 0
            }
            api.customerListPage(params).then((response) => {
                let data = response

                if (response.result == '1') {
                    this.tableData = data.data.customerInfoVOList || []
                    this.totalPage = data.data.listTotal || 0
                    this.tableData.map(p=>{
                        p.Establish = filter.time_s(p.created)
                    })
                }
            }).catch((error) => {
                this.$message({
                    message: '获取客户列表失败！',
                    type: 'warning'
                });
            })
        },
        /**
         * 排序
         */
        sortChange: function (action) {
            console.log(action, action.prop + action.order)
            this.searchFormData.sort = {
                'Establishdescending': 0,  //降序
                'Establishascending': 1  //升序
            }[action.prop + action.order] || 0
            this.getList()
        },
        handleClick() {
            
        },
        goNew(){
            this.$router.push('/managementNew')
        }
    },
    created(){
       
    },
    mounted(){},
    activated() {
        this.state = this.$store.state.home.routerState
        if (!this.state){
            this.clearAll()
            this.getList()
            this.$store.commit('setRouterState', false)
        }
    }
}
</script>

<style scoped>
.contentBox{
    background: #f5f5f5;
    padding: 20px;
}
.content{
    background: #fff;
    overflow: auto;
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
.el-form-item{
    margin-bottom: 15px;
}
.el-table--border::after, .el-table--group::after, .el-table::before{
    background: #fff;
}
</style>
