// components/RecipeList.tsx
import { useState } from 'react';

interface Recipe {
    name: string;
    category: string;
    ingredients: string[];
}

const RecipeList = ({ recipes, onEdit, onDelete }: { recipes: Recipe[]; onEdit: (recipe: Recipe, index: number) => void; onDelete: (index: number) => void }) => {
    const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);

    const getRandomRecipes = () => {
        const storedRecipes: Recipe[] = JSON.parse(localStorage.getItem('recipes') || '[]');
        const randomRecipes: Recipe[] = [];
        while (randomRecipes.length < 7 && storedRecipes.length > 0) {
            const randomIndex = Math.floor(Math.random() * storedRecipes.length);
            randomRecipes.push(storedRecipes[randomIndex]);
            storedRecipes.splice(randomIndex, 1);
        }
        setRandomRecipes(randomRecipes);
    };

    return (
        <div>
            <h2>レシピ一覧</h2>
            <ul>
                {recipes.length > 0 ? (
                    recipes.map((recipe, index) => (
                        <li key={index}>
                            {recipe.name} - {recipe.category} - {recipe.ingredients.join(', ')}
                            <button onClick={() => onEdit(recipe, index)}>更新</button>
                            <button onClick={() => onDelete(index)}>削除</button>
                        </li>
                    ))
                ) : (
                    <li>レシピがありません。</li>
                )}
            </ul>

            <h2>ランダムレシピ取得</h2>
            <button onClick={getRandomRecipes}>ランダムレシピ取得</button>
            <ul>
                {randomRecipes.map((recipe, index) => (
                    <li key={index}>
                        {recipe.name} - {recipe.category} - {recipe.ingredients.join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeList;