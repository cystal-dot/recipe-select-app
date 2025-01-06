import { useState, useEffect } from 'react';
import RegisterForm from '../components/RegisterForm';
import RecipeList from '../components/RecipeList';

interface Recipe {
    name: string;
    category: string;
    ingredients: string[];
    index?: number;
}

const Home = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);

    useEffect(() => {
        const storedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        setRecipes(storedRecipes);
    }, []);

    const handleEdit = (recipe: Recipe, index: number) => {
        setRecipeToEdit({ ...recipe, index });
    };

    const handleCancelEdit = () => {
        setRecipeToEdit(null);
    };

    const handleDelete = (index: number) => {
        const updatedRecipes = recipes.filter((_, i) => i !== index);
        setRecipes(updatedRecipes);
        localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    };

    const refreshRecipes = () => {
        const storedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        setRecipes(storedRecipes);
    };

    return (
        <div>
            <h1>料理セレクトアプリ</h1>
            <RegisterForm recipeToEdit={recipeToEdit} onCancel={handleCancelEdit} refreshRecipes={refreshRecipes} />
            <RecipeList 
                recipes={recipes} 
                onEdit={(recipe, index) => handleEdit(recipe, index)} 
                onDelete={(index) => handleDelete(index)}
            />
        </div>
    );
};

export default Home;
