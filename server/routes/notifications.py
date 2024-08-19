from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification
from schema.schema import NotificationSchema

notifications = Blueprint('notifications', __name__)
notification_schema = NotificationSchema()
notifications_schema = NotificationSchema(many=True)

@notifications.route("", methods=["GET"])
@jwt_required()
def get_notifications():
    notifications = Notification.query.all()
    return jsonify(notifications_schema.dump(notifications)), 200

@notifications.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_notification(id):
    notification = Notification.query.get_or_404(id)
    return jsonify(notification_schema.dump(notification)), 200

@notifications.route("", methods=["POST"])
@jwt_required()
def create_notification():
    data = request.get_json()
    new_notification = Notification(
        userId=data["userId"],
        message=data["message"],
        isRead=data.get("isRead", False)
    )
    db.session.add(new_notification)
    db.session.commit()
    return jsonify(notification_schema.dump(new_notification)), 201

@notifications.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_notification(id):
    notification = Notification.query.get_or_404(id)
    data = request.get_json()
    notification.message = data.get("message", notification.message)
    notification.isRead = data.get("isRead", notification.isRead)
    db.session.commit()
    return jsonify(notification_schema.dump(notification)), 200

@notifications.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_notification(id):
    notification = Notification.query.get_or_404(id)
    db.session.delete(notification)
    db.session.commit()
    return "", 204

@notifications.route("/user", methods=["GET"])
@jwt_required()
def get_user_notifications():
    current_user_id = get_jwt_identity()
    user_notifications = Notification.query.filter_by(userId=current_user_id).all()
    return jsonify(notifications_schema.dump(user_notifications)), 200
