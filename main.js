Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: ` <div class="product">
    <div class="product-image">
        <img v-bind:src="image"/>
    </div>
    <div class="product-info">
        <h1>{{product}}</h1>
        <p v-if="inventory >= 10">In Stock</p>
        <p v-else-if="inventory > 0 && inventory < 10">Almost Sold Out!</p>
        <p v-else>Out of Stock</p>
        <p>Shipment: {{shipment}}</p>
        <ul>
            <li v-for="detail in details">{{detail}}</li>
        </ul>
        <div v-for="(variant, index) in variants"
            class="color-box"
            :style="{backgroundColor: variant.variantColor}"
            :key="variant.variantId"
            @mouseover="updateImage(index)">
    
        </div>
        <button @click="addToCart()" 
        :class="{ disabledButton: !inStock }">Add to cart</button>
    </div>
    <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.lenght">There is no review.</p>
        <ul>
            <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
            </li>
        </ul>
    </div>

    <product-review @review-submitted="addToReviewList"></product-review>
</div>`,
  data() {
    return {
      product: "Socks",
      selectedPosition: 0,
      inventory: 100,
      details: ["80% cotton", "15% polyster", "5% nylon"],
      variants: [
        {
          variantId: 1111,
          variantColor: "green",
          variantImage: "./assets/socks_green.png",
          variantQuantity: 0,
        },
        {
          variantId: 1112,
          variantColor: "blue",
          variantImage: "./assets/socks_blue.png",
          variantQuantity: 10,
        },
      ],
      reviews: [],
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedPosition].variantId);
    },
    updateImage(index) {
      this.selectedPosition = index;
    },
    addToReviewList(review) {
      this.reviews.push(review);
    },
  },
  computed: {
    image() {
      return this.variants[this.selectedPosition].variantImage;
    },
    inStock() {
      return this.variants[this.selectedPosition].variantQuantity > 0;
    },
    shipment() {
      if (this.premium) return "Free";
      else return "2.99$";
    },
  },
});

Vue.component("product-review", {
  template: ` 
  <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors"> {{error}} </li>
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
      
  <p>
    <input type="submit" value="Submit">  
  </p>    

</form>`,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
        };
        this.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
      }
    },
  },
});

var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(variantId) {
      this.cart.push(variantId);
    },
  },
});
