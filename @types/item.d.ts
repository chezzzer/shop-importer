export interface Item {
    product_id: number;
    sku: string | null;
    title: string | null;
    description: string | null;
    price: string | null;
    rrp: string | null;
    freight_id: string | null;
    sort: string | null;
    stock_zero: string | null;
    product_status: string | null;
    variation_one_name: string | null;
    variation_one_value: string | null;
    variation_two_name: string | null;
    variation_two_value: string | null;
    variation_three_name: string | null;
    variation_three_value: string | null;
    stock: string | null;
    brand: string | null;
    category: string | null;
    tags: string | null;
    image: string | null;
    gtin: string | null;
    google_category_id: string | null;
    buy_on_subscription: string | null;
    afterpay_restricted: string | null;
    order: string | null;
}