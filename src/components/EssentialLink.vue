<template>
  <q-item
    @click="redirect"
    tag="a"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { inject } from "vue";
import { useRouter } from 'vue-router'

export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  },
  setup( props ) {
		const emitter = inject("emitter");
    const router = useRouter();

    const redirect = () => {
      router.push( props.link );
      emitter.emit( "updateLeftDrawerTreeViewOpen", false );
    };

    return { redirect };
  },
}
</script>
