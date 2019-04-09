<template>
    <div>
        <el-container style="height:100%;">
            <el-header direction="vertical" style="line-height: 60px;">
                <el-select placeholder="总部部门"  clearable style="width:150px;" v-model="center">
                    <el-option v-for="item in centerList" :key="item.text" :value="item.text" :label="item.text"></el-option>
                    </el-select>
                <el-input placeholder="概念名称" style="width:150px;" v-model="conceptName"></el-input>
                <el-select placeholder="概念类型" clearable style="width:150px;" v-model="conceptType">
                    <el-option v-for="item in conceptTypeList" :key="item.id" :value="item.id" :label="item.text"></el-option>
                </el-select>
                <el-select placeholder="指标类型" clearable style="width:150px;" v-model="indicatorType">
                    <el-option v-for="item in indicatorTypeList" :key="item.id" :value="item.id" :label="item.text"></el-option>
                </el-select>
                <el-select placeholder="状态" clearable style="width:150px;" v-model="isDisabled">
                    <el-option v-for="item in isDisabledList" :key="item.id" :value="item.id" :label="item.text"></el-option>
                </el-select>
                <el-button icon="el-icon-search" @click="loadData">查询</el-button>
                <el-button icon="el-icon-plus" @click="addRow">新增</el-button>
                <el-button icon="el-icon-edit" @click="editRow">修改</el-button>
                <el-button icon="el-icon-circle-check-outline" @click="isdisabled(0)">启用</el-button>
                <el-button icon="el-icon-circle-close-outline" @click="isdisabled(1)">禁用</el-button>
            </el-header>
            <el-container style="height:calc(100vh - 60px)">
                <el-aside width="200px" class="asideSty">
                        <el-tree ref="tree" accordion :data="menuData" :props="defaultProps" node-key="id"  @node-click="handleNodeClick"></el-tree>
                </el-aside>
                <el-container>
                    <el-main style="padding:0;">
                        <el-table ref="singleTable" :data="tableData" border highlight-current-row style="width: 100%;"
                            height="calc(100vh - 92px)" @selection-change="getDetails" @row-click="handleRowChange">
                            <el-table-column type="index" label="序号" header-align="center" min-width="60">
                            </el-table-column>
                            <el-table-column label="概念名称、类型及定义" header-align="center">
                                <el-table-column property="conceptName" label="概念名称" header-align="center" min-width="100">
                                </el-table-column>
                                <el-table-column property="conceptType" label="概念类型" header-align="center" min-width="80">
                                </el-table-column>
                                <el-table-column property="conceptDefinition" label="概念定义" header-align="center" min-width="300">
                                </el-table-column>
                            </el-table-column>
                            <el-table-column label="指标类型及计算公式" header-align="center">
                                <el-table-column property="indicatorType" label="指标类型" header-align="center" min-width="120">
                                </el-table-column>
                                <el-table-column property="calculation" label="计算公式" header-align="center" min-width="200">
                                </el-table-column>
                            </el-table-column>
                            <el-table-column property="center" label="总部职能中心" header-align="center" min-width="120">
                            </el-table-column>
                            <el-table-column property="isDisabled" label="状态" header-align="center" min-width="80" :formatter="statusFormat">
                            </el-table-column>
                            <el-table-column property="operateDate" label="修订时间" header-align="center" min-width="100" >
                            </el-table-column>
                        </el-table>
                    </el-main>
                    <el-footer style="text-align: right;margin-right: 45px;">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                            :total="pagetotal">
                        </el-pagination>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
        <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible" >
            <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
                <el-form-item label="职能中心" prop="center">
                    <el-select clearable v-model="form.center" style="width:100%" :disabled="isShow">
                        <el-option v-for="item in centerList" :key="item.id" :value="item.text" :label="item.text"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="概念名称" prop="name">
                    <el-input v-model="form.name" :disabled="isShow"></el-input>
                </el-form-item>

                <el-form-item label="概念定义" prop="desc">
                    <el-input type="textarea" v-model="form.desc" :autosize="{ minRows: 2, maxRows: 4}" :disabled="isShow"></el-input>
                </el-form-item>

                <el-form-item label="概念类型" prop="conceptType">
                    <el-col :span="11">
                            <el-select placeholder="" clearable style="width:100%;" v-model="form.conceptType" :disabled="isShow">
                                    <el-option v-for="item in conceptTypeList" :key="item.id" :value="item.id" :label="item.text"></el-option>
                                </el-select>
                    </el-col>
                    <el-col :span="13">
                        <el-form-item label="指标类型" prop="indicatorType">
                                <el-select placeholder="" clearable style="width:100%;" v-model="form.indicatorType" :disabled="isShow">
                                        <el-option v-for="item in indicatorTypeList" :key="item.id" :value="item.id" :label="item.text"></el-option>
                                    </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="计算公式" prop="calculation">
                    <el-input type="textarea" v-model="form.calculation" placeholder="没有则填/" :disabled="isShow"></el-input>
                </el-form-item>

                <el-form-item label="申请原因" prop="remark">
                    <el-input type="textarea" v-model="form.remark" placeholder="请说明原因"></el-input>
                </el-form-item>

                <el-form-item style="text-align: center;margin-left: -80px;">
                        <el-button type="primary" @click="saveForm('form')">保存</el-button>
                        <el-button  @click="dialogTableVisible = false">取消</el-button>
                </el-form-item>
        </el-form>
        </el-dialog>
    </div>
