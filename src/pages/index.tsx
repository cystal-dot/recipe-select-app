import { useState, useEffect, useCallback } from 'react';
import RegisterForm from '../components/RegisterForm';
import RecipeList from '../components/RecipeList';
import RandomRecipeSelector from '../components/RandomRecipeSelector';
import { supabase } from '../utils/supabaseClient';

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
        const { data, error } = await supabase.from('recipes').select('*');
        if (error) {
            console.error('Error fetching recipes:', error);
            return;
        }
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
        const { error } = await supabase.from('recipes').delete().eq('id', id);
        if (error) {
            console.error('Error deleting recipe:', error);
        } else {
            const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
            setRecipes(updatedRecipes);
            updateRandomRecipes(updatedRecipes);
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
