from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from supabase import create_client, Client
from dotenv import load_dotenv 
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import re, datetime, os
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
bcrypt = Bcrypt(app)

# Allow CORS for all origins
CORS(app)

############ USER CONTROLLER ############

@app.route("/create-account", methods=["POST"])
def create_account():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    confirm_password = request.json.get("confirm_password", None)

    # Validate user input
    inputErrors = []
    if len(username) < 4 or len(username) > 16:
        inputErrors.append("Username must be between 4 & 16 characters long")
    if not re.search(r"^[A-Za-z0-9]+$", username):
        inputErrors.append(
            "Username must only contain letters and/or numbers (A-Z, a-z, 0-9)"
        )
    if not re.search(r"[A-Z]+", password):
        inputErrors.append("Password must contain at least one uppercase letter (A-Z)")
    if not re.search(r"[a-z]+", password):
        inputErrors.append("Password must contain at least one lowercase letter (a-z)")
    if not re.search(r"\d+", password):
        inputErrors.append("Password must contain at least one number (0-9)")
    if not re.search(r"[~!@#$%^&*=+.?]+", password):
        inputErrors.append(
            "Password must contain at least one special character ~!@#$%^&*=+.?"
        )
    if len(password) < 8 or len(password) > 256:
        inputErrors.append("Password must be between 8 & 256 characters long")
    if password != confirm_password:
        inputErrors.append("Password and Confirm Password do not match")

    # If user input is invalid, send error response
    if len(inputErrors) > 0:
        return jsonify({"errors": inputErrors}), 400

    # If username is already taken, send error response
    response = (
        supabase.table("Users").select("username").eq("username", username).execute()
    )
    if response.data:
        return jsonify({"errors": ["Username taken"]}), 400

    # Hash user's password and store new user credentials in DB
    pw_hash = bcrypt.generate_password_hash(password)

    response = (
        supabase.table("Users")
        .insert({"username": username, "password": pw_hash.decode()})
        .execute()
    )

    if response.data:
        return jsonify({"msg": "User created successfully"}), 200
    else:
        return jsonify({"errors": ["Failed to create user"]}), 400


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    response = supabase.table("Users").select("*").eq("username", username).execute()

    # Return error if username doesn't exist
    if not response.data:
        return jsonify({"errors": ["Invalid username or password"]}), 401

    # Return error if incorrect password
    if not bcrypt.check_password_hash(response.data[0]["password"], password):
        return jsonify({"errors": ["Invalid username or password"]}), 401

    # Generate JWT and send to frontend
    access_token = create_access_token(
        identity=response.data[0]["user_id"],
        expires_delta=datetime.timedelta(days=7),
        additional_claims={"username": response.data[0]["username"]},
    )
    return jsonify(access_token=access_token)


############ TRIP CONTROLLER ############

# Fetches trips for a given user_id
@app.route('/trips', methods=['GET'])
@jwt_required()
def get_user_trips():
    user_id = get_jwt_identity()
    response = supabase.table('Trip').select('*').eq('user_id', user_id).execute()

    if response.data:
        return jsonify(response.data), 200
    else:
        return jsonify([]), 200

# Deletes a particular trip
@app.route('/delete_trip', methods=['DELETE'])
@jwt_required()
def delete_trip():
    user_id = get_jwt_identity()
    data = request.get_json()
    trip_id = data.get('trip_id')

    trip = supabase.table('Trip').select('*').eq('trip_id', trip_id).eq('user_id', user_id). execute()

    if trip.data:
        experiences = supabase.table('Trip_Experience').delete().eq('trip_id', trip_id).execute()
        if experiences.data:
            supabase.table('Trip_Experience').delete().eq('trip_id', trip_id).execute()
        supabase.table('Trip').delete().eq('trip_id', trip_id).execute()
        return jsonify({"message": "Trip deleted successfully"}), 200
    else:
        return jsonify({"error": "Trip is not found or is not one of the user's trips"}), 404

# Edits a particular trip
@app.route('/edit_trip', methods=['PUT'])
@jwt_required()
def edit_trip():
    user_id = get_jwt_identity()
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
        .eq('user_id', user_id)
        .execute()
    )

    if update_response.data:
        return jsonify({"message": "Trip updated successfully"}), 200
    else:
        return jsonify({"error": "Trip not found or failed to update"}), 404

