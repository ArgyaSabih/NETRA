from fastapi import FastAPI
import utils

app = FastAPI()

# Backend routers
app.include_router(utils.router)

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)