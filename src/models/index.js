import { Brand } from './brand.model.js';
import { Category } from './category.model.js';
import { Order } from './order.model.js';
import { ProductImage } from './product.image.model.js';
import { Reviews } from './product.reviews.model.js';
import { ProductLike } from './productLike.model.js';
import { Product } from './products.model.js';
import { Tag } from './tag.model.js';
import { UserAddress } from './user.address.model.js';
import { User } from './user.model.js';
import { UserProfile } from './user.profile.model.js';
import { Wishlist } from './wishlist.model.js';
import { Favorite } from './favorite.model.js';
import { FakeBankAccount } from './fake.bank.account.model.js';
import { Payment } from './payment.model.js';
import { OrderItems } from './order.items.model.js';
import { RecentlyViewed } from './recently.viewed.model.js';
import { ProductSize } from './product.size.model.js';
import { Cart } from './cart.model.js';
import { CartItems } from './cart.items.model.js';
import { Coupon } from './coupon.model.js';
import { CouponUsage } from './coupon.usages.model.js';
import { ProductColor } from './product.color.model.js';

/* [User Relational] */
// One-to-One: User ↔ UserProfile
User.hasOne(UserProfile, {
  foreignKey: 'user_id',
  as: 'profile',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// One-to-One: User ↔ UserAddress
User.hasOne(UserAddress, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
UserAddress.belongsTo(User, { foreignKey: 'user_id' });

// One-to-Many: User ↔ Reviews
User.hasMany(Reviews, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Reviews.belongsTo(User, { foreignKey: 'user_id' });

// One-to-Many: User ↔ Orders
User.hasMany(Order, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Order.belongsTo(User, { foreignKey: 'user_id' });

/* [Product Relational] */
// Category ↔ Product (One-to-Many)
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Brand ↔ Product (One-to-Many)
Brand.hasMany(Product, {
  foreignKey: 'brand_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });

// Product ↔ Tag (Many-to-Many)
Product.belongsToMany(Tag, {
  through: 'ProductTags',
  foreignKey: 'product_id',
});
Tag.belongsToMany(Product, { through: 'ProductTags', foreignKey: 'tag_id' });

// Product ↔ Reviews (One-to-Many)
Product.hasMany(Reviews, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Reviews.belongsTo(Product, { foreignKey: 'product_id' });

// Product ↔ ProductImage (One-to-Many)
Product.hasMany(ProductImage, {
  foreignKey: 'product_id',
  as: 'images',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Product ↔ ProductSize (One-to-Many)
Product.hasMany(ProductSize, {
  foreignKey: 'product_id',
  as: 'sizes',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
ProductSize.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// Product ↔ ProductColor (One-to-Many)
Product.hasMany(ProductColor, {
  foreignKey: 'product_id',
  as: 'colors',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
ProductColor.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// Product ↔ Wishlist (Many-to-Many)
User.belongsToMany(Product, {
  through: Wishlist,
  as: 'wishlistProducts',
  foreignKey: 'user_id',
  otherKey: 'product_id',
});
Product.belongsToMany(User, {
  through: Wishlist,
  as: 'wishlistedByUsers',
  foreignKey: 'product_id',
  otherKey: 'user_id',
});

// Product ↔ Like (Many-to-Many)
User.belongsToMany(Product, {
  through: ProductLike,
  as: 'likedProducts',
  foreignKey: 'user_id',
});
Product.belongsToMany(User, {
  through: ProductLike,
  as: 'usersWhoLiked',
  foreignKey: 'product_id',
});

// Product ↔ Favorite (Many-to-Many)
User.belongsToMany(Product, {
  through: Favorite,
  as: 'favoriteProducts',
  foreignKey: 'user_id',
});
Product.belongsToMany(User, {
  through: Favorite,
  as: 'usersWhoFavorited',
  foreignKey: 'product_id',
});

// Product ↔ User (created_by, One-to-Many)
User.hasMany(Product, { foreignKey: 'created_by' });
Product.belongsTo(User, { foreignKey: 'created_by', as: 'create_by_admin' });

// Order ↔ Product (Many-to-Many via OrderItems)
Order.belongsToMany(Product, {
  through: 'OrderItems',
  as: 'orderProducts',
  foreignKey: 'order_id',
  otherKey: 'product_id',
});
Product.belongsToMany(Order, {
  through: 'OrderItems',
  as: 'productOrders',
  foreignKey: 'product_id',
  otherKey: 'order_id',
});
// User ↔ FakeBankAccount (One-to-One)
User.hasOne(FakeBankAccount, { foreignKey: 'user_id', as: 'bankAccount' });
FakeBankAccount.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
// Payment ↔ FakeBankAccount (One-to-One)
Payment.belongsTo(FakeBankAccount, {
  foreignKey: 'bank_id',
  as: 'bankAccount',
});
FakeBankAccount.hasMany(Payment, { foreignKey: 'bank_id', as: 'bankAccount' });
// Order ↔ Order Items (One-to-Many)
Order.hasMany(OrderItems, { foreignKey: 'order_id', as: 'order_items' });
OrderItems.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
// Product ↔ Order_items (One-to-Many)
Product.hasMany(OrderItems, {
  foreignKey: 'product_id',
  as: 'orderItems',
});
OrderItems.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Order.hasOne(Payment, {
  foreignKey: 'order_id', // FK stored in PaymentTransaction
  as: 'payment', // alias to use in includes
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Payment.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

// User ↔ Product (Many-to-Many) recently viewed
User.belongsToMany(Product, {
  through: RecentlyViewed,
  foreignKey: 'user_id',
  otherKey: 'product_id',
  as: 'recentlyViewedProducts',
});

Product.belongsToMany(User, {
  through: RecentlyViewed,
  foreignKey: 'product_id',
  otherKey: 'user_id',
  as: 'usersWhoViewed',
});

// Cart ↔ Product (Many-to-Many) recently viewed
Product.belongsToMany(Cart, {
  through: CartItems,
  foreignKey: 'product_id',
  otherKey: 'cart_id',
  as: 'cartsContainingProduct',
});
Cart.belongsToMany(Product, {
  through: CartItems,
  foreignKey: 'cart_id',
  otherKey: 'product_id',
  as: 'productsInCart',
});

// Cart ↔ User (One-to-One)
User.hasOne(Cart, {
  foreignKey: 'user_id',
  as: 'cart',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Coupon ↔ Order (Many-to-One)
Coupon.hasMany(Order, {
  foreignKey: 'coupon_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
Order.belongsTo(Coupon, { foreignKey: 'coupon_id', as: 'coupon' });

// Coupon ↔ User (Many-to-Many)
User.belongsToMany(Coupon, {
  through: CouponUsage,
  foreignKey: 'user_id',
  otherKey: 'coupon_id',
  as: 'userCoupons',
});
Coupon.belongsToMany(User, {
  through: CouponUsage,
  foreignKey: 'coupon_id',
  otherKey: 'user_id',
  as: 'couponUsers',
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
  ProductSize,
  Reviews,
  Order,
  ProductLike,
  Wishlist,
  Favorite,
  FakeBankAccount,
  Payment,
  RecentlyViewed,
  Cart,
  Coupon,
  ProductColor
};
