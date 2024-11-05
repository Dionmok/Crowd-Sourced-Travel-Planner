from flask import Flask, request, jsonify
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

@app.route('/')
def home():
    response = supabase.table("Users").select("*").execute()
    print(response)
    return f"Hello World, from Flask!"

# Fetches trips for a given user_id
@app.route('/trips/<user_id>', methods=['GET'])
def get_user_trips(user_id):
    response = supabase.table('Trip').select('*').eq('user_id', user_id).execute()

    if response.data:
        return jsonify(response.data), 200
    else:
        return jsonify({"error": "No trips found for this user"}), 404

# Deletes a particular trip
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

# Edits a particular trip
@app.route('/edit_trip', methods=['PUT'])
def edit_trip():
    data = request.get_json()

    trip_id = data.get('trip_id')
    trip_name = data.get('trip_name')
    trip_description = data.get('trip_description')
    start_date = data.get('start_date')
    time_updated = data.get('time_updated')

    update_response = (
        supabase.table('Trip')
        .update({
            'trip_name': trip_name,
            'trip_description': trip_description,
            'start_date': start_date,
            'time_updated': time_updated
        })
        .eq('trip_id', trip_id)
        .execute()
    )

    if update_response.data:
        return jsonify({"message": "Trip updated successfully"}), 200
    else:
        return jsonify({"error": "Trip not found or failed to update"}), 404

# Saves a newly created trip
@app.route('/save_trip', methods=['POST'])
def save_trip():
    data = request.get_json()

    user_id = data.get('user_id')
    trip_name = data.get('trip_name')
    trip_description = data.get('trip_description')
    start_date = data.get('start_date')
    time_created = data.get('time_created')

    if not all([user_id, trip_name, trip_description, start_date]):
        return jsonify({"error": "Missing required fields"}), 400
    
    response = supabase.table('Trip').insert({
        'user_id': user_id,
        'trip_name': trip_name,
        'trip_description': trip_description,
        'start_date': start_date,
        'time_created': time_created
    }).execute()

    if response.data:
        return jsonify({"message": "Trip saved successfully"}), 200
    else:
        return jsonify({"error": "Trip not found or failed to update"}), 404

# Fetches experiences that have been added to a trip
@app.route('/trip_experiences/<trip_id>', methods=['GET'])
def get_trip_experiences(trip_id):
    response = supabase.table('Trip_Experience').select('*').eq('trip_id', trip_id).execute()
    response_data = response.data

    # Gets the experience ids for trip-experiences
    experience_ids = []
    for trip_experience in response_data:
        if isinstance(trip_experience, dict) and 'experience_id' in trip_experience:
            experience_ids.append(trip_experience['experience_id'])
    
    if experience_ids:
        experience_data = supabase.table('Experiences').select('*').in_('experience_id', experience_ids).execute()
        if experience_data.data:
            return jsonify(experience_data.data), 200
  
if __name__ == '__main__':
    app.run(debug=True) # enable debug mode 
