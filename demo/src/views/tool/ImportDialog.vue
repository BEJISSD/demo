<template>

  <section>
    <!-- 补货单导入对话框 -->
    <el-dialog :title="desc" :before-close="handleBeforeClose" :show-close="false" @close="closeUploadDialog" :visible.sync="importVisible" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>导入请下载最新模板。</span>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                   @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="upload.isUploading" @click="submitFileForm()">确 定</el-button>
        <el-button :loading="upload.isUploading" @click="closeUploadDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入成功后的弹窗 errorMsg-->
    <el-dialog title="" class="tabsDialog"  :before-close="handleBeforeClose" :show-close="false"  fit :visible.sync="openDetail" width="1500px" append-to-body>
      <div class="dialog-header" style="height: 5vh;width: 100%;">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
                   @click="uploadExcel">导出</el-button>
      </div>
      <el-tabs class="tabs" v-model="importTabsValue" type="card">
        <el-tab-pane label="正确列表" name="success" >
<!--          <el-table :data="importTabs.successList" height="100%">-->
          <el-table :data="importTabs.successList.slice((successListPage.pageNum-1)*successListPage.pageSize,successListPage.pageNum*successListPage.pageSize)" height="85%">
            <el-table-column width="100" label="序号"  align="center" type="index" />
            <el-table-column label="条形码" align="center" prop="barcode" />
            <el-table-column label="名称" align="center" prop="name" />
            <el-table-column label="规格" align="center" prop="spec" />
            <el-table-column label="单位" align="center" prop="unit" />
            <el-table-column v-if="type==1" label="供应商" align="center" prop="supplier" />
            <el-table-column v-if="type==1" label="入库数量" align="center" prop="quantity" />
            <el-table-column v-if="type==1" label="入库成本(元)" align="center" prop="cost" />
            <el-table-column v-if="type==3" label="总数量" align="center" prop="sumQuantity" />
            <el-table-column v-if="type==3" label="总成本(元)" align="center" prop="sumCost" />
            <el-table-column v-if="type==1" label="入库日期" align="center" prop="changeDate" />
            <el-table-column v-if="type==4" label="指导价格" align="center" prop="guidePrice" />
            <el-table-column v-if="type==4" label="商品编码" align="center" prop="itemNo" />
            <el-table-column v-if="type==2" label="出库数量" align="center" prop="quantity" />
            <el-table-column v-if="type==2" label="出库日期" align="center" prop="changeDate" />
          </el-table>
          <div class="pagination">
            <pagination
              :total="successListPage.total"
              :pageSizes="successListPage.pageSizes"
              :page.sync="successListPage.pageNum"
              :limit.sync="successListPage.pageSize"
              @pagination="successListPageChange"
            />
          </div>

        </el-tab-pane>

        <el-tab-pane label="错误列表" name="error">
<!--          <el-table height="100%" :data="importTabs.errorList">-->
          <el-table height="85%" :data="importTabs.errorList.slice((errorListPage.pageNum-1)*errorListPage.pageSize,errorListPage.pageNum*errorListPage.pageSize)">
            <el-table-column width="100" label="序号" align="center" type="index" />
            <el-table-column label="条形码" align="center" prop="barcode" />
            <el-table-column label="名称" align="center" prop="name" />
            <el-table-column label="规格" align="center" prop="spec" />
            <el-table-column label="单位" align="center" prop="unit" />
            <el-table-column v-if="type==1" label="供应商" align="center" prop="supplier" />
            <el-table-column v-if="type==1" label="入库数量" align="center" prop="quantity" />
            <el-table-column v-if="type==1" label="入库成本(元)" align="center" prop="cost" />
            <el-table-column v-if="type==3" label="总数量" align="center" prop="sumQuantity" />
            <el-table-column v-if="type==3" label="总成本(元)" align="center" prop="sumCost" />
            <el-table-column v-if="type==1" label="入库日期" align="center" prop="changeDate" />
            <el-table-column v-if="type==4" label="指导价格" align="center" prop="guidePrice" />
            <el-table-column v-if="type==4" label="商品编码" align="center" prop="itemNo" />
            <el-table-column v-if="type==2" label="出库数量" align="center" prop="quantity" />
            <el-table-column v-if="type==2" label="出库日期" align="center" prop="changeDate" />
            <el-table-column label="错误信息" align="center" prop="msg" />
          </el-table>
          <div class="pagination">
            <pagination
              :total="errorListPage.total"
              :pageSizes="errorListPage.pageSizes"
              :page.sync="errorListPage.pageNum"
              :limit.sync="errorListPage.pageSize"
              @pagination="errorListPageChange"
            />
          </div>

        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" v-if="importTabs.successList.length !== 0" @click="saveForm">保存</el-button>
        <el-button :loading="saveLoading" @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </section>

</template>

