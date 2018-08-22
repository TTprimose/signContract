<template>
    <div>
        <div :style="{height: $store.state.home.modelContentHeight-110 + 'px'}" class="contentBox">
            <div class="title">
                <el-tabs v-model="activeName" >
                    <el-tab-pane label="新增客户" name="first" ></el-tab-pane>
                </el-tabs>
            </div>
            <div class="content" :style="{height: $store.state.home.modelContentHeight-204 + 'px'}">
                <el-form :model="formData"  :rules="formData.customerType == '1' ? BusinessRules : userRules" ref="ruleForm" class="demo-ruleForm contentT" enctype="multipart/form-data" v-loading.fullscreen.lock="loading" element-loading-text="努力提交中！">
                    <el-form-item label="客户名称：" :label-width="formLabelWidth" prop="customerName">
                        <el-input v-model="formData.customerName"  size="small" clearable placeholder="请输入客户名称" maxlength="15"></el-input>
                    </el-form-item>
                    <el-form-item label="客户类型：" :label-width="formLabelWidth" prop="customerType">
                        <el-select v-model="formData.customerType" clearable placeholder="请选择客户类型" size="small"  @change="changeType()">
                            <el-option
                            v-for="item in customerTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  :label-width="formLabelWidth" prop="cardNo" :label="formData.customerType == '1'? '统一社会信用代码：' : '身份证号码：'">
                        <el-input v-model="formData.cardNo"  size="small" clearable :placeholder="formData.customerType == '1'? '请输入统一社会信用代码' : '请输入身份证号码'" maxlength="18"></el-input>
                    </el-form-item>
                    <el-form-item label="客户手机号：" :label-width="formLabelWidth" prop="mobile">
                        <el-input v-model="formData.mobile"  size="small" clearable placeholder="请输入客户手机号" maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="客户邮箱：" :label-width="formLabelWidth" prop="email">
                        <el-input v-model="formData.email"  size="small" clearable placeholder="请输入客户邮箱"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="CA状态：" :label-width="formLabelWidth" prop="UserCaType" class="CAStatus">
                        <el-radio-group v-model="formData.UserCaType">
                            <el-radio label="1" >CFCA</el-radio>
                            <el-radio label="2" >ZSCA</el-radio>
                        </el-radio-group>
                    </el-form-item> -->
                    <!-- <el-form-item label="是否验证客户真实性" :label-width="formLabelWidth" prop="UserCaType" v-if="formData.customerType === '1'">
                        <el-radio-group v-model="formData.isReal" @change="changeType()">
                            <el-radio label="0" >是</el-radio>
                            <el-radio label="1" >否</el-radio>
                        </el-radio-group>
                    </el-form-item> -->
                    <el-form-item label="法人姓名：" :label-width="formLabelWidth" prop="legalPerson" v-if="formData.customerType === '1'">
                        <el-input v-model="formData.legalPerson"  size="small" placeholder="请输入法人姓名" clearable maxlength="15"></el-input>
                    </el-form-item>
                    <el-form-item label="法人身份证号码：" :label-width="formLabelWidth" prop="legalPersonIdCard" v-if="formData.customerType === '1'">
                        <el-input v-model="formData.legalPersonIdCard"  size="small" placeholder="请输入法人身份证号码" clearable maxlength="18"></el-input>
                    </el-form-item>
                     <el-form-item label="认证手机号码：" :label-width="formLabelWidth" prop="identifyMobile" v-if="formData.customerType === '1'">
                        <el-input v-model="formData.identifyMobile"  size="small" placeholder="请输入法人手机号码" clearable maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="银行账号：" :label-width="formLabelWidth" prop="bankCard" v-if="formData.customerType === '1'" >
                        <el-input v-model="formData.bankCard" size="small"  placeholder="请输入银行账号" clearable maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="印章图片：" :label-width="formLabelWidth" class="upPic">
                        <el-upload
                            :action="upDateImgUrl"
                            :auto-upload=false
                            :data='formData'
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :file-list="fileList"
                            multiple
                            :limit='1'
                            ref="newupload"
                            accept=".png"
                            :before-upload="beforeUpload"
                            :on-exceed="handleLimit"
                            :on-error="uploadError"
                            :on-success="handleAvatarSuccess"
                            :on-remove="handleRemove"
                            name="multipartFile"
                            :on-change="onChange"
                            >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" append-to-body>
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                        <span style="font-size: 15px;color: #a3adc8;">最多上传1张图片</span>
                    </el-form-item>
                </el-form>
            </div>

        </div>
        <div class="block">
            <el-button type="primary" size="small" style="width:90px" @click="submitFormBus()" >提交</el-button>
            <el-button size="small" style="width:90px"  @click="resetForm()">取消</el-button>
        </div>
    </div>
</template>

