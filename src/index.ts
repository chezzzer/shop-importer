import config from "./config.js";
import { load } from "cheerio";
import { defaultItem } from "./defaultItem.js";
import { Parser } from "@json2csv/plainjs";
import { writeFile } from "fs/promises";
import { ASource } from "../@types/config.js";
import http from "http";
import { publicIpv4 } from "public-ip";

const ip = await publicIpv4();
if (config.proxy) {
    var server = http.createServer(async function (req, res) {
        try {
            const url = req.url?.substring(1);
            if (!url) {
                res.end();
                return;
            }
            const image = await fetch(url);
            const buffer = Buffer.from(await image.arrayBuffer());
            res.writeHead(200, {
                "Content-Type":
                    image.headers.get("content-type") ?? "image/png",
                "Content-Length": buffer.length,
            });
            res.end(buffer);
        } catch (_) {
            res.statusCode = 500;
            res.end();
        }
    });
    server.listen(5050);
}

const parser = new Parser();

const products = [];

let urls: string[];

console.log("Starting...");

if (typeof config.source === "object") {
    console.log("Grabbing ASource list");
    const asource = config.source as ASource;
    const content = await fetch(asource.url).then((res) => res.text());
    const $ = load(content);

    const items = $(asource.selector)
        .toArray()
        //@ts-ignore
        .map((a) => a.attribs.href.trim());

    urls = items;
} else {
    urls = config.source as string[];
}

console.log("Doing these:", urls);

let i = 1000;
for (const url of urls) {
    console.log("Grabbing:", url);
    const content = await fetch(url).then((res) => res.text());

    const $ = load(content);

    const items = $(config.items_selector).toArray();

    let urls = items
        //@ts-ignore
        .map((a) => a.attribs.href)
        .filter((url) => url !== "#");

    urls = [...new Set(urls)];

    for (const url of urls) {
        console.log("Parsing", url);
        const item = await parseProductPage(url, i);

        if (item.title) {
            products.push(item);
        }

        i++;
    }

    console.log("Grabbed " + urls.length + " items from " + url);
}

const csv = parser.parse(products);
await writeFile("output/products.csv", csv);
if (config.proxy) {
    console.log("Complete, still running proxy, CTRL+C to finish");
} else {
    console.log("Complete");
}
async function parseProductPage(url: string, id: number) {
    const content = await fetch(url).then((res) => res.text());

    let item = JSON.parse(JSON.stringify(defaultItem));

    item.product_id = id;

    const $ = load(content);

    for (const [key, selector] of Object.entries(config.item_selectors)) {
        if (selector === null) continue;

        let value = $(selector).text().trim();

        if (key == "image") {
            value = $(selector)
                //@ts-ignore
                .map((_, img) => config.proxy ? `http://${ip}:5050/${img.attribs.src}` : img.attribs.src)
                .toArray()
                .join("|");
        }

        if (key == "tags") {
            value = $(selector)
                //@ts-ignore
                .map((_, tag) => tag.children[0].data)
                .toArray()
                .join(",");
        }

        if (key == "description") {
            value = $(selector).html()?.trim() ?? "";
        }

        if (key == "sku" && value == "") {
            value = i.toString();
        }

        item[key as "sku"] = value;
    }

    item.url = url;

    return item;
}
