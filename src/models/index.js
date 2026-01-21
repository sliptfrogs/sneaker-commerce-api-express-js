import { Brand } from "./brand.model.js";
import { Category } from "./category.model.js";
import { Order } from "./order.model.js";
import { ProductImage } from "./product.image.model.js";
import { Reviews } from "./product.reviews.model.js";
import { ProductLike } from "./productLike.model.js";
import { Product } from "./products.model.js";
import { Tag } from "./tag.model.js";
import { UserAddress } from "./user.address.model.js";
import { User } from "./user.model.js";
import { UserProfile } from "./user.profile.model.js";
import { Wishlist } from "./wishlist.model.js";
import { Favorite } from "./favorite.model.js";

/* [User Relational] */
// One-to-One: User ↔ UserProfile
User.hasOne(UserProfile, {
  foreignKey: "user_id",
  as: "profile",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
UserProfile.belongsTo(User, { foreignKey: "user_id", as: "user" });

// One-to-One: User ↔ UserAddress
User.hasOne(UserAddress, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
UserAddress.belongsTo(User, { foreignKey: "user_id" });

// One-to-Many: User ↔ Reviews
User.hasMany(Reviews, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Reviews.belongsTo(User, { foreignKey: "user_id" });

// One-to-Many: User ↔ Orders
User.hasMany(Order, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Order.belongsTo(User, { foreignKey: "user_id" });

/* [Product Relational] */
// Category ↔ Product (One-to-Many)
Category.hasMany(Product, { foreignKey: "category_id", onDelete: "SET NULL", onUpdate: "CASCADE" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Brand ↔ Product (One-to-Many)
Brand.hasMany(Product, { foreignKey: "brand_id", onDelete: "SET NULL", onUpdate: "CASCADE" });
Product.belongsTo(Brand, { foreignKey: "brand_id", as: "brand" });

// Product ↔ Tag (Many-to-Many)
Product.belongsToMany(Tag, { through: "ProductTags", foreignKey: "product_id" });
Tag.belongsToMany(Product, { through: "ProductTags", foreignKey: "tag_id" });

// Product ↔ Reviews (One-to-Many)
Product.hasMany(Reviews, { foreignKey: "product_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Reviews.belongsTo(Product, { foreignKey: "product_id" });

// Product ↔ ProductImage (One-to-Many)
Product.hasMany(ProductImage, { foreignKey: "product_id", as: "images", onDelete: "CASCADE", onUpdate: "CASCADE" });
ProductImage.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Product ↔ Wishlist (Many-to-Many)
User.belongsToMany(Product, {
  through: Wishlist,
  as: "wishlistProducts",
  foreignKey: "user_id",
  otherKey: "product_id",
});
Product.belongsToMany(User, {
  through: Wishlist,
  as: "wishlistedByUsers",
  foreignKey: "product_id",
  otherKey: "user_id",
});

// Product ↔ Like (Many-to-Many)
User.belongsToMany(Product, {
  through: ProductLike,
  as: "likedProducts",
  foreignKey: "user_id",
});
Product.belongsToMany(User, {
  through: ProductLike,
  as: "usersWhoLiked",
  foreignKey: "product_id",
});

// Product ↔ Favorite (Many-to-Many)
User.belongsToMany(Product, {
  through: Favorite,
  as: "favoriteProducts",
  foreignKey: "user_id",
});
Product.belongsToMany(User, {
  through: Favorite,
  as: "usersWhoFavorited",
  foreignKey: "product_id",
});

// Product ↔ User (created_by, One-to-Many)
User.hasMany(Product, { foreignKey: "created_by" });
Product.belongsTo(User, { foreignKey: "created_by" });

// Order ↔ Product (Many-to-Many via OrderItems)
Order.belongsToMany(Product, {
  through: "OrderItems",
  as: "orderProducts",
  foreignKey: "order_id",
  otherKey: "product_id",
});
Product.belongsToMany(Order, {
  through: "OrderItems",
  as: "productOrders",
  foreignKey: "product_id",
  otherKey: "order_id",
});

export {
  User,
  UserProfile,
  UserAddress,
  Category,
  Brand,
  Product,
  Tag,
  ProductImage,
  Reviews,
  Order,
  ProductLike,
  Wishlist,
  Favorite,
};