</template>
<script>
        var zbbm = [{id:'1',text:'经营管理部'},
				{id:'2',text:'运营管理部'},
				{id:'3',text:'服务支持部'},
				{id:'4',text:'车险销售支持部'},
				{id:'5',text:'生产技术研发中心'},
				{id:'7',text:'供应链中心'},
				{id:'8',text:'客户中心'},
				{id:'10',text:'互联网中心'},
				{id:'11',text:'品牌中心'},
				{id:'12',text:'财务中心'},
				{id:'13',text:'人力行政中心'},
				{id:'14',text:'渠道发展中心'},
				{id:'15',text:'IT数据中心'},
				{id:'9',text:'产品研发部'}];
        // var zbbm = [{id : '',	text : '华胜连锁'},{id:'运营中心',text:'运营中心'},{id:'运营管理部',text:'运营中心运营管理部'},{id:'服务支持部',text:'运营中心服务支持部'},{id:'车险销售支持部',text:'运营中心车险销售支持部'},{id:'生产技术研发中心',text:'生产技术研发中心'},{id:'供应链中心',text:'供应链中心'},{id:'客户中心',text:'客户中心'},{id:'互联网中心',text:'互联网中心'},{id:'品牌中心',text:'品牌中心'},{id:'财务中心',text:'财务中心'},{id:'人力行政中心',text:'人力行政中心'},{id:'渠道发展中心',text:'渠道发展中心'},{id:'IT数据中心',text:'IT数据中心'},{id:'产品研发部',text:'产品研发部'},{id:'经营管理部',text:'经营管理部'}];
        var gnlx = [ {id : '基础类',	text : '基础类'}, {id : '专业类',text : '专业类'} ,{id : '管理类',	text : '管理类'} ];
	    var zblx = [ {id : '结果指标',	text : '结果指标'}, {id : '效率指标',text : '效率指标'},{id : '/',	text : '/'}  ];
        var zt = [  {id : '0',text : '启用'} ,{id : '1',	text : '禁用'} ];
        //var token = "ZxLZWnlOKTYZUPXdeqhf";
        //var token = localStorage.getItem('token');
        var day = new Date();
        var tdate = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()} ${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;

        import { getConceptTree,getConceptGridData,saveConceptForm,isConceptUse } from '@/request/api';// 导入我们的api接口
export default {
    data(){
        return{
            center: '',
            centerList:zbbm,
            conceptName: '',
            conceptType: '',
            conceptTypeList:gnlx,
            indicatorType: '',
            indicatorTypeList: zblx,
            isDisabled: '',
            isDisabledList: zt,
            tableData: [],//表格的数据
            menuData:[],//左边菜单树的数据
            currRow:{},//当前选中行数据
            dialogTitle:'',//弹出框标题
            isShow:false,//form不能填写
            token:localStorage.getItem('token'),
            defaultProps: {
                children: 'children',
                label: 'text'
            },
            form:{//新建概念表单数据
                center:'',
                name:'',
                desc:'',
                conceptType:'',
                indicatorType:'',
                calculation:'',
                remark:''
            },
            formRules:{//新建概念表单 验证规则
                center:[{required:true,message:'请输入职能中心',trigger:'blur'}],
                name:[ {validator:'', trigger: 'blur' }],
                desc:[{required:true,message:'请输入概念定义',trigger:'blur'}],
                conceptType:[{required:true,message:'请输入概念类型',trigger:'blur'}],
                indicatorType:[{required:true,message:'请输入指标类型',trigger:'blur'}],
                calculation:[{required:true,message:'请输入计算公式',trigger:'blur'}],
                remark:[{required:true,message:'请输入申请原因',trigger:'blur'}]
            },
            dialogTableVisible:false,//新建概念表单 是否显示

            currentPage: 0, //当前页
            pageSize: 20, //分页数
            pagetotal: 0//总条数
        }
    },
    created(){
        this.loadData() ;
        this.loadMenuTree() ;
        this.formRules.name[0].validator = this.centerNameRule;
    },
    methods: {
        handleSizeChange(val) {
            this.pageSize = val;
            this.loadData();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadData();
            console.log(`当前页: ${val}`);
        },
        handleNodeClick(value, data, node){
            // console.log(value);
            // console.log(data);
            // console.log(node);
            var id = node.node.data.id;
            var text = node.node.data.text;
            var isLeaf = node.node.isLeaf;
            var params = {
                token:this.token,
                center:text,
            };
            this.center = '';
            this.conceptType ='';
            if(isLeaf){
                params={
                    conceptType:text,
                    center:this.$refs.tree.getNode(id).parent.data.text,
                    token:this.token,
                }
                this.conceptType = text
            }else{
                if(text == '华胜连锁'){
                    params={
                        center:'',
                        token:this.token,
                    }
                    this.center = '';
                }else{
                    this.center = text;
                }
            }
            params.pageIndex = ((this.currentPage - 1)== -1?0:(this.currentPage - 1));
            params.pageSize = this.pageSize;
            this.getData(params);
        },
        loadData() {
            var params = {
                center:this.center,
                conceptName:this.conceptName,
                conceptType:this.conceptType,
                indicatorType:this.indicatorType,
                isDisabled:this.isDisabled,

                pageIndex: this.currentPage - 1,
                pageSize: this.pageSize,
                token: this.token
            };
            this.getData(params);
        },
        getData(params){
            var that = this;
            getConceptGridData(params).then(res => {
                var data = res.mm;
                that.pagetotal = res.total;
                that.tableData = data;
                
            }, function (err) {
                console.log(err);
            })
        },
        loadMenuTree(){
            var params ={
                token: this.token
            };
            var that = this;
            getConceptTree(params).then(res => {
                    var data = res.mm;
                    that.menuData = this.convert(data);
                    console.log(that.menuData);
                },
                function(err){
                    console.log(err);
                })
        },
        statusFormat:function(row,col){
            var val = row[col.property];
            for (let index = 0; index < zt.length; index++) {
                if(val == zt[index].id){
                    return zt[index].text
                }
            }
        },
        convert(treeData) {
            var nodes = [];
            // 得到顶层节点
            for (var i = 0; i < treeData.length; i++) {
                var row = treeData[i];
                if (!this.exists(treeData, row.parentId)) {
                    nodes.push({
                        id: row.id,
                        text: row.center
                    });
                }
            }
            var nodesArr = [];
            for (var i = 0; i < nodes.length; i++) {
                nodesArr.push(nodes[i]);
            }
            while (nodesArr.length) {
                var node = nodesArr.shift(); // 父节点 shift()方法用于把数组的第一个元素从其中删除,并返回第一个元素的值
                // 得到子节点
                for (var i = 0; i < treeData.length; i++) {
                    var row = treeData[i];
                    if (row.parentId == node.id) {
                        var child = {
                            id: row.id,
                            text: row.center
                        };
                        if (node.children) {
                            node.children.push(child);
                        } else {
                            node.children = [child];
                        }
                        nodesArr.push(child);
                    }
                }
            }
            return nodes;
        },
        exists(treeData, parentId) {
            for (var i = 0; i < treeData.length; i++) {
                if (treeData[i].id == parentId) {
                    return true;
                }
            }
            return false;
        },
        saveForm(formEl){
            if(this.dialogTitle=='新增概念'){
                var params = {
                    token:this.token,
                    center:this.form.center,
                    conceptNa:this.form.name,
                    data:this.form,
                    nowdate:tdate,
                    operateType:'新增',
                    status:'草稿'
                }
                this.$refs[formEl].validate((valid) => {
                    if (valid) {
                        saveConceptForm(params).then(
                            res=>{this.showTip(1,'新增成功');},
                            err=>{this.showTip(2,'新增失败');}
                        )
                    } else {
                        console.log('error add!!');
                        return false;
                    }
                });
            }
            if(this.dialogTitle=='修改概念'){
                var params = {
                    token:this.token,
                    center:this.form.center,
                    conceptNa:this.form.name,
                    data:this.form,
                    nowdate:tdate,
                    operateType:'修改',
                    status:'草稿'
                }
                this.$refs[formEl].validate((valid) => {
                    if (valid) {
                        saveConceptForm(params).then(
                            res=>{this.showTip(1,'修改成功');},
                            err=>{this.showTip(2,'修改失败');}
                        )
                    } else {
                        console.log('error edit!!');
                        return false;
                    }
                });
            }
            if(this.dialogTitle=='启用概念'){
                var params = {
                    token:this.token,
                    data:{
                        id:this.currRow.id,
                        operateType:'启用',
                        isDisabled:0
                    },
                    nowdate:tdate,
                    remark:this.form.remark
                }
                this.$refs[formEl].validate((valid) => {
                    if (valid) {
                        isConceptUse(parmas).then(
                            res=>{this.showTip(1,'启用成功');},
                            err=>{this.showTip(2,'启用失败');}
                        )
                    } else {
                        console.log('error use!!');
                        return false;
                    }
                });
            }
            if(this.dialogTitle =='禁用概念'){
                var params = {
                    token:this.token,
                    data:{
                        id:this.currRow.id,
                        operateType:'禁用',
                        isDisabled:1
                    },
                    nowdate:tdate,
                    remark:this.form.remark
                }
                this.$refs[formEl].validate((valid) => {
                    if (valid) {
                        isConceptUse(params).then(
                            res=>{this.showTip(1,'禁用成功');},
                            err=>{this.showTip(2,'禁用失败');}
                        )
                    } else {
                        console.log('error use!!');
                        return false;
                    }
                });
            }
        },
        showTip(e,msg){
            if(e == 1){
                this.$message({
                    message: msg,
                    type: 'success'
                });
            }
            if(e == 2){
                this.$message.error(msg);
            }
        },
        centerNameRule(rule,value,callback){
            var regex=/^【.*】$/g;
            var val = regex.test(value);
            if (value === '') {
                callback(new Error('请输入概念名称'));
            } else if(!val){
                callback(new Error('请在概念名称外层加上【】'));
            }else{
                callback();
            }
        },
        handleRowChange(row){
            this.currRow = row;
        },
        getDetails(rows){
            
        },
        addRow(){
            this.dialogTableVisible=true;
            this.dialogTitle='新增概念';
        },
        editRow(){
            // var ids = this.currRows.map(item =>item.id);
            if(this.currRow.id == null){
                this.$message({
                    message: '请选择一条要修改的数据',
                    type: 'warning'
                });
            }else{
                this.dialogTitle='修改概念';
                this.dialogTableVisible=true;
                this.setFormData();
            }
        },
        setFormData(){
            var row = {
                center:this.currRow.center,
                name:this.currRow.conceptName,
                desc:this.currRow.conceptDefinition,
                conceptType:this.currRow.conceptType,
                indicatorType:this.currRow.indicatorType,
                calculation:this.currRow.calculation,
                remark:''
            }
            this.form = row;
        },
        isdisabled(e){
            if(this.currRow.id == null){
                this.$message({
                    message: '请选择一条要操作的数据',
                    type: 'info'
                });
            }else{
                var tip = null;
                if(e == 0){
                    if(this.currRow.isDisabled == 0){
                        this.showTip(2,'请勿重复启用！');
                        return;
                    }
                    tip = `是否启用${this.currRow.conceptName}？`;
                }
                if(e == 1){
                    if(this.currRow.isDisabled == 1){
                        this.showTip(2,'请勿重复禁用！');
                        return;
                    }
                    tip = `是否禁用${this.currRow.conceptName}？`;
                }
                this.$confirm(tip,'友情提示',{
                    confirmButtonText:'确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).then(()=>{
                    if(e == 0){
                        this.dialogTitle='启用概念';
                    }
                    if(e == 1){
                        this.dialogTitle='禁用概念';
                    }
                    this.dialogTableVisible=true;
                    this.setFormData();
                    this.isShow = true;
                }).catch(()=>{

                })
            }
        }
    }
}
</script>

<style lang="less" scoped>

.el-dialog
{
    position: absolute;
    top :50%;
    left :50%;
    margin: 0 !important;
    transform :translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width :calc(100% - 30px)
    
}
.el-dialog__body{
    padding:10px 20px;
}
.el-footer{
    height: auto !important;
    padding:0px !important;
}
.asideSty{
    border-top:1px solid #ebeef5;
    border-bottom:1px solid #ebeef5;
    border-left:1px solid #ebeef5;
}
</style>

