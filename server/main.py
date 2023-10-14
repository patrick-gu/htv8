from fastapi import FastAPI, Request
import uvicorn

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/paybilt")
async def paybilt_ntf(request: Request):
    body = await request.body()
    body_str = body.decode()
    print(body_str)
    return {"message": "received paybilt data"}


if __name__ == "__main__":
    uvicorn.run("main:app", port=8080, log_level="info")
