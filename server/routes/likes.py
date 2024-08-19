from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Like
from schema.schema import LikeSchema

likes = Blueprint('likes', __name__)
like_schema = LikeSchema()
likes_schema = LikeSchema(many=True)

@likes.route("", methods=["GET"])
@jwt_required()
def get_likes():
    likes = Like.query.all()
    return jsonify(likes_schema.dump(likes)), 200

@likes.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_like(id):
    like = Like.query.get_or_404(id)
    return jsonify(like_schema.dump(like)), 200

@likes.route("", methods=["POST"])
@jwt_required()
def create_like():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_like = Like(userId=current_user_id, recipeId=data["recipeId"])
    db.session.add(new_like)
    db.session.commit()
    return jsonify(like_schema.dump(new_like)), 201

@likes.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_like(id):
    like = Like.query.get_or_404(id)
    db.session.delete(like)
    db.session.commit()
    return "", 204

@likes.route("/user", methods=["GET"])
@jwt_required()
def get_user_likes():
    current_user_id = get_jwt_identity()
    user_likes = Like.query.filter_by(userId=current_user_id).all()
    return jsonify(likes_schema.dump(user_likes)), 200

@likes.route("/recipe/<int:recipe_id>", methods=["GET"])
@jwt_required()
def get_recipe_likes(recipe_id):
    recipe_likes = Like.query.filter_by(recipeId=recipe_id).all()
    return jsonify(likes_schema.dump(recipe_likes)), 200
