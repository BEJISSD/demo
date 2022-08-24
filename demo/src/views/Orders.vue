<template>
  <div class="order">
    <div class="filter">
      <div class="filter-left">
        <el-form class="form" ref="queryParams" :model="queryParams" :inline="true"   label-width="125px">
          <el-form-item label="订单号" prop="ordersNum">
            <el-input
              v-model="queryParams.ordersNum"
              placeholder="请输入订单号"
              clearable
              @keyup.enter.native="loadDate"
            />
          </el-form-item>

          <el-form-item label="订单状态" prop="status">
            <el-select
              v-model="statusArray"
              placeholder="全部"
              clearable
              multiple
              class="select"
              @keyup.enter.native="loadDate"
            >
              <el-option
                v-for="operator in statusList"
                :key="operator.value"
                :label="operator.key"
                :value="operator.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="开始日期" prop="date">
            <el-date-picker
              v-model="queryParams.startDate"
              type="date"
              placeholder="选择日期"
              @change="loadDate"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" prop="date">
            <el-date-picker
              v-model="queryParams.endDate"
              type="date"
              placeholder="选择日期"
              @change="loadDate"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="loadDate">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>

        </el-form>
      </div>

      <div class="filter-right">
        <el-button icon="el-icon-refresh" type="primary" @click="reload">刷新页面</el-button>
      </div>
    </div>

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
        <el-table-column
          prop="orders_num"
          align="center"
          label="订单号"
        >
        </el-table-column>
        <el-table-column
          prop="quantity"
          align="center"
          label="商品数量"
        >
        </el-table-column>
        <el-table-column
          prop="discount_price"
          align="center"
          label="金额"
        />
        <el-table-column
          prop="picking_status"
          align="center"
          label="订单状态"
          width="150"
        />
        <el-table-column
          prop="create_time"
          align="center"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              type="warning"
              @click="handleShowInfo(scope.row)"
            >详情</el-button>
            <el-button type="primary" @click="handlePrint(scope.row)">打印小票</el-button>

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
      width="80%"
      top="5vh"
      :before-close="handleClose"
      class="dialogStyle"
      center
    >
      <div class="desc">
        <div class="row">
          <div class="item">
            <label class="label">订单信息:</label>
          </div>
          <div class="item">
<!--            <label class="label"></label>-->
            <span class="span">{{ (orderData.ordersNum ? orderData.ordersNum : '' ) + '，'}}</span>
          </div>
          <div class="item">
<!--            <label class="label">，共</label>-->
            <span class="span">{{'共' + (orderData.quantity ? orderData.quantity : 0 ) + '件商品，'}}</span>
          </div>
          <div class="item">
<!--            <label class="label">件商品，合计</label>-->
            <span class="span">{{ '合计' + (orderData.discount_price ? orderData.discount_price : 0) + '元' }}</span>
<!--            <label class="label">元</label>-->
          </div>
        </div>
        <div class="row">
          <div class="item">
            <label class="label">收货人信息:</label>
          </div>
          <div class="item">
<!--            <label class="label"></label>-->
            <span class="span">{{ (orderData.customer_name ? orderData.customer_name : '' ) + '，'}}</span>
          </div>
          <div class="item">
<!--            <label class="label">，</label>-->
            <span class="span">{{ (orderData.customer_phone ? orderData.customer_phone : '') + '，'  }}</span>
          </div>
          <div class="item">
<!--            <label class="label">，</label>-->
            <span class="span">{{ (orderData.customer_address ? orderData.customer_address : '') }}</span>
          </div>

        </div>




      </div>

      <div class="dialog-content">
        <el-table
          :data="orderData.list"
          :loading="loading"
          height="100%"
          stripe
          border
          style="width: 100%;"
        >
          <el-table-column
            type="index"
            align="center"
            width="80"
            label="序号"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="名称"
          />
          <el-table-column
            prop="barcode"
            align="center"
            label="条码"
          />
          <el-table-column
            prop="quantity"
            align="center"
            label="商品数量"
          >
          </el-table-column>
          <el-table-column
            prop="discount_price"
            align="center"
            label="金额"
          />
          <el-table-column
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              <i :class="getStatusClass(scope.row)"></i>
            </template>
          </el-table-column>.
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <InputNumber
                :model="scope.row"
                :number="scope.row.ordersPickingLogList?scope.row.ordersPickingLogList.length:0"
                :min="0"
                @change="handleChangeInputNumber"
              ></InputNumber>
