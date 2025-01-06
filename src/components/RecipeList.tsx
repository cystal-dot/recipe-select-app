import { useState, useEffect } from 'react';

interface Recipe {
    name: string;
    category: string;
    ingredients: string[];
}

interface RecipeListProps {
    recipes: Recipe[];
    onEdit: (recipe: Recipe, index: number) => void;
    onDelete: (index: number) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onEdit, onDelete }) => {
    const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        // レシピが変更されたときにランダムレシピを取得
        getRandomRecipes();
    }, [recipes]);

    const getRandomRecipes = () => {
        const shuffledRecipes = [...recipes];
        for (let i = shuffledRecipes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledRecipes[i], shuffledRecipes[j]] = [shuffledRecipes[j], shuffledRecipes[i]];
        }
        // ランダムに最大7つのレシピを取得
        setRandomRecipes(shuffledRecipes.slice(0, 7));
    };

    return (
        <div className="recipe-list">
            <h2>レシピ一覧</h2>
            {recipes.length > 0 ? (
                <ul>
                    {recipes.map((recipe, index) => (
                        <li key={index} className="recipe-item">
                            <h3>{recipe.name}</h3>
                            <p><strong>カテゴリー:</strong> {recipe.category}</p>
                            <p><strong>食材:</strong> {recipe.ingredients.join(', ')}</p>
                            <div className="recipe-actions">
                                <button onClick={() => onEdit(recipe, index)}>更新</button>
                                <button onClick={() => onDelete(index)}>削除</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>レシピがありません。</p>
            )}

            <h2>ランダムレシピ取得</h2>
            <button onClick={getRandomRecipes}>ランダムレシピ取得</button>
            {randomRecipes.length > 0 && (
                <ul>
                    {randomRecipes.map((recipe, index) => (
                        <li key={index} className="random-recipe-item">
                            <h3>{recipe.name}</h3>
                            <p><strong>カテゴリー:</strong> {recipe.category}</p>
                            <p><strong>食材:</strong> {recipe.ingredients.join(', ')}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecipeList;
