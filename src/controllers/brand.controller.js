import { Brand } from "../models/index.js";

/**
 * Get All Brands
 */
export const getAllBrands = async (req, res) => {
  try {
    const data = await Brand.findAll();
    res.status(200).json({
      statusCode: 200,
      message: "Get data successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get One Brand by ID
 */
export const getBrandById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "ID must be a positive integer",
      });
    }

    // Find brand by PK
    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({
        statusCode: 404,
        message: "Brand not found",
      });
    }

    // Send response
    res.status(200).json({
      statusCode: 200,
      message: "Get data successfully",
      data: brand,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * Create Brand
 */
export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    let existingBrandName = await Brand.findOne({
      where: { name: name },
    });

    if (existingBrandName) {
        return res.status(400).json({
        statusCode: 400,
        message: "Brand name already exists",
        data: existingBrandName,
      });
    }
      
    // create brand
    const brand = await Brand.create({
      name,
    });

    // send response
    res.status(201).json({
      statusCode: 201,
      message: "Brand created successfully",
      data: brand,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * Update Brand
 */
export const updateBrand = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name: newName } = req.body;

    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "ID must be a positive integer",
      });
    }

    // Find brand by ID
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({
        statusCode: 404,
        message: "Brand not found",
      });
    }

    // Check duplicate name if provided
    if (newName && newName !== brand.name) {
      const existingBrand = await Brand.findOne({
        where: { name: newName },
      });

      if (existingBrand) {
        return res.status(409).json({
          statusCode: 409,
          message: "Brand name already exists",
        });
      }
    }

    // Update brand
    await brand.update({
      name: newName ?? brand.name,
    });

    res.status(200).json({
      statusCode: 200,
      message: "Brand updated successfully",
      data: brand,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * Delete Brand
 */
export const deleteBrand = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "ID must be a positive integer",
      });
    }

    // Check if brand exists
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({
        statusCode: 404,
        message: "Brand not found",
      });
    }

    // Delete brand
    await Brand.destroy({
      where: { id },
    });

    res.status(200).json({
      statusCode: 200,
      message: "Brand deleted successfully",
      data: brand,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
      error: err.message,
    });
  }
};
