import { useRouter } from 'next/router';
import React from 'react';
import { RecipeComp } from 'react-demo/recipes/recipe.comp';
import { vanillaRecipe } from 'react-demo/recipes/vanilla/vanilla-recipe';

export default function Index() {
  const router = useRouter();

  console.log(router);

  return <RecipeComp recipe={vanillaRecipe} />;
}
