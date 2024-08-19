import json
import random
from app import app, db
from models import User, Recipe, Comment

from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def seed_data():
    # Create admin user if not exists
    admin = User.query.filter_by(username="admin").first()
    if not admin:
        hashed_password = bcrypt.generate_password_hash("X9#mK2$pL7@qR3").decode('utf-8')
        admin = User(
            email="admin@tastetribe.com",
            username="admin",
            password=hashed_password,
            firstName="Admin",
            lastName="User",
            title="Administrator",
            aboutMe="I am the admin user.",
            profilePicture="default_admin.jpg",
            is_admin=True
        )
        db.session.add(admin)

    # Load data from db.json
    with open('db.json', 'r') as f:
        data = json.load(f)

    # Add all recipes
    for recipe_data in data['recipes']:
        existing_recipe = Recipe.query.filter_by(title=recipe_data['title']).first()
        if not existing_recipe:
            recipe = Recipe(
                title=recipe_data['title'],
                chefName=recipe_data['chefName'],
                chefImage=recipe_data['chefImage'],
                image=recipe_data['image'],
                ingredients=recipe_data['ingredients'],
                instructions=recipe_data['instructions'],
                url=recipe_data['url'],
                moreInfoUrl=recipe_data['moreInfoUrl'],
                rating=recipe_data['rating'],
                prepTime=recipe_data['prepTime'],
                servings=recipe_data['servings'],
                countryOfOrigin=recipe_data['countryOfOrigin'],
                dietType=recipe_data['dietType']
            )
            db.session.add(recipe)
            
            # Add random comments for each recipe
            num_comments = random.randint(1, 5)
            for _ in range(num_comments):
                comment = Comment(
                    content=random.choice([
                        "Delicious!", "Great recipe!", "Will make again!", 
                        "My family loved it!", "Easy to follow instructions.",
                        "Tasty and quick to prepare!", "A new favorite!",
                        "Impressive dish!", "Perfect for special occasions.",
                        "Healthy and flavorful!"
                    ]),
                    user=admin,
                    recipe=recipe
                )
                db.session.add(comment)

    # Commit changes
    db.session.commit()

    print("Seed data has been added successfully!")

if __name__ == "__main__":
    with app.app_context():
        seed_data()
