import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// GET /api/categories (Public: Active only / Admin: All)
export const getCategories = async (req: Request, res: Response) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';

    const where = includeInactive ? {} : { active: true };

    const categories = await prisma.category.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { products: { where: { active: true } } },
        },
      },
    });

    const formatted = categories.map((cat: any) => ({
      ...cat,
      productCount: cat._count.products,
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('getCategories error:', error);
    return res.status(500).json({ message: 'Failed to retrieve categories.' });
  }
};

// GET /api/categories/:slug
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: { where: { active: true } } },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.json({
      ...category,
      productCount: category._count.products,
    });
  } catch (error) {
    console.error('getCategoryBySlug error:', error);
    return res.status(500).json({ message: 'Failed to retrieve category details.' });
  }
};

// POST /api/admin/categories (Admin only)
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug: customSlug, description, image, displayOrder, active } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const slug = customSlug ? generateSlug(customSlug) : generateSlug(name);

    const existingSlug = await prisma.category.findUnique({ where: { slug } });
    if (existingSlug) {
      return res.status(400).json({ message: `Slug '${slug}' is already taken. Please use a unique slug.` });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description || null,
        image: image || null,
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error('createCategory error:', error);
    return res.status(500).json({ message: 'Failed to create category.' });
  }
};

// PUT /api/admin/categories/:id (Admin only)
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug: customSlug, description, image, displayOrder, active } = req.body;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    let slug = category.slug;
    if (customSlug || (name && name !== category.name)) {
      const newSlugCandidate = generateSlug(customSlug || name);
      if (newSlugCandidate !== category.slug) {
        const existing = await prisma.category.findUnique({ where: { slug: newSlugCandidate } });
        if (existing) {
          return res.status(400).json({ message: `Slug '${newSlugCandidate}' is already in use by another category.` });
        }
        slug = newSlugCandidate;
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : category.name,
        slug,
        description: description !== undefined ? description : category.description,
        image: image !== undefined ? image : category.image,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : category.displayOrder,
        active: active !== undefined ? Boolean(active) : category.active,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error('updateCategory error:', error);
    return res.status(500).json({ message: 'Failed to update category.' });
  }
};

// DELETE /api/admin/categories/:id (Admin safe deletion check)
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { targetCategoryId, force } = req.body; // Allow reassignment or forced deactivation

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const productCount = category._count.products;

    if (productCount > 0 && !force && !targetCategoryId) {
      return res.status(409).json({
        message: `Cannot delete category. It contains ${productCount} products.`,
        productCount,
        requiresAction: true,
      });
    }

    if (targetCategoryId) {
      // Reassign products to target category first
      await prisma.product.updateMany({
        where: { categoryId: id },
        data: { categoryId: targetCategoryId },
      });
    }

    await prisma.category.delete({ where: { id } });

    return res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('deleteCategory error:', error);
    return res.status(500).json({ message: 'Failed to delete category.' });
  }
};
