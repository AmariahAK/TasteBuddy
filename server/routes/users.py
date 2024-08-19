from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User
from schema.schema import UserSchema

users = Blueprint('users', __name__)
user_schema = UserSchema()
users_schema = UserSchema(many=True)

@users.route("", methods=["POST"])
def create_user():
    data = request.get_json()
    new_user = User(
        username=data["username"],
        email=data["email"],
        password=data["password"]
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": "User created successfully"}), 201

@users.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user_schema.dump(user)), 200

@users.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()

    user.username = data.get("username", user.username)
    user.firstName = data.get("firstName", user.firstName)
    user.lastName = data.get("lastName", user.lastName)
    user.title = data.get("title", user.title)
    user.aboutMe = data.get("aboutMe", user.aboutMe)
    user.profilePicture = data.get("profilePicture", user.profilePicture)

    db.session.commit()
    return jsonify(user_schema.dump(user)), 200

@users.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

@users.route("/current", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user:
        return jsonify(user_schema.dump(current_user)), 200
    else:
        return jsonify({"error": "User not found"}), 404
