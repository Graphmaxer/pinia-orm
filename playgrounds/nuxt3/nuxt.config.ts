import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: ['@pinia/nuxt'],
  modules: ['@pinia-orm/nuxt'],
})
