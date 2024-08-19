from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Bookmark
from schema.schema import BookmarkSchema

bookmarks = Blueprint('bookmarks', __name__)
bookmark_schema = BookmarkSchema()
bookmarks_schema = BookmarkSchema(many=True)

@bookmarks.route("", methods=["GET"])
@jwt_required()
def get_bookmarks():
    bookmarks = Bookmark.query.all()
    return jsonify(bookmarks_schema.dump(bookmarks)), 200

@bookmarks.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_bookmark(id):
    bookmark = Bookmark.query.get_or_404(id)
    return jsonify(bookmark_schema.dump(bookmark)), 200

@bookmarks.route("", methods=["POST"])
@jwt_required()
def create_bookmark():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_bookmark = Bookmark(userId=current_user_id, recipeId=data["recipeId"])
    db.session.add(new_bookmark)
    db.session.commit()
    return jsonify(bookmark_schema.dump(new_bookmark)), 201

@bookmarks.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_bookmark(id):
    bookmark = Bookmark.query.get_or_404(id)
    data = request.get_json()
    bookmark.recipeId = data.get("recipeId", bookmark.recipeId)
    db.session.commit()
    return jsonify(bookmark_schema.dump(bookmark)), 200

@bookmarks.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_bookmark(id):
    bookmark = Bookmark.query.get_or_404(id)
    db.session.delete(bookmark)
    db.session.commit()
    return "", 204

@bookmarks.route("/user", methods=["GET"])
@jwt_required()
def get_user_bookmarks():
    current_user_id = get_jwt_identity()
    user_bookmarks = Bookmark.query.filter_by(userId=current_user_id).all()
    return jsonify(bookmarks_schema.dump(user_bookmarks)), 200
