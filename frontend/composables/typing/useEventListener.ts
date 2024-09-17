import { useEventListener } from '@vueuse/core'

export default defineComponent({
  setup() {
    useEventListener(window, 'keydown', (event) => {
      console.log('Key pressed:', event.key)
    })
  }
})