import config from "../config.js";

const persistence = config.persistence;

let CartManager;
let MessageManager;
let ProductManager;
let usersManager;
let TiketManager;

switch (persistence) {
  case "MONGO":
    console.log("working with db");
    const mongoose = await import("mongoose");
    await mongoose.connect(config.mongoUrl);
    const { default: ProductManagerBDD } = await import(
      "./memoryManager/products.manager.js"
    );
    const { default: CartManagerBDD } = await import(
      "./memoryManager/cart.manager.js"
    );
    const { default: MessageManagerBDD } = await import(
      "./memoryManager/message.manager.js"
    );
    const { default: usersManagerBDD } = await import(
      "./memoryManager/users.manager.js"
    );
    const { default: TiketRepositoryBDD } = await import(
      "./memoryManager/tiket.manager.js"
    );
    ProductManager = ProductManagerBDD;
    CartManager = CartManagerBDD;
    MessageManager = MessageManagerBDD;
    usersManager = usersManagerBDD;
    TiketManager = TiketRepositoryBDD;
    break;
  case "FILES":
    console.log("working with filesystem");
    const { default: ProductManagerFS } = await import(
      "./fileManagers/products.manager.js"
    );
    const { default: CartManagerFS } = await import(
      "./fileManagers/cart.manager.js"
    );
    const { default: MessageManagerFS } = await import(
      "./fileManagers/message.manager.js"
    );
    const { default: usersManagerFS } = await import(
      "./fileManagers/users.manager.js"
    );
    const { default: TiketRepositoryFS } = await import(
      "./fileManagers/tiket.manager.js"
    );
    TiketManager = TiketRepositoryFS;
    ProductManager = ProductManagerFS;
    CartManager = CartManagerFS;
    MessageManager = MessageManagerFS;
    usersManager = usersManagerFS;
    break;
}

export {
  ProductManager,
  CartManager,
  MessageManager,
  usersManager,
  TiketManager,
};
