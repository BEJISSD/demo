<template>
  <div>
    <template v-if="!item.children_list || item.children_list.length ==0">
      <app-link  :to="resolvePath(item.code)">
        <el-menu-item :index="item.id" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="item.icon" :title="item.name" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="item.id" popper-append-to-body>
      <template slot="title">
        <item :title="item.name" />
      </template>
      <sidebar-item
        v-for="child in item.children_list"
        :key="child.id"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(item.code)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import item from '@/Layout/components/Sidebar/Item'
import appLink from '@/Layout/components/Sidebar/Link'
import { isExternal } from '@/utils/validate'
import path from 'path'
export default {
  name: 'SidebarItem',
  components: { item ,appLink},
  props: {
    item:{
      type:Object,
      default:()=>{}
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild:null,
    }
  },
  methods:{
    hasOneShowingChild(children = [], parent) {
      return false
    },
    resolvePath(routePath, routeQuery) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      if (routeQuery) {
        let query = JSON.parse(routeQuery);
        return { path: path.resolve(this.basePath, routePath), query: query }
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style scoped>

</style>
