<template>
  <div id="app">
    <!-- 单页面其实直接在这个里面开发就好啦 -->
    <api-request></api-request>
  </div>
</template>
<script>
import ApiRequest from './views'

export default {
  name: 'Api-Test',
  components: {
    ApiRequest
  }
}
</script>

<style>
</style>
