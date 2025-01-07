import React from 'react';

interface Recipe {
    name: string;
    category: string;
    ingredients: string[];
}

interface RandomRecipeSelectorProps {
    onSelectRandomRecipes: () => void;
    randomRecipes: Recipe[];
}

const RandomRecipeSelector: React.FC<RandomRecipeSelectorProps> = ({ onSelectRandomRecipes, randomRecipes }) => {
    return (
        <div>
            <button onClick={onSelectRandomRecipes}>ランダムに7つの料理を選ぶ</button>
            <h2>選ばれた料理</h2>
            {randomRecipes.length > 0 ? (
                <ul>
                    {randomRecipes.map((recipe, index) => (
                        <li key={index}>
                            <h3>{recipe.name}</h3>
                            <p><strong>カテゴリー:</strong> {recipe.category}</p>
                            <p><strong>食材:</strong> {recipe.ingredients.join(', ')}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>レシピが選ばれていません。</p>
            )}
        </div>
    );
};

export default RandomRecipeSelector;