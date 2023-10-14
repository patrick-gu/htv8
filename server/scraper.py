from os import unlink
import os
import requests
import re
import json
import openai
from fastapi import Request, FastAPI, Body
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import cloudscraper

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


load_dotenv()


session = requests.session()
my_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'}
session.headers.update(my_headers)


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


def getFlippPage(postalCode):
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
  return groceryStores


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/flipp/{postalCode}")
async def flipp(postalCode: str):
    return getSaleItems(postalCode)
