<template>
  <div class="q-pa-md">
    <!-- <q-btn flat round dense icon="person"> -->
      <q-chip 
        clickable
        color="transparent"
        text-color="white">
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar4.jpg">
        </q-avatar>
        {{ store.state.auth.username }}
      <q-menu :offset="[20, 20]">
        <div class="column items-center no-wrap">
          <!-- <div class="column"> -->
            <!-- <div class="text-h6 q-mb-md">Settings</div>
            <q-toggle v-model="mobileData" label="Use Mobile Data" />
            <q-toggle v-model="bluetooth" label="Bluetooth" /> -->
          <!-- </div> -->

          <!-- <q-separator vertical inset class="q-mx-lg" /> -->
 
          <!-- <div class="column items-center"> -->
            <div class="q-py-md q-px-xl">
              <q-avatar size="72px">
                <img src="https://cdn.quasar.dev/img/avatar4.jpg">
              </q-avatar>

              <div class="text-subtitle1 text-center q-mt-xs q-mb-md">{{ store.state.auth.username }}</div>
            </div>

            <q-list class="full-width">
              <q-item clickable v-close-popup>
                <q-item-section avatar style="min-width: auto">
                  <q-icon color="primary" name="person" />
                </q-item-section>
                <q-item-section>Perfil</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar style="min-width: auto">
                  <q-icon color="primary" name="logout" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>

            <!-- <q-btn
              color="primary"
              label="Logout"
              push
              size="sm"
              v-close-popup
            /> -->
          <!-- </div> -->
        </div>
      </q-menu>
    </q-chip>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup () {
    const store = useStore();
    const router = useRouter();

    const logout = () => {
      store.commit( 'auth/logout' );
      router.push('/login');
    };

    return {
      store,
      logout
    }
  }
}
</script>