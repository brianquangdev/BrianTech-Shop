import { backendClient } from "../lib/backendClient";
import { Address, Product } from "@/sanity.types";

export interface OrderMetadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address: Address | null;
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
      paymentMethod: "vnpay", // Default to vnpay for now as this is used in VNPay flow
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

    // Update the status
    await backendClient
      .patch(order._id)
      .set({ status: status })
      .commit();

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error };
  }
}
