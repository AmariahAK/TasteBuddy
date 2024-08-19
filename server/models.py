from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin

# metadata = MetaData(
#     naming_convention={
#         "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
#     }
# )

db = SQLAlchemy()


#======================================= USER MODEL =========================================================
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-password', '-notifications.user', '-comments.user', '-recipes.user', '-bookmarks.user', '-likes.user', '-ratings.user')

    id = db.Column(db.Integer, primary_key=True)
    is_admin = db.Column(db.Boolean, default=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    firstName = db.Column(db.String(80), nullable=True)
    lastName = db.Column(db.String(80), nullable=True)
    title = db.Column(db.String(120), nullable=True)
    aboutMe = db.Column(db.Text, nullable=True)
    profilePicture = db.Column(db.String(255), nullable=True)

    bookmarks = db.relationship('Bookmark', back_populates='user', lazy=True, cascade='all, delete-orphan')
    likes = db.relationship('Like', back_populates='user', lazy=True, cascade='all, delete-orphan')
    ratings = db.relationship('Rating', back_populates='user', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', back_populates='user', lazy=True, cascade='all, delete-orphan')
    recipes = db.relationship('Recipe', back_populates='user', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='user', lazy=True, cascade='all, delete-orphan')

    def is_admin_user(self):
        return self.is_admin

    def is_regular_user(self):
        return not self.is_admin
    
    def set_password(self, password):
        self.password = Bcrypt.generate_password_hash(password).decode('utf-8')

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'title': self.title,
            'aboutMe': self.aboutMe,
            'profilePicture': self.profilePicture,
            'is_admin': self.is_admin,
            'recipes': [recipe.to_dict() for recipe in self.recipes],
            'bookmarks': [bookmark.to_dict() for bookmark in self.bookmarks],
            'likes': [like.to_dict() for like in self.likes],
            'ratings': [rating.to_dict() for rating in self.ratings],
            'notifications': [notification.to_dict() for notification in self.notifications],
            'comments': [comment.to_dict() for comment in self.comments],
        }
    
    def __repr__(self):
        return f'<User {self.username}, {self.email}, {self.password}, {self.firstName} >'

    

#======================================= RECIPE MODEL =========================================================

class Recipe(db.Model, SerializerMixin):
    __tablename__ = 'recipes'

    serialize_rules = ('-user', '-bookmarks.recipe', '-likes.recipe', '-ratings.recipe', '-comments.recipe')

    id = db.Column(db.Integer, primary_key=True)
    chefName = db.Column(db.String, nullable=False)
    chefImage = db.Column(db.String, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    image = db.Column(db.String, nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    url = db.Column(db.String)
    moreInfoUrl = db.Column(db.String)
    rating = db.Column(db.Integer, nullable=False)
    prepTime = db.Column(db.String, nullable=False)
    servings = db.Column(db.Integer, nullable=False)
    countryOfOrigin = db.Column(db.String(200), nullable=False)
    dietType = db.Column(db.String(200), nullable=False)

    userId = db.Column(db.Integer, db.ForeignKey("users.id"))

    bookmarks = db.relationship('Bookmark', back_populates='recipe', lazy=True)
    likes = db.relationship('Like', back_populates='recipe', lazy=True)
    ratings = db.relationship('Rating', back_populates='recipe', lazy=True, cascade="all, delete-orphan")
    user = db.relationship('User', back_populates='recipes', lazy=True)
    comments = db.relationship('Comment', back_populates='recipe', lazy=True, cascade='all, delete-orphan')
    
    def add_bookmark(self, user):
        bookmark = Bookmark(userId=user.id, recipeId=self.id)
        db.session.add(bookmark)
        db.session.commit()
    
    def remove_bookmark(self, user):
        bookmark = Bookmark.query.filter_by(userId=user.id, recipeId=self.id).first()
        if bookmark:
            db.session.delete(bookmark)
            db.session.commit()
        
    def add_comment(self, user, content):
        comment = Comment(userId=user.id, recipeId=self.id, content=content)
        db.session.add(comment)
        db.session.commit()
        return comment

    def to_dict(self):
        return {
            'id': self.id,
            'chefName': self.chefName,
            'chefImage': self.chefImage,
            'title': self.title,
            'image': self.image,
            'ingredients': self.ingredients,
            'instructions': self.instructions,
            'url': self.url,
            'moreInfoUrl': self.moreInfoUrl,
            'rating': self.rating,
            'prepTime': self.prepTime,
            'servings': self.servings,
            'countryOfOrigin': self.countryOfOrigin,
            'dietType': self.dietType,
            'bookmarks': [bookmark.to_dict() for bookmark in self.bookmarks],
            'likes': [like.to_dict() for like in self.likes],
            'ratings': [rating.to_dict() for rating in self.ratings],
            'comments': [comment.to_dict() for comment in self.comments],
        }

    
    def __repr__(self):
        return f'<Recipe {self.id}, {self.chefName}, {self.title}, {self.dietType}, {self.countryOfOrigin}, {self.comments}>'
    

#======================================= BOOKMARK MODEL =========================================================

class Bookmark(db.Model, SerializerMixin):

    __tablename__ = 'bookmarks'

    serialize_rules = ('-user.bookmarks', '-recipe.bookmarks')

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipeId = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)

    user = db.relationship('User', back_populates='bookmarks')
    recipe = db.relationship('Recipe', back_populates='bookmarks')

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.userId,
            'recipeId': self.recipeId,
        }
    
    def __repr__(self):
        return f'<Bookmark {self.id}, {self.userId}, {self.recipeId}>'
    

#======================================= LIKE MODEL =========================================================

class Like(db.Model, SerializerMixin):
    __tablename__ = "likes"

    serialize_rules = ('-user.likes', '-recipe.likes')

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipeId = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)

    user = db.relationship('User', back_populates='likes')
    recipe = db.relationship('Recipe', back_populates='likes')

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.userId,
            'recipeId': self.recipeId,
        }
    
    def __repr__ (self):
        return f'<Like {self.id}, {self.userId}, {self.recipeId}>'

    
