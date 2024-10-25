<template>
  <Table />
</template>
<script setup>
import Table from "../components/table/Table.vue";

new ResizeObserver((event) => {
  const width = document.documentElement.scrollWidth || 0;
  const height = document.documentElement.scrollHeight || 0;
  parent.postMessage({ width, height }, "*");
}).observe(document.documentElement);
</script>
<style lang="scss" scoped>
</style>
