<template>
  <div class="home">
    <div class="input-box">
      <div class="input">
        <label class="label">条码:</label>
        <div style="width: 180px">
          <el-input
            ref="barcodeInput"
            v-model="barcode"
            placeholder="请扫条码"
            :disabled="disabledBarcodeInput"
            v-on:keyup.native="watchBarcodeKeyup"
            @blur="barcodeInputBlur"
            oninput="value=value.replace(/[^\d]/g,'')"
            clearable
          ></el-input>
        </div>
      </div>
      <div class="button-box">
        <el-button class="button" type="primary" @click="clearInput('barcode')">清空</el-button>
      </div>
    </div>

    <div class="goods-box" v-if="showGoodsInfo">
      <div class="goods-box__item">
        <label class="label">名称:</label>
        <span class="span">{{goodsInfo}}</span>
      </div>
<!--      <div class="goods-box__item">-->
<!--        <label class="label">规格:</label>-->
<!--        <span class="span">{{goods.spec}}</span>-->
<!--      </div>-->
    </div>

    <div class="input-box">
      <div class="input">
        <label class="label">数量:</label>
        <div style="width: 180px">
          <el-input
            ref="numberInput"
            v-model="number"
            placeholder="输入数量"
            oninput="value=value.replace(/[^\d]/g,'')"
            clearable
          ></el-input>
        </div>
<!--        <el-input v-model="number"></el-input>-->
<!--        <el-input-number ref="numberInput" v-model="number"></el-input-number>-->
      </div>
      <div class="button-box">
        <el-button class="button" type="primary" @click="clearInput('number')">清空</el-button>
      </div>
    </div>
    <div class="input-box">
      <div class="input">
        <label class="label">进货价:</label>
        <div style="width: 180px">
          <el-input
            ref="sumCostInput"
            v-model="sumCost"
            placeholder="输入进货价"
            @keyup.native="onlyNumber()"
            clearable
          ></el-input>
        </div>
<!--        <el-input v-model="sumCost"></el-input>-->
<!--        <el-input-number ref="numberInput" v-model="sumCost" :precision="2" :step="0.1"></el-input-number>-->
      </div>
      <div class="button-box">
        <el-button class="button" type="primary" @click="clearInput('sumCost')">清空</el-button>
      </div>
    </div>
    <div class="submitForm">
      <el-button type="primary" class="button" @click="uploadData">确定</el-button>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        :loading="loading"
        height="100%"
        style="width: 100%;"
      >
        <el-table-column
          type="index"
          label="序号"
          center
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="barcode"
          center
          label="条码"
        >
        </el-table-column>
        <el-table-column
          prop="quantity"
          center
          label="数量"
        >
        </el-table-column>
        <el-table-column
          prop="sum_cost"
          center
          label="进货价"
        >
        </el-table-column>
        <el-table-column
          prop="create_time"
          center
          label="日期"
        >
        </el-table-column>
      </el-table>
    </div>



  </div>
</template>

<script>
import { getByBarcode, getPageList, purchase } from '@/api/interface'
import { getToken } from '@/utils/auth'
import { onlyNumOnePoint } from '@/utils/ruoyi'

