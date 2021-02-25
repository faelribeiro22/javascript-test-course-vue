import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard'
import { makeServer } from '@/miragejs/server'
import { CartManager } from '@/managers/CartManager'

const mountProductCard = (server) => {
  const product = server.create('product', {
    title: 'Relógio bonito',
    price: '22.00',
    image:
      'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
  })

  const cartManager = new CartManager()

  const wrapper = mount(ProductCard, {
    propsData: {
      product,
    },
    mocks: {
      $cart: cartManager,
    },
  })
  return {
    wrapper,
    product,
    cartManager,
  }
}

describe('Product - unit', () => {
  let server
  beforeEach(() => {
    server = makeServer({ enviroment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should match snapshot', () => {
    const { wrapper } = mountProductCard(server)
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should mount the component', () => {
    const { wrapper } = mountProductCard(server)
    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain('Relógio bonito')
    expect(wrapper.text()).toContain('$22.00')
  })

  it('should add item to cartState on button click', async () => {
    const { wrapper, cartManager, product } = mountProductCard(server)
    const spy1 = jest.spyOn(cartManager, 'open')
    const spy2 = jest.spyOn(cartManager, 'addProduct')

    await wrapper.find('button').trigger('click')

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledWith(product)
  })
})
