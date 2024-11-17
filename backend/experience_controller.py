from __main__ import app, supabase
from flask import jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import jwt_required, get_jwt_identity

bcrypt = Bcrypt(app)


# Fetches experinces for a given user_id
@app.route('/saved_experiences', methods=['GET'])
@jwt_required()
def get_user_experiences():
    user_id = get_jwt_identity()
    response = supabase.table('Experiences').select('*').eq('user_id', user_id).execute()
    if response.data:
        for experience in response.data:
            ratings = supabase.table('Ratings').select('rating').eq('experience_id', experience['experience_id']).execute()
            if ratings.data:
                ratingsList = []
                for rating in ratings.data:
                    ratingsList.append(int(rating['rating']))
                experience['rating'] = f"{round(sum(ratingsList) / len(ratingsList),1)} ({len(ratingsList)} ratings)"
            else:
                experience['rating'] = "0 (0 ratings)"
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
        print("Existing Keywords", existing_keywords)
        
        # insert a new keyword on Keywords table or retrive existing one, get keyword id 
        updated_keywords = handle_keywords(keywords)

        keywords_to_add = set(updated_keywords) - set(existing_keywords) # add keywords that are not in the existing list
        keywords_to_remove = set(existing_keywords) - set(updated_keywords) # remove keywords that are not in the updated list

        print("Keywords to add", keywords_to_add)
        print("Keywords to remove", keywords_to_remove)
        
        if keywords_to_add:
            keyword_inserts = []
            for keyword_id in keywords_to_add:
                keyword_inserts.append({
                    'experience_id': experience_id,
                    'keyword_id': keyword_id
                })
            print("Inserting into Experience_Keywords", keyword_inserts)
            supabase.table('Experience_Keywords').insert(keyword_inserts).execute()
        
        if keywords_to_remove:
            for keyword_id in keywords_to_remove:
                print("Removing keyword", keyword_id)
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
    # user_id = data.get('user_id')

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
    
# Fetches the experience rating for the current user
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
    ratings = supabase.table('Ratings').select('rating').eq('experience_id', experience_id).execute()

    avg_rating = "0 (0 ratings)"

    if ratings.data:
        ratingsList = []
        for rating in ratings.data:
            ratingsList.append(int(rating['rating']))
        avg_rating = f"{round(sum(ratingsList) / len(ratingsList),1)} ({len(ratingsList)} ratings)"

    return jsonify({'rating': avg_rating}), 200