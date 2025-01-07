import { useEffect, useState } from 'react';
import { categories } from '../data/categories';
import Autosuggest from 'react-autosuggest';
import { supabase } from '../utils/supabaseClient';

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
			const { data, error } = await supabase.from('recipes').select('*');
			if (error) {
				console.error('Error fetching recipes:', error);
				return [];
			}
			setAllRecipes(data.reverse()); // 逆順で保存
		};

		fetchRecipes();
	}, []);

	useEffect(() => {
		if (recipeToEdit) {
			setName(recipeToEdit.name);
			setCategory(recipeToEdit.category);
			const editedIngredients = [...recipeToEdit.ingredients];
			while (editedIngredients.length < 4) {
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

		if (recipeToEdit) {
			const { error } = await supabase
				.from('recipes')
				.update(recipe)
				.eq('id', recipeToEdit.id);
			if (error) {
				console.error('Error updating recipe:', error);
			} else {
				refreshRecipes();
				setSuccessMessage('更新できました！');
				setTimeout(() => setSuccessMessage(null), 3000);
				resetForm();
				window.scrollTo(0, 0);
			}
		} else {
			const { error } = await supabase
				.from('recipes')
				.insert([recipe]);
			if (error) {
				console.error('Error adding recipe:', error);
			} else {
				refreshRecipes();
				setSuccessMessage('登録できました！');
				setTimeout(() => setSuccessMessage(null), 3000);
				resetForm();
				window.scrollTo(0, 0);
			}
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
