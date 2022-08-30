<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
<!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children_list', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60"></el-table-column>
<!--      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column prop="url" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="680px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parent_id == '0'?null:form.parent_id"
                :options="menuList"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="路由名称" prop="code">
              <el-input v-model="form.code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="路由路径" prop="url">
              <el-input v-model="form.url"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuById, listMenu, saveMenu, updateMenu } from '@/api/system/menu'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
export default {
  name: 'Menu',
  components: { Treeselect, IconSelect },
  data(){
    return{
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams:{
        name:'',
        pageNumber:1,
        pageSize:10,
      },
      // 显示搜索条件
      showSearch:true,
      title:'',
      statusOptions:[],
      menuList:[],
      refreshTable:true,
      isExpandAll:false,
      dialogVisible:false,
      // 表单对象
      form:{},
      //表单验证
      rules:{}
    }
  },
  created() {
    this.getList();
  },
  methods:{
    /** 查询列表 */
    handleQuery(){

    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        // this.menuList = this.handleTree(response.data, "id");
        // console.log(" this.menuList", this.menuList)
        this.menuList = response.data;
        this.loading = false;
      });
    },
    /** 重置查询 */
    resetQuery(){

    },
    /** 添加 */
    handleAdd(row){
      this.reset();
      this.dialogVisible = true;
      this.form.parent_id = row.id;
      this.title = '添加菜单';
    },
    /** 重置表单 */
    reset() {
      this.form = {
        id: null,
        parent_id: null,
        name: undefined,
        icon: undefined,
        sort: undefined,
      };
      this.resetForm("form");
    },
    /** 展开/折叠 */
    toggleExpandAll(){
      this.isExpandAll = !this.isExpandAll;
    },
    /** 修改 */
    async handleUpdate(row){
      this.reset();
      const { data } = await getMenuById(row.id);
      // this.form = camelCaseByObject(data);
      this.form = data;
      this.dialogVisible = true;
      this.title = '修改路由'
    },
    /** 删除 */
    handleDelete(){},
    /** 关闭模态框 */
    handleClose(){
      this.reset();
      this.dialogVisible = false;
    },
    /** 选择图标 */
    selected(name) {
      this.form.icon = name;
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children_list && !node.children_list.length) {
        delete node.children_list;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children_list
      };
    },
    /** 提交表单 */
    submitForm(){
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMenu(this.form).then(response => {
              this.$message.success("修改成功");
              this.dialogVisible = false;
              this.getList();
            });
          } else {
            saveMenu(this.form).then(response => {
              this.$message.success("新增成功");
              this.dialogVisible = false;
              this.getList();
            });
          }
        }
      });
    },
  }
}
</script>

<style scoped>

</style>
