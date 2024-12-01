from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from typing import List, Optional
from datetime import datetime

# MongoDB connection
DATABASE_URL = "mongodb+srv://surajbangade19:g099VdSMHsbJahS5@cluster0.6kwayyd.mongodb.net/shop-management-system?retryWrites=true&w=majority"
client = MongoClient(DATABASE_URL)
db = client['shop-management-system']
transactions_collection = db['transactions']

# FastAPI app initialization
app = FastAPI()

# Pydantic models
class Transaction(BaseModel):
    client: str
    date: str  # You can adjust the date format as needed
    paid_amount: float
    remaining_amount: float
    id: str

class Metadata(BaseModel):
    totalPages: int
    totalTransactions: int

class TransactionResponse(BaseModel):
    transactions: List[Transaction]
    metadata: Metadata

class FetchTransactionsRequest(BaseModel):
    page: int = 1
    limit: int = 10
    search: Optional[str] = None
    sortBy: str = 'date'
    sortOrder: str = 'asc'

# Helper function for pagination and sorting
def get_paginated_results(query, page, limit, sort_by, sort_order):
    skip = (page - 1) * limit
    sort_order = 1 if sort_order == 'asc' else -1  # Sort order for ascending or descending
    transactions = list(query.skip(skip).limit(limit).sort(sort_by, sort_order))
    return transactions

# FastAPI endpoint to fetch transactions
@app.get("/api/history", response_model=TransactionResponse)
async def fetch_transactions(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    search: Optional[str] = None,
    sortBy: str = Query('date'),
    sortOrder: str = Query('asc')
):
    try:
        # Build the query for filtering transactions
        query = {}
        if search:
            query = {
                "$or": [
                    {"client": {"$regex": search, "$options": "i"}},
                    {"date": {"$regex": search, "$options": "i"}}
                ]
            }

        # Fetch transactions with pagination and sorting
        transactions = get_paginated_results(transactions_collection.find(query), page, limit, sortBy, sortOrder)

        # Get total number of transactions for pagination metadata
        total_transactions = transactions_collection.count_documents(query)
        total_pages = (total_transactions // limit) + (1 if total_transactions % limit else 0)

        # Prepare response data
        response = TransactionResponse(
            transactions=[Transaction(**tx) for tx in transactions],
            metadata=Metadata(totalPages=total_pages, totalTransactions=total_transactions)
        )
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the FastAPI app using Uvicorn:
# uvicorn app_name:app --reload