<!--              <el-input-number v-model="scope.row.number"@change="handleChangeInputNumber"  :min="0"></el-input-number>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="number-box">
        <label class="label">贴单数量:</label>
        <el-input-number v-model="orderData.stickerNum":min="0"></el-input-number>
      </div>
      <div slot="footer" class="dialog-footer">

        <el-button class="button" @click="dialogVisible = false">取 消</el-button>
        <el-button class="button" type="primary" @click="submitFormBtn">完成并打印贴单</el-button>
       </div>
    </el-dialog>
  </div>
</template>

<script>
import { completePicking, getOrdersDetails, getOrdersPageList, increase, printTicket, reduce } from '@/api/interface'
import { getToken } from '@/utils/auth'

export default {
  name: 'Orders',
  data(){
    return{
      tableData:{
        list: [],
        pageNumber: 1,
        pageSize: 10,
        totalPage: 1,
        totalRow: 1,
      },
      loading:false,
      dialogVisible:false,
      orderData:{
        list:[],
        ordersNum:"",
        customer_name:"",
        customer_phone:"",
        customer_address:"",
        stickerNum:1,
      },

      statusList:[
        {value:0,key:"0"},
        {value:1,key:"1"},
        {value:2,key:"2"}
      ],
      ordersNum:'',
      statusArray:[0,1],
      date:[
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 1),
        new Date()
      ],
      queryParams:{
        ordersNum:"",
        pageSize:10,
        pageNumber: 1,
        startDate: new Date(new Date().getTime() - 3600 * 1000 * 24 * 1).toISOString().split("T")[0],
        endDate:new Date().toISOString().split("T")[0],
        pickingStatus:"0,1",
      },
      scanCodeSwitch:false, // 扫码开关
      dynamicId:null,
      debounce:false,
    }
  },
  watch:{
    dialogVisible(val){
      this.scanCodeSwitch = val;
    },
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
    // 绑定enter事件
    document.onkeydown = (e) => {
      if (this.scanCodeSwitch) {
        if (e.key == 'Enter') {
          this.scanBarcode()
        } else {
          this.dynamicId = this.dynamicId ? this.dynamicId + e.key : e.key
        }
      }
    }
  },
  methods:{
    loadDate(){
      getOrdersPageList(this.getParams()).then((res) =>{
        const {data} = res;
        this.tableData = data;
      }).catch(()=>{
      })
    },
    getParams() {
      const params = {}
      this.queryParams.pickingStatus = this.statusArray.join(',');
      for (const key in this.queryParams) {
        if (this.queryParams[key] || this.queryParams[key] === 0) {
          params[key] = this.queryParams[key];
        }
      }
      return params
    },
    resetQuery(){
      this.data = [];
      this.queryParams = {
        ordersNum:"",
        pageSize:10,
        pageNumber: 1,
        startDate: '',
        endDate:'',
        pickingStatus:"",
      }
      this.statusArray = [];
      this.loadDate();
    },
    handleChange(){

    },
    tableDataPageChange(e){
      this.queryParams.pageSize = e.limit;
      this.queryParams.pageNumber = e.page;
      this.loadDate();
    },
    handleShowInfo(row){
      let param = {
        ordersNum:row.orders_num,
        isNeedPickingLog:true
      }
      getOrdersDetails(param).then((res) =>{
        let list = res.data;
        this.orderData ={
          list:list,
          ordersNum:row.orders_num,
          customer_name:row.customer_name,
          customer_phone:row.customer_phone,
          customer_address:row.customer_address,
          stickerNum:1,
          quantity:row.quantity,
          discount_price:row.discount_price,
        }
        this.dialogVisible = true;
      }).catch(()=>{
      })
    },
    reloadOrderInfo(model){
      let param = {
        ordersNum:model.orders_num,
        isNeedPickingLog:true
      }
      getOrdersDetails(param).then((res) =>{
        this.orderData.list = res.data;
      }).catch(()=>{
      })
    },
    /** 日期修改事件 */
    handleChangeDate(value){
      this.loadDate()
    },
    handleUpdate(){

    },
    handleClose(){
      this.dialogVisible = false;
    },
    reload(){
      location.reload();
    },
    handleChangeInputNumber(newVal,oldVal,model){
      let param = {
        ordersNum:model.orders_num,
        barcode:model.barcode
      }
      if (newVal>oldVal){
        increase(param).then((res) =>{
          this.reloadOrderInfo(model);
        }).catch(()=>{})
      }else {
        reduce(param).then((res) =>{
          this.reloadOrderInfo(model);
        }).catch(()=>{})
      }
    },
    getStatusClass(row){
      let ordersPickingLogListLength = row.ordersPickingLogList.length;
      let quantity = row.quantity;
      if (ordersPickingLogListLength == 0){
        return "el-icon-warning-outline gray"
      }
      if (ordersPickingLogListLength<quantity){
        return "el-icon-warning-outline yellow"
      }else if(ordersPickingLogListLength == quantity){
        return "el-icon-circle-check green"
      }else if (ordersPickingLogListLength > quantity){
        return "el-icon-warning-outline rad"
      }
    },
    submitFormBtn(){
      let list = this.orderData.list;
      let filterList = list.filter(function(item,index){
        let ordersPickingLogListLength = item.ordersPickingLogList.length;
        let quantity = item.quantity;
        return ordersPickingLogListLength != quantity
      });
      if (filterList && filterList.length>0){
        this.$confirm('存在异常数据，确定完成?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=> {
          this.handleCompletePicking();
        }).catch(() => {});
      }else {
        this.handleCompletePicking();
      }

    },
    handleCompletePicking(){
      let param = {
        ordersNum:this.orderData.ordersNum,
        stickerNum:this.orderData.stickerNum
      };
      completePicking(param).then((res) =>{
        this.$message.success("操作成功!");
        this.dialogVisible = false;
        this.loadDate();
      }).catch(()=>{});
    },
    handlePrint(row){
      let param = {
        ordersNum:row.orders_num,
      };
      printTicket(param).then((res) =>{
        this.$message.success("操作成功!");
      }).catch(()=>{});
    },
    /** 扫码 */
    scanBarcode(){
      if (this.debounce){
        this.dynamicId = null;
        this.$message({
          message: h('p', null, [
            h('span', null, "请勿扫码过快:")
          ]),
          type:'warning'
        });
        return false;
      }
      this.debounce = true;
      let {dynamicId,orderData} = this
      // let dynamicId = this.dynamicId
      let list = orderData.list;
      let filterList = list.filter(function(item,index){
       let barcode = item.barcode
        return barcode == dynamicId
      });
      const h = this.$createElement;

      if (filterList && filterList.length>0){
        this.$message({
          message: h('p', null, [
            h('span', null, "扫码成功:" + dynamicId)
          ]),
          type:'success'
        });
        // this.$message.success("扫码成功:" + this.dynamicId)
        this.handleChangeInputNumber(1,0,filterList[0]);
        this.dynamicId = null;
      }else {
        this.dynamicId = null;
        this.$message({
          message: h('p', null, [
            h('span',null, "扫码失败:" + dynamicId)
          ]),
          type:'warning'
        });
        // this.$message.warning("扫码失败!" + this.dynamicId)
      }
      setTimeout(()=>{
        this.debounce = false;
      },1000)
    },
    handleBlur(event){
      // 点击后强制失去焦点
      if (event) {
        let target = event.target;
        if (target.nodeName == "SPAN") {
          target = event.target.parentNode;
        }
        target.blur();
      }
    },
  }
}
</script>

