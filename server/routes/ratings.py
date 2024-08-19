from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Rating
from schema.schema import RatingSchema

ratings = Blueprint('ratings', __name__)
rating_schema = RatingSchema()
ratings_schema = RatingSchema(many=True)

@ratings.route("", methods=["GET"])
@jwt_required()
def get_ratings():
    ratings = Rating.query.all()
    return jsonify(ratings_schema.dump(ratings)), 200

@ratings.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_rating(id):
    rating = Rating.query.get_or_404(id)
    return jsonify(rating_schema.dump(rating)), 200

@ratings.route("", methods=["POST"])
@jwt_required()
def create_rating():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_rating = Rating(
        userId=current_user_id,
        recipeId=data["recipeId"],
        rating=data["rating"]
    )
    db.session.add(new_rating)
    db.session.commit()
    return jsonify(rating_schema.dump(new_rating)), 201

@ratings.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_rating(id):
    rating = Rating.query.get_or_404(id)
    data = request.get_json()
    rating.rating = data.get("rating", rating.rating)
    db.session.commit()
    return jsonify(rating_schema.dump(rating)), 200

@ratings.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_rating(id):
    rating = Rating.query.get_or_404(id)
    db.session.delete(rating)
    db.session.commit()
    return "", 204

@ratings.route("/recipe/<int:recipe_id>", methods=["GET"])
@jwt_required()
def get_recipe_ratings(recipe_id):
    recipe_ratings = Rating.query.filter_by(recipeId=recipe_id).all()
    return jsonify(ratings_schema.dump(recipe_ratings)), 200

@ratings.route("/user", methods=["GET"])
@jwt_required()
def get_user_ratings():
    current_user_id = get_jwt_identity()
    user_ratings = Rating.query.filter_by(userId=current_user_id).all()
    return jsonify(ratings_schema.dump(user_ratings)), 200
