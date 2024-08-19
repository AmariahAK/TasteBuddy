from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Recipe
from schema.schema import RecipeSchema

recipes = Blueprint('recipes', __name__)
recipe_schema = RecipeSchema()
recipes_schema = RecipeSchema(many=True)


@recipes.route("", methods=["GET"])
@jwt_required()
def get_recipes():
    diet_type = request.args.get('dietType')
    if diet_type:
        recipes = Recipe.query.filter_by(dietType=diet_type).all()
    else:
        recipes = Recipe.query.all()
    return jsonify(recipes_schema.dump(recipes)), 200



@recipes.route("/<int:id>", methods=["GET"])
def get_recipe(id):
    recipe = Recipe.query.get_or_404(id)
    return jsonify(recipe_schema.dump(recipe)), 200

@recipes.route("", methods=["POST"])
@jwt_required()
def create_recipe():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_recipe = Recipe(
        chefName=data["chefName"],
        chefImage=data["chefImage"],
        title=data["title"],
        image=data["image"],
        ingredients=data["ingredients"],
        instructions=data["instructions"],
        url=data["url"],
        moreInfoUrl=data["moreInfoUrl"],
        rating=data["rating"],
        prepTime=data["prepTime"],
        servings=data["servings"],
        countryOfOrigin=data["countryOfOrigin"],
        dietType=data["dietType"],
        userId=current_user_id
    )
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify(recipe_schema.dump(new_recipe)), 201

@recipes.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_recipe(id):
    recipe = Recipe.query.get_or_404(id)
    data = request.get_json()
    
    recipe.chefName = data.get("chefName", recipe.chefName)
    recipe.chefImage = data.get("chefImage", recipe.chefImage)
    recipe.title = data.get("title", recipe.title)
    recipe.image = data.get("image", recipe.image)
    recipe.ingredients = data.get("ingredients", recipe.ingredients)
    recipe.instructions = data.get("instructions", recipe.instructions)
    recipe.url = data.get("url", recipe.url)
    recipe.moreInfoUrl = data.get("moreInfoUrl", recipe.moreInfoUrl)
    recipe.rating = data.get("rating", recipe.rating)
    recipe.prepTime = data.get("prepTime", recipe.prepTime)
    recipe.servings = data.get("servings", recipe.servings)
    recipe.countryOfOrigin = data.get("countryOfOrigin", recipe.countryOfOrigin)
    recipe.dietType = data.get("dietType", recipe.dietType)

    db.session.commit()
    return jsonify(recipe_schema.dump(recipe)), 200

@recipes.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_recipe(id):
    recipe = Recipe.query.get_or_404(id)
    db.session.delete(recipe)
    db.session.commit()
    return jsonify({"message": "Recipe deleted successfully"}), 200

@recipes.route("/user", methods=["GET"])
@jwt_required()
def get_user_recipes():
    current_user_id = get_jwt_identity()
    user_recipes = Recipe.query.filter_by(userId=current_user_id).all()
    return jsonify(recipes_schema.dump(user_recipes)), 200

@recipes.route("/featured", methods=["GET"])
def get_featured_recipes():
    featured_recipes = Recipe.query.filter_by(featured=True).limit(5).all()
    return jsonify(recipes_schema.dump(featured_recipes)), 200