# Saves a newly created trip
@app.route('/save_trip', methods=['POST'])
@jwt_required()
def save_trip():
    user_id = get_jwt_identity()
    data = request.get_json()

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
@jwt_required()
def get_trip_experiences(trip_id):
    user_id = get_jwt_identity()
    response = supabase.table('Trip_Experience').select('*, Trip(user_id)').eq('trip_id', trip_id).eq('Trip.user_id', user_id).execute()
    response_data = response.data

    # Gets the experience ids for trip-experiences
    experience_ids = []
    for trip_experience in response_data:
        if isinstance(trip_experience, dict) and 'experience_id' in trip_experience:
            experience_ids.append(trip_experience['experience_id'])
    
    if experience_ids:
        experience_data = supabase.table('Experiences').select('*').in_('experience_id', experience_ids).execute()
        if experience_data.data:
            # Get ratings for all trip-experiences
            for experience in experience_data.data:
                ratings = supabase.table('Ratings').select('rating').eq('experience_id', experience['experience_id']).execute()

                if ratings.data:
                    ratingsList = []
                    for rating in ratings.data:
                        ratingsList.append(int(rating['rating']))
                    experience['rating'] = f"{round(sum(ratingsList) / len(ratingsList),1)} ({len(ratingsList)} ratings)"
                else:
                    experience['rating'] = "0 (0 ratings)"

            return jsonify(experience_data.data), 200
        else:
          return jsonify([]), 200
    else:
      return jsonify([]), 200 

# Removes an experience from a trip
@app.route('/trip/<int:trip_id>/experience/<int:experience_id>', methods=['DELETE'])
@jwt_required()
def delete_experience_from_trip(trip_id, experience_id):
    user_id = get_jwt_identity()
    trip_experience = supabase.from_('Trip_Experience').select('*, Trip(user_id)').eq('trip_id', trip_id).eq('experience_id', experience_id).eq('Trip.user_id', user_id).execute()
    
    if trip_experience.data:
        supabase.from_('Trip_Experience').delete().eq('trip_id', trip_id).eq('experience_id', experience_id).execute()
        return jsonify({"message": "Experience removed from trip successfully"}), 200
    else:
        return jsonify({"error": "Experience not found in trip"}), 404
  

############ SEARCH CONTROLLER ############

@app.route('/experiences', methods=['GET'])
def search_experiences():
    location = request.args.get('location', '').strip()
    keywords = request.args.get('keywords', '').strip().lower().split(',')

    query = supabase.table('Experiences').select('*').eq('published', True)
    if location:
        query = query.ilike('address', f"%{location}%")

    if keywords and keywords[0]:
        keyword_ids_response = supabase.table('Keywords').select('keyword_id').in_('keyword', keywords).execute()

        if not keyword_ids_response.data:
            return jsonify({"error": "No experiences found matching the keywords"}), 404

        keyword_ids = [item['keyword_id'] for item in keyword_ids_response.data]
        experience_ids_response = supabase.table('Experience_Keywords').select('experience_id').in_('keyword_id', keyword_ids).execute()

        if not experience_ids_response.data:
            return jsonify({"error": "No experiences found matching the keywords"}), 404

        experience_ids = [item['experience_id'] for item in experience_ids_response.data]
        query = query.in_('experience_id', experience_ids)

    response = query.execute()

    if response.data:
        for experience in response.data:
            ratings = supabase.table('Ratings').select('rating').eq('experience_id', experience['experience_id']).execute()
            if ratings.data:
                ratings_list = [int(rating['rating']) for rating in ratings.data]
                experience['rating'] = f"{round(sum(ratings_list) / len(ratings_list),1)} ({len(ratings_list)} ratings)"
            else:
                experience['rating'] = "0 (0 ratings)"
        return jsonify(response.data), 200
    else:
        return jsonify({"error": "No experiences found"}), 404


############ EXPERIENCE CONTROLLER ############

