'use strict';

const SubCategoryModel = require('../models/subCategoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiErorr');

// @desc    Get a list of subcategories
// @route   GET /api/v1/subcategories?page=<number>&limit=<number>
// @query   page : integer  , limit : integer
// @access  Public
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;
  const subcategories = await SubCategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({
    results: subcategories.length,
    page,
    data: subcategories,
  });
});

// @desc    Get a specific subCategory depend on ID
// @route   GET /api/v1/subcategories/:id
// @params  id : integer
// @access  Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findById(id);

  if (!subCategory)
    return next(new ApiError(`The subcatgegory isn't exist`, 404));
  res.status(200).json({ data: subCategory });
});

// @desc    Create subCategory
// @route   POST /api/v1/subcategories
// @access  Private
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { categoryID, name } = req.body;

  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category: categoryID,
  });
  res.status(201).json({ data: subCategory });
});

// @desc    Update subCategory
// @route   POST /api/v1/subcategories
// @access  Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const subCategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  res.status(200).json({ data: subCategory });
});
