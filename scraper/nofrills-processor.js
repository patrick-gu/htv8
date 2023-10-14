const nofrills = require('./nofrills.json');

const data = [];
for (const { text, image } of nofrills) {
    const sp = text.split("\n\n");
    let productName;
    if (sp.length === 3) {
        productName = sp[1];
    } else if (sp.length === 4) {
        productName = sp[2];
    } else if (sp.length === 5) {
        productName = sp[2];
    } else if (sp.length === 6) {
        productName = sp[3];
    } else if (sp.length === 7) {
        productName = sp[3];
    } else {
        throw new Error("idk", sp);
    }
    const product = {
        "name": productName,
        "desc": "",
        "price": parseFloat(text.match(/\$[\d\.]+/)[0].slice(1)),
        "img": image,
        "pricePerUnit": 0,
        "unit": "GR",
        "unitQuantity": 0
    };
    data.push(product);
}
console.log(JSON.stringify(data, null, 2));