import { mount } from '@vue/test-utils'
import CartItem from '@/components/CartItem'
import { makeServer } from '@/miragejs/server'

const mountCartItem = (server) => {
  const product = server.create('product', {
    title: 'Lindo relogio',
    price: '22.33',
  })

  const wrapper = mount(CartItem, {
    propsData: {
      product,
    },
  })

  return {
    product,
    wrapper,
  }
}

describe('CartItem', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should mount the component', () => {
    const { wrapper } = mountCartItem(server)
    expect(wrapper.vm).toBeDefined()
  })

  it('should display product info', async () => {
    const {
      wrapper,
      product: { title, price },
    } = mountCartItem(server)
    const content = wrapper.text()

    expect(content).toContain(title)
    expect(content).toContain(price)
  })

  it('should display quantity 1 when product is first displayed', () => {
    const { wrapper } = mountCartItem(server)
    const quantity = wrapper.find('[data-testid="quantity"]')

    expect(quantity.text()).toContain('1')
  })

  it('should increase quantity when + button gets clicked', async () => {
    const { wrapper } = mountCartItem(server)
    const button = wrapper.find('[data-testid="+"]')
    const quantity = wrapper.find('[data-testid="quantity"]')

    await button.trigger('click')
    expect(quantity.text()).toContain('2')
    await button.trigger('click')
    expect(quantity.text()).toContain('3')
    await button.trigger('click')
    expect(quantity.text()).toContain('4')
  })

  it('should decrease quantity when - button gets clicked', async () => {
    const { wrapper } = mountCartItem(server)
    const button = wrapper.find('[data-testid="-"]')
    const quantity = wrapper.find('[data-testid="quantity"]')

    await button.trigger('click')
    expect(quantity.text()).toContain('0')
  })

  it('should not go below zero when button - is repeatedly clicked', async () => {
    const { wrapper } = mountCartItem(server)
    const button = wrapper.find('[data-testid="-"]')
    const quantity = wrapper.find('[data-testid="quantity"]')

    await button.trigger('click')
    await button.trigger('click')
    expect(quantity.text()).toContain('0')
  })
})
