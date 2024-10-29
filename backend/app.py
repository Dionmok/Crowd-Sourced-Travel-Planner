from flask import Flask
from supabase import create_client, Client
from dotenv import load_dotenv 
import os 

# load env variables from .env file
load_dotenv()

# get value of supabase env variables 
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# initalize supabase client 
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)

@app.route('/')
def home():
    response = supabase.table("Users").select("*").execute()
    print(response)
    return f"Hello World, from Flask!"

if __name__ == '__main__':
    app.run(debug=True) # enable debug mode 
