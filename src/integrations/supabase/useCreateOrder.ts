
import { supabase } from "@/integrations/supabase/client";

interface OrderItemInput {
  book_id: number;
  quantity: number;
  price: number;
}

interface OrderInput {
  order_number: string;
  status?: string;
  shipping_address: any;
  payment_method: string;
  shipping_method: string;
  subtotal: number;
  shipping: number;
  total: number;
  order_items: OrderItemInput[];
}

export async function createOrder(order: OrderInput) {
  // Insert the order
  const { data: insertedOrder, error } = await supabase
    .from("orders")
    .insert([
      {
        order_number: order.order_number,
        status: order.status ?? "Processing",
        shipping_address: order.shipping_address,
        payment_method: order.payment_method,
        shipping_method: order.shipping_method,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  // Insert order items
  const orderItems = order.order_items.map(item => ({
    order_id: insertedOrder.id,
    book_id: item.book_id,
    quantity: item.quantity,
    price: item.price,
  }));
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);
  if (itemsError) throw itemsError;

  return insertedOrder;
}
