import { useState, useEffect, useCallback } from 'react';
import RegisterForm from '../components/RegisterForm';
import RecipeList from '../components/RecipeList';
import RandomRecipeSelector from '../components/RandomRecipeSelector';

interface Recipe {
    name: string;
    category: string;
    ingredients: string[];
    id?: number;
}

const Home = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
    const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);

    const fetchRecipes = useCallback(async () => {
        const response = await fetch('/api/recipes');
        const data = await response.json();
        setRecipes(data.reverse());
        updateRandomRecipes(data);
    }, []);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const updateRandomRecipes = (allRecipes: Recipe[]) => {
        const shuffledRecipes = [...allRecipes].sort(() => Math.random() - 0.5);
        setRandomRecipes(shuffledRecipes.slice(0, 7));
    };

    const handleEdit = (recipe: Recipe) => {
        setRecipeToEdit(recipe);
    };

    const handleCancelEdit = () => {
        setRecipeToEdit(null);
    };

    const handleDelete = async (id: number) => {
        const response = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
        if (response.ok) {
            const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
            setRecipes(updatedRecipes);
            updateRandomRecipes(updatedRecipes);
        } else {
            console.error('Error deleting recipe');
        }
    };

    const refreshRecipes = async () => {
        await fetchRecipes();
    };

    return (
        <div>
            <h1>ご飯を考えてもらおう！！</h1>
            <RegisterForm recipeToEdit={recipeToEdit} onCancel={handleCancelEdit} refreshRecipes={refreshRecipes} />
            <RecipeList 
                recipes={recipes} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                getRandomRecipes={() => updateRandomRecipes(recipes)}
            />
            <RandomRecipeSelector 
                onSelectRandomRecipes={() => updateRandomRecipes(recipes)} 
                randomRecipes={randomRecipes} 
            />
        </div>
    );
};

export default Home;