# Fetches experinces for a given user_id
@app.route('/saved_experiences', methods=['GET'])
@jwt_required()
def get_user_experiences():
    user_id = get_jwt_identity()
    response = supabase.table('Experiences').select('*').eq('user_id', user_id).execute()
    if response.data:
        for experience in response.data:
            experience['rating'] = get_average_rating(experience['experience_id'])
        return jsonify(response.data), 200
    else:
        return jsonify({"error": "No experiences found for this user"}), 404
                        
def handle_keywords(keywords):
    """
    Given a list of keywords value(s), checks if Keyword already exists in Keyword Table, if not, inserts into Keywords Table
    Returns list of keyword id(s)
    """
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
@jwt_required()
def save_experience():
    data = request.get_json()
    user_id = get_jwt_identity()
    # user_id = data.get('user_id')
    experience_name = data.get('experience_name')
    description = data.get('description')
    photo = data.get('photo')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    address = data.get('address')
    keywords = data.get('keywords')
    time_created = data.get('time_created')

    if not all([user_id, experience_name, description, photo, latitude, longitude, address, time_created]):
        return jsonify({"error": "Missing required fields"}), 400
    
    response = supabase.table('Experiences').insert({
        'user_id': user_id,
        'experience_name': experience_name,
        'description': description,
        'photo': photo,
        'latitude': latitude,
        'longitude': longitude,
        'address': address,
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
        # Gets the keyword ids for experience-keywords
        keyword_ids = []
        keyword_values = []
        for item in response_data:
            keyword_id = item['keyword_id']
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

# get keyword ids of an expeience
def get_experience_keywords_ids(experience_id):
    """
    Returns a list of keyword IDs for a given experience id.
    """
    response = supabase.table('Experience_Keywords').select('keyword_id').eq('experience_id', experience_id).execute()
    if response.data:
        keyword_ids = []
        for item in response.data:
            keyword_ids.append(item['keyword_id'])
        return keyword_ids
    else:
        return jsonify({"error": "No keywords found for this experience"}), 404
    
# Edits a particular experience
@app.route('/edit_experience', methods=['PUT'])
@jwt_required()
def edit_experience():
    user_id = get_jwt_identity()
    data = request.get_json()

    experience_id = data.get('experience_id')
    experience_name = data.get('experience_name')
    description = data.get('description')
    photo = data.get('photo')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    address = data.get('address')
    keywords = data.get('keywords')
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
            'time_created': time_updated
        })
        .eq('experience_id', experience_id)
        .eq('user_id', user_id)
        .execute()
    )

    # update keywords for the experience
    if update_response.data: 
        existing_keywords = get_experience_keywords_ids(experience_id)
        
        # insert a new keyword on Keywords table or retrive existing one, get keyword id 
        updated_keywords = handle_keywords(keywords)

        keywords_to_add = set(updated_keywords) - set(existing_keywords) # add keywords that are not in the existing list
        keywords_to_remove = set(existing_keywords) - set(updated_keywords) # remove keywords that are not in the updated list
        
        if keywords_to_add:
            keyword_inserts = []
            for keyword_id in keywords_to_add:
                keyword_inserts.append({
                    'experience_id': experience_id,
                    'keyword_id': keyword_id
                })
            supabase.table('Experience_Keywords').insert(keyword_inserts).execute()
        
        if keywords_to_remove:
            for keyword_id in keywords_to_remove:
                supabase.table('Experience_Keywords').delete().eq('experience_id', experience_id).eq('keyword_id', keyword_id).execute()

        return jsonify({"message": "Experience updated successfully"}), 200
    else:
        return jsonify({"error": "Experience not found or failed to update"}), 404
    
