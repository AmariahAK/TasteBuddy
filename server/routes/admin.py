from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from models import db, User, Recipe, Comment, Bookmark, Like, Rating, Notification
from schema.schema import UserSchema, RecipeSchema, CommentSchema, BookmarkSchema, LikeSchema, RatingSchema, NotificationSchema
from flask_bcrypt import Bcrypt
from functools import wraps
from flask_cors import cross_origin

bcrypt = Bcrypt()
admin = Blueprint('admin', __name__)


@admin.route('/signin', methods=['POST', 'OPTIONS'])
@cross_origin()
def admin_signin():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email, is_admin=True).first()
    
    if user:
        try:
            if bcrypt.check_password_hash(user.password, password):
                access_token = create_access_token(identity=user.id)
                return jsonify(access_token=access_token), 200
            else:
                return jsonify({"message": "Invalid credentials"}), 401
        except ValueError as e:
            print(f"Password verification error: {str(e)}")
            print(f"Stored password hash: {user.password}")
            return jsonify({"message": "An error occurred during authentication"}), 500
    else:
        return jsonify({"message": "User not found or not an admin"}), 404



def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or not user.is_admin:
            return jsonify({"message": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper


@admin.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    users = User.query.all()
    return jsonify(UserSchema(many=True).dump(users)), 200

@admin.route('/recipes', methods=['GET'])
@admin_required
def get_all_recipes():
    recipes = Recipe.query.all()
    return jsonify(RecipeSchema(many=True).dump(recipes)), 200

@admin.route('/recipes', methods=['POST'])
@admin_required
def create_recipe():
    data = request.json
    new_recipe = Recipe(**data)
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify(RecipeSchema().dump(new_recipe)), 201

@admin.route('/comments', methods=['GET'])
@admin_required
def get_all_comments():
    comments = Comment.query.all()
    return jsonify(CommentSchema(many=True).dump(comments)), 200

@admin.route('/comments/<int:comment_id>', methods=['DELETE'])
@admin_required
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comment deleted successfully"}), 200

@admin.route('/bookmarks', methods=['GET'])
@admin_required
def get_all_bookmarks():
    bookmarks = Bookmark.query.all()
    return jsonify(BookmarkSchema(many=True).dump(bookmarks)), 200

@admin.route('/likes', methods=['GET'])
@admin_required
def get_all_likes():
    likes = Like.query.all()
    return jsonify(LikeSchema(many=True).dump(likes)), 200

@admin.route('/ratings', methods=['GET'])
@admin_required
def get_all_ratings():
    ratings = Rating.query.all()
    return jsonify(RatingSchema(many=True).dump(ratings)), 200

@admin.route('/notifications', methods=['GET'])
@admin_required
def get_all_notifications():
    notifications = Notification.query.all()
    return jsonify(NotificationSchema(many=True).dump(notifications)), 200

@admin.route('/statistics', methods=['GET'])
@admin_required
def get_statistics():
    stats = {
        "total_users": User.query.count(),
        "total_recipes": Recipe.query.count(),
        "total_comments": Comment.query.count(),
        "total_bookmarks": Bookmark.query.count(),
        "total_likes": Like.query.count(),
        "total_ratings": Rating.query.count(),
        "total_notifications": Notification.query.count()
    }
    return jsonify(stats), 200
