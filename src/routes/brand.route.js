import { Router } from "express";
import {  getAllBrands ,createBrand,getBrandById,updateBrand,deleteBrand} from "../controllers/brand.controller.js";

const brandRouter = Router();

// Get All Brands
brandRouter.get('/', getAllBrands)

// Get One 
brandRouter.get('/:id', getBrandById)

// CREATE
brandRouter.post('/', createBrand)

// UPDATE
brandRouter.put('/:id', updateBrand)

// DELETE
brandRouter.delete('/:id', deleteBrand)

export default brandRouter;
