import { Request, Response } from 'express';
import { prisma } from '../prisma';

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      categorySlug,
      categoryId,
      search,
      featured,
      inStock,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = '1',
      limit = '50',
      includeInactive = 'false',
    } = req.query;

    const whereClause: any = {};

    if (includeInactive !== 'true') {
      whereClause.active = true;
    }

    if (categorySlug) {
      whereClause.category = { slug: String(categorySlug) };
    } else if (categoryId) {
      whereClause.categoryId = String(categoryId);
    }

    if (featured === 'true') {
      whereClause.featured = true;
    }

    if (inStock === 'true') {
      whereClause.stockQuantity = { gt: 0 };
    }

    if (search) {
      const q = String(search).trim();
      whereClause.OR = [
        { name: { contains: q } },
        { sku: { contains: q } },
        { description: { contains: q } },
      ];
    }

    if (minPrice || maxPrice) {
      whereClause.salePrice = {};
      if (minPrice) whereClause.salePrice.gte = parseFloat(String(minPrice));
      if (maxPrice) whereClause.salePrice.lte = parseFloat(String(maxPrice));
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { salePrice: 'asc' };
    if (sort === 'price-high') orderBy = { salePrice: 'desc' };
    if (sort === 'name-asc') orderBy = { name: 'asc' };

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { displayOrder: 'asc' } },
          specifications: true,
          features: true,
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    return res.json({
      products,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error('getProducts error:', error);
    return res.status(500).json({ message: 'Failed to retrieve products.' });
  }
};

// GET /api/products/:slug
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { displayOrder: 'asc' } },
        specifications: true,
        features: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Related products in same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        active: true,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { displayOrder: 'asc' }, take: 1 },
      },
      take: 4,
    });

    return res.json({ product, relatedProducts });
  } catch (error) {
    console.error('getProductBySlug error:', error);
    return res.status(500).json({ message: 'Failed to retrieve product details.' });
  }
};

// POST /api/admin/products
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      sku,
      slug: customSlug,
      description,
      mrp,
      salePrice,
      stockQuantity,
      categoryId,
      featured,
      active,
      age,
      capacity,
      seoTitle,
      seoDescription,
      images = [],
      specifications = [],
      features = [],
    } = req.body;

    if (!name || !sku || !description || mrp === undefined || salePrice === undefined || !categoryId) {
      return res.status(400).json({ message: 'Missing required product fields (name, sku, description, mrp, salePrice, categoryId).' });
    }

    const slug = customSlug ? generateSlug(customSlug) : generateSlug(name);

    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      return res.status(400).json({ message: `SKU '${sku}' already exists.` });
    }

    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      return res.status(400).json({ message: `Slug '${slug}' already exists.` });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        slug,
        description,
        mrp: parseFloat(mrp),
        salePrice: parseFloat(salePrice),
        stockQuantity: parseInt(stockQuantity || '0', 10),
        categoryId,
        featured: Boolean(featured),
        active: active !== undefined ? Boolean(active) : true,
        age: age || null,
        capacity: capacity || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        images: {
          create: images.map((img: any, idx: number) => ({
            url: typeof img === 'string' ? img : img.url,
            alt: typeof img === 'object' ? img.alt : name,
            isPrimary: idx === 0,
            displayOrder: idx + 1,
          })),
        },
        specifications: {
          create: specifications.map((spec: any) => ({
            key: spec.key,
            value: spec.value,
          })),
        },
        features: {
          create: features.map((feat: any) => ({
            feature: typeof feat === 'string' ? feat : feat.feature,
          })),
        },
      },
      include: {
        category: true,
        images: true,
        specifications: true,
        features: true,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({ message: 'Failed to create product.' });
  }
};

