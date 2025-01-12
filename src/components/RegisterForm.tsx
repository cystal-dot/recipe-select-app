import React from 'react';
import { useEffect, useState } from 'react';
import { categories } from '../data/categories';
import Autosuggest from 'react-autosuggest';
import { TIMEOUT_SECONDS, INGREDIENTS_NUM } from '../common/consts';

interface Recipe {
	name: string;
	category: string;
	ingredients: string[];
	id?: number;
}

const getSuggestions = (value: string, items: string[]) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    if (inputLength === 0) return [];
    return items.filter(item => item.slice(0, inputLength) === inputValue);
};

const RegisterForm = ({ recipeToEdit, onCancel, refreshRecipes }: { recipeToEdit: Recipe | null; onCancel: () => void; refreshRecipes: () => void }) => {
    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [ingredients, setIngredients] = useState<string[]>(['', '', '', '']);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [recipeSuggestions, setRecipeSuggestions] = useState<string[]>([]);
    const [ingredientSuggestions, setIngredientSuggestions] = useState<string[]>([]);
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    // const [searchTerm, setSearchTerm] = useState<string>(''); // 検索用の状態
    // const [showRecipeList, setShowRecipeList] = useState<boolean>(false); // レシピ一覧表示用の状態

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await fetch('/api/recipes');
            const data = await response.json();
            setAllRecipes(data.reverse());
        };

        fetchRecipes();
    }, []);

    useEffect(() => {
        if (recipeToEdit) {
            setName(recipeToEdit.name);
            setCategory(recipeToEdit.category);
            const editedIngredients = [...recipeToEdit.ingredients];
            while (editedIngredients.length < INGREDIENTS_NUM) {
                editedIngredients.push('');
            }
            setIngredients(editedIngredients);
        } else {
            resetForm();
        }
    }, [recipeToEdit]);

    const resetForm = () => {
        setName('');
        setCategory('');
        setIngredients(['', '', '', '']);
    };

    const handleRecipeSuggestionsFetchRequested = async ({ value }: { value: string }) => {
        const recipeNames = allRecipes.map((r: Recipe) => r.name);
        setRecipeSuggestions(getSuggestions(value, recipeNames));
    };

    const handleIngredientSuggestionsFetchRequested = async ({ value }: { value: string }) => {
        const ingredientNames = allRecipes.map((recipe: Recipe) => recipe.ingredients).flat();
        setIngredientSuggestions(getSuggestions(value, ingredientNames));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const recipe: Recipe = {
            name,
            category,
            ingredients: ingredients.filter(Boolean)
        };

        if (recipe.ingredients.length === 0) {
            alert('少なくとも1つの材料を入力してください。');
            return;
        }

        const method = recipeToEdit ? 'PUT' : 'POST';
        const endpoint = recipeToEdit ? `/api/recipes/${recipeToEdit.id}` : '/api/recipes';

        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
        });

        if (response.ok) {
            refreshRecipes();
            setSuccessMessage(recipeToEdit ? '更新できました！' : '登録できました！');
            setTimeout(() => setSuccessMessage(null), TIMEOUT_SECONDS);
            resetForm();
            window.scrollTo(0, 0);
        } else {
            // eslint-disable-next-line no-console
            console.error('Error submitting recipe');
        }
        onCancel();
    };

    return (
        <div className="register-form">
            <h2>{recipeToEdit ? 'レシピ編集' : '新しいレシピの登録'}</h2>
            <form onSubmit={handleSubmit}>
                <Autosuggest
                    suggestions={recipeSuggestions}
                    onSuggestionsFetchRequested={handleRecipeSuggestionsFetchRequested}
                    onSuggestionsClearRequested={() => setRecipeSuggestions([])}
                    getSuggestionValue={(suggestion: string) => suggestion}
                    renderSuggestion={(suggestion: string) => <div>{suggestion}</div>}
                    inputProps={{
                        placeholder: '料理名称',
                        value: name,
                        onChange: (event, { newValue }) => setName(newValue),
                        required: true,
                        maxLength: 100
                    }}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">カテゴリを選択</option>
                    {Object.keys(categories).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="その他">その他</option>
                </select>
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-input">
                        <Autosuggest
                            suggestions={ingredientSuggestions}
                            onSuggestionsFetchRequested={handleIngredientSuggestionsFetchRequested}
                            onSuggestionsClearRequested={() => setIngredientSuggestions([])}
                            getSuggestionValue={(suggestion: string) => suggestion}
                            renderSuggestion={(suggestion: string) => <div>{suggestion}</div>}
                            inputProps={{
                                placeholder: `食材 ${index + 1}`,
                                value: ingredient,
                                onChange: (event, { newValue }) => {
                                    const newIngredients = [...ingredients];
                                    newIngredients[index] = newValue;
                                    setIngredients(newIngredients);
                                },
                                maxLength: 100
                            }}
                        />
                    </div>
                ))}
                <button type="submit">{recipeToEdit ? '更新' : '登録'}</button>
                {recipeToEdit && <button type="button" onClick={onCancel}>キャンセル</button>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
};

export default RegisterForm;
