import { BrandService } from '../services/brand.service.js';

export const getAllBrands = async (req, res) => {
  try {
    const data = await BrandService.getAllBrands();
    res
      .status(200)
      .json({ statusCode: 200, message: 'Get data successfully', data });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ statusCode: err.statusCode || 500, message: err.message });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await BrandService.findBrandById(id);
    res
      .status(200)
      .json({ statusCode: 200, message: 'Get data successfully', data });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ statusCode: err.statusCode || 500, message: err.message });
  }
};

export const createBrand = async (req, res) => {
  try {
    const { brand_name } = req.body;
    const data = await BrandService.createBrand(brand_name);
    res
      .status(201)
      .json({ statusCode: 201, message: 'Brand created successfully', data });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ statusCode: err.statusCode || 500, message: err.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { brand_name } = req.body;
    const data = await BrandService.updateBrand(id, brand_name);
    res
      .status(200)
      .json({ statusCode: 200, message: 'Brand updated successfully', data });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ statusCode: err.statusCode || 500, message: err.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await BrandService.deleteBrand(id);
    res
      .status(200)
      .json({ statusCode: 200, message: 'Brand deleted successfully', data });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ statusCode: err.statusCode || 500, message: err.message });
  }
};
