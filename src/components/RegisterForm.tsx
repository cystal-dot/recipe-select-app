// components/RegisterForm.tsx
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { categories } from '../data/categories';

interface Recipe {
    name: string;
    category: string;
    ingredients: string[];
    index?: number;
}

const RegisterForm = ({ recipeToEdit, onCancel, refreshRecipes }: { recipeToEdit: Recipe | null; onCancel: () => void; refreshRecipes: () => void }) => {
    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [ingredients, setIngredients] = useState<string[]>(['', '', '', '']);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (recipeToEdit) {
            setName(recipeToEdit.name);
            setCategory(recipeToEdit.category);
            setIngredients(recipeToEdit.ingredients);
        } else {
            setName('');
            setCategory('');
            setIngredients(['', '', '', '']);
        }
    }, [recipeToEdit]);

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const recipe: Recipe = { name, category, ingredients: ingredients.filter(Boolean) };
        if (recipeToEdit) {
            const storedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
            if (recipeToEdit.index !== undefined) {
                storedRecipes[recipeToEdit.index] = recipe;
                localStorage.setItem('recipes', JSON.stringify(storedRecipes));
                refreshRecipes();
            }
        } else {
            dispatch({ type: 'ADD_RECIPE', payload: recipe });
            localStorage.setItem('recipes', JSON.stringify([...JSON.parse(localStorage.getItem('recipes') || '[]'), recipe]));
            refreshRecipes();
            setSuccessMessage('登録できました！');
            setTimeout(() => setSuccessMessage(null), 3000);
        }
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="料理名称" required maxLength={50} />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">カテゴリを選択</option>
                {Object.keys(categories).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            {ingredients.map((ingredient, index) => (
                <input
                    key={index}
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`食材 ${index + 1}`}
                    maxLength={100}
                />
            ))}
            <button type="submit">{recipeToEdit ? '更新' : '登録'}</button>
            {recipeToEdit && <button type="button" onClick={onCancel}>キャンセル</button>}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </form>
    );
};

export default RegisterForm;