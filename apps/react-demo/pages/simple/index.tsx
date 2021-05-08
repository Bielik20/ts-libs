import { RecipeComp } from 'react-demo/recipes/recipe.comp';
import { simpleRecipe } from 'react-demo/recipes/simple/simple-recipe';

export default function Index() {
  return <RecipeComp recipe={simpleRecipe} />;
}
