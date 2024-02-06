const socket = io();

//products

const addToCart = (_id) => {
  const pid = _id;
  fetch(`/api/carts/product/${pid}`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Product with ID ${pid} added to cart.`);
      } else {
        console.error("Error adding product to cart.");
      }
    })
    .catch((error) => {
      console.error("Network error when adding product to cart:", error);
    });
};
