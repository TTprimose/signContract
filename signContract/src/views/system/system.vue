<template>
    <div>
        <div :style="{height: $store.state.home.modelContentHeight-60 + 'px'}" class="contentBox">
            <div class="title">
                <el-tabs v-model="activeName" >
                    <el-tab-pane label="账号管理" name="first" ></el-tab-pane>
                </el-tabs>
            </div>
            <div class="content" :style="{height: $store.state.home.modelContentHeight-204 + 'px'}">
                <div class="contentTitle">登录信息</div>
                <ul class="info-list">
                    <li>
                        <label>用户名称</label>
                        <span class="info-text">{{ formData.userName }}</span>
                    </li>
                    <!-- <li>
                        <label>绑定手机号</label>
                        <span class="info-text">{{ formData.mobile }}</span>
                        <span class="operation" @click="changePhoto">修改</span>
                    </li> -->
                    <li>
                        <label>登陆密码</label>
                        <span class="info-text" ><input type="password" v-model="passWord" class="password" disabled="disabled"></span>
                        <span class="operation" @click="changePassWord">修改</span>
                    </li>
                </ul>
            </div>

            <el-dialog title="修改登录密码" :visible.sync="dialogFormVisible" >
                <div class="systemBox">
                    <el-form :model="passData">
                        <el-form-item label="原密码" :label-width="formLabelWidth">
                            <el-input v-model="passData.oldPassWord" clearable size='small' type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" :label-width="formLabelWidth">
                            <el-input v-model="passData.newPassWord" clearable size='small' type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" :label-width="formLabelWidth">
                            <el-input v-model="passData.truePassWord" clearable size='small' type="password"></el-input>
                        </el-form-item>

                    </el-form>
                    <div slot="footer" class="dialog-footer" style="float:right;margin-top:20px">
                        <el-button @click="dialogFormVisible = false" size='small'>取 消</el-button>
                        <el-button type="primary" @click="trueChange" size='small'>确 定</el-button>
                    </div>
                </div>

            </el-dialog>
        </div>
    </div>

</template>

<script>
import api from 'api/login'
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
            activeName:'first',

            userName:'',
            passWord:'',

            dialogFormVisible:false,
            formLabelWidth: '70px',

            formData:{

            },
            passData:{
                oldPassWord:'',
                newPassWord:'',
                truePassWord:''
            }
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
        changePhoto() {

        },
        changePassWord() {
            for (let key in this.passData) {
                this.passData[key] = null
            }
            this.dialogFormVisible = true
            // this.passData.oldPassWord = this.passWord
        },
        trueChange() {
            if (this.passData.newPassWord != this.passData.truePassWord){
                this.$message({
                    message: '新密码两次输入不相同',
                    showClose: true,
                    type: 'warning'
                });
            } else {
                let obj = {
                    userName:this.userName,
                    passWord:this.passData.oldPassWord,
                    mobile:'',
                    Pwd:this.passData.newPassWord,
                    pwdConfirm:this.passData.truePassWord
                }

                api.postuserupdate(obj).then((response) => {
                    this.$message({
                        message: '密码修改成功',
                        showClose: true,
                        type: 'success'
                    });
                    this.dialogFormVisible = false
                    this.$router.push({
                        path: '/login'
                    })
                    sessionStorage.clear()
                })
            }
        },
        getData(data) {
            api.getuserName(data).then((response) => {
                this.formData = response.data
            })
        }
    },
    created(){},
    mounted(){},
    activated() {
        this.clearAll()

        let arr = sessionStorage.getItem('user')

        let array = JSON.parse(arr)

        this.userName = array.userName
        this.passWord = array.passWord

        // console.log(array)

        this.getData(this.userName)
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
    overflow: auto;
    padding: 20px
}
.contentTitle{
    margin-bottom: 20px;
    font-size: 16px;
    text-align: left;
    text-indent: 16px;
    border-left: 4px solid #6994ea;
}
.info-list{
    padding-left: 0
}
.info-list li{
    display: flex;
    height: 55px;
    line-height: 55px;
    text-align: left;
    font-size: 14px;
}
.info-list li label{
    width: 120px;
    color: #999;
    text-align: left;
}
.info-list li span{
    flex: 1;
    color: #444;
    border-bottom: 1px solid #f1f1f1;
}
.info-list li .operation{
    position: absolute;
    right: 55px;
    color: #409eff;
    cursor: pointer;
}
.password{
    width: 95%;
    border: none;
    outline: none;
    font: 14px;
    background: none
}
.systemBox{
    padding: 0 60px;
    padding-bottom: 50px;
}

</style>
