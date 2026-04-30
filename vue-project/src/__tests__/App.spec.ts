import { describe, it, expect, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '../App.vue'

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the AppHeader and a RouterView outlet', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          RouterView: { template: '<div data-test="router-view" />' },
        },
      },
    })

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true)
  })
})
