from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    firstName = fields.Str()
    lastName = fields.Str()
    title = fields.Str()
    aboutMe = fields.Str()
    profilePicture = fields.Str()

class RecipeSchema(Schema):
    id = fields.Int(dump_only=True)
    chefName = fields.Str(required=True)
    chefImage = fields.Str()
    title = fields.Str(required=True)
    image = fields.Str()
    ingredients = fields.List(fields.Str())
    instructions = fields.List(fields.Str())
    url = fields.Str()
    moreInfoUrl = fields.Str()
    rating = fields.Float()
    prepTime = fields.Str()
    servings = fields.Int()
    countryOfOrigin = fields.Str()
    dietType = fields.Str()
    userId = fields.Int(required=True)

class BookmarkSchema(Schema):
    id = fields.Int(dump_only=True)
    userId = fields.Int(required=True)
    recipeId = fields.Int(required=True)

class LikeSchema(Schema):
    id = fields.Int(dump_only=True)
    userId = fields.Int(required=True)
    recipeId = fields.Int(required=True)

class NotificationSchema(Schema):
    id = fields.Int(dump_only=True)
    userId = fields.Int(required=True)
    message = fields.Str(required=True)
    isRead = fields.Boolean()

class RatingSchema(Schema):
    id = fields.Int(dump_only=True)
    userId = fields.Int(required=True)
    recipeId = fields.Int(required=True)
    rating = fields.Float(required=True)

class CommentSchema(Schema):
    id = fields.Int(dump_only=True)
    userId = fields.Int(required=True)
    recipeId = fields.Int(required=True)
    content = fields.Str(required=True)

class ContactSchema(Schema):
    id = fields.Int(dump_only=True)
    firstName = fields.Str(required=True)
    lastName = fields.Str(required=True)
    email = fields.Email(required=True)
    phoneNumber = fields.Str(required=True)
    inquiryType = fields.Str(required=True)
    message = fields.Str(required=True)
