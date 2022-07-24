<template>
  <div>
    <login-component></login-component>
  </div>
</template>

<script>
import LoginComponent from '../components/LoginComponent.vue'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Login',
  components: { LoginComponent },
  setup () {
    const store = useStore();

    const username = computed( () => store.state.auth.username );
    const token    = computed( () => store.state.auth.token );

    onMounted(() => {
			
		});


  }
}
</script>
