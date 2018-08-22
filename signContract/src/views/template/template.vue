<template>
    <div class="template">
        <div :style="{height: $store.state.home.modelContentHeight-110 + 'px'}" class="contentBox">
            <div class="page">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="模板管理" name="first"></el-tab-pane>
                </el-tabs>
                <div class="content" :style="{height: $store.state.home.modelContentHeight-204 + 'px'}">
                    <div  class="contentTop" v-on:keyup.enter="searchList" >
                        <el-form ref="form" :model="searchFormData" label-width="70px" v-loading.fullscreen.lock="loading" element-loading-text="努力提交中！">
                            <el-form-item label="模板名称">
                                <el-input v-model="searchFormData.templateName" size="small" clearable  placeholder="请输入模板名称" @clear="searchList"></el-input>
                            </el-form-item>
                            <el-form-item style="margin:-0px 0px 0px -50px">
                                <el-button type="primary" size="small" @click="searchList">搜索</el-button>
                            </el-form-item>
                            <el-form-item class="new_tem">
                                <el-button type="primary" size="small" @click="openNewTem">新增模板</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="contentText">
                        <el-table
                                :data="tableData"
                                style="width:98%;text-align:left;margin:auto;background:#fff;"
                                :height="$store.state.home.modelContentHeight - 277"
                                :header-cell-style="getRowClass"
                                >
                            <el-table-column
                                width="30"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="templateName"
                                label="模板名称"
                                >
                            </el-table-column>
                            <el-table-column
                                prop="Establish"
                                label="创建时间"
                                width="200%"
                                >
                            </el-table-column>
                            <el-table-column label="操作"  width="150%">
                                <template slot-scope="scope">
                                    <div>
                                        <el-button @click="openDetail(scope.row.templateCode)" type="text" size="small">详情</el-button>
                                        <el-button @click="delTem(scope.row.templateCode)" type="text" size="small">删除</el-button>
                                        <a :href="scope.row.templateFileUrl" target="_blank" >下载</a>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
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
        <el-dialog title="新建模板" :visible.sync="dialogFormVisible" class="templateDia" :before-close="reset" :close-on-click-modal="false" width="650px">
            <el-form :model="formData" :rules="rules" ref="ruleForm" enctype="multipart/form-data">
                <el-form-item label="模板名称" :label-width="formLabelWidth" prop="templateName">
                    <el-input v-model="formData.templateName"  maxlength="64" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="上传模板" :label-width="formLabelWidth"  class="is-required">
                    <el-upload
                        class="upload-demo"
                        name="multipartFile"
                        style="width:350px"
                        drag
                        :data='formData'
                        :auto-upload=false
                        :action="upDateImgUrl"
                        list-type="text"
                        ref="newupload"
                        :file-list="fileList"
                        accept=".pdf"
                        :limit='1'
                        :on-remove="handleRemove"
                        :on-exceed="handleLimit"
                        :before-upload="beforeUpload"
                        :on-error="uploadError"
                        :on-success="uploadSuccess"
                        :on-change="onChange"
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">仅支持.pdf文件且不超过3MB</div>
                        </el-upload>
                        <p class="err_text" v-if="noTempalte">请上传模板</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="reset" size="small">取 消</el-button>
                <el-button type="primary" @click="submitForm" size="small">确 定</el-button>
            </div>
        </el-dialog>
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
            upDateImgUrl: process.env.API_ROOT + '/template/insert',
            formData:{
                templateName: ''
            },
            fileList: [],
            formLabelWidth: '120px',
            dialogFormVisible: false,
            dialogRename:false,
            searchFormData : {
                templateName:''
            },
            tableData : [{Establish:''}],
            rules: {
                templateName: [
                    { required: true, message: '请输入模板名称', trigger: 'blur' },
                    { min: 2, max: 64, message: '模板名称长度在 2 到 64 个字符', trigger: 'blur' }
                ]
            },
            totalPage:0,
            currentPage:1,
            page:{
                pageSize:10,
                pageNo:1
            },
            activeName: 'first',
            noTempalte: false,
            loading: false
        }
    },
    computed:{},
    methods:{
        /**
        * 打开详情
        */
        openDetail(data) {
            this.$router.push('/TemplateDetail?templateCode=' + data)
        },
        /**
         * 删除模板
         */
        delTem(templateCode) {
            this.$confirm('确定要删除合同模板, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteTem(templateCode).then((response) => {
                    if (response.result == '1') {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.getList()
                    }
                }).catch((error) => {
                    this.$message({
                        message: '删除模板失败！',
                        type: 'warning'
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        openNewTem() {
            for (let key in this.formData) {
                this.formData[key] = null
            }
            this.fileList = []
            this.dialogFormVisible = true
        },
        /**
         * 上传之前对文件类型，大小校验
         */
        beforeUpload(file) {
            console.log(file)
            let typeName = file.name

            let isLt3M = file.size / 1024 / 1024 < 3

            if (typeName.indexOf('.pdf') < 0) {
                this.$message({
                    message: '请上传PDF格式的文件',
                    type: 'warning'
                })
            } else {
                if (!isLt3M) {
                    this.$message({
                        message: '上传文件大小不能超过 3MB!',
                        type: 'warning'
                    })
                } else {
                    this.loading = true
                    return true
                }

            }
            return false
        },
        /**
         * 模板上传数量提醒
         */
        handleLimit() {
            this.$message({
                type: 'warning',
                message: '合同模板只可以上传一份'
            })
        },
        /**
         * 上传失败提示
         */
        uploadError (err, file, fileList) {
            this.loading = false
            if (err.msg) {
                this.$message({
                    message: err.msg,
                    type: 'warning'
                })
            } else {
                this.$message({
                    message: '上传文件出错，请重新上传！',
                    type: 'warning'
                })
            }
        },
        /**
         * 上传成功提示
         */
        uploadSuccess (res, file, fileList) {
            if (res.result === 1) {
                this.loading = false
                this.reset()
                this.$message({
                    message: '恭喜你，模板已上传成功！',
                    type: 'success'
                })
                this.getList()
            } else {
                this.loading = false
                this.$message.warning(res.message)
            }

            console.log(res)
            console.log(file)
            console.log(fileList)
        },
        /**
         * 新建模板提交
         */
        submitForm(){
            let that = this

            this.fileList.map(p=>{
                p.status = 'ready'
            })

            that.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    if (that.noTempalte == false) {
                        if (that.fileList.length !== 0) {

                            that.$refs.newupload.submit()
                        } else if (that.fileList.length == '0') {
                            that.noTempalte = true
                        }
                    }
                } else {
                    return false
                }
            })

        },
        /**
         * 新建模板取消功能
         */
        reset() {
            this.dialogFormVisible = false
            for (let key in this.formData) {
                this.formData[key] = null
            }
            this.fileList = []
            this.noTempalte = false
            this.$refs["ruleForm"].resetFields()
        },
        /**
         * 移除模板
         */
        handleRemove(file, fileList) {
            console.log(fileList)
            this.fileList = fileList
            this.noTempalte = true
            console.log(this.fileList)
        },
        onChange(file, fileList) {
            console.log(fileList)
            this.fileList = fileList
            this.noTempalte = false
            console.log(this.fileList)

        },
        /**
         *  搜索
         * */
        searchList(){
            this.totalPage = 0
            this.page.pageNo = 1
            this.getList()
        },
        clearAll() {
            for (let key in this.searchFormData) {
                this.searchFormData[key] = null
            }
            for (let key in this.formData) {
                this.formData[key] = null
            }
            this.tableData = [{create:''}]
        },
        handleSizeChange(val) {
            this.page.pageSize = val
            this.getList(this.page)

        },
        handleCurrentChange(val) {
            this.page.pageNo = val
            this.getList(this.page)
        },
        /***
         * 表头对齐及颜色
         */
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'background:#fff;text-align:left;'
            } else {
                return ''
            }
        },
        /**
         * 获取模板列表
         */
        getList() {
            let that = this

            // this.tableData = []
            let params

            params = {
                pageNo: that.page.pageNo,
                pageSize: that.page.pageSize,
                templateName: that.searchFormData.templateName
            }
            api.templateListPage(params).then((response) => {
                let data = response

                if (response.result == '1') {
                    this.tableData = data.data.contractTemplateVOList || []
                    this.totalPage = data.data.listTotal || 0
                    this.tableData.map(p=>{
                        p.Establish = filter.time_s(p.created)
                    })
                }
            }).catch((error) => {
                this.$message({
                    message: '获取模板列表失败！',
                    type: 'warning'
                });
            })
        },
        handleClick() {

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
    padding: 20px
}
.content{
    background: #fff;
    overflow: hidden;
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
    overflow: hidden;
    clear: both;
}
.el-form-item{
    float: left;
    margin-left: 15px;
}
.el-form{
    overflow: hidden;
}

.new_tem{
    float: right;
}
.el-table--border::after, .el-table--group::after, .el-table::before{
    background: #fff;
}
.el-upload-dragger{
    width: 350px;
}
a{
    color: #409EFF;
    text-decoration:none;
    margin-left: 10px;
    cursor: pointer;
}
.err_text{
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
}
.el-form-item.is-required .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}
</style>
