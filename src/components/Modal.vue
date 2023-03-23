<template>
  <transition name="modal-fade">
    <div class="modal-holder" v-if="modal">
      <slot name="modal-all">
        <div class="modal-inner" :style="{background:color,border:border}" v-on-clickaway="away"><a
            class="modal-close-icon" @click="close()">
          <Icon id="close"></Icon>
        </a>
          <slot name="modal"></slot>
        </div>
      </slot>
    </div>
  </transition>
</template>
<script>
import {mixin as clickaway} from 'vue-clickaway';
import Icon from '@/components/Icon'
export default {
  name: "Modal",
  components: {Icon},
  mixins: [clickaway],
  props: {
    color: {default: '#ffffff'},
    border: {default: 0},
    borderRadius: {default: 10},
    padding: {default: '10px 30px'},
    indexTable: {},
    indexElement: {},
    keyElement: {},
    table: {}
  },
  data: () => ({
    modal: false,
    aw: false,
    selectPack: '',
    error: false
  }),

  methods: {
    open() {
      this.aw = false;
      this.modal = true;
      document.body.classList.add("noScroll");
    },
    openScroll() {
      this.modal = true;
    },
    close() {
      this.modal = false;
      this.aw = false
      document.body.classList.remove("noScroll");
    },
    away() {
      if (this.modal === true && this.aw === true) {
        this.modal = false;
        this.aw = false
        document.body.classList.remove("noScroll");
      } else {
        this.aw = true
      }
    },
  },

  mounted() {


  }
}
</script>

<style >
.modal-inner {
  margin: 20px;
  background: #fff;
  min-width: 400px;
  position: relative;
  padding: 20px 40px;
  border-radius: 25px;
}

.modal-main .radio-holder {
  margin-right: 10px;
}
.modal-main .radio-holder:last-child {
  margin-right: 0;
}
.modal-holder {
  position: fixed;
  z-index: 9999999999;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .7);
}
.modal--inner {
  box-shadow: -3px -3px 13px rgba(0, 0, 0, 0.2);
  position: relative;
  max-width: 600px;
  box-sizing: border-box;
  width: 100%;
}
.modal-close-icon {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 20px;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-close-icon svg {
  top: 0;
  width: 20px;
  height: 20px;
  fill: #000000;
}
.modal-close-icon.task {
  top: 15px;
}
.modal-fade-enter, .modal-fade-leave-active {
  opacity: 0;
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.5s ease;
}

</style>
