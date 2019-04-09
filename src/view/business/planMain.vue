<template>
    <div>
        <el-container style="height:100%">
            <el-header style="text-align: left;">
                <el-select v-model="status" clearable placeholder="请选择状态" style="width:150px;">
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id"
                    ></el-option>
                </el-select>

                <el-date-picker
                    v-model="startDate"
                    type="month"
                    placeholder="选择起始月份"
                    style="width:150px;"
                ></el-date-picker>

                <el-date-picker
                    v-model="endDate"
                    type="month"
                    placeholder="选择结束月份"
                    style="width:150px;"
                ></el-date-picker>
                <el-button icon="el-icon-search" @click="loadData">查询</el-button>
                <!-- <span style="border-left: solid 1px #8ba0bc;"></span> -->
                <el-button icon="el-icon-circle-plus-outline" @click="dialogVisible = true">制定计划</el-button>
                <el-button icon="el-icon-tickets" @click="dialogVisible = true">查看</el-button>
            </el-header>
            <!-- 表格区域 -->
            <el-main style="padding:0px 20px;">
                <el-table
                    ref="singleTable"
                    :data="tableData"
                    border
                    highlight-current-row
                    style="width: 100%;"
                    height="500px"
                >
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column property="examinee" label="被考核人" width="80"></el-table-column>
                    <el-table-column property="valuea" label="中心" width="120"></el-table-column>
                    <el-table-column property="department" label="部门" width="120"></el-table-column>
                    <el-table-column property="post" label="岗位" width="120"></el-table-column>
                    <el-table-column property="valueb" label="报告名称" width="320"></el-table-column>
                    <el-table-column
                        property="status"
                        label="状态"
                        width="120"
                        :formatter="statusFormat"
                    ></el-table-column>
                    <el-table-column property="khMan" label="考核人" width="70"></el-table-column>
                    <el-table-column
                        property="examineDate"
                        label="提交日期"
                        width="100"
                        :formatter="dateFormat"
                    ></el-table-column>
                    <el-table-column label="操作" width="180">
                        <template>
                            <el-button size="mini" @click="dialogVisible = true">编辑</el-button>
                            <el-button size="mini" type="danger" @click="dialogVisible = true">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagetotal"
                ></el-pagination>
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
import { getPlanList } from "@/request/api";
const Statue = [
    {
        id: "0",
        text: "草稿"
    },
    {
        id: "10",
        text: "计划已提交"
    },
    {
        id: "11",
        text: "计划已审核"
    },
    {
        id: "20",
        text: "绩效已提交"
    },
    {
        id: "21",
        text: "绩效已审核"
    },
    {
        id: "30",
        text: "已审批"
    }
]; //状态
export default {
    data: function() {
        return {
            tableData: [],
            currentPage: 0,
            pageSize: 10,
            pagetotal: 0,
            status: "",
            startDate: "",
            endDate: "",
            dialogVisible: false,
            options: Statue,
            token:localStorage.getItem('token')
        };
    },
    created() {
        this.loadData();
    },
    filters: {
        dateFormat: function(val) {
            var d = new Date(val);
            var year = d.getFullYear();
            var month = d.getMonth();
            var day = d.getDate();
            return year + "-" + month + "-" + day;
        }
    },
    methods: {
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
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
        loadData() {
            var params = {
                data: {
                    date: this.startDate,
                    data2: this.endDate,
                    status: this.status
                },
                // page: {
                //   begin: 0,
                //   length: 5
                // },
                pageIndex: this.currentPage - 1,
                pageSize: this.pageSize,
                token: this.token
            };
            var that = this;
            //this.$http.post(turl, params)

            getPlanList(params).then(
                res => {
                    //console.log(JSON.stringify(params), '哈哈哈哈或');
                    var data = res.mm;
                    that.pagetotal = res.total;
                    //that.currentPage = that.pagetotal
                    //console.log(data);
                    //console.log(JSON.stringify(data));
                    //console.log(data.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize));
                    that.tableData = data;
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
        statusFormat: function(row, column) {
            var val = row[column.property];
            for (let index = 0; index < Statue.length; index++) {
                if (val == Statue[index].id) return Statue[index].text;
            }
        }
    }
};
</script>