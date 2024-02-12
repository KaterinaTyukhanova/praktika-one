let eventBus = new Vue()

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
      <div>
        <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="tab in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
        </ul>
        
        <div v-show="selectedTab === 'Reviews'">
          <p v-if="!reviews.length">There are no reviews yet.</p>
          <ul>
            <li v-for="review in reviews">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>{{ review.review }}</p>
            </li>
          </ul>
        </div>
        
        <div v-show="selectedTab === 'Make a Review'">
          <product-review></product-review>
        </div>
        
        <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
          <product-details :details="details"></product-details>
        </div>
      </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    }
})

Vue.component('product-review', {
    template: `
      <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>

        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name" placeholder="name">
        </p>

        <p>
          <label for="review">Review:</label>
          <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

        <p><b>Would you recommend this product?</b></p>
        <label>
          No
          <input type="radio" value="No" v-model="recommendation"/>
        </label>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommendation"/>
        </label>
        
        <p>
          <input type="submit" value="Submit">
        </p>

      </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods:{
        onSubmit() {
            this.errors = []
            if(this.name && this.review && this.rating && this.recommendation) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommendation = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommendation) this.errors.push("Recommendation isn't selected.")
            }
        }
    }
})

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
           <div class="color-box"
                v-for="variant in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(variant.variantImage)">
           </div>
           <button v-on:click="addToCart"
                   :disabled="!inStock"
                   :class="{ disabledButton: !inStock }">Add to cart</button>
           <button v-on:click="cleanToCart">Clean to cart</button>
         </div>
         <product-tabs :reviews="reviews" :shipping="shipping" :details="details"></product-tabs>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
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
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "src/assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(variantImage) {
            this.image = variantImage
        },
        cleanToCart() {
            this.$emit('clean-to-cart', this.variants[this.selectedVariant].variantId)
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
    },
    created() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteItem(id) {
            for(let i = 0; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                }
            }
        }
    }
})

