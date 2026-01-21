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
import { Favorite } from "./favorite.model.js";
/* [User Relational] */
// Defining One-to-One relationship between User and UserProfile
User.hasOne(UserProfile, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
UserProfile.belongsTo(User, { foreignKey: "user_id" });
// Defining One-to-One relationship between User and UserAddress
User.hasOne(UserAddress, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
UserAddress.belongsTo(User, { foreignKey: "user_id" });
// User - Review Relationship
User.hasMany(Reviews, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Reviews.belongsTo(User, { foreignKey: "user_id" });
// User - Order Relationship
User.hasMany(Order, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Order.belongsTo(User, { foreignKey: "user_id" });
//

/* [Product Relational] */
// Category - Product Relationship
Category.hasMany(Product, {
  foreignKey: "category_id",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Product.belongsTo(Category, { foreignKey: "category_id", as: 'category' });

// Brand - Product Relationship
Brand.hasMany(Product, {
  foreignKey: "brand_id",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Product.belongsTo(Brand, { foreignKey: "brand_id",as: 'brand' });
// Product - Tag Relationship (Many-to-Many)
Product.belongsToMany(Tag, {
  through: "ProductTags",
  foreignKey: "product_id",
});
Tag.belongsToMany(Product, { through: "ProductTags", foreignKey: "tag_id" });
// Product - Review Relationship
Product.hasMany(Reviews, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Reviews.belongsTo(Product, { foreignKey: "product_id" });
// Product - Image Relationship
Product.hasMany(ProductImage, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
ProductImage.belongsTo(Product, { foreignKey: "product_id" });
// Product - Wishlist Relationship (Many-to-Many)
User.belongsToMany(Product, {
  through: "Wishlist",
  as: "WishlistProducts",
  foreignKey: "user_id",
});
Product.belongsToMany(User, {
  through: "Wishlist",
  as: "UsersWhoWishlisted",
  foreignKey: "product_id",
});
// Product - Like Relationship (Many-to-Many)
User.belongsToMany(Product, {
  through: ProductLike,
  as: "LikedProducts",
  foreignKey: "user_id",
});
Product.belongsToMany(User, {
  through: ProductLike,
  as: "UsersWhoLiked",
  foreignKey: "product_id",
});
// Product - Favourite Relationship (Many-to-Many)
User.belongsToMany(Product, {
  through: "UserFavourites",
  as: "FavouriteProducts",
  foreignKey: "user_id",
});
Product.belongsToMany(User, {
  through: "UserFavourites",
  as: "UsersWhoFavourited",
  foreignKey: "product_id",
});
// Order - Product Relationship (Many-to-Many via OrderItems)
Order.belongsToMany(Product, {
  through: "OrderItems",
  as: "OrderProducts",
  foreignKey: "order_id",
  otherKey: "product_id",
});
Product.belongsToMany(Order, {
  through: "OrderItems",
  as: "ProductOrders",
  foreignKey: "product_id",
  otherKey: "order_id",
});
User.hasMany(Product, {foreignKey: 'created_by'});
Product.belongsTo(User, {foreignKey: 'created_by'})


// New Line Added by Developer HONG Handsome man
// Favorite belongsTo relationships (optional)
// Favorite.belongsTo(User, { foreignKey: "user_id"  });
// Favorite.belongsTo(Product, { foreignKey: "product_id" });
// User ↔ Favorite
// User ↔ Product through Favorite
User.belongsToMany(Product, {
  through: Favorite,       // join table
  as: "favoriteProducts",  // alias for easy querying
  foreignKey: "user_id",
});

Product.belongsToMany(User, {
  through: Favorite,
  as: "usersWhoFavorited",
  foreignKey: "product_id",
});

// User ↔ UserProfile
User.hasOne(UserProfile, { foreignKey: "user_id", as: "profile" });
UserProfile.belongsTo(User, { foreignKey: "user_id" });


//  

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
  Favorite
};
