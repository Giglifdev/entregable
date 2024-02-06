const socket = io();

//cart
const purchase = (_id) => {
  const cid = _id;

  fetch(`/api/carts/${cid}/purchase`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        console.log(`The cart with ID ${cid} I generate a purchase ticket.`);
      } else {
        console.error("Error generating purchase ticket.");
      }
    })
    .catch((error) => {
      console.error("Network error when generating purchase ticket:", error);
    });
};

const emptyCart = (_id) => {
  const cid = _id;

  fetch(`/api/carts/empty/${cid}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Cart with ID ${cid} emptied.`);
      } else {
        console.error("Error emptying cart.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
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

const removeQuantity = (_id) => {
  const pid = _id;
  fetch(`/api/carts/removeQuantity/${pid}`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Product with ID ${pid} deleted from cart.`);
      } else {
        console.error("Error adding product to cart.");
      }
    })
    .catch((error) => {
      console.error("Network error when removing product to cart:", error);
    });
};

const removeProduct = (_id) => {
  const pid = _id;
  fetch(`/api/carts/remove/${pid}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Product with ID ${pid} removed to cart.`);
      } else {
        console.error("Error adding product to cart.");
      }
    })
    .catch((error) => {
      console.error("Network error when removing product to cart:", error);
    });
};
