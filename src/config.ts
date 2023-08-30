import { Config } from "../@types/config";
import { Item } from "../@types/item";

export default {
    source: {
        url: "https://goodguyshire.co.nz/product/chiller-trailer/",
        selector: ".product-categories a"
    },
    items_selector: ".portfolio-set a",
    item_selectors: {
        sku: ".sku",
        title: ".product_title.entry-title",
        description: ".woocommerce-product-details__short-description",
        price: null,
        stock: null,
        category: ".posted_in a:first-of-type",
        tags: ".posted_in a",
        image: ".product-gallery-image img",
    },
    proxy: false
} as Config;
