<template>
    <div>
        <div :style="{height: $store.state.home.modelContentHeight-110 + 'px'}" class="contentBox">
            <div >
                内容
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
            }
        }
    },
    computed:{

    },
    methods:{
        clearAll() {
            for (let key in this.FormData) {
                this.FormData[key] = null
            }
        },
        handleSizeChange(val) {
            this.page.pageSize = val

        },
        handleCurrentChange(val) {
            this.page.pageNo = val
        }
    },
    created(){},
    mounted(){},
    activated() {
        this.clearAll()
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
</style>