// PUT /api/admin/products/:id
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      sku,
      slug: customSlug,
      description,
      mrp,
      salePrice,
      stockQuantity,
      categoryId,
      featured,
      active,
      age,
      capacity,
      seoTitle,
      seoDescription,
      images,
      specifications,
      features,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    let slug = existingProduct.slug;
    if (customSlug || (name && name !== existingProduct.name)) {
      const candidate = generateSlug(customSlug || name);
      if (candidate !== existingProduct.slug) {
        const taken = await prisma.product.findUnique({ where: { slug: candidate } });
        if (taken) {
          return res.status(400).json({ message: `Slug '${candidate}' is already taken.` });
        }
        slug = candidate;
      }
    }

    if (sku && sku !== existingProduct.sku) {
      const skuTaken = await prisma.product.findUnique({ where: { sku: sku.trim().toUpperCase() } });
      if (skuTaken) {
        return res.status(400).json({ message: `SKU '${sku}' is already taken.` });
      }
    }

    // Delete existing sub-relations if updating them
    if (images) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
    }
    if (specifications) {
      await prisma.productSpecification.deleteMany({ where: { productId: id } });
    }
    if (features) {
      await prisma.productFeature.deleteMany({ where: { productId: id } });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existingProduct.name,
        sku: sku !== undefined ? sku.trim().toUpperCase() : existingProduct.sku,
        slug,
        description: description !== undefined ? description : existingProduct.description,
        mrp: mrp !== undefined ? parseFloat(mrp) : existingProduct.mrp,
        salePrice: salePrice !== undefined ? parseFloat(salePrice) : existingProduct.salePrice,
        stockQuantity: stockQuantity !== undefined ? parseInt(stockQuantity, 10) : existingProduct.stockQuantity,
        categoryId: categoryId !== undefined ? categoryId : existingProduct.categoryId,
        featured: featured !== undefined ? Boolean(featured) : existingProduct.featured,
        active: active !== undefined ? Boolean(active) : existingProduct.active,
        age: age !== undefined ? age : existingProduct.age,
        capacity: capacity !== undefined ? capacity : existingProduct.capacity,
        seoTitle: seoTitle !== undefined ? seoTitle : existingProduct.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existingProduct.seoDescription,
        ...(images && {
          images: {
            create: images.map((img: any, idx: number) => ({
              url: typeof img === 'string' ? img : img.url,
              alt: typeof img === 'object' ? img.alt : name || existingProduct.name,
              isPrimary: idx === 0,
              displayOrder: idx + 1,
            })),
          },
        }),
        ...(specifications && {
          specifications: {
            create: specifications.map((spec: any) => ({
              key: spec.key,
              value: spec.value,
            })),
          },
        }),
        ...(features && {
          features: {
            create: features.map((feat: any) => ({
              feature: typeof feat === 'string' ? feat : feat.feature,
            })),
          },
        }),
      },
      include: {
        category: true,
        images: true,
        specifications: true,
        features: true,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error('updateProduct error:', error);
    return res.status(500).json({ message: 'Failed to update product.' });
  }
};

// PATCH /api/admin/products/:id/inventory
export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stockQuantity } = req.body;

    if (stockQuantity === undefined || isNaN(stockQuantity)) {
      return res.status(400).json({ message: 'Valid stock quantity required.' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { stockQuantity: parseInt(stockQuantity, 10) },
    });

    return res.json({ id: updated.id, stockQuantity: updated.stockQuantity });
  } catch (error) {
    console.error('updateInventory error:', error);
    return res.status(500).json({ message: 'Failed to update inventory.' });
  }
};

// DELETE /api/admin/products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });
    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    return res.status(500).json({ message: 'Failed to delete product.' });
  }
};

// GET /api/admin/dashboard
export const getAdminDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      totalCategories,
      featuredProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { stockQuantity: 0 } }),
      prisma.product.count({ where: { stockQuantity: { gt: 0, lte: 5 } } }),
      prisma.category.count(),
      prisma.product.count({ where: { featured: true } }),
    ]);

    return res.json({
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      totalCategories,
      featuredProducts,
    });
  } catch (error) {
    console.error('getAdminDashboardStats error:', error);
    return res.status(500).json({ message: 'Failed to retrieve dashboard stats.' });
  }
};
