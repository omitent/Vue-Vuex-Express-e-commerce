import axios from 'axios'
import { router } from '@/router'

const moduleProduct = {
    state: {
        products: [],
        productsByCategory: [],
        newArrivals: [],
        relatedProducts: [],
        product: {},
        quickViewProduct: {},
    },
    mutations: {
        INIT_PRODUCTS(state, products) {
            state.products = products
        },
        INIT_NEW_ARRIVALS(state, newArrivals) {
            state.newArrivals = newArrivals
        },

        INIT_PRODUCTS_BY_CATEGORY(state, productsByCategory) {
            state.productsByCategory = productsByCategory
        },
        INIT_BY_SLUG_PRODUCT(state, product) {
            state.product = { ...product }
        },
        INIT_QUICK_VIEW_PRODUCT(state, quickViewProduct) {
            state.quickViewProduct = quickViewProduct
        }
        ,
        INIT_BY_SLUG_PRODUCT_RELATED_PRODUCTS(state, relatedProducts) {
            state.relatedProducts = relatedProducts
        },
        ADD_PRODUCT(state, product) {
            state.products.push(product)
        },
        EDIT_PRODUCT(state, product) {
            let index = state.products.findIndex(p => p._id === product._id)
            if (index > -1) {
                state.products[index] = product
            }
        },
        DELETE_PRODUCT(state, productId) {
            let index = state.products.findIndex(p => p._id === productId)
            if (index > -1) {
                state.products.splice(index, 1)
            }
        },
    },
    actions: {
        initProducts({ commit }, filterAndSortObject) {
            const filter = JSON.stringify(filterAndSortObject.filter)
            const sort = JSON.stringify(filterAndSortObject.sort)
            axios.get(`product?filter=${filter}&sort=${sort}`).then(res => {
                console.log(res)
                commit('INIT_PRODUCTS', res.data.products)
            })
        },
        initProductsByCategory({ commit }, filterObjectAndCategory) {
            const filter = JSON.stringify(filterObjectAndCategory.filter)
            const sort = JSON.stringify(filterObjectAndCategory.sort)
            const slugCategory = filterObjectAndCategory.slugCategory
            axios
                .get(
                    `product/category/${slugCategory}?filter=${filter}&sort=${sort}`,
                )
                .then(res => {
                    console.log(res)
                    commit(
                        'INIT_PRODUCTS_BY_CATEGORY',
                        res.data.productsByCategory,
                    )
                })
        },
        initNewArrivals({ commit }) {
            axios
                .get('product/new-arrivals')
                .then(res => {
                    commit('INIT_NEW_ARRIVALS', res.data.newArrivalsProducts)
                })
        },
        initBySlugProduct({ commit }, slugProduct) {
            axios
                .get(`product/${slugProduct}`)
                .then(res => {
                    console.log(res)
                    commit('INIT_BY_SLUG_PRODUCT', res.data.product)
                    commit(
                        'INIT_BY_SLUG_PRODUCT_RELATED_PRODUCTS',
                        res.data.relatedProducts,
                    )
                })
                .catch(() => {
                    commit('INIT_BY_SLUG_PRODUCT', {})
                })
        },
        initQuickViewProduct({ commit }, productId) {
              axios.get(`product/quick-view/${productId}`)
                  .then(res=>{
                      commit("INIT_QUICK_VIEW_PRODUCT",res.data.quickView)
                  })
        }
        ,
        addProduct({ commit }, productForm) {
            axios
                .post('product', productForm, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                .then(res => {
                    commit('ADD_PRODUCT', res.data.newProduct)
                    router.push('/admin')
                })
        },
        editProduct({ commit }, product) {
            axios
                .put(`product/${product.productId}`, product.productForm, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(res => {
                    console.log(res)
                    commit('EDIT_PRODUCT', res.data.editProduct)
                    router.push('/admin')
                })
        },
        deleteProduct({ commit }, productId) {
            axios
                .delete(`product/${productId}`)
                .then(res => {
                    console.log(res)
                    commit('DELETE_PRODUCT', productId)
                })
        },
    },
    getters: {
        getProducts(state) {
            return state.products
        },
        getProduct(state) {
            return state.product
        },
        getRelatedProducts(state) {
            console.log(state.relatedProducts)
            return state.relatedProducts
        },
        getNewArrivals(state) {
            return state.newArrivals
        },
        getProductsByCategory(state) {
            console.log('computed tetiklendi')
            return state.productsByCategory
        },
        getQuickViewProduct(state){
            return state.quickViewProduct
        }
    },
}

export default moduleProduct
