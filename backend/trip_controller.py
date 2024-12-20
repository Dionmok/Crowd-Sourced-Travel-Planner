from __main__ import app, supabase
from flask import jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import jwt_required, get_jwt_identity

bcrypt = Bcrypt(app)

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
  