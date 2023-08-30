export type Config = {
    source: Source | string[];
    items_selector: string;
    item_selectors: Item
    proxy: boolean;
}

export type ASource = {
    url: string;
    //list of a elements
    selector: string;
}

export type Source = ASource | string[]