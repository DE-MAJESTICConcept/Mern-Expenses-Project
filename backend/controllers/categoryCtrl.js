const asyncHandler = require("express-async-handler");
const Category = require("../model/Category");
const Transaction = require("../model/Transaction");

const categoryController = {
  //!add
  create: asyncHandler(async (req, res) => {
    // Add check for req.user just in case middleware fails or is missed
    if (!req.user) {
      res.status(401); // Unauthorized
      throw new Error("User not authenticated.");
    }
    const { name, type } = req.body;
    if (!name || !type) {
      res.status(400); // Bad Request
      throw new Error("Name and type are required for creating a category");
    }
    const normalizedName = name.toLowerCase();
    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type.toLowerCase())) {
      res.status(400); // Bad Request
      throw new Error("Invalid category type: " + type);
    }
    const categoryExists = await Category.findOne({
      name: normalizedName,
      user: req.user,
    });
    if (categoryExists) {
      res.status(409); // Conflict
      throw new Error(
        `Category "${categoryExists.name}" already exists for this user.`
      );
    }
    const category = await Category.create({
      name: normalizedName,
      user: req.user,
      type,
    });
    res.status(201).json(category);
  }),

  //!lists
  lists: asyncHandler(async (req, res) => {
    // Explicitly check if req.user is available
    if (!req.user) {
      res.status(401); // Unauthorized
      throw new Error("Authentication required to list categories.");
    }
    const categories = await Category.find({ user: req.user });
    // If no categories are found, send an empty array rather than assuming a non-existent state
    res.status(200).json(categories);
  }),

  //!update
  update: asyncHandler(async (req, res) => {
    if (!req.user) {
      res.status(401);
      throw new Error("User not authenticated.");
    }
    const { categoryId } = req.params;
    const { type, name } = req.body;
    if (!name && !type) { // Ensure at least one field is provided for update
      res.status(400);
      throw new Error("At least name or type is required for updating a category.");
    }
    
    const category = await Category.findById(categoryId);
    
    // Check if category exists AND belongs to the authenticated user
    if (!category || category.user.toString() !== req.user.toString()) {
      res.status(404); // Not Found or Forbidden
      throw new Error("Category not found or user not authorized.");
    }

    const oldName = category.name;
    const normalizedName = name ? name.toLowerCase() : category.name; // Normalize if name is provided

    // Check if a category with the new name and type already exists for the user (if name is changing)
    if (name && normalizedName !== oldName) {
        const existingCategoryWithNewName = await Category.findOne({
            name: normalizedName,
            user: req.user,
            _id: { $ne: categoryId } // Exclude the current category from the check
        });
        if (existingCategoryWithNewName) {
            res.status(409);
            throw new Error(`Category "${normalizedName}" already exists for this user.`);
        }
    }

    // Update category properties
    category.name = normalizedName;
    category.type = type || category.type; // Only update type if provided

    const updatedCategory = await category.save();

    // Update affected transaction categories if name changed
    if (oldName !== updatedCategory.name) {
      await Transaction.updateMany(
        {
          user: req.user,
          category: oldName, // Match by old category name string
        },
        { $set: { category: updatedCategory.name } } // Set to new category name string
      );
    }
    res.status(200).json(updatedCategory); // OK
  }),

  //! delete
  delete: asyncHandler(async (req, res) => {
    if (!req.user) {
      res.status(401);
      throw new Error("User not authenticated.");
    }
    const category = await Category.findById(req.params.id);
    
    // Check if category exists AND belongs to the authenticated user
    if (!category || category.user.toString() !== req.user.toString()) {
      res.status(404); // Not Found or Forbidden
      throw new Error("Category not found or user not authorized.");
    }

    //! Update transactions that have this category to "Uncategorized"
    const defaultCategory = "Uncategorized"; // Make sure "Uncategorized" is a valid category or string
    await Transaction.updateMany(
      { user: req.user, category: category.name }, // Match by category name string
      { $set: { category: defaultCategory } }
    );
    
    //! Remove category
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category removed and associated transactions updated." }); // OK
  }),
};

module.exports = categoryController;



