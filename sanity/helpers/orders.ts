import { backendClient } from "../lib/backendClient";
import { Address, Product } from "@/sanity.types";

export interface OrderMetadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address: Address | null;
  paymentMethod?: "vnpay" | "momo";
}

export interface OrderItem {
  product: Product;
}

export async function createOrder(items: OrderItem[], metadata: OrderMetadata) {
  try {
    console.log("Creating order in Sanity...");
    const order = await backendClient.create({
      _type: "order",
      orderNumber: metadata.orderNumber,
      customerName: metadata.customerName,
      email: metadata.customerEmail,
      clerkUserId: metadata.clerkUserId,
      paymentMethod: metadata.paymentMethod || "vnpay", 
      paymentStatus: "pending",
      address: metadata.address
        ? {
            _type: "shippingAddress",
            name: metadata.address.name,
            address: metadata.address.address,
            city: metadata.address.city,
            state: metadata.address.state,
            zip: metadata.address.zip,
          }
        : undefined,
      products: items.map((item) => ({
        _key: crypto.randomUUID(),
        product: {
          _type: "reference",
          _ref: item.product._id,
        },
        quantity: 1,
      })),
      totalPrice: items.reduce(
        (total, item) => total + (item.product.price || 0),
        0
      ),
      currency: "VND",
      amountDiscount: 0,
      status: "pending",
      orderDate: new Date().toISOString(),
    });
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderNumber: string,
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
) {
  try {
    // Find the order by orderNumber
    const order = await backendClient.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]`,
      { orderNumber }
    );

    if (!order) {
      throw new Error(`Order with number ${orderNumber} not found`);
    }

    // Determine payment status based on order status
    const paymentStatus = status === "paid" ? "paid" : status === "cancelled" ? "failed" : "pending";

    // Use createOrReplace instead of patch - this might have better permission handling
    const updatedOrder = {
      ...order,
      status: status,
      paymentStatus: paymentStatus,
      _type: "order",
    };

    await backendClient.createOrReplace(updatedOrder);

    console.log(`✅ Order ${orderNumber} updated to status: ${status}, paymentStatus: ${paymentStatus}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error };
  }
}
