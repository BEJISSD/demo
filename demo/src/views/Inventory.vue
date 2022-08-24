<template>
  <div class="Inventory">
    <div class="filter">
      <el-form class="form" ref="queryParams" :model="queryParams" :inline="true"   label-width="60px">
        <el-form-item label="条码:" prop="barcode">
          <el-input
            v-model="queryParams.barcode"
            placeholder="请输入条码"
            clearable
            @keyup.enter.native="loadDate"
          />
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
            clearable
            @keyup.enter.native="loadDate"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadDate">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>

        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="10" class="mb8">

      <el-col :span="1.5">
        <el-button type="primary" size="mini" icon="el-icon-upload2" @click="handleImport(1)">入库导入</el-button>
        <el-button type="danger" size="mini" icon="el-icon-upload2" @click="handleImport(2)">出库导入</el-button>
        <el-button type="success" size="mini" icon="el-icon-upload2" @click="handleImport(3)">变更导入</el-button>
      </el-col>

    </el-row>
    <div class="table">
      <el-table
        :data="tableData.list"
        :loading="loading"
        stripe
        height="100%"
        border
        style="width: 100%;"
      >
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="80"
        >
        </el-table-column>
        <el-table-column label="条形码" align="center" prop="barcode" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="规格" align="center" prop="spec" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column
          prop="sum_cost"
          align="center"
          label="总成本(元)"
        >
          <template slot-scope="scope">
            <InputNumber
              v-show="scope.row.isEdit"
              :model="scope.row"
              :number.sync="scope.row.sum_cost"
              :min="0"
              @change="handleChangeInputNumber"
            ></InputNumber>
            <span v-show="!scope.row.isEdit">{{scope.row.sum_cost}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          align="center"
          label="库存"
        >
          <template slot-scope="scope">
            <InputNumber
              v-show="scope.row.isEdit"
              :model="scope.row"
              :number.sync="scope.row.quantity"
              :min="0"
              @change="handleChangeInputNumber"
            ></InputNumber>
            <span v-show="!scope.row.isEdit">{{scope.row.quantity}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="cost"
          align="center"
          label="成本价(元)"
        />
        <el-table-column prop="update_time" align="center" label="修改时间"></el-table-column>
        <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button :type="scope.row.isEdit?'danger':'primary'" @click="handleEdit(scope.$index,scope.row)">{{scope.row.isEdit?"保存":"编辑"}}</el-button>
<!--            <el-button type="warning" @click="handleShowInfo(scope.row)">详情</el-button>-->
            <el-button type="success" @click="handleEditRecord(scope.$index,scope.row)">变更记录</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <pagination
          :total="tableData.totalRow"
          :page.sync="tableData.pageNumber"
          :limit.sync="tableData.pageSize"
          @pagination="tableDataPageChange"
        />
      </div>

    </div>

    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      :width="showType === 'table'?'60%':'40%'"
      top="5vh"
      :before-close="handleClose"
      :class="showType === 'table'?'dialogStyle':''"
      center
      width="90%"
    >
      <el-form v-if="showType==='form'" ref="form" :model="form" label-width="100px">
        <el-form-item label="条码:" prop="barcode">
          <el-input
            v-model="form.barcode"
            placeholder="请输入条码"
            clearable
          />
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="规格:" prop="spec">
          <el-input
            v-model="form.spec"
            placeholder="请输入规格"
            clearable
          />
        </el-form-item>
        <el-form-item label="成本价(元):" prop="cost">
          <span>{{form.cost}}</span>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <InputNumber
            :model="form"
            :number.sync="form.stock"
            :min="0"
            @change="handleChangeInputNumber"
          ></InputNumber>
        </el-form-item>
        <el-form-item label="总成本(元):" prop="sum_cost">
          <InputNumber
            :model="form"
            :number.sync="form.sum_cost"
            :min="0"
            @change="handleChangeInputNumber"
          ></InputNumber>
        </el-form-item>
      </el-form>

      <div v-if="showType==='table'" class="dialog-content">
        <el-table
          :data="recordData.list"
          :loading="loading"
          stripe
          border
          height="100%"
          style="width: 100%;"
        >
          <el-table-column type="index" align="center" width="80" label="序号"></el-table-column>
          <el-table-column label="条形码" align="center" width="150" prop="barcode" />
          <el-table-column label="名称" align="center" width="200"prop="name" />
          <el-table-column label="规格" align="center" prop="spec" />
          <el-table-column label="单位" align="center" prop="unit" />
          <el-table-column label="供应商" align="center" width="150" prop="supplier" />
          <el-table-column prop="sum_cost" align="center" label="变更成本(元)"/>
          <el-table-column prop="quantity" align="center" label="变更数量"/>
          <el-table-column prop="change_date" align="center" label="变更日期">
            <template slot-scope="scope">
              {{parseTime(scope.row.change_date,"{y}-{m}-{d}")}}
            </template>
          </el-table-column>
          <el-table-column prop="batch_number" align="center" label="变更批号"/>
          <el-table-column prop="type" align="center" label="变更类型">
            <template slot-scope="scope">
              <dict-tag :options="typeOptions" :value="scope.row.type"></dict-tag>
            </template>
          </el-table-column>
          <el-table-column prop="update_time" align="center" label="修改时间">
<!--            <template slot-scope="scope">-->
<!--              {{parseTime(scope.row.update_time,"{y}-{m}-{d}")}}-->
<!--            </template>-->
          </el-table-column>

        </el-table>

        <div class="pagination">
          <pagination
            :total="recordData.totalRow"
            :page.sync="recordData.pageNumber"
            :limit.sync="recordData.pageSize"
            @pagination="tableRecordDataPageChange"
          />
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button class="button" @click="dialogVisible = false">关 闭</el-button>
        <el-button v-if="showType==='form'" class="button" type="primary" @click="submitFormBtn">保 存</el-button>
      </div>
    </el-dialog>
    <import-dialog
      :dialog-visible.sync="importVisible"
      :import-type="importType"
      :desc="importDialogTitle"
      @change="handleChangeImport"
    ></import-dialog>
  </div>
</template>

<script>
import {
  getGoodsBaseInfoById,
  getGoodsBaseList,
  getGoodsStockChangeLog,
  updateCost,
  updateGoodsBaseInfo
} from '@/api/interface'
import { getToken } from '@/utils/auth'

export default {
  name: 'Inventory',
  data(){
    return{
      queryParams:{
        pageSize:10,
        pageNumber: 1,
        barcode:'',
        name:''
      },
      tableData:{
        list:[],
        totalRow:0,
        pageNumber:0,
        pageSize:0
      },
      loading:false,
      dialogVisible:false,
      importVisible:false,
      form:{

      },
      showType:'',
      recordData:{
        list:[],
        totalRow:0,
        pageNumber:0,
        pageSize:0
      },
      barcode:'',
      // 1进库 2出库 3手动纠正
      typeOptions:[
        {dictValue:'1',dictLabel:'入库',listClass:'default'},
        {dictValue:'2',dictLabel:'出库',listClass:'default'},
        {dictValue:'3',dictLabel:'变更',listClass:'default'}
      ],
      importType:null,
      importDialogTitle:'',
      importModel:{},
    }
  },
  created() {
  },
  mounted() {
    if (!getToken()){
      this.$login.showMsgBox().then((data)=>{
        this.loadDate();
      }).catch(()=>{
      })
    }else {
      this.loadDate();
    };

  },
  methods:{
    loadDate(){
      this.loading = true;
      getGoodsBaseList(this.getParams()).then((res)=>{
        const {data} = res;
        data.list.forEach((item)=>{
          item.isEdit = false;
        })
        this.tableData = data;
        this.loading = false;
      }).catch(()=>{})
    },
    handleImport(type){
      this.importVisible = true;
      this.importType = type;
      switch (type) {
        case 1:
          this.importDialogTitle = '入库导入';
          break;
        case 2:
          this.importDialogTitle = '出库导入';
          break;
        case 3:
          this.importDialogTitle = '变更导入';
          break;
      }
    },
    getParams() {
      const params = {}
      for (const key in this.queryParams) {
        if (this.queryParams[key] || this.queryParams[key] === 0) {
          params[key] = this.queryParams[key];
        }
      }
      return params
    },
    resetQuery(){
      this.queryParams = {
        pageSize:10,
        pageNumber: 1,
        barcode:'',
        name:''
      }
      this.loadDate();
    },
    handleChangeImport(){
      this.loadDate();
    },
    /** 展示详情 */
    handleShowInfo(row){
      this.showType = 'form'
      this.dialogVisible = true;
      getGoodsBaseInfoById(row.id).then((res)=>{
        const {data} = res;
        this.form = data;
      }).catch(()=>{})
    },
    /** 快捷编辑 */
    handleEdit(index,row){
      if (row.isEdit){
        // 保存编辑
        this.handleUpdate(row);
      }else {
        // 开启编辑
        row.isEdit = true;
      }
    },
    /** 保存编辑 */
    handleUpdate(row){
      const {id,quantity,sum_cost} = row
      let param = {
        id,
        quantity,
        sumCost:sum_cost
      }
      updateCost(param).then((res)=>{
        row.isEdit = false;
        this.$message.success("操作成功");
        this.loadDate();
      }).catch(()=>{})
    },
    /** 分页 */
    tableDataPageChange(e){
      this.queryParams.pageSize = e.limit;
      this.queryParams.pageNumber = e.page;
      this.loadDate();
    },
    tableRecordDataPageChange(e){
      let param ={
        pageSize:e.limit,
        pageNumber:e.page,
        barcode:this.barcode,
      };
      this.loadRecordData(param);
    },
    handleChangeInputNumber(newVal,oldVal,model){
      model.cost =  parseFloat(model.sum_cost/model.quantity).toFixed(4);
    },
    submitFormBtn(){
      updateGoodsBaseInfo(this.form).then((res) =>{
        this.$message.success("操作成功")
        this.dialogVisible = false;
        this.loadDate();
      }).catch(()=>{})
    },
    handleClose(){
      this.dialogVisible = false;
    },
    /** 获取变更记录 */
    handleEditRecord(index,row){
      this.showType = 'table'
      this.dialogVisible = true;
      this.barcode = row.barcode;
      let param = {
        pageSize:10,
        pageNumber:1,
        barcode:row.barcode,
      }
      this.loadRecordData(param);
    },
    loadRecordData(param){
      getGoodsStockChangeLog(param).then((res) =>{
        this.recordData = res.data;
      }).catch(()=>{})
    },
  }
}
</script>

<style lang="scss">
.Inventory{
  //font-size:24px;
  //font-weight: bold;
  padding: 2%;
  width: 100%;
  height: 100%;
}
.dialogStyle {
  .el-dialog__header {
    //height: 0;
    //padding: 0;
  }

  .el-dialog__body {
    //margin-top: 2%;
    padding: 1% 2% 0 2%;
    height: 80vh;
  }
  .dialog-content{
    height: 90%;
  }
}
.filter{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.table{
  height: 80%;
  width: 100%;
  margin-bottom: 10%;
  margin-top: 1%;
}
.el-table th > .cell {
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  //font-size: 1.7vh;
  font-weight: 600;
  color: #282E39;
  line-height: 2;
}
.pagination{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