<style lang="scss">
.dialogStyle {
  .el-dialog__header {
    //height: 0;
    //padding: 0;
  }

  .el-dialog__body {
    //margin-top: 2%;
    padding: 0 2% 0 2%;
    height: 75vh;
  }
  .desc{
    //height: 20%;
    line-height: 2;
    margin-right: 5%;
  }
  .row{
    display: flex;
  }
  .label{
    font-size: 1.8vh;
    font-weight: 600;
    color: #282E39;
  }
  .item{
    //margin-right: 2%;
  }
  .span{
    font-size: 1.8vh;
    font-weight: 300;
    color: #282E39;
  }
  .dialog-content{
    height: 67%;
  }
}
.order{
  //font-size:24px;
  font-weight: bold;
  padding: 2%;
  width: 100%;
  height: 100%;
  //padding: 0 2% 0 2%;
}
.filter{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.form{
  display: flex;
}
.table{
  height: 80%;
  width: 100%;
  margin-bottom: 10%;
}

.el-table{
  font-size: 1.7vh;
  //border-radius: 10px;
}
//.el-table__body{
//  height: 100%;
//}
 .cell{
  //height: 3vh;
  font-size: 1.7vh;
  display: flex;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
}
 .el-input{
   //font-size: 1.7vh;
 }
 .el-form-item__label{
   font-size: 1.7vh;
 }
.el-date-editor{
  font-size: 1.7vh;
}
.el-table th > .cell {
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  font-size: 1.7vh;
  font-weight: 600;
  color: #282E39;
  line-height: 2;
}
.number-box{
  margin-top: 4%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  .label{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    margin-right: 2%;
  }
}
.dialog-footer{
  width: 100%;
  .button{
    width: 20%;
  }
}
.rad{
  font-size: 2.7vh;
  color: red;
}
.green{
  font-size: 2.7vh;
  color: #67C23A;
}
.yellow{
  font-size: 2.7vh;
  color: #E6A23C;
}
.gray{
  font-size: 2.7vh;
  color: #909399;
}
.el-message{
  font-size: 2vh;
}
.pagination{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
