<template>
    <div>
        <template>
            <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
                <el-tab-pane label="练习" name="first">
                     <el-button @click="ToGo('Business')">商务概念</el-button>
                     <el-button @click="ToGo('planMain')">计划</el-button>
                    
                </el-tab-pane>
                <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>  

<script>
export default {
    data(){
        return{
            activeName:"first"
        }
    },
    methods:{
        handleClick(tab,event){
            console.log(tab, event)
        },
        ToMain () {
            this.$router.push({
            name: 'Home',
            params: {}
          })
        },
        ToGo(a) {
            this.$router.push(a);
        }
    }
}
</script>


<style lang="less" scoped>

</style>
