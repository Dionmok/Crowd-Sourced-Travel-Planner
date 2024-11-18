from __main__ import app, supabase
from flask import request, jsonify

@app.route('/experiences', methods=['GET'])
def search_experiences():
    location = request.args.get('location', '').strip()
    keywords = request.args.get('keywords', '').strip().split(',')

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
                ratingsList = []
                for rating in ratings.data:
                    ratingsList.append(int(rating['rating']))
                experience['rating'] = f"{round(sum(ratingsList) / len(ratingsList),1)} ({len(ratingsList)} ratings)"
            else:
                experience['rating'] = "0 (0 ratings)"
        return jsonify(response.data), 200
    else:
        return jsonify({"error": "No experiences found"}), 404