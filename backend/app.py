from flask import Flask, request, jsonify
from supabase import create_client, Client
from dotenv import load_dotenv 
import os 
from flask_cors import CORS

# load env variables from .env file
load_dotenv()

# get value of supabase env variables 
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# initalize supabase client 
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)

# Allow CORS for all origins
CORS(app)

@app.route('/')
def home():
    response = supabase.table("Users").select("*").execute()
    print(response)
    return f"Hello World, from Flask!"

# Fetch trips for a given user_id
@app.route('/trips/<user_id>', methods={'GET'})
def get_user_trips(user_id):
    response = supabase.table('Trip').select('*').eq('user_id', user_id).execute()

    if response.data:
        return jsonify(response.data), 200
    else:
        return jsonify({"error": "No trips found for this user"}), 404

@app.route('/delete_trip', methods=['DELETE'])
def delete_trip():
    data = request.get_json()
    trip_id = data.get('trip_id')
    user_id = data.get('user_id')

    trip = supabase.table('Trip').select('*').eq('trip_id', trip_id).eq('user_id', user_id). execute()

    if trip.data:
        supabase.table('Trip').delete().eq('trip_id', trip_id).execute()
        return jsonify({"message": "Trip deleted successfully"}), 200
    else:
        return jsonify({"error": "Trip is not found or is not one of the user's trips"}), 404

if __name__ == '__main__':
    app.run(debug=True) # enable debug mode 