# Deletes a particular experience
@app.route('/delete_experience', methods=['DELETE'])
@jwt_required()
def delete_experience():
    data = request.get_json()
    experience_id = data.get('experience_id')
    user_id = get_jwt_identity()

    # check if experience is connected to any keywords on Experience_Keywords table
    keyword_response = supabase.table('Experience_Keywords').select('*').eq('experience_id', experience_id).execute() # get all keywords for the experience
    if keyword_response.data:
        supabase.table('Experience_Keywords').delete().eq('experience_id', experience_id).execute()
    
    # check if experience is connected to any trips on Trip_Experience table
    trip_response = supabase.table('Trip_Experience').select('*').eq('experience_id', experience_id).execute() # get all trips for the experience
    if trip_response.data:
        supabase.table('Trip_Experience').delete().eq('experience_id', experience_id).execute()
    
    # check if experience is connected to any ratings on Ratings table
    rating_response = supabase.table('Ratings').select('*').eq('experience_id', experience_id).execute() # get all ratings for the experience
    if rating_response.data:
        supabase.table('Ratings').delete().eq('experience_id', experience_id).execute()
    
    # delete the experience
    experience = supabase.table('Experiences').select('*').eq('experience_id', experience_id).eq('user_id', user_id). execute()

    if experience.data:
        supabase.table('Experiences').delete().eq('experience_id', experience_id).execute()
        return jsonify({"message": "Experience deleted successfully"}), 200
    else:
        return jsonify({"error": "Experience is not found or is not one of the user's experiences"}), 404
    

# Adds Experience to a users Trip 
@app.route('/add_to_trip', methods=['POST'])
@jwt_required()
def add_to_trip():
    data = request.get_json()
    experience_id = data.get('experience_id')
    trip_id = data.get('trip_id')
    user_id = get_jwt_identity()

    if not all([experience_id, trip_id]):
        return jsonify({"error": "Missing required fields"}), 400
    
    # check if the user is the owner of the trip
    trip_response = supabase.table('Trip').select('user_id').eq('trip_id', trip_id).execute()
    if trip_response.data:
        if trip_response.data[0]['user_id'] != user_id:
            return jsonify({"error": "You are not the owner of the trip"}), 400
    else:
        return jsonify({"error": "Trip not found"}), 404

    response = supabase.table('Trip_Experience').insert({
        'experience_id': experience_id,
        'trip_id': trip_id,
    }).execute()

    if response.data:
        return jsonify({"message": "Experience added to trip successfully"}), 200
    else:
        return jsonify({"error": "Failed to add experience to trip"}), 404# Fetches the experience rating for the current user
@app.route('/experience_user_rating/<experience_id>', methods=['GET'])
@jwt_required()
def get_experience_user_rating(experience_id):
    user_id = get_jwt_identity()

    rating = supabase.table('Ratings').select('rating').eq('experience_id', experience_id).eq('user_id', user_id).execute()

    if rating.data:
        return jsonify({'user_rating': rating.data[0]['rating']}), 200
    else:
        return jsonify({'user_rating': ''}), 200
    
# Sets the users rating for a particular experience
@app.route('/rate_experience', methods=['POST'])
@jwt_required()
def rate_experience():
    user_id = get_jwt_identity()
    experience_id = request.json.get("experience_id", None)
    user_rating = request.json.get("user_rating", None)

    rating = supabase.table('Ratings').select('rating').eq('experience_id', experience_id).eq('user_id', user_id).execute()

    if user_rating == '':
        supabase.table('Ratings').delete().eq('experience_id', experience_id).eq('user_id', user_id).execute()
        return jsonify({'message': 'Rating deleted successfully'}), 200
    elif len(rating.data) > 0:
        supabase.table('Ratings').update({'rating': user_rating}).eq('experience_id', experience_id).eq('user_id', user_id).execute()
        return jsonify({'message': 'Rating updated successfully'}), 200
    else:
        supabase.table('Ratings').insert({'user_id': user_id, 'experience_id': experience_id, 'rating': user_rating}).execute()
        return jsonify({'message': 'Rating created successfully'}), 200

# Fetches the current rating for a particular experience
@app.route('/experience_rating/<experience_id>', methods=['GET'])
def get_experience_rating(experience_id):
    avg_rating = get_average_rating(experience_id)

    return jsonify({'rating': avg_rating}), 200

# Calculates and returns the average rating and number of ratings of the given experience
def get_average_rating(experience_id):
    ratings = supabase.table('Ratings').select('rating').eq('experience_id', experience_id).execute()

    if ratings.data:
        ratingsList = []
        for rating in ratings.data:
            ratingsList.append(int(rating['rating']))
        return f"{round(sum(ratingsList) / len(ratingsList),1)} ({len(ratingsList)} ratings)"
    else:
        return "0 (0 ratings)"

if __name__ == '__main__':
    app.run(port=5000) # enable debug mode 
