from flask import Flask
from supabase import create_client, Client
from dotenv import load_dotenv 
from flask_jwt_extended import JWTManager
import os
from flask_cors import CORS

# load env variables from .env file
load_dotenv()

# get values of env variables 
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "")
GOOGLE_PLACES_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY", "")

# initalize supabase client 
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)

# Setup JWT
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
jwt = JWTManager(app)

# Allow CORS for all origins
CORS(app)

# Import route controllers
import user_controller

import trip_controller

import search_controller
  
import experience_controller

if __name__ == '__main__':
    app.run(debug=True) # enable debug mode 
