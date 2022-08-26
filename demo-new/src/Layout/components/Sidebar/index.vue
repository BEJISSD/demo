<template>
  <div :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
<!--    <logo v-if="showLogo" :collapse="isCollapse" />-->
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
        :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.id"
          :item="route"
          :base-path="route.code"
        />
      </el-menu>
    </el-scrollbar>
  </div>

<!--  <div :class="'has-logo'">-->
<!--&lt;!&ndash;    <logo v-if="showLogo" :collapse="isCollapse" />&ndash;&gt;-->
<!--    <el-scrollbar wrap-class="scrollbar-wrapper">-->
<!--      <el-menu-->
<!--        :default-active="activeMenu"-->
<!--        :collapse="isCollapse"-->
<!--        :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"-->
<!--        :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"-->
<!--        :unique-opened="true"-->
<!--        :active-text-color="settings.theme"-->
<!--        :collapse-transition="false"-->
<!--        mode="vertical"-->
<!--      >-->
<!--        <sidebar-item-->
<!--          v-for="(item, index) in sidebarRouters"-->
<!--          :key="item.id"-->
<!--          :item="item"-->
<!--          :base-path="item.code"-->
<!--        />-->
<!--      </el-menu>-->
<!--    </el-scrollbar>-->
<!--  </div>-->
</template>

<script>
import variables from "@/assets/styles/variables.scss";
// import Logo from "./Logo";
import { mapGetters, mapState } from 'vuex'
import SidebarItem from '@/Layout/components/Sidebar/SidebarItem'
export default {
  name: 'Sidebar',
  components: {SidebarItem},
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["sidebarRouters", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      console.log(this.$route)
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      // if (meta.activeMenu) {
      //   return meta.activeMenu;
      // }
      if (meta.id) {
        return meta.id;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
}
</script>

