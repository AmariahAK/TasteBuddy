from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Comment
from schema.schema import CommentSchema

comments = Blueprint('comments', __name__)
comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)

@comments.route("", methods=["GET"])
@jwt_required()
def get_comments():
    comments = Comment.query.all()
    return jsonify(comments_schema.dump(comments)), 200

@comments.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_comment(id):
    comment = Comment.query.get_or_404(id)
    return jsonify(comment_schema.dump(comment)), 200

@comments.route("", methods=["POST"])
@jwt_required()
def create_comment():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_comment = Comment(
        userId=current_user_id,
        recipeId=data["recipeId"],
        content=data["content"]
    )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify(comment_schema.dump(new_comment)), 201

@comments.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_comment(id):
    comment = Comment.query.get_or_404(id)
    data = request.get_json()
    comment.content = data.get("content", comment.content)
    db.session.commit()
    return jsonify(comment_schema.dump(comment)), 200

@comments.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_comment(id):
    comment = Comment.query.get_or_404(id)
    db.session.delete(comment)
    db.session.commit()
    return "", 204

@comments.route("/recipe/<int:recipe_id>", methods=["GET"])
@jwt_required()
def get_recipe_comments(recipe_id):
    recipe_comments = Comment.query.filter_by(recipeId=recipe_id).all()
    return jsonify(comments_schema.dump(recipe_comments)), 200
