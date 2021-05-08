import { RecipeComp } from 'react-demo/recipes/recipe.comp';
import { vanillaRecipe } from 'react-demo/recipes/vanilla/vanilla-recipe';

export default function Index() {
  return <RecipeComp recipe={vanillaRecipe} />;
}
