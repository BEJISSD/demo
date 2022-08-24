<template>
  <el-input-number v-model="value" @change="handleChange" :min="min" :max="max" ></el-input-number>
</template>

<script>
export default {
  name: 'InputNumber',
  props:{
    model:{
      type:Object,
      default:() =>{}
    },
    number:{
      type:Number,
    },
    min:{
      type:Number,
    },
    max:{
      type:Number,
    },
  },
  watch:{
    number:{
      immediate:true,
      handler(val){
        this.value = val;
      }
    }

  },
  data(){
    return{
      value:0,
    }
  },
  methods:{
    handleChange(newVal,oldVal){
      this.$emit("update:number",newVal);
      this.$emit('change',newVal,oldVal,this.model);
    },
  }
}
</script>

<style scoped>

</style>