<script>
import api from 'api/management'
export default {
    components: {
    },
    data(){
        return {
            loading: false,
            upDateImgUrl: process.env.API_ROOT + '/customer/insert',
            dialogImageUrl: '',
            dialogVisible: false,
            fileList: [],
            activeName: 'first',
            formLabelWidth:'150px',
            formData:{
                customerName: '',
                cardNo: '',
                mobile: '',
                email: '',
                // UserCaType: '',
                customerType: '2',
                identifyMobile: '',
                bankCard: '',
                legalPerson: '',
                legalPersonIdCard: '',
                multipartFile: ''
            },
            userRules: {
                customerName: [
                    { required: true, message: '请输入客户名称', trigger: 'blur' },
                    { min: 2, max: 50, message: '客户名称长度在 2 到 50 个字符', trigger: 'blur' }
                ],
                cardNo: [
                    { required: true, message: '请输入身份证号码', trigger: 'blur' },
                    {pattern: /^[0-9a-zA-Z]+$/, message:'请输入正确的身份证号码'}
                ],
                mobile: [
                    { required: true, message: '请输入客户手机号码', trigger: 'blur' },
                    {pattern: /^1[34578]\d{9}$/, message:'请输入11位手机号码'}
                ],
                // UserCaType: [
                //     { required: true, message: '请选择CA状态', trigger: 'change' }
                // ],
                email: [
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]
            },
            BusinessRules: {
                customerName: [
                    { required: true, message: '请输入客户名称', trigger: 'blur' },
                    { min: 2, max: 50, message: '客户名称长度在 2 到 50 个字符', trigger: 'blur' }
                ],
                cardNo: [
                    { required: true, message: '请输入客户统一社会信用代码', trigger: 'blur' },
                    {pattern: /^[0-9a-zA-Z]+$/, message:'请输入正确的统一社会信用代码'}
                ],
                mobile: [
                    { required: true, message: '请输入客户手机号码', trigger: 'blur' },
                    {pattern: /^1[34578]\d{9}$/, message:'请输入11位手机号码'}
                ],
                // UserCaType: [
                //     { required: true, message: '请选择CA状态', trigger: 'change' }
                // ],
                legalPerson:[
                    { required: true, message: '请输入法人姓名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                legalPersonIdCard:[
                    { required: true, message: '请输入法人身份证号码', trigger: 'blur' }
                ],
                identifyMobile:[
                    { required: true, message: '请输入法人手机号', trigger: 'blur' },
                    {pattern: /^1[34578]\d{9}$/, message: '请输入11位手机号码'}
                ],
                bankCard:[
                    { required: true, message: '请输入法人银行卡号码', trigger: 'blur' }
                ],
                email: [
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]
            },
            customerTypeList: [
                {
                    label:'个人用户',
                    value:'2'
                },
                {
                    label:'企业用户',
                    value:'1'
                }
            ]
        }
    },
    computed:{
        
    },
    methods:{
        /**
         * 数量限制
         */
        handleLimit() {
            this.$message({
                type: 'warning',
                message: '只能上传一张印章图片'
            })
        },
        /**
         * 上传之前对文件类型，大小校验
         */
        beforeUpload(file) {
            console.log('beforeUpload')
            console.log(file)
            let typeName = file.name

            let isLt3M = file.size / 1024 / 1024 < 3

            if (typeName.indexOf('.png') < 0) {
                this.$message({
                    message: '请上传PNG格式的图片',
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
         * 触发图片上传
         */
        onChange (file, fileList) {
            console.log("onChange")
            console.log(fileList)
            this.fileList = fileList
            console.log(this.fileList)
        },
        /**
         * 移除图片
         */
        handleRemove(file, fileList) {
            console.log('handleRemove')
            console.log(fileList)
            this.fileList = fileList
            console.log(this.fileList)
        },
        /**
         * 上传失败提示
         */
        uploadError (err, file, fileList) {
            this.loading = false
            console.log('uploadError')
            if (err.msg) {
                this.$message({
                    message: err.msg,
                    type: 'warning'
                })
            } else {
                this.$message({
                    message: '新增客户出错！',
                    type: 'warning'
                })
            }
        },
        /**
         * 文件上传成功时
         */
        handleAvatarSuccess(res, file, fileList) {
            console.log('handleAvatarSuccess')
            console.log(fileList)
            if (res.result === 1) {
                this.loading = false
                this.$router.push('/management')
                this.$message({
                    message: '恭喜你，新增客户成功！',
                    type: 'success'
                });
            } else {
                this.loading = false
                this.$message.warning(res.message)
            }
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        clearAll() {
            for (let key in this.FormData) {
                this.FormData[key] = ''
            }
            this.fileList = []
        },
        changeType() {
            let that = this

            setTimeout(function(){
                that.$refs["ruleForm"].clearValidate()
            })
        },
        resetForm() {
            this.clearAll()
            this.$router.go(-1)
        },
        /**
         * 个人用户表单提交
         */
        submitFormPer () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.loading = true
                    api.customerInsert(this.formData).then((response) => {
                        console.log(response)
                        this.loading = false
                        this.$router.push('/management')
                        this.$message({
                            message: '恭喜你，新增客户成功！',
                            type: 'success'
                        });
                    }).catch((error) => {
                        console.log(error)
                        this.loading = false
                        this.$message({
                            message: error.message,
                            type: 'warning'
                        });
                    })
                } else {
                    return false;
                }
            })
        },
        /**
         * 企业客户表单提交
         */
        submitFormBus (){
            let that = this

            this.fileList.map(p=>{
                p.status = 'ready'
            })

            that.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    
                    if (this.fileList.length > 0) {
                        console.log(1)
                        that.$refs.newupload.submit()
                        console.log(2)
                    } else {
                        this.submitFormPer()
                    }
                   
                } else {
                    return false;
                }
            })
        }
    },
    created(){},
    mounted(){},
    activated() {
        this.clearAll()
        
        this.$refs["ruleForm"].resetFields()
        this.changeType()
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
    padding: 10px 20px

}
.el-input,.el-select{
    width: 350px;
}
.contentT{
    margin-top: 35px
}
.upPic{
    padding-top: 10px;
}
</style>
