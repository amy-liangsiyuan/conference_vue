<template>
  <v-md-editor v-model="markdown" mode="preview"></v-md-editor>
</template>

<script>
import { ref } from 'vue';

export default {
  setup () {
    const markdown = ref('123');

    return {
      markdown
    }
  }
}
</script>
