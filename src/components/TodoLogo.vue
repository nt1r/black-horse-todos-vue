<template>
  <section>
    <header>
      <h1 class="logo-title">todos</h1>
    </header>
  </section>
</template>

<script lang="ts">
export default {
  name: 'TodoLogo',
};
</script>

<style scoped lang="scss">
@use '../styles/_variable';

.logo-title {
  font-size: 100px;
  font-family: inherit;
  font-weight: inherit;
  color: variable.$primary-color;
  margin: variable.$base-margin;
  text-align: center;
}
</style>
