import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AppHeader from '../components/AppHeader.vue'
import { useAuthStore } from '../stores/authStore'

const push = vi.fn()
vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return {
    ...actual,
    useRouter: () => ({ push }),
  }
})

function mountHeader() {
  return mount(AppHeader, {
    global: {
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

describe('AppHeader', () => {
  beforeEach(() => {
    sessionStorage.clear()
    setActivePinia(createPinia())
    push.mockReset()
  })

  it('shows the Login link when logged out', () => {
    const wrapper = mountHeader()
    const links = wrapper.findAllComponents(RouterLinkStub)
    const targets = links.map((l) => l.props('to'))

    expect(targets).toContain('/login')
    expect(wrapper.text()).not.toContain('Logout')
  })

  it('shows the Logout action when logged in', () => {
    const store = useAuthStore()
    store.setAuth({ jwt: 'j', refreshToken: 'r' })

    const wrapper = mountHeader()

    expect(wrapper.text()).toContain('Logout')
    const targets = wrapper.findAllComponents(RouterLinkStub).map((l) => l.props('to'))
    expect(targets).not.toContain('/login')
  })

  it('clicking Logout clears auth and navigates to Login', async () => {
    const store = useAuthStore()
    store.setAuth({ jwt: 'j', refreshToken: 'r' })

    const wrapper = mountHeader()
    const logoutLink = wrapper.findAll('a.nav-link').find((a) => a.text() === 'Logout')!
    await logoutLink.trigger('click')

    expect(store.isLoggedIn()).toBe(false)
    expect(push).toHaveBeenCalledWith({ name: 'Login' })
  })
})
