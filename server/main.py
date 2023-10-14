import uvicorn
import requests
import re
import json
from fastapi import Request, FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cloudscraper
import os

with open("./.env") as env_file:
    line = env_file.readline()
    [key, value] = line.split("=")
    os.environ[key] = value
PAYBILT_TOKEN = os.environ["PAYBILT_TOKEN"]

app = FastAPI()


class Sieve(BaseModel):
    storesList: list
    shoppingList: list


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


session = requests.session()
my_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'}
session.headers.update(my_headers)


class Store:
    def __init__(self, name, id):
        self.name = name
        self.id = id


class Item:
    def __init__(self, name, brand, store, storeId, price, img):
        self.name = name
        self.brand = brand
        self.store = store
        self.storeId = storeId
        self.price = price
        self.img = img


class FinalItem:
    def __init__(self, name, store, price, img, unitprice):
        self.name = name
        self.store = store
        self.price = price
        self.img = img
        self.unitprice = unitprice


def levenshtein_distance(s, t):
    m, n = len(s), len(t)
    if m < n:
        s, t = t, s
        m, n = n, m
    d = [list(range(n + 1))] + [[i] + [0] * n for i in range(1, m + 1)]
    for j in range(1, n + 1):
        for i in range(1, m + 1):
            if s[i - 1] == t[j - 1]:
                d[i][j] = d[i - 1][j - 1]
            else:
                d[i][j] = min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]) + 1
    return d[m][n]


def compute_similarity(input_string, reference_string):
    distance = levenshtein_distance(input_string, reference_string)
    max_length = max(len(input_string), len(reference_string))
    similarity = 1 - (distance / max_length)
    return similarity


def get_ddg_cookies(url):
    r = requests.get('https://check.ddos-guard.net/check.js',
                     headers={'referer': url})
    r.raise_for_status()
    return r.cookies.get_dict()['__ddg2']


def getStores():
    f = open('data.json')
    data = json.load(f)
    return list(data.keys())


def searchDefaultItems(query):
    f = open('defaultItems.json')
    data = json.load(f)
    choice = None
    for item in data:
        if compute_similarity(query.lower(), item['name'].lower()) > 0.6 or query.lower() in item['name'].lower():
            choice = FinalItem(item['name']+" "+item['desc'], None, item['price'], item['img'], str(
                item['pricePerUnit'])+' / ' + str(item['unitQuantity']) + str(item['unit']))
            break
    return choice


def searchSaleData(query):
    f = open('data.json')
    data = json.load(f)
    itemsByStore = {}
    for key in data.keys():
        items = []
        for item in data[key]:
            if compute_similarity(query.lower(), item['name'].lower()) > 0.6 or query.lower() in item['name'].lower():
                items.append(item)
        if (len(items) > 0):
            itemsByStore[key] = items
    return itemsByStore


def getSaleItems(postalCode):
    scraper = cloudscraper.create_scraper()
    groceryStores = []
    url = f"https://cdn-gateflipp.flippback.com/bf/flipp/data?locale=en-ca&postal_code={postalCode}&sid=9565209900140639"
    cookie = get_ddg_cookies(url)
    scraper.cookies.set(cookie, cookie, domain=url)
    webpage = scraper.get(url).json()
    for store in webpage["flyers"]:
        if "Groceries" in store["categories"]:
            entry = Store(store["merchant"], store["id"])
            groceryStores.append(entry)

    itemsByStore = {}
    stores = set()
    for store in groceryStores:
        if (store.name == 'Walmart' or store.name == 'Metro' or store.name == 'Food Basics' or store.name == 'No Frills' or store.name == 'Sobeys' or store.name == 'Real Canadian Superstore' or store.name == 'Loblaws' or store.name == 'T&T Supermarket' or store.name == 'Costco' or store.name == 'FreshCo'):
            url = f"https://cdn-gateflipp.flippback.com/bf/flipp/flyers/{store.id}?locale=en-ca&sid=9874069328040511"
            cookie = get_ddg_cookies(url)
            scraper.cookies.set(cookie, cookie, domain=url)
            webpage = scraper.get(url).json()
            items = []
            for item in webpage["items"]:
                if (item["name"] and item["price"]):
                    itemName = item["name"].replace('\n', '')
                    entry = Item(
                        itemName, item["brand"], store.name, store.id, item["price"], item["cutout_image_url"])
                    items.append(entry)
                    stores.add(store.name)
            if (store.name in stores):
                itemsByStore[store.name] = items
    return itemsByStore


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/searchDefaultItems/{query}")
async def flipp(query: str):
    return searchDefaultItems(query)


@app.get("/flipp/{postalCode}")
async def flipp(postalCode: str):
    return getSaleItems(postalCode)


@app.get("/getItems/{query}")
async def flipp(query: str):
    return searchSaleData(query)


