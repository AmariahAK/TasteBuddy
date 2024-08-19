from flask import Blueprint, request, jsonify
from models import db, Contact
from schema.schema import ContactSchema

contact = Blueprint('contact', __name__)
contact_schema = ContactSchema()

@contact.route("", methods=["POST"])
def submit_contact():
    data = request.get_json()
    
    new_contact = Contact(
        firstName=data["firstName"],
        lastName=data["lastName"],
        email=data["email"],
        phoneNumber=data["phoneNumber"],
        inquiryType=data["inquiryType"],
        message=data["message"]
    )
    
    db.session.add(new_contact)
    db.session.commit()
    
    return jsonify({"message": "Message received!"}), 201

@contact.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad request", "message": str(error)}), 400

@contact.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error", "message": str(error)}), 500
