import { Brand } from "../models/index.js";
import { ApiError } from "../utils/ApiError.util.js";

export class BrandService {
  static async getAllBrands() {
    return await Brand.findAll();
  }

  static async getBrandById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiError("ID must be a positive integer", 400);
    }

    const brand = await Brand.findByPk(id);
    if (!brand) {
      throw new ApiError("Brand not found", 404);
    }
    return brand;
  }

  static async createBrand(name) {
    const existingBrand = await Brand.findOne({ where: { name } });
    if (existingBrand) {
      throw new ApiError("Brand name already exists", 400);
    }

    return await Brand.create({ name });
  }

  static async updateBrand(id, newName) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiError("ID must be a positive integer", 400);
    }

    const brand = await Brand.findByPk(id);
    if (!brand) {
      throw new ApiError("Brand not found", 404);
    }

    if (newName && newName !== brand.name) {
      const existingBrand = await Brand.findOne({ where: { name: newName } });
      if (existingBrand) {
        throw new ApiError("Brand name already exists", 409);
      }
    }

    await brand.update({ name: newName ?? brand.name });
    return brand;
  }

  static async deleteBrand(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiError("ID must be a positive integer", 400);
    }

    const brand = await Brand.findByPk(id);
    if (!brand) {
      throw new ApiError("Brand not found", 404);
    }

    await Brand.destroy({ where: { id } });
    return brand;
  }
}
