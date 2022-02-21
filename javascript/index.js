/* global axios bootstrap VeeValidate VeeValidateRules VeeValidateI18n */

Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'phil';

const app = Vue.createApp({
  data() {
    return {
      cartData: {},
      products: [],
      productId: '',
      isLoadingItem: '',
      user: {
        email: '',
        name: '',
        address: '',
        phone: '',
      },
    };
  },

  methods: {
    getProducts() {
      axios.get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res) => {
          // console.log(res);
          this.products = res.data.products;
        });
    },
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    getCart() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`)
        .then((res) => {
          // console.log(res);
          this.cartData = res.data.data;
        });
    },
    // 參數預設值qty=1
    addToCart(id, qty = 1) {
      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      // 此api需要帶入參數格式{data}
      axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
        .then(() => {
          // console.log(res);
          this.getCart();
          this.$refs.productModal.closeModal();
          this.isLoadingItem = '';
        });
    },
    removeCartItem(id) {
      this.isLoadingItem = id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then(() => {
          // console.log(res);
          this.getCart();
          this.isLoadingItem = '';
        });
    },
    removeCartAll() {
      axios.delete(`${apiUrl}/api/${apiPath}/carts`)
        .then(() => {
          // console.log(res);
          this.getCart();
        });
    },
    updateCartItem(item) {
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      // 此api需要帶入參數格式{data}
      axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
        .then(() => {
          // console.log(res);
          this.getCart();
          this.isLoadingItem = '';
        });
    },
    onSubmit() {
      console.log(this.user);
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '需要正確的電話號碼';
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
})
// $refs.
  .component('product-modal', {
    props: ['id'],
    template: '#userProductModal',
    data() {
      return {
        modal: {},
        product: {},
        qty: 1,
      };
    },
    watch: {
      id() {
        this.getProduct();
      // console.log(this.id);
      },
    },
    methods: {
      openModal() {
        this.modal.show();
      },
      closeModal() {
        this.modal.hide();
      },
      getProduct() {
        axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
          .then((res) => {
          // console.log(res);
            this.product = res.data.product;
          });
      },
      addToCart() {
        this.$emit('add-cart', this.product.id, this.qty);
      },
    },
    mounted() {
    // ref="modal"
      this.modal = new bootstrap.Modal(this.$refs.modal);
    },
  });
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');
