Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
       <div class="product">
         <div class="product-image">
           <img :src="image" :alt="altText"/>
         </div>
         <div class="product-info">
           <h1>{{ title }}</h1>
           <p>{{ sale }}</p>
           <p v-if="inStock">In Stock</p>
           <p v-else style="text-decoration: line-through">Out of Stock</p>
           <product-details :details="details"></product-details>
           <p>Shipping: {{ shipping }}</p>
           <div class="color-box"
                v-for="variant in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(variant.variantImage)">
           </div>
           <div class="cart">
             <p>Cart({{ cart }})</p>
           </div>
           <button v-on:click="addToCart"
                   :disabled="!inStock"
                   :class="{ disabledButton: !inStock }">Add to cart</button>
           <button v-on:click="cleanToCart">Clean to cart</button>
         </div>
       </div>
 `,
    data() {
        return {
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
        }
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
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }
})



let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
})


