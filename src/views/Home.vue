<template>
  <div class="home">
    <section>
      <header>
        <TodoLogo />
      </header>
    </section>

    <section>
      <main class="main">
        <TodoCreator />
        <TodoList />
        <TodoFilter />
      </main>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TodoList from '@/components/TodoList.vue';
import TodoLogo from '@/components/TodoLogo.vue';
import TodoCreator from '@/components/TodoCreator.vue';
import TodoFilter from '@/components/TodoFilter.vue';

@Component({
  components: {
    TodoLogo,
    TodoCreator,
    TodoList,
    TodoFilter,
  },
})
export default class Home extends Vue {}
</script>

<style scoped lang="scss">
@use "../styles/_mixin";

.main {
  @include mixin.flex-layout(column, flex-start, center, flex-start);
}
</style>
