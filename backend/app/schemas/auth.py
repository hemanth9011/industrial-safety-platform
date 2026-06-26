from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str
    email: str
    role: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
