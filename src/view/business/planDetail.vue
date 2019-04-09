<template>
    <div>
        <el-container v-bind:style="{height:conmentHeight+ 'px'}">
            <el-header style="text-align: left;">
                <span>被考核人：</span>
                <el-input style="width:100px;"></el-input>
                <span>岗位：</span>
                <el-input style="width:100px;"></el-input>
                <span>部门：</span>
                <el-input style="width:100px;"></el-input>
                <span>考核阶段：</span>
                <el-date-picker type="month" placeholder="选择月份" style="width:150px;"></el-date-picker>
                <span>考核人：</span>
                <el-input style="width:100px;"></el-input>

                <el-button icon="el-icon-circle-plus-outline" @click="dialogVisible = true">保存</el-button>
                <el-button icon="el-icon-tickets" @click="dialogVisible = true">提交</el-button>
            </el-header>
            <!-- 表格区域 -->
            <el-main style="padding:0px 20px;" class="test-1">
                <div style="width:1500px;">
                    <el-table
                        ref="singleTable"
                        :data="tableData"
                        :show-header="false"
                        border
                        highlight-current-row
                        fit
                        style="width:100% "
                        :span-method="cellMerge"
                        row-style="height:20px;"
                        cell-style="padding:5px;"
                    >
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column property label="考核维度" width="80">
                            <template slot-scope="scope">
                                <div v-html="scope.row.assessmentLat"></div>
                            </template>
                        </el-table-column>
                        <el-table-column property label="职能模块" width="240">
                            <template slot-scope="scope">
                                <div v-html="scope.row.functionMudole"></div>
                            </template>
                        </el-table-column>
                        <el-table-column property label="职能描述" width="120">
                            <template slot-scope="scope">
                                <div v-html="scope.row.departmentDesc"></div>
                            </template>
                        </el-table-column>
                        <el-table-column property label="本期任务、目标及评价标准" width="400">
                            <template slot-scope="scope">
                                <div v-html="scope.row.target"></div>
                            </template>
                        </el-table-column>
                        <el-table-column property label="目标完成情况" width="120">
                            <template slot-scope="scope">
                                <div v-html="scope.row.taskAchi"></div>
                            </template>
                        </el-table-column>
                        <el-table-column property label="权重" width="120">
                            <template slot-scope="scope">
                                <div v-html="scope.row.weight"></div>
                            </template>
                        </el-table-column>
                        <el-table-column property label="自评" width="70">
                            <template slot-scope="scope">
                                <div v-html="scope.row.myselfScore"></div>
                            </template>
                        </el-table-column>
                        <el-table-column property label="得分" width="100">
                            <template slot-scope="scope">
                                <div v-html="scope.row.score"></div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template >
                                <el-button size="mini" @click="dialogVisible = true">编辑</el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="dialogVisible = true"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                
                    <el-table
                        ref="singleTable"
                        :data="tableData2"
                        :show-header="false"
                        border
                        highlight-current-row
                        fit
                        style="width:100%;"
                        :span-method="cellMergeB"
                    >
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column property="assessmentLat" label="考核维度" width="80"></el-table-column>
                        <el-table-column property="productLine" label="产品线" width="120"></el-table-column>
                        <el-table-column property="functionMudole" label="职能模块" width="120"></el-table-column>
                        <el-table-column property="departmentDesc" label="职能描述" width="120"></el-table-column>
                        <el-table-column property="wbscode" label="WBS编码" width="80"></el-table-column>
                        <el-table-column property="target" label="本期任务、目标及评价标准" width="220"></el-table-column>
                        <el-table-column
                            property="examineDate"
                            label="预计完成时间"
                            width="100"
                            :formatter="dateFormat"
                        ></el-table-column>
                        <el-table-column property="taskAchi" label="目标完成情况" width="120"></el-table-column>
                        <el-table-column property="weight" label="权重" width="120"></el-table-column>
                        <el-table-column property="myselfScore" label="自评" width="70"></el-table-column>
                        <el-table-column property="score" label="得分" width="100"></el-table-column>
                        <el-table-column label="操作" width="180">
                            <template>
                                <el-button size="mini" @click="dialogVisible = true">编辑</el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="dialogVisible = true"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
        </el-container>

        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <span>待开发...</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {getPlanDetailA,getPlanDetailB} from '@/request/api'; 
