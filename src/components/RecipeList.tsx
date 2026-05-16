import React from 'react';
import { useState, useEffect } from 'react';

interface Recipe {
    name: string;
    category: string;
    ingredients: string[];
    id?: number;
}

interface RecipeListProps {
    recipes: Recipe[];
    onEdit: (recipe: Recipe, index: number) => void;
    onDelete: (id: number) => void;
    getRandomRecipes: () => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onEdit, onDelete, getRandomRecipes }) => {
    const [showRecipeList, setShowRecipeList] = useState<boolean>(false);

    useEffect(() => {
        if (recipes.length > 0) {
            // レシピが存在する場合のみランダムレシピを取得
            getRandomRecipes();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recipes.length]);

    const toggleRecipeList = () => {
        setShowRecipeList(prev => !prev);
    };

    const handleDelete = (id?: number) => {
        if (id === undefined) return;
        onDelete(id);
    };

    return (
        <div className="recipe-list">
            <button onClick={toggleRecipeList}>
                {showRecipeList ? 'レシピ一覧を閉じる' : 'レシピ一覧を見る'}
            </button>
            {showRecipeList && recipes.length > 0 && (
                <div>
                    <h2>レシピ一覧</h2>
                    <ul>
                        {recipes.map((recipe, index) => (
                            <li key={recipe.id ?? index} className="recipe-item">
                                <h3>{recipe.name}</h3>
                                <p><strong>カテゴリー:</strong> {recipe.category}</p>
                                <p><strong>食材:</strong> {recipe.ingredients.join(', ')}</p>
                                <div className="recipe-actions">
                                    <button onClick={() => {
                                        window.scrollTo(0, 0);
                                        onEdit(recipe, index);
                                    }}>更新</button>
                                    <button onClick={() => handleDelete(recipe.id)}>削除</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RecipeList;
