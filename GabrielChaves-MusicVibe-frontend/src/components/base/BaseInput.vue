<script setup>
// defineModel() cria o par prop "modelValue" + evento "update:modelValue"
// automaticamente. É isso que faz o v-model funcionar neste componente.
const model = defineModel({ type: [String, Number], default: '' });

defineOptions({ inheritAttrs: false });

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' }
});
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>

    <textarea
      v-if="type === 'textarea'"
      :id="id"
      v-model="model"
      class="form-control"
      :class="{ 'is-invalid': error }"
      v-bind="$attrs"
    ></textarea>

    <!-- input file não aceita v-model: o pai escuta @change (vem via $attrs) -->
    <input
      v-else-if="type === 'file'"
      :id="id"
      type="file"
      class="form-control"
      :class="{ 'is-invalid': error }"
      v-bind="$attrs"
    />

    <input
      v-else
      :id="id"
      v-model="model"
      :type="type"
      class="form-control"
      :class="{ 'is-invalid': error }"
      v-bind="$attrs"
    />

    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
    <div v-else-if="hint" class="form-text">{{ hint }}</div>
  </div>
</template>
