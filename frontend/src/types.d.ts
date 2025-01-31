export interface Ingredient {
  id: number;
  name: string;
}

export interface Recipe {
  id: number;
  name: string;
  picture?: string;
  instruction: string;
  ingredients: Ingredient[];
}
