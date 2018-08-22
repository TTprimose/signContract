<template>
    <div>
        <div :style="{height: $store.state.home.modelContentHeight-110 + 'px'}" class="contentBox">
            <div >
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="操作日志" name="first">
                        <div class="content"  :style="{height: $store.state.home.modelContentHeight-204 + 'px'}">
                            <div class="contentTop">
                                <el-form :inline="true" :model="page" class="demo-form-inline">
                                    <el-form-item label="开始时间">
                                        <el-date-picker
                                            v-model="page.startTime"
                                            type="datetime"
                                            placeholder="选择开始时间"
                                            size='small'
                                            @change="onFind"
                                            @keyup.enter.native='onSearch'>
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间">
                                        <el-date-picker
                                            v-model="page.endTime"
                                            type="datetime"
                                            placeholder="选择日期时间"
                                            default-time="23:59:59"
                                            size='small'
                                            @keyup.enter.native='onSearch'>
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="onSearch" size='small'>搜索</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="contentText">
                                <el-table
                                    :data="formDataO"
                                    style="width: 98%;margin:auto">
                                    <el-table-column
                                        label="#"
                                        width='50'>
                                        <template slot-scope="scope">
                                            <span v-if='page.pageNo > 0'>{{ scope.$index + 1 + page.pageSize * ( page.pageNo - 1 ) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="操作内容">
                                        <template slot-scope="scope">
                                            <span>操作人：{{ scope.row.userName }} ；</span>
                                            &nbsp;
                                            <span>创建时间：{{ scope.row.created | time_s }} ；</span>
                                            &nbsp;
                                            <span>操作Ip：{{ scope.row.operateIp }} ；</span>
                                            &nbsp;
                                            <span>操作类型：
                                                <span v-if='scope.row.operateType == 0'>登录 ；</span>
                                                <span v-if='scope.row.operateType == 1'>新增客户 ；</span>
                                                <span v-if='scope.row.operateType == 2'>新增模板 ；</span>
                                                <span v-if='scope.row.operateType == 3'>新增合同并签约 ；</span>
                                                <span v-if='scope.row.operateType == 4'>更新合同 ；</span>
                                                <span v-if='scope.row.operateType == 5'>修改用户信息 ；</span>
                                                <span v-if='scope.row.operateType == 6'>删除模板 ；</span>
                                                <!-- {{ scope.row.operateType }} -->
                                            </span>
                                            <!-- &nbsp;
                                            <span>操作对象：
                                                <span v-if='scope.row.operateObject == 0'>不存在</span>
                                                <span v-if='scope.row.operateObject == 1'>客户code</span>
                                                <span v-if='scope.row.operateObject == 2'>模板code</span>
                                                <span v-if='scope.row.operateObject == 3'>合同code</span>
                                                <span v-if='scope.row.operateObject == 4'>合同code</span>
                                                <span v-if='scope.row.operateObject == 5'>用户id</span>
                                                {{ scope.row.operateObject }}
                                            </span>
                                            &nbsp; -->
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="签约日志" name="second">
                        <div class="content"  :style="{height: $store.state.home.modelContentHeight-204 + 'px'}">
                            <div class="contentTop">
                                <el-form :inline="true" :model="page" class="demo-form-inline">
                                    <el-form-item label="开始时间">
                                        <el-date-picker
                                            v-model="page.startTime"
                                            type="datetime"
                                            placeholder="选择开始时间"
                                            size='small'
                                            @change="onFind"
                                            @keyup.enter.native='onSearch'>
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间">
                                        <el-date-picker
                                            v-model="page.endTime"
                                            type="datetime"
                                            placeholder="选择日期时间"
                                            default-time="23:59:59"
                                            size='small'
                                            @keyup.enter.native='onSearch'>
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="onSearch" size='small'>搜索</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="contentText">
                                <el-table
                                    :data="formDataT"
                                    style="width: 98%;margin:auto">
                                    <el-table-column
                                        label="#"
                                        width='50'>
                                        <template slot-scope="scope">
                                            <span v-if='page.pageNo > 0'>{{ scope.$index + 1 + page.pageSize * ( page.pageNo - 1 ) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="操作内容">
                                        <template slot-scope="scope">
                                            <span>操作人：{{ scope.row.userName }} ；</span>
                                            &nbsp;
                                            <span>创建时间：{{ scope.row.created | time_s }} ；</span>
                                            &nbsp;
                                            <span>操作Ip：{{ scope.row.operateIp }} ；</span>
                                            &nbsp;
                                            <span>操作类型：
                                                <span v-if='scope.row.operateType == 0'>登录 ；</span>
                                                <span v-if='scope.row.operateType == 1'>新增客户 ；</span>
                                                <span v-if='scope.row.operateType == 2'>新增模板 ；</span>
                                                <span v-if='scope.row.operateType == 3'>新增合同并签约 ；</span>
                                                <span v-if='scope.row.operateType == 4'>更新合同 ；</span>
                                                <span v-if='scope.row.operateType == 5'>修改用户信息 ；</span>
                                                <span v-if='scope.row.operateType == 6'>删除模板 ；</span>
                                                <!-- {{ scope.row.operateType }} -->
                                            </span>
                                            <!-- &nbsp;
                                            <span>操作对象：
                                                <span v-if='scope.row.operateObject == 0'>不存在</span>
                                                <span v-if='scope.row.operateObject == 1'>客户code</span>
                                                <span v-if='scope.row.operateObject == 2'>模板code</span>
                                                <span v-if='scope.row.operateObject == 3'>合同code</span>
                                                <span v-if='scope.row.operateObject == 4'>合同code</span>
                                                <span v-if='scope.row.operateObject == 5'>用户id</span>
                                                {{ scope.row.operateObject }}
                                            </span>
                                            &nbsp; -->
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
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
import api from 'api/audit'
export default {
    components: {
    },
    data(){
        return {
            totalPage:0,
            page:{
                type:'0',
                pageSize:10,
                pageNo:1,
                startTime:'',
                endTime:''
            },
            activeName: 'first',
            formDataO:[],
            formDataT:[],
            pageType:'1'
        }
    },
    computed:{

    },
    methods:{
        clearAll() {
            for (let key in this.formDataO) {
                this.formDataO[key] = ''
            }
            for (let key in this.formDataT) {
                this.formDataT[key] = ''
            }
        },
        clearPage() {
            for (let key in this.page) {
                this.page[key] = ''
            }
            this.page.pageSize = 10
            this.page.pageNo = 1
            this.pageType = '1'
        },
        handleSizeChange(val) {
            if (!this.page.startTime){
                this.page.startTime = ''
            }
            if (!this.page.endTime){
                this.page.endTime = ''
            }
            this.page.pageSize = val
            this.getForm()
        },
        handleCurrentChange(val) {
            if (!this.page.startTime){
                this.page.startTime = ''
            }
            if (!this.page.endTime){
                this.page.endTime = ''
            }
            this.page.pageNo = val
            this.getForm()
        },
        handleClick(tab, event) {
            this.clearAll()
            this.clearPage()
            if (tab.name == 'first'){
                this.getTabForm(0)
                this.pageType = '1'
            }
            if (tab.name == 'second'){
                this.getTabForm(1)
                this.pageType = '2'
            }

        },
        getTabForm(data) {
            this.page.type = data

            let obj = {
                type:this.page.type,
                pageSize:this.page.pageSize,
                pageNo:this.page.pageNo,
                startTime:'',
                endTime:''
            }

            if (this.page.startTime != ''){
                obj.startTime = Date.parse(this.page.startTime) / 1000
            }
            if (this.page.endTime != ''){
                obj.endTime = Date.parse(this.page.endTime) / 1000
            }

            // 请求接口返回数据后
            api.getoperatelistPage(obj).then((response) => {
                // console.log(response)
                if (this.page.type == 0){
                    this.formDataO = response.data.operateLogVOList
                    this.totalPage = response.data.listTotal
                }
                if (this.page.type == 1){
                    this.formDataT = response.data.operateLogVOList
                    this.totalPage = response.data.listTotal
                }
            })
        },
        getForm() {
            if (this.pageType == '1'){
                this.getTabForm(0)
            }
            if (this.pageType == '2'){
                this.getTabForm(1)
            }
        },
        onSearch() {
            if (!this.page.startTime){
                this.page.startTime = ''
                this.getForm()
            }
            if (!this.page.endTime){
                this.page.endTime = ''
                this.getForm()
            }
            this.page.pageSize = 10
            this.page.pageNo = 1
            if (this.pageType == '1'){
                this.getTabForm(0)
            }
            if (this.pageType == '2'){
                this.getTabForm(1)
            }
        }
    },
    created(){},
    mounted(){},
    activated() {
        this.clearPage()
        this.clearAll()
        this.getTabForm(0)
        this.activeName = 'first'
    }
}
</script>

<style scoped>
.contentBox{
    background: #f5f5f5;
    padding: 20px
}
.block{
    height: 50px;
    background: white;
    text-align: right;
    padding-right: 50px
}
.content{
    background: white;
    overflow: auto
}
.contentTop{
    width: 98%;
    margin: auto;
    padding-top:10px
}
</style>
