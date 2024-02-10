let app = new Vue({
    el: '#app',
    data: {
        product: "Socks",
        brand: 'Vue Mastery',
        image: "src/assets/vmSocks-blue-onWhite.jpg",
        altText: "A pair of socks",
        inStock: true,
        onSale: true,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "src/assets/vmSocks-green-onWhite.jpg",
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "src/assets/vmSocks-blue-onWhite.jpg",
            }

        ],
        cart: 0
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        updateProduct(variantImage) {
            this.image = variantImage
        },
        cleanToCart() {
            if (this.cart >= 1) {
                this.cart -= 1
            }
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        sale: function() {
            if (this.onSale) {
                return `${this.brand} ${this.product} is on sale!`
            } else {
                return `${this.brand} ${this.product} isn't on sale!`
            }
        }
    }
})
