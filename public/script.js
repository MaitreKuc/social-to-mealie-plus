const input = document.querySelector('input');
const button = document.querySelector('button');
const body = document.querySelector('body');
const spinner = document.getElementById('spinner');

body.removeChild(spinner);

button.addEventListener('click', async () => {
  body.appendChild(spinner);
  const res = await fetch('/get-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: input.value }),
  });
  const data = await res.json();
  if (data.error) {
    alert(data.error);
    body.removeChild(spinner);
    return;
  }

  const recipeCard = document.createElement('a');
  recipeCard.href = data.url;
  recipeCard.target = '_blank';
  recipeCard.id = 'result';

  const recipeImage = document.createElement('img');
  recipeImage.src = `${data.imageUrl}`;
  recipeImage.alt = 'Recipe image';
  recipeCard.appendChild(recipeImage);

  const recipeTitle = document.createElement('h2');
  recipeTitle.textContent = data.name;
  recipeCard.appendChild(recipeTitle);

  const recipeDescription = document.createElement('p');
  recipeDescription.textContent = data.description;
  recipeCard.appendChild(recipeDescription);

  body.appendChild(recipeCard);
  body.removeChild(spinner);
});
