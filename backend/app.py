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
  
# Fetches experinces for a given user_id
@app.route('/experiences/<user_id>', methods=['GET'])
def get_user_experiences(user_id):
    response = supabase.table('Experiences').select('*').eq('user_id', user_id).execute()

    if response.data:
        return jsonify(response.data), 200
    else:
        return jsonify({"error": "No experiences found for this user"}), 404
                        
# insert a new keyword on Keywords table or retrive existing keyword for the experience
def handle_keywords(keywords):
    keyword_ids = []
    for keyword in keywords:
        # check if keyword exists in the Keywords table
        keyword_data = supabase.table('Keywords').select('keyword_id').eq('keyword', keyword).execute()
        if keyword_data.data:
            keyword_ids.append(keyword_data.data[0]['keyword_id']) # append the keyword_id to the list
        else:
            # insert the new keyword into the Keywords table
            keyword_response = supabase.table('Keywords').insert({'keyword': keyword}).execute()
            keyword_ids.append(keyword_response.data[0]['keyword_id']) # append the keyword_id to the list
    return keyword_ids

# Save a newly created Experience
@app.route('/save_experience', methods=['POST'])
def save_experience():
    data = request.get_json()

    user_id = data.get('user_id')
    experience_name = data.get('experience_name')
    description = data.get('description')
    photo = data.get('photo')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    address = data.get('address')
    keywords = data.get('keywords')
    rating = data.get('rating')
    time_created = data.get('time_created')

    if not all([user_id, experience_name, description, photo, latitude, longitude, address, rating, time_created]):
        return jsonify({"error": "Missing required fields"}), 400
    
    response = supabase.table('Experiences').insert({
        'user_id': user_id,
        'experience_name': experience_name,
        'description': description,
        'photo': photo,
        'latitude': latitude,
        'longitude': longitude,
        'address': address,
        'rating': rating,
        'time_created': time_created,
        'published': True
    }).execute()
    experince_id = response.data[0]['experience_id']
    # insert a new keyword on Keywords table or retrive existing keyword for the experience
    keyword_ids = handle_keywords(keywords)

    # insert the experience_id and keyword_id into the Experience_Keywords table
    for keyword_id in keyword_ids:
        keyword_inserts = []
        existing_keyword = supabase.table('Experience_Keywords').select('*').eq('experience_id', experince_id).eq('keyword_id', keyword_id).execute()

        # if link between experience and keyword does not exist, insert it
        if not existing_keyword.data:
            print("inserting keyword")
            keyword_inserts.append({
                'experience_id': experince_id,
                'keyword_id': keyword_id
            })
        if keyword_inserts:
            supabase.table('Experience_Keywords').insert(keyword_inserts).execute()

    if response.data:
        return jsonify({"message": "Experience saved successfully"}), 200
    else:
        return jsonify({"error": "Experience not found or failed to update"}), 404

# Returns list of keyword_ids for a given experience_id
@app.route('/experience_keywords/<experience_id>', methods=['GET'])
def get_experience_keywords(experience_id):
    response = supabase.table('Experience_Keywords').select('keyword_id').eq('experience_id', experience_id).execute()

    if response.data:
        response_data = response.data
        print(response_data)
        # Gets the keyword ids for experience-keywords
        keyword_ids = []
        keyword_values = []
        for item in response_data:
            print(item)
            keyword_id = item['keyword_id']
            print(keyword_id)
            keyword_value = supabase.table('Keywords').select('keyword').eq('keyword_id', item['keyword_id']).execute()
            keyword_ids.append(item['keyword_id'])
            keyword_values.append(keyword_value.data[0]['keyword'])
        return keyword_values
    else:
        return jsonify({"error": "No keywords found for this experience"}), 404
            
# Fetches all keywords
@app.route('/get_keywords', methods=['GET'])
def get_keywords():
    response = supabase.table('Keywords').select('*').execute()
    if response.data:
        return jsonify(response.data), 200
    else:
        return jsonify({"error": "No keywords found"}),

# Edits a particular experience
@app.route('/edit_experience', methods=['PUT'])
def edit_experience():
    data = request.get_json()
    print(data)

    experience_id = data.get('experience_id')
    experience_name = data.get('experience_name')
    description = data.get('description')
    photo = data.get('photo')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    address = data.get('address')
    keywords = data.get('keywords')
    rating = data.get('rating')
    time_updated = data.get('time_updated')

    update_response = (
        supabase.table('Experiences')
        .update({
            'experience_name': experience_name,
            'description': description,
            'photo': photo,
            'latitude': latitude,
            'longitude': longitude,
            'address': address,
            'rating': rating,
            'time_created': time_updated
        })
        .eq('experience_id', experience_id)
        .execute()
    )

    # TODO: update keywords for the experience
    if update_response.data: 
        # keyword_ids = handle_keywords(keywords) # insert a new keyword on Keywords table or retrive existing keyword for the experience
        # for keyword_id in keyword_ids: # insert the experience_id and keyword_id into the Experience_Keywords table
        #     keyword_inserts = []
        #     existing_keyword = supabase.table('Experience_Keywords').select('*').eq('experience_id', experience_id).eq('keyword_id', keyword_id).execute()

        #     # if link between experience and keyword does not exist, insert it
        #     if not existing_keyword.data:
        #         keyword_inserts.append({
        #             'experience_id': experience_id,
        #             'keyword_id': keyword_id
        #         })
        #     if keyword_inserts:
        #         supabase.table('Experience_Keywords').insert(keyword_inserts).execute()

        return jsonify({"message": "Experience updated successfully"}), 200
    else:
        return jsonify({"error": "Experience not found or failed to update"}), 404
    
# Deletes a particular experience
@app.route('/delete_experience', methods=['DELETE'])
def delete_experience():
    data = request.get_json()
    experience_id = data.get('experience_id')
    user_id = data.get('user_id')

    # check if experience is connected to any keywords on Experience_Keywords table
    keyword_response = supabase.table('Experience_Keywords').select('*').eq('experience_id', experience_id).execute() # get all keywords for the experience
    if keyword_response.data:
        print("keywords found", keyword_response.data)    
        supabase.table('Experience_Keywords').delete().eq('experience_id', experience_id).execute()
    
    # delete the experience
    experience = supabase.table('Experiences').select('*').eq('experience_id', experience_id).eq('user_id', user_id). execute()

    if experience.data:
        supabase.table('Experiences').delete().eq('experience_id', experience_id).execute()
        return jsonify({"message": "Experience deleted successfully"}), 200
    else:
        return jsonify({"error": "Experience is not found or is not one of the user's experiences"}), 404
    
if __name__ == '__main__':
    app.run(debug=True) # enable debug mode 
