import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { categories } from '../data/categories';
import Autosuggest from 'react-autosuggest';
import { getLocalStorageData } from '../utils/storage';

interface Recipe {
	name: string;
	category: string;
	ingredients: string[];
	index?: number;
}

const getSuggestions = (value: string, items: string[]) => {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;
	if (inputLength === 0) return [];
	return items.filter(item => item.slice(0, inputLength) === inputValue);
};

const handleSuggestionsFetchRequested = (
	key: string,
	setSuggestions: React.Dispatch<React.SetStateAction<string[]>>,
	getItemNames: (items: any[]) => string[],
	value: string
) => {
	const storedItems = getLocalStorageData(key);
	const itemNames = getItemNames(storedItems);
	setSuggestions(getSuggestions(value, itemNames));
};

const RegisterForm = ({ recipeToEdit, onCancel, refreshRecipes }: { recipeToEdit: Recipe | null; onCancel: () => void; refreshRecipes: () => void }) => {
	const [name, setName] = useState<string>('');
	const [category, setCategory] = useState<string>('');
	const [ingredients, setIngredients] = useState<string[]>(['', '', '', '']);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [recipeSuggestions, setRecipeSuggestions] = useState<string[]>([]);
	const [ingredientSuggestions, setIngredientSuggestions] = useState<string[]>([]);

	const dispatch = useDispatch();

	useEffect(() => {
		if (recipeToEdit) {
			setName(recipeToEdit.name);
			setCategory(recipeToEdit.category);
			setIngredients(recipeToEdit.ingredients);
		} else {
			resetForm();
		}
	}, [recipeToEdit]);

	const resetForm = () => {
		setName('');
		setCategory('');
		setIngredients(['', '', '', '']);
	};

	const handleRecipeSuggestionsFetchRequested = ({ value }: { value: string }) => {
		handleSuggestionsFetchRequested('recipes', setRecipeSuggestions, (recipes) => recipes.map((r: Recipe) => r.name), value);
	};

	const handleIngredientSuggestionsFetchRequested = ({ value }: { value: string }) => {
		handleSuggestionsFetchRequested('recipes', setIngredientSuggestions, (recipes) => recipes.map((recipe: Recipe) => recipe.ingredients).flat(), value);
	};

	const handleSuggestionsClearRequested = (setSuggestions: React.Dispatch<React.SetStateAction<string[]>>) => {
		setSuggestions([]);
	};

	const handleNameChange = (event: React.FormEvent<HTMLElement>, { newValue }: { newValue: string }) => {
		setName(newValue);
	};

	const createInputProps = (value: string, onChange: (event: React.FormEvent<HTMLElement>, { newValue }: { newValue: string }) => void, placeholder: string) => {
		return {
			placeholder,
			value,
			onChange,
			required: true,
			maxLength: 100
		};
	};

	const handleIngredientChange = (index: number, newValue: string) => {
		const newIngredients = [...ingredients];
		newIngredients[index] = newValue;
		setIngredients(newIngredients);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const recipe: Recipe = {
			name,
			category,
			ingredients: ingredients.filter(Boolean)
		};
		if (recipeToEdit) {
			const storedRecipes = getLocalStorageData('recipes');
			if (recipeToEdit.index !== undefined) {
				storedRecipes[recipeToEdit.index] = recipe;
				localStorage.setItem('recipes', JSON.stringify(storedRecipes));
				refreshRecipes();
			}
		} else {
			dispatch({ type: 'ADD_RECIPE', payload: recipe });
			const oldRecipes = getLocalStorageData('recipes');
			localStorage.setItem('recipes', JSON.stringify([...oldRecipes, recipe]));
			refreshRecipes();
			setSuccessMessage('登録できました！');
			setTimeout(() => setSuccessMessage(null), 3000);
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
					onSuggestionsClearRequested={() => handleSuggestionsClearRequested(setRecipeSuggestions)}
					getSuggestionValue={(suggestion: string) => suggestion}
					renderSuggestion={(suggestion: string) => <div>{suggestion}</div>}
					inputProps={createInputProps(name, handleNameChange, '料理名称')}
				/>
				<select value={category} onChange={(e) => setCategory(e.target.value)}>
					<option value="">カテゴリを選択</option>
					{Object.keys(categories).map(cat => (
						<option key={cat} value={cat}>{cat}</option>
					))}
				</select>
				{ingredients.map((ingredient, index) => (
					<div key={index} className="ingredient-input">
						<Autosuggest
							suggestions={ingredientSuggestions}
							onSuggestionsFetchRequested={handleIngredientSuggestionsFetchRequested}
							onSuggestionsClearRequested={() => handleSuggestionsClearRequested(setIngredientSuggestions)}
							getSuggestionValue={(suggestion: string) => suggestion}
							renderSuggestion={(suggestion: string) => <div>{suggestion}</div>}
							inputProps={createInputProps(ingredient, (event, { newValue }) => handleIngredientChange(index, newValue), `食材 ${index + 1}`)}
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