@app.post("/filter/")
async def flipp(sieve: Sieve):
    f = open('data.json')
    data = json.load(f)
    categorizeByItem = {}
    for item in sieve.shoppingList:
        categorizeByItem[item] = []
    for key in data.keys():
        for item in data[key]:
            for shoppingListItem in sieve.shoppingList:
                if compute_similarity(shoppingListItem.lower(), item['name'].lower()) > 0.6 or shoppingListItem.lower() in item['name'].lower():
                    if item['store'] in sieve.storesList:
                        categorizeByItem[shoppingListItem] = categorizeByItem[shoppingListItem]+[item]
    totalcost = 0
    bestShoppingList = {}
    for key in categorizeByItem.keys():
        itemCost = 1e9
        item = None
        for choice in categorizeByItem[key]:
            try:
                if float(choice['price']) < itemCost:
                    itemCost = float(choice['price'])
                    item = choice
            except:
                0 == 0
        if (item != None):
            newItem = FinalItem(
                item['name'], item['store'], item['price'], item['img'], None)
            bestShoppingList[key] = newItem
            totalcost += float(item['price'])
        else:
            defaultItem = searchDefaultItems(key)
            if defaultItem != None:
                bestShoppingList[key] = defaultItem
                totalcost += float(defaultItem.price)

    return bestShoppingList, {"cost": str(round(totalcost, 2))}


class WalmartItem:
    def __init__(self, name, desc, price, img, pricePerUnit, unit, unitQuantity):
        self.name = name
        self.desc = desc
        self.price = price
        self.img = img
        self.pricePerUnit = pricePerUnit
        self.unit = unit
        self.unitQuantity = unitQuantity

    def display(self):
        print(self.name)
        print(self.desc)
        print(self.price)
        print(self.pricePerUnit, '/', self.unitQuantity, self.unit)
        print(self.img)


def searchItem(query, postalCode, storeId):
    scraper = cloudscraper.create_scraper()
    url = f"https://www.walmart.ca/search?q={query}&c=10019"
    # cookie = get_ddg_cookies(url)
    # session.cookies.set(cookie,cookie,domain=url)
    webpage = scraper.get(url).text
    rawOptions = re.findall(
        """<p data-automation=name class="css-1p4va6y eudvd6x0">(.+?)</p>""", webpage)
    rawSubtext = re.findall(
        """<p data-automation=description class="css-1m0dajq eudvd6x0">(.+?)</p>""", webpage)
    skuId = re.findall(
        """<div data-automation=quantity-atc-panel-(.+?) class="e1m8uw919 css-fgci5x e1nah0ad2">""", webpage)
    id = re.findall(
        """div data-automation=grocery-product data-product-id=(.+?) class="css-1d0izcz e1m8uw9118""", webpage)
    img = re.findall(
        'src="(.+?)" data-automation=image class="css-19q6667 e175iya62"', webpage)
    products = []
    for i in range(len(id)):
        entry = {}
        entry["productId"] = id[i]
        skuIds = [skuId[i]]
        entry["skuIds"] = skuIds
        products.append(entry)

    data = {
        "fsa": postalCode[0:3],
        "products": products,
        "lang": "en",
        "pricingStoreId": str(storeId),
        "fulfillmentStoreId": str(storeId),
        "experience": "grocery"
    }
    jsonData = json.dumps(data)
    cookie = get_ddg_cookies("https://www.walmart.ca/api/bsp/v2/price-offer")
    scraper.cookies.set(
        cookie, cookie, domain="https://www.walmart.ca/api/bsp/v2/price-offer")
    content = scraper.post(
        "https://www.walmart.ca/api/bsp/v2/price-offer",
        data=jsonData,
        headers={"Referer": url}
    )
    itemData = json.loads(content.content.decode())
    items = []
    counter = 0
    for product in products:
        entry = itemData["offers"][product["skuIds"][0]]
        price = entry["currentPrice"]
        if "pricePerUnit" in entry and "priceCompQty" in entry and "priceCompUomCd" in entry:
            pricePerUnit = entry["pricePerUnit"]
            unit = entry["priceCompUomCd"]
            unitQuantity = entry["priceCompQty"]
            newItem = WalmartItem(
                rawOptions[counter], rawSubtext[counter], price, img[counter], pricePerUnit, unit, unitQuantity)
            items.append(newItem)
            newItem.display()
        else:
            newItem = WalmartItem(
                rawOptions[counter], rawSubtext[counter], price, img[counter], None, None, None)
            items.append(newItem)
            newItem.display()
        counter += 1

    return items


@app.get("/getWalmartItems/{query}")
async def flipp(query: str):
    return searchItem(query, "M1B5J5", 3111)


@app.post("/paybilt")
async def payment_paybilt(request: Request):
    """
    Body should have email, phone, items, first_name, last_name, address, city, state, country, zip_code
    and nonce
    """
    body = await request.json()
    paybilt_body = {
        "email": body["email"],
        "phone": body["phone"],
        "items": body["items"],
        "first_name": body["first_name"],
        "last_name": body["last_name"],
        "address": body["address"],
        "city": body["city"],
        "state": body["state"],
        "country": body["country"],
        "zip_code": body["zip_code"],
        "ip_address": str(request.client),
        "ntf_url": "https://docs.paybilt.com/reference/e-transfer-payment",  # random url for now
        "udfs": [body["nonce"]],
        "shipping_cost": 12.97,
        "return_url": "https://github.com/patrick-gu/htv8",  # also here
        "convenience_fee": 0
    }
    url = "https://sandbox.pp.paybilt.com/api/v2/payment/eTransfer/"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {PAYBILT_TOKEN}"
    }
    response = requests.request(
        "POST", url, json=paybilt_body, headers=headers)
    return response.json()


if __name__ == "__main__":
    uvicorn.run("main:app", port=8080, log_level="info")
