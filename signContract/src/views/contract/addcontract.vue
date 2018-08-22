<template>
    <div>
        <div :style="{height: $store.state.home.modelContentHeight-110 + 'px'}" class="contentBox">
            <div class="title">
                <el-tabs v-model="activeName" >
                    <el-tab-pane label="新增合同" name="first" ></el-tab-pane>
                </el-tabs>
            </div>
            <div class="content" :style="{height: $store.state.home.modelContentHeight-204 + 'px'}">
                <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm contentT">
                    <el-form-item label="合同名称：" prop="contractName" >
                        <el-input v-model="formData.contractName" size='small' placeholder="请输入合同名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="合同编号：" prop="contractNo">
                        <el-input v-model="formData.contractNo" size='small' placeholder="请输入合同编号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="签约有效期：" prop="validityTime">
                        <el-input v-model="formData.validityTime" size='small' placeholder="请输入 1 - 30天 签约有效期" clearable>
                            <template slot="append">天</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="合同模板：" prop="templateIdent">
                        <el-select v-model="formData.templateCode" placeholder="请选择合同模板" size='small' clearable>
                            <el-option
                                v-for="item in templateIdentOptions"
                                :key="item.templateCode"
                                :label="item.templateName"
                                :value="item.templateCode"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="签约方式：" prop="signOrder">
                        <el-select v-model="formData.signType" placeholder="请选择签约方式" size='small' clearable>
                            <el-option
                                v-for="item in signTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择甲方：" >
                        <div>
                            <el-input placeholder="请选择甲方" v-model="formData.contractUserList" size='small' @focus="findJia"  class="cursoInput" :disabled="disTF"></el-input>
                            <!-- <el-button slot="append" icon="el-icon-more" ></el-button> -->
                            <i class="el-icon-more findPeo" style="position: absolute;margin-top: 14px;margin-left: -25px;color: #999;" @click="findJia"></i>
                        </div>
                        <div class='otherInput'>
                            <el-dialog
                                title="选择甲方"
                                :visible.sync="dialogVisibleJ"
                                width="50%"
                                style="margin-top: -1vh"
                                :close-on-click-modal='false'
                                @close='returnJia'>
                                <el-input v-model="page1.customerName" size='small' placeholder="请输入甲方" clearable style="margin:auto" @keyup.enter.native='searchJia' @clear="searchJia">
                                    <el-button slot="append" icon="el-icon-search" @click="searchJia" ></el-button>
                                </el-input>
                                <el-table
                                    :data="contractUserListOptions1"
                                    style="width:100%;text-align:center;margin:auto;background:#fff;"
                                    :header-cell-style="getRowClass"
                                    @selection-change="handleSelectionChange1"
                                    :height="$store.state.home.modelContentHeight - 485"
                                    ref="select1">
                                    <el-table-column
                                        type="selection"
                                        width="30">
                                    </el-table-column>
                                    <el-table-column property="customerName" label="客户名称" ></el-table-column>
                                    <el-table-column property="customerType" label="客户类型" >
                                        <template slot-scope="scope">
                                            <div>
                                                <span v-if="scope.row.customerType == '1'">企业用户</span>
                                                <span v-if="scope.row.customerType == '2'">个人用户</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column property="cardNo" label="证件号码"></el-table-column>
                                </el-table>
                                <div style="text-align:right;height:55px;width:100%;overflow:auto">
                                    <el-pagination
                                        @size-change="handleSizeChange1"
                                        @current-change="handleCurrentChange1"
                                        :current-page="currentPage1"
                                        :page-sizes="[10, 30, 50, 100]"
                                        :page-size="10"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="totalPage1">
                                    </el-pagination>
                                </div>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="clearJia" size='small'>取消选择</el-button>
                                    <el-button @click="returnJia" size='small'>取 消</el-button>
                                    <el-button type="primary" @click="trueJia" size='small'>确 定</el-button>
                                </span>
                            </el-dialog>
                        </div>
                    </el-form-item>
                    <el-form-item label="甲方签约关键字：" >
                        <el-input v-model="formData.contractFile" size='small' clearable placeholder='请输入甲方签约关键字！'></el-input>
                    </el-form-item>

                    <el-form-item label="选择乙方：" class="addTab">
                        <el-table
                            :data="tabData"
                            style="width: 98%;text-align:center;border: 1px solid #ebeef5;border-bottom:none"
                            id="addTab"
                            :header-cell-style="getRowClass">
                            <el-table-column
                                prop="other"
                                width='150'>
                                <template slot-scope="scope">
                                    <div class="addAndRemove">
                                        <i class="el-icon-plus" @click="tabAdd"></i>
                                        &nbsp;
                                        &nbsp;
                                        <i class="el-icon-minus removeI" @click="tabRemove(scope.$index, tabData)"></i>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                prop="signOrder"
                                label="排序"
                                width='100'
                                style="text-align:left">
                                <template slot-scope="scope">
                                    <div class="sortBox">
                                        <el-input
                                            v-model="scope.row.signOrder"
                                            size='small' style="width:50px"
                                            :maxlength= 4
                                            onKeyUp="value=value.replace(/[^\d]/g,'') "
                                            onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"
                                            placeholder="数字">
                                        </el-input>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                prop="cardNo"
                                label="乙方名称">
                                <template slot-scope="scope">
                                    <div>
                                        <el-input placeholder="请选择乙方" v-model="scope.row.cardNo" size='small'  class="cursoInput" :disabled="disTF" @focus="findYi(scope.$index, scope.row)"></el-input>
                                        <i class="el-icon-more findPeo" style="position: absolute;color: #999;margin-top: 10px;margin-left: -25px" @click="findYi(scope.$index, scope.row)"></i>
                                    </div>
                                    <div class="otherInput">
                                        <el-dialog
                                            title="选择乙方"
                                            :visible.sync="dialogVisibleY"
                                            width="50%"
                                            style="margin-top: -1vh;"
                                            :close-on-click-modal='false'
                                            @close="returnYi">
                                            <div style="text-align:left">
                                                <el-input v-model="page2.customerName" size='small' placeholder="请输入乙方" clearable @keyup.enter.native='searchYi' @clear="searchYi">
                                                    <el-button slot="append" icon="el-icon-search" @click="searchYi" ></el-button>
                                                </el-input>
                                            </div>
                                            <el-table
                                                :data="contractUserListOptions2"
                                                style="width:100%;text-align:center;margin:auto;background:#fff;"
                                                :header-cell-style="getRowClass"
                                                @selection-change="handleSelectionChange2"
                                                :height="$store.state.home.modelContentHeight - 470"
                                                ref='selcetOp'
                                                :row-key="getRowKeys">
                                                <el-table-column
                                                    type="selection"
                                                    :reserve-selection="true"
                                                    width="30">
                                                </el-table-column>
                                                <el-table-column property="customerName" label="客户名称" ></el-table-column>
                                                <el-table-column property="customerType" label="客户类型" >
                                                    <template slot-scope="scope">
                                                        <div>
                                                            <span v-if="scope.row.customerType == '1'">企业用户</span>
                                                            <span v-if="scope.row.customerType == '2'">个人用户</span>
                                                        </div>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column property="cardNo" label="证件号码"></el-table-column>
                                            </el-table>
                                            <div style="text-align:right;height:55px;width:100%;overflow:auto">
                                                <el-pagination
                                                    @size-change="handleSizeChange2"
                                                    @current-change="handleCurrentChange2"
                                                    :current-page="currentPage2"
                                                    :page-sizes="[10, 30, 50, 100]"
                                                    :page-size="10"
                                                    layout="total, sizes, prev, pager, next, jumper"
                                                    :total="totalPage2">
                                                </el-pagination>
                                            </div>

                                            <span slot="footer" class="dialog-footer">
                                                <el-button @click="returnYi" size='small'>取 消</el-button>
                                                <el-button type="primary" @click="trueYi" size='small'>确 定</el-button>
                                            </span>
                                        </el-dialog>
                                    </div>

                                </template>
                            </el-table-column>

                            <el-table-column
                                prop="signKey"
                                label="乙方签约关键字">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.signKey" size='small' clearable class="cursoInput" placeholder='请输入签约关键字！'></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column
                                prop="signMobile"
                                label="签约手机号">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.signMobile" size='small' clearable class="cursoInput" :disabled='true'></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column
                                prop="signMobe"
                                label="签约链接模型">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.signMobe" placeholder="请选择签约链接模型" size='small' clearable class="cursoInput">
                                        <el-option
                                            v-for="item in signMobeOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        >
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="block">
            <el-button type="primary" size="small" style="width:90px" @click='trueConfirm' :disabled="trueCon" v-loading.fullscreen.lock='loading' element-loading-text="努力提交中！">提交</el-button>
            <el-button size="small" style="width:90px" @click="returnGo">取消</el-button>
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
            totalPage1:0,
            currentPage1:1,
            page1:{
                pageSize:10,
                pageNo:1,
                customerName:''
            },
            totalPage2:0,
            currentPage2:1,
            page2:{
                pageSize:10,
                pageNo:1,
                customerName:''
            },
            activeName: 'first',
            rules: {
                contractName: [
                    { required: true, message: '请输入合同名称', trigger: 'blur' }
                ],
                contractNo: [
                    { required: true, message: '请输入合同编码', trigger: 'blur' }
                ],
                validityTime: [
                    { required: true, message: '请选择30天以内合同效期', trigger: 'blur' },
                    {pattern: /^([12][0-9]|30|[1-9])$/, message:'请输入正确天数'}
                ],
                templateCode: [
                    { required: true, message: '请选择合同模板', trigger: 'change' }
                ],
                signType: [
                    { required: true, message: '请选择签约方式', trigger: 'change' }
                ]

            },
            formData:{
                contractName:'',
                contractNo:'',
                validityTime:'',
                templateCode:'',
                signType:'',
                contractUserList:'',
                contractFile:''
            },

            tabData:[
                {
                    IsSponsor: 0,
                    cardNo:'',
                    signKey:'',
                    signMobile:'',
                    signMobe:'',
                    signOrder:''
                }
            ],

            templateIdentOptions:[],
            signTypeOptions:[
                {
                    value:'0',
                    label:'无序签约'
                },
                {
                    value:'1',
                    label:'顺序签约'
                }
            ],
            contractUserListOptions1:[],
            contractUserListOptions2:[],
            signMobeOptions:[
                {
                    value:'1',
                    label:'web'
                },
                {
                    value:'2',
                    label:'手机端'
                }
            ],


            dialogVisibleJ:false,
            dialogVisibleY:false,
            disTF:false,

            jiaChange:[],
            yiChange:[],
            index:'',
            indexdata:'',
            jiaArr:[],
            yiArr:[],

            trueCon:false,
            loading:false
        }
    },
    computed:{

    },
    methods:{
        clearAll() {
            for (let key in this.formData) {
                this.formData[key] = ''
            }
            this.tabData = [
                {
                    IsSponsor: 0,
                    cardNo:'',
                    signKey:'',
                    signMobile:'',
                    signMobe:'',
                    signOrder:''
                }
            ]
            this.jiaArr = []
            this.yiArr = []
            this.trueCon = false
        },
        handleSizeChange1(val) {
            this.page1.pageSize = val
            this.getcustomerOptions1()

        },
        handleCurrentChange1(val) {
            this.page1.pageNo = val
            this.getcustomerOptions1()
        },
        handleSizeChange2(val) {
            this.page2.pageSize = val
            this.getcustomerOptions2()
        },
        getRowKeys(row){
            return row.cardNo
        },
        handleCurrentChange2(val) {
            this.page2.pageNo = val
            this.getcustomerOptions2()

        },
        // 返回
        returnGo() {
            this.clearAll()
            this.$refs['ruleForm'].resetFields();
            this.$router.go(-1)
        },
        // 发送
        trueConfirm() {

            var blean = false

            for (let i in this.tabData){
                if (this.tabData[i].cardNo == ''){
                    if (this.tabData.length > 1){
                        this.tabData.splice(i, 1)
                    }
                }
            }

            if (this.jiaArr.length < 1){
                this.$message({
                    message: '请选择甲方',
                    duration: 1000,
                    type: 'warning'
                })
            } else {
                for (let i in this.tabData){
                    if (this.tabData[i].cardNo == ''){
                        this.$message({
                            message: '请选择乙方',
                            duration: 1000,
                            type: 'warning'
                        })
                    } else {
                        blean = true
                    }
                }
            }

            if (blean){
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.trueCon = true
                        let arr = []

                        let objj = {
                            cardNo:this.jiaArr[0].cardNo,
                            signKey:this.formData.contractFile,
                            IsSponsor: 1
                        }

                        arr.push(objj)

                        if (this.yiArr.length >= arr.length){
                            for (let j = 0 ; j < this.yiArr.length ; j ++){
                                let obj = {
                                    IsSponsor: 0,
                                    cardNo:this.yiArr[j].cardNo,
                                    signKey:this.tabData[j].signKey,
                                    signMobile:this.tabData[j].signMobile,
                                    signMobe:this.tabData[j].signMobe,
                                    signOrder:this.tabData[j].signOrder
                                }

                                arr.push(obj)
                            }
                        }

                        let obj = {
                            contractNo:this.formData.contractNo,
                            contractName:this.formData.contractName,
                            validityTime:this.formData.validityTime,
                            templateCode:this.formData.templateCode,
                            signType:this.formData.signType,
                            signatoryInfoDTOList:arr
                        }

                        // let prom = JSON.stringify(obj)

                        // console.log(prom)

                        api.postcontractinsert(obj).then((response) => {
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            })
                            this.loading = false
                            this.trueCon = false
                            this.$router.go(-1)
                        }).catch((error) => {
                            this.loading = false
                            this.trueCon = false
                        })

                    }
                })
            }

        },

        handleSelectionChange1(val) {
            this.jiaChange = val
        },
        handleSelectionChange2(val) {
            this.yiChange = val
        },
        // 选择甲方
        findJia() {
            this.dialogVisibleJ = true
            this.disTF = true
        },
        clearJia() {
            this.$refs.select1.clearSelection()
            this.formData.contractUserList = ''
            this.jiaArr = []
        },
        returnJia() {
            this.$refs.select1.clearSelection()
            this.dialogVisibleJ = false
            this.disTF = false
        },
        trueJia() {
            this.jiaArr = []
            if (this.jiaChange.length == 0){
                this.$message({
                    message: '请选择一个甲方！',
                    duration: 1000,
                    type: 'warning'
                })
                return false
            } else {
                if (this.jiaChange.length > 1){
                    this.$message({
                        message: '只能选择一个甲方，请重新选择！',
                        duration: 1000,
                        type: 'warning'
                    })
                    return false
                } else {
                    if (this.yiArr.length > 1){
                        for (let j of this.yiArr){
                            if (this.jiaChange[0].customerName == j.customerName){
                                this.$message({
                                    message: '甲方与乙方重复，请重新选择',
                                    duration: 1000,
                                    type: 'warning'
                                })
                                return false
                            }
                        }
                        this.formData.contractUserList = this.jiaChange[0].customerName
                        this.dialogVisibleJ = false
                        this.disTF = false
                        this.jiaArr = this.jiaChange
                    } else {
                        this.formData.contractUserList = this.jiaChange[0].customerName
                        this.dialogVisibleJ = false
                        this.disTF = false
                        this.jiaArr = this.jiaChange
                    }
                }
            }

        },
        // 选择乙方
        findYi(index, date) {
            this.index = index
            this.indexdata = date.cardNo
            this.dialogVisibleY = true
            this.disTF = true

        },
        returnYi() {
            this.dialogVisibleY = false
            this.disTF = false
        },
        trueYi() {
            // 判断甲方是否存在
            if (this.jiaArr.length > 0){
                for (let ob of this.yiChange){
                    // 如果与甲方重复
                    if (ob.customerName == this.jiaArr[0].customerName){
                        this.$message({
                            message: '乙方与甲方重复，请重新选择！',
                            duration: 1000,
                            type: 'warning'
                        })
                        return false
                    }
                }
                // 如果与甲方不重复
                this.showYi()
            } else {
                // 如果不存在甲方
                this.showYi()
            }
            // console.log(this.yiArr,  'asfdsadfjsahdfjh')
        },
        // 判断添加
        showYi() {
            // 如果选择的是空的
            if (this.indexdata == ''){
                // 选择多个乙方时
                if (this.yiChange.length > 1){
                    for (let j of this.tabData){
                        for (let k of this.yiChange){
                            // 判断乙方是否有重复
                            if (j.cardNo == k.customerName){
                                this.$message({
                                    message: '乙方重复，请重新选择！',
                                    duration: 1000,
                                    type: 'warning'
                                })
                                return false
                            } else {
                                for (let i = 1 ; i < this.yiChange.length ; i ++){
                                    let obj = {
                                        IsSponsor: 0,
                                        cardNo:this.yiChange[i].customerName,
                                        signKey:'',
                                        signMobile:this.yiChange[i].mobile,
                                        signMobe:'',
                                        signOrder:''
                                    }

                                    this.tabData.push(obj)
                                    this.tabData[this.index].cardNo = this.yiChange[0].customerName
                                    this.tabData[this.index].signMobile = this.yiChange[0].mobile
                                    $('.removeI').css('display', 'inline-block')
                                }
                                this.yiArr.push(k)
                                this.$refs.selcetOp.clearSelection()
                                this.dialogVisibleY = false
                                this.disTF = false
                            }
                        }
                    }
                } else {
                    // 只选择一个的时候
                    for (let j of this.tabData){
                        if (j.cardNo == this.yiChange[0].customerName){
                            this.$message({
                                message: '乙方重复，请重新选择！',
                                duration: 1000,
                                type: 'warning'
                            })
                            return false
                        }
                    }
                    this.yiArr.push(this.yiChange[0])
                    this.tabData[this.index].cardNo = this.yiArr[this.index].customerName
                    this.tabData[this.index].signMobile = this.yiArr[this.index].mobile
                    this.$refs.selcetOp.clearSelection()
                    this.dialogVisibleY = false
                    this.disTF = false
                }

            } else {
                // 如果选择的是有乙方数据的
                // 如果多选
                if (this.yiChange.length > 1){
                    this.$message({
                        message: '只能更改一个乙方！',
                        duration: 1000,
                        type: 'warning'
                    })
                    return false
                } else {
                    // 只选择一个.更改乙方
                    for (let j of this.tabData){
                        if (j.cardNo == this.yiChange[0].customerName){
                            this.$message({
                                message: '乙方重复，请重新选择！',
                                duration: 1000,
                                type: 'warning'
                            })
                            return false
                        }
                    }
                    this.dialogVisibleY = false
                    this.disTF = false
                    this.yiArr[this.index] = this.yiChange[0]
                    // console.log(this.yiArr)
                    this.tabData[this.index].cardNo = this.yiArr[this.index].customerName
                    this.tabData[this.index].signMobile = this.yiArr[this.index].mobile
                    this.$refs.selcetOp.clearSelection()
                }
            }
        },
        // 增加乙方
        tabAdd() {
            let obj = {
                IsSponsor: 0,
                cardNo:'',
                signKey:'',
                signMobile:'',
                signMobe:'',
                signOrder:''
            }

            this.tabData.push(obj)
            $('.removeI').css('display', 'inline-block')
        },
        // 移除乙方
        tabRemove(index, row) {
            if (row.length > 1){
                row.splice(index, 1)
                this.yiArr.splice(index, 1)
                if (row.length == 1){
                    $('.removeI').css('display', 'none')
                }
            }
        },
        // 表格样式
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'text-align:center'
            } else {
                return ''
            }
        },

        // 获取模板
        getTemplateOptions() {
            api.gettemplatelistPage().then((response) => {
                this.templateIdentOptions = response.data.contractTemplateVOList
                // console.log(response.data)
            })
        },
        // 获取客户
        getcustomerOptions1() {
            api.getcustomerlistPage(this.page1).then((response) => {
                this.contractUserListOptions1 = response.data.customerInfoVOList
                this.totalPage1 = response.data.listTotal

            })
        },
        serchOption1() {
            this.page1.pageSize = 10
            this.page1.pageNo = 1
            api.getcustomerlistPage(this.page1).then((response) => {
                this.contractUserListOptions1 = response.data.customerInfoVOList
                this.totalPage1 = response.data.listTotal

            })
        },
        getcustomerOptions2() {
            api.getcustomerlistPage(this.page2).then((response) => {
                this.contractUserListOptions2 = response.data.customerInfoVOList
                this.totalPage2 = response.data.listTotal
            })
        },
        serchOption2() {
            this.page2.pageSize = 10
            this.page2.pageNo = 1
            api.getcustomerlistPage(this.page2).then((response) => {
                this.contractUserListOptions2 = response.data.customerInfoVOList
                this.totalPage2 = response.data.listTotal
            })
        },
        searchJia() {
            this.serchOption1()
        },
        searchYi() {
            this.serchOption2()
        },
        getAllOptions() {
            this.getTemplateOptions()
            this.getcustomerOptions1()
            this.getcustomerOptions2()
        }
    },
    created(){},
    mounted(){},
    activated() {
        this.clearAll()
        $('.removeI').css('display', 'none')
        this.getAllOptions()
        this.$refs["ruleForm"].resetFields()

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
    padding: 10px 20px
}
.content{
    background: white;
    overflow: auto
}
.contentT{
    margin-top: 35px
}
.addAndRemove{
    font-size: 18px;
}
.addAndRemove i{
    cursor: pointer
}
.addAndRemove i:hover{
    color: #4e84ef
}
.findPeo{
    cursor: pointer
}
.otherInput:hover{
    cursor: pointer;
}

</style>