export default {
  name: 'ScanCode',
  data() {
    return {
      barcode: null,
      isUpload:false,
      number:null,
      sumCost:null,
      msg:'',
      tableData:[],
      loading:false,
      loginForm:{
        account:"account3",
        password:"password",
      },
      loginRules:{},
      goodsInfo:'',
      showGoodsInfo:false,
      disabledBarcodeInput:false,

    }
  },
  created() {
  },

  mounted() {
    if (!getToken()){
      this.$login.showMsgBox().then((data)=>{
        this.init();
      }).catch(()=>{
      })
    }else {
      this.init();
    };

  },
  methods:{
    init() {
      this.initTableData()
      this.$refs.barcodeInput.focus()
    },
    initTableData() {
      this.loading = true
      let that = this
      let param = {
        pageSize: 5,
        type:1,
      }
      getPageList(param).then((res)=>{
        const {data:{list}} = res;
        this.tableData = list;
      })
    },
    handleClose() {

    },
    focusBarcodeInput() {
      this.$refs.barcodeInput.focus()
    },
    clearInput(val){
      switch (val) {
        case "all":
          this.barcode = null;
          this.number = null;
          this.sumCost = null;
          this.goodsInfo = null;
          this.showGoodsInfo = false;
          break;
        case 'barcode':
          this[val] = null
          this.goodsInfo = null;
          this.showGoodsInfo = false;
          break;
        default:
          this[val] = null
          break;
      }

    },
    uploadData() {
      let param = {
        barcode: this.barcode,
        quantity: this.number,
        sumCost:this.sumCost,
      }
      purchase(param).then((res) =>{
        this.$message({
          message: "操作成功",
          type: 'success',
          showClose: true,
          duration:1000,
        })
        this.clearInput('all');
        this.initTableData();
        this.$refs.barcodeInput.focus();
      }).catch(()=>{
      });
    },

    // 监听条形码  20位
    watchBarcodeKeyup(e) {
      if (this.isUpload ) {
        this.isUpload = false
        if (this.showGoodsInfo){
          this.barcode = null;
        }
        this.barcode = e.key
      }
      if (e.keyCode === 13) {
        this.disabledBarcodeInput = true;
        this.getByBarcode().then((res)=>{
          this.isUpload = true;
        }).catch(()=>{
        });
      }
    },
    // 条码框失焦
    barcodeInputBlur(){
      if (!this.disabledBarcodeInput&&this.barcode){
        this.getByBarcode().then(()=>{
        }).catch(()=>{
        })
      }
      if (!this.barcode){
        this.goodsInfo = null;
        this.showGoodsInfo = false;
      }
    },
    getByBarcode(){
      let param = {
        barcode:this.barcode
      }
      return getByBarcode(param).then((res)=>{
        this.disabledBarcodeInput = false;
        this.showGoodsInfo = true;
        if (res.data){
          let {data:{name,spec}} = res;
          name = name?name:'空';
          spec = spec?spec:'空';
          this.goodsInfo = name + "("+ spec +")"
        }else {
          this.goodsInfo = "新品";
        }
      }).catch(()=>{
      })
    },
    /** 只能输入数字和小数点 */
    onlyNumber(value) {
      this.sumCost= onlyNumOnePoint(this.sumCost);
    }
  }

}
</script>

<style lang="scss">
.home{
  font-size:24px;
  //font-weight: bold;
  width: 100%;
  height: 100%;
  padding: 0 2% 0 2%;
  /* display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center; */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.table{
  height: 58%;
  width: 100%;
  margin-bottom: 10%;
}
.input-box{
  width: 100%;
  height: 10%;
  display: flex;
  .label{
    width: 65px;
    font-size: 2vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
}
.button-box{
  height:100%;
  //width:30%;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: flex-end
}

.input{
  height:100%;
  margin-right: 10%;
  //width:70%;
  flex-wrap: wrap;
  display: flex;
  align-content: center;
}
.goods-box{
  width: 100%;
  //height: 8%;
  //height: 0%;
  display: flex;
  .goods-box__item{
    display: flex;
    margin-right: 2%;
    .label{
      //width: 65px;
      font-size: 2vh;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
    .span{
      font-size: 2vh;
      color: #606266;
    }
  }

}
.submitForm{
  height: 6%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;

  .button {
    height: 100%;
  }
}
.el-dialog__header{
  padding: 0;
}
.el-table th > .cell {
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  text-align: center;
  justify-content: center;
  //font-size: 1.7vh;
  //font-weight: 600;
  color: #282E39;
  line-height: 2;
}
.el-table .cell{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  text-align: center;
  justify-content: center;
}
</style>
