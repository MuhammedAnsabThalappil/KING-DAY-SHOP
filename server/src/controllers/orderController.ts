import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      phone,
      email,
      address,
      apartment,
      city,
      district,
      state = 'Kerala',
      pincode,
      notes,
      items,
      discount = 0,
    } = req.body;

    if (!customerName || !phone || !address || !city || !pincode || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Customer details and at least one item are required.' });
    }

    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const itemPrice = Number(item.price) || 0;
      const itemQty = Number(item.quantity) || 1;
      const itemTotal = itemPrice * itemQty;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId || null,
        productName: item.name || item.productName || 'Toy Product',
        productSku: item.sku || item.productSku || null,
        productImage: item.image || item.productImage || null,
        price: itemPrice,
        quantity: itemQty,
        total: itemTotal,
      });

      // Update product stock if productId exists
      if (item.productId) {
        try {
          const product = await prisma.product.findUnique({ where: { id: item.productId } });
          if (product && product.stockQuantity >= itemQty) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { stockQuantity: Math.max(0, product.stockQuantity - itemQty) },
            });
          }
        } catch (err) {
          console.warn('Failed to update stock quantity for product:', item.productId, err);
        }
      }
    }

    const shipping = subtotal > 2000 ? 0 : 99; // Free shipping over ₹2000
    const total = Math.max(0, subtotal + shipping - Number(discount));
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `KD-${Date.now().toString().slice(-5)}${randomSuffix}`;

    const order = await (prisma as any).order.create({
      data: {
        orderNumber,
        customerName,
        phone,
        email: email || null,
        address,
        apartment: apartment || null,
        city,
        district: district || null,
        state,
        pincode,
        notes: notes || null,
        subtotal,
        shipping,
        discount: Number(discount),
        total,
        orderStatus: 'Pending',
        paymentStatus: 'WhatsApp Pending',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.orderStatus = String(status);
    }
    if (search) {
      const q = String(search).trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { customerName: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    const [orders, total] = await Promise.all([
      (prisma as any).order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      (prisma as any).order.count({ where }),
    ]);

    res.json({
      orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getOrderByIdOrNumber = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const order = await (prisma as any).order.findFirst({
      where: {
        OR: [
          { id: identifier },
          { orderNumber: identifier },
          { phone: identifier },
        ],
      },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const dataToUpdate: any = {};
    if (orderStatus) dataToUpdate.orderStatus = orderStatus;
    if (paymentStatus) dataToUpdate.paymentStatus = paymentStatus;

    const order = await (prisma as any).order.update({
      where: { id },
      data: dataToUpdate,
      include: { items: true },
    });

    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await (prisma as any).order.delete({ where: { id } });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order' });
  }
};

export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const orders: any[] = await (prisma as any).order.findMany({
      select: {
        customerName: true,
        phone: true,
        email: true,
        total: true,
        createdAt: true,
        city: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const customerMap = new Map<string, any>();

    for (const ord of orders) {
      const key = ord.phone || ord.customerName;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: ord.customerName,
          phone: ord.phone,
          email: ord.email,
          city: ord.city,
          totalOrders: 1,
          totalSpent: ord.total,
          lastOrderDate: ord.createdAt,
        });
      } else {
        const existing = customerMap.get(key);
        existing.totalOrders += 1;
        existing.totalSpent += ord.total;
      }
    }

    const customers = Array.from(customerMap.values());
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
};

export const getAnalytics = async (_req: Request, res: Response) => {
  try {
    const [orders, totalProducts, totalCategories, outOfStock] = await Promise.all([
      (prisma as any).order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.count({ where: { stockQuantity: 0 } }),
    ]);

    const totalRevenue = orders.reduce((acc: number, ord: any) => acc + (ord.orderStatus !== 'Cancelled' ? ord.total : 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o: any) => o.orderStatus === 'Pending').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Top products by quantity ordered
    const productSalesMap = new Map<string, { name: string; salesCount: number; revenue: number }>();
    for (const order of orders) {
      if (order.orderStatus === 'Cancelled') continue;
      for (const item of order.items) {
        const key = item.productName;
        if (!productSalesMap.has(key)) {
          productSalesMap.set(key, { name: item.productName, salesCount: item.quantity, revenue: item.total });
        } else {
          const current = productSalesMap.get(key)!;
          current.salesCount += item.quantity;
          current.revenue += item.total;
        }
      }
    }

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5);

    res.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      averageOrderValue,
      totalProducts,
      totalCategories,
      outOfStock,
      topProducts,
      recentOrders: orders.slice(0, 5),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};
