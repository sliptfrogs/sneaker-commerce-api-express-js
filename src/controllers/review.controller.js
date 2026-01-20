import { Reviews } from "../models/product.reviews.model.js";
import { Product } from "../models/products.model.js";
import { User } from "../models/user.model.js";

// CREATE Review
export const createReview = async (req, res) => {
  try {
    const user_id = req.user.id; 
    const { product_id, rating, comment } = req.body;

    // Optional: check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = await Reviews.create({ user_id, product_id, rating, comment });
    res.status(201).json({
      statusCode: 201,
      message: "Review created successfully",
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Reviews.findAll({
      include: [
        { model: User, attributes: ["id", "email"] },
        { model: Product, attributes: ["id", "title"] },
      ],
    });
    res.status(200).json({
      count : reviews.length,
      statusCode: 200,
      success: true,
      message: "Success",
      data: reviews,
      meta: []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET - Single Review =================
export const getReviewById = async (req, res) => {
  try {
    const review = await Reviews.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "email"] },
        { model: Product, attributes: ["id", "title"] },
      ],
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ success: true, message: "Success", data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= PUT - Update Review =================
export const updateReview = async (req, res) => {
  try {
    const review = await Reviews.findByPk(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only owner can update
    if (review.user_id !== req.user?.id)
      return res.status(403).json({ message: "Forbidden" });

    const { rating, comment } = req.body;
    await review.update({ rating, comment });

    res.json({ success: true, message: "Review updated", data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE - Remove Review =================
export const deleteReview = async (req, res) => {
  try {
    const review = await Reviews.findByPk(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only owner or admin can delete
    if (review.user_id !== req.user?.id && req.user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await review.destroy();
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};