export default {
    data() {
        return {
            tableData: [],
            tableData2: [],
            dialogVisible: false,
            conmentHeight: document.documentElement.clientHeight,

            spanArr: [],
            pos: 0,
            spanArrTwo: [],
            posTwo: 0,

            spanArrB: [],
            posB: 0,
            spanArrTwoB: [],
            posTwoB: 0,
            token:localStorage.getItem('token')
        };
    },
    created() {
        this.loadData();
        //this.getSpanArr(this.tableData);
    },
    mounted() {
        //this.getSpanArr(this.tableData);
    },
    methods: {
        loadData() {
            // var turl1 =
            //     "http://14.23.35.20:6280/vapp/com.hs.plan.PerformanceAssessment.PA_Detail_Search.biz.ext";
            // var turl2 =
            //     "http://14.23.35.20:6280/vapp/com.hs.plan.PerformanceAssessment.PA_Detail_Searchb.biz.ext";
            var params = {
                recordId: 1535,
                operateType: "view",
                token: this.token
            };
            var that = this;
            // this.$http.post(turl1, params)
            getPlanDetailA(params).then(
                res => {
                    var data = res.mm;
                    that.tableData = data;
                    this.getSpanArr(data);
                },
                function(err) {
                    console.log(err);
                }
            );
            // this.$http.post(turl2, params)
            getPlanDetailB(params).then(
                res => {
                    var data = res.mm;
                    that.tableData2 = data;
                    this.getSpanArrB(data);
                },
                function(err) {
                    console.log(err);
                }
            );
        },
        dateFormat: function(row, column) {
            var val = row[column.property];
            var d = new Date(val);
            var year = d.getFullYear();
            var month = d.getMonth();
            var day = d.getDate();
            return year + "-" + month + "-" + day;
        },

        getSpanArr(data) {
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    (this.pos = 0), this.spanArrTwo.push(1);
                    this.posTwo = 0;
                } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[i].assessmentLat === data[i - 1].assessmentLat) {
                        //第一列需合并相同内容的判断条件
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }

                    if (data[i].functionMudole === data[i - 1].functionMudole) {
                        //第二列和第16列需合并相同内容的判断条件
                        this.spanArrTwo[this.posTwo] += 1;
                        this.spanArrTwo.push(0);
                    } else {
                        this.spanArrTwo.push(1);
                        this.posTwo = i;
                    }
                }
            }
        },

        getSpanArrB(data) {
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArrB.push(1);
                    (this.posB = 0), this.spanArrTwoB.push(1);
                    this.posTwoB = 0;
                } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[i].assessmentLat === data[i - 1].assessmentLat) {
                        //第一列需合并相同内容的判断条件
                        this.spanArrB[this.posB] += 1;
                        this.spanArrB.push(0);
                    } else {
                        this.spanArrB.push(1);
                        this.posB = i;
                    }

                    if (data[i].functionMudole === data[i - 1].functionMudole) {
                        //第二列和第16列需合并相同内容的判断条件
                        this.spanArrTwoB[this.posTwoB] += 1;
                        this.spanArrTwoB.push(0);
                    } else {
                        this.spanArrTwoB.push(1);
                        this.posTwoB = i;
                    }
                }
            }
        },
        cellMerge({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 1) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
            if (columnIndex === 2) {
                const _row = this.spanArrTwo[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        },
        cellMergeB({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 1) {
                const _row = this.spanArrB[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
            if (columnIndex === 2) {
                const _row = this.spanArrTwoB[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        }

        //         setTable:function(){
        //         let spanOneArr = [],
        //       spanTwoArr = [],
        //       concatOne = 0,
        //       concatTwo = 0;
        //       var tableData = this.tableData2;
        //   tableData.forEach((item,index)=>{
        //     if(index === 0){
        //       spanOneArr.push(1);
        //       spanTwoArr.push(1);
        //     }else{
        //       if(item.assessmentLat === tableData[index - 1].assessmentLat){ //第一列需合并相同内容的判断条件
        //         spanOneArr[concatOne] += 1;
        //         spanOneArr.push(0);
        //       }else{
        //         spanOneArr.push(1);
        //         concatOne = index;
        //       };
        //       if(item.functionMudole === tableData[index - 1].functionMudole){//第二列和第16列需合并相同内容的判断条件
        //         spanTwoArr[concatTwo] += 1;
        //         spanTwoArr.push(0);
        //       }else{
        //         spanTwoArr.push(1);
        //         concatTwo = index;
        //       };
        //     }
        //   });
        //   return  {
        //     one: spanOneArr,
        //     two: spanTwoArr
        //   }
        // },
        //
        // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        //   if(columnIndex === 0 ) {
        //     const _row = (this.setTable(this.tableData).one)[rowIndex];
        //     const _col = _row > 0 ? 1 : 0;
        //     return {
        //       rowspan: _row,
        //       colspan: _col
        //     };
        //   }
        //   if(columnIndex === 1 || columnIndex === 15) {
        //     const _row = (this.setTable(this.tableData).two)[rowIndex];
        //     const _col = _row > 0 ? 1 : 0;
        //     return {
        //       rowspan: _row,
        //       colspan: _col
        //     };
        //   }
        // },
    }
};
</script>

<style scoped>
.test-1::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
}
.test-1::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    /* border-radius: 10px; */
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #535353;
}
.test-1::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px #ccc;
    /* border-radius: 10px; */
    background: #ededed;
}
</style>
