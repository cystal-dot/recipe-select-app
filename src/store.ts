import { createStore } from 'redux';

interface Recipe {
    name: string;
    category: string;
    ingredients: string;
}

interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
};

const recipeReducer = (state = initialState, action: { type: string; payload: Recipe }) => {
    switch (action.type) {
        case 'ADD_RECIPE':
            return { ...state, recipes: [...state.recipes, action.payload] };
        default:
            return state;
    }
};

const store = createStore(recipeReducer);

export default store;