<script>
import { getToken } from '@/utils/auth'
import { saveImport, saveImportCost } from '@/api/interface'

export default {
  name: 'ImportDialog',
  props:{
    dialogVisible: {
      type:Boolean,
      default:false,
    },
    importType:{
      type:Number,
      default: '',
    },
    desc:String,
    model: {
      type:Object,
      default:()=>{}
    },
  },
  watch:{
    dialogVisible(val) {
      // 打开弹框
      if (val) {
        this.importVisible = val;
        this.reset();
      }
    },
    importVisible(val) {
      // 关闭弹框
      if (!val){
        this.reset();
        this.$emit('change');
        this.$emit("update:dialogVisible", val);
      }
    },
    importType:{
      immediate:true,
      handler(val){
        this.initImportModel(val);
      }
    },
  },
  data(){
    return{
      openDetail:false,
      exportLoading:false,
      importTabsValue:'success',
      importVisible:false,
      saveLoading:false,
      type:1,
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        // updateSupport: 0,
        // 设置上传的请求头部
        headers: { 'x-auth-token': getToken() },
        // 上传的地址
        url: '',
        delete:false,
      },
      importTabs:{
        successList:[],
        errorList:[],
      },
      importModel:{

      },

      successListPage: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes:[10]
      },
      errorListPage: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes:[10]
      },
    }
  },
  methods:{
    handleBeforeClose(){

    },
    closeUploadDialog(){
      this.importVisible = false;
    },
    initImportModel(val){
      this.type = val;
      let api = '';
      switch (val) {
        case 1:
          api= '/goodsBase/doImportCost?type=1';
          break;
        case 2:
          api = '/goodsBase/doImportCost?type=2';
          break;
        case 3:
          api = '/goodsBase/doImportCost?type=3';
          break;
        case 4:
          api = '/goodsBase/doImport';
          break;
      }
      //+ '?type=' + (type==3?1:type)
      this.upload.url =  process.env.VUE_APP_BASE_API + api
    },
    /** 重置 */
    reset(){
      this.$nextTick(()=>{
        this.$refs.upload.clearFiles();
      })
    },
    /** 文件上传中处理 */
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    /** 文件上传成功处理 */
    handleFileSuccess(response, file, fileList){
      console.log("Success",response)
      const {code,data,msg} = response;
      if (code == 200){
        this.importTabsValue = 'success'
        this.importTabs = data;
        this.successListPage.total = data.successList.length;
        this.errorListPage.total = data.errorList.length;
        this.openDetail = true;
      }else {
        this.$message.warning(msg);
      }
      this.upload.isUploading = false;

    },
    handleFileError(response){
      console.log("Error",response)
      this.$message.warning(response.msg)
      this.upload.isUploading = false;
      this.reset();
    },
    /** 下载模板 */
    importTemplate(){

      var a = document.createElement("a"); //创建一个<a></a>标签
      let href = '';
      switch (this.type) {
        case 1:
          href = '/template/入库模板.xlsx';
          break;
        case 2:
          href = '/template/变更模板.xlsx';
          break;
        case 3:
          href = '/template/出库模板.xlsx';
          break;
        case 4:
          href = '/template/商品模板.xlsx';
          break;
      }
      a.href = href; // 给a标签的href属性值加上地址，注意，这里是绝对路径，不用加 点.
      // a.download = "下载啦.xlsx"; //设置下载文件文件名，这里加上.xlsx指定文件类型，pdf文件就指定.fpd即可
      a.style.display = "none"; // 障眼法藏起来a标签
      document.body.appendChild(a); // 将a标签追加到文档对象中
      a.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
      a.remove(); // 一次性的，用完就删除a标签
    },
    /** 确认上传 */
    submitFileForm(){
      this.$refs.upload.submit()
    },

    /** 导出 */
    uploadExcel(){

    },

    /** 关闭导入数据预览 */
    closeDialog(){
      this.openDetail = false;
      this.importVisible = false;
    },

    /** 保存导入数据 */
    saveForm(){
      this.saveLoading = true;
      if (this.type == 4){
        saveImport(this.importTabs).then((res)=>{
          const {msg} = res;
          this.saveLoading = false;
          this.$message.success(msg);
          this.closeDialog();
        }).catch(()=>{})
      }else {
        saveImportCost(this.importTabs).then((res)=>{
          const {msg} = res;
          this.saveLoading = false;
          this.$message.success(msg);
          this.closeDialog();
        }).catch(()=>{})
      }
    },
    successListPageChange(e){},
    errorListPageChange(e){}
  }
}
</script>

<style lang="scss">
.tabsDialog{
  .el-dialog__body {
    //margin-top: 2%;
    padding: 1% 2% 0 2%;
    height: 65vh;
  }
}
.tabs{
  height: 50vh;
}
.el-tabs__content{
  height: 100%
}
.el-tab-pane{
  height: 100%
}
.pagination{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