#======================================= RATING MODEL =========================================================

class Rating(db.Model, SerializerMixin):
    __tablename__ = "ratings"

    serialize_rules = ('-user.ratings', '-recipe.ratings')

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipeId = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)

    user = db.relationship('User', back_populates='ratings')
    recipe = db.relationship('Recipe', back_populates='ratings')

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.userId,
            'recipeId': self.recipeId,
            'rating': self.rating,
        }
    
    def __repr__(self):
        return f'<Rating {self.id}, {self.userId}, {self.recipeId}, {self.rating}>'
    
#======================================= NOTIFICATION MODEL =========================================================

class Notification(db.Model, SerializerMixin):
    __tablename__ = "notifications"

    serialize_rules = ('-user.notifications')

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(200), nullable=False)
    isRead = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='notifications')

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.userId,
            'message': self.message,
            'isRead': self.isRead,
            'timestamp': self.timestamp.isoformat(),
        }
    
    def __repr__(self):
        return f'<Notification {self.id}, {self.message}, {self.timestamp}>'

#======================================= COMMENT MODEL =========================================================

class Comment(db.Model, SerializerMixin):

    __tablename__ = "comments"

    serialize_rules = ('-user.comments', '-recipe.comments')

    id = db.Column(db.Integer, primary_key=True)
    recipeId = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    recipe = db.relationship('Recipe', back_populates='comments')
    user = db.relationship('User', back_populates='comments')

    def to_dict(self):
        return {
            'id': self.id,
            'recipeId': self.recipeId,
            'userId': self.userId,
            'comment': self.content,
            'timestamp': self.timestamp.isoformat(),
        }
 
    def __repr__(self):
        return f'<Comment {self.id}, {self.recipeId}, {self.content}, {self.timestamp}>'


#======================================= CONTACTUS MODEL =========================================================

class Contact(db.Model, SerializerMixin):

    __tablename__ = "contactus"

    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phoneNumber = db.Column(db.String(20), nullable=False)
    inquiryType = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'email': self.email,
            'phoneNumber': self.phoneNumber,
            'inquiryType': self.inquiryType,
            'message': self.message
        }

    def __repr__(self):
        return f'<Contact {self.id}, {self.firstName}, {self.email}, {self.phoneNumber}, {self.inquiryType}, {self.message}>'


