<script setup>
defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: '' },
  // largura da coluna no grid do Bootstrap (cabe em Login/Registro/Perfil)
  wide: { type: Boolean, default: false }
});
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div :class="wide ? 'col-md-8 col-lg-6' : 'col-md-7 col-lg-5'">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h1 class="h3 mb-4 text-center text-musicvibe">
              <i v-if="icon" :class="['bi', icon, 'me-2']"></i>{{ title }}
            </h1>

            <slot />
          </div>

          <div v-if="$slots.footer" class="card-footer text-center small">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
