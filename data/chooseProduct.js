function kgConvert({ amount, unit }) {
    if (unit === "kg") {
        return amount;
    }
    if (unit === "lb") {
        return amount * 0.454;
    }
    throw new Error(`unknown unit ${unit}`);
}

function purchasePrice(storeProduct, kgRequired) {
    const { store, price, type, qty } = storeProduct;
    const kg = kgConvert(qty);
    if (type === "bulk") {
        return { store, price: kgRequired / kg * price, surplus: 0 };
    }
    if (type === "unit") {
        const units = Math.ceil(kgRequired / kg);
        const surplus = units * kg - kgRequired;
        return { store, price: units * price, surplus };
    }
    throw new Error(`unknown product type ${type}`);
}

function getProductChoices(stores, kgRequired) {
    const ans = stores.map((storeProduct) => purchasePrice(storeProduct, kgRequired));
    ans.sort((a, b) => a.price - b.price);
    return ans;
}

// console.log(getProductChoices(require("./processed.json").products.tomato, 1));