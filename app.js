const pokedex = document.querySelector("#pokedex");
const pokemonInput = document.querySelector("#pokemon");
const searchBtn = document.querySelector("#search");

const pokeCache = {};
const fetchPokemon = async (pokemonName = null) => {
  if (pokemonName !== null) {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

      const res = await fetch(url);
      const data = await res.json();

      const pokemon = {
        name: pokemonName,
        id: data.id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
      };
      displayPokemon(pokemon, true);
    } catch (err) {
      alert("The pokemon you entered does not exist");
    }
  } else {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=150`;

    const res = await fetch(url);
    const data = await res.json();

    const pokemon = data.results.map((res, i) => ({
      ...res,
      id: i + 1,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        i + 1
      }.png`,
    }));
    displayPokemon(pokemon);
  }
};

const displayPokemon = (pokemon, specificPokemon) => {
  let pokemonHTMLString;
  if (!specificPokemon) {
    pokemonHTMLString = pokemon
      .map(
        (pokemon) => `
      <li class="card" onclick="selectPokemon(${pokemon.id})">
        <img class="card-image" src="${pokemon.image}" />
        <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
      </li>
      `
      )
      .join("");
  } else {
    pokemonHTMLString = `
    <li class="card" onclick="selectPokemon(${pokemon.id})">
      <img class="card-image" src="${pokemon.image}" />
      <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
    </li>
    `;
  }
  pokedex.innerHTML = pokemonHTMLString;
};

const selectPokemon = async (id) => {
  if (!pokeCache[id]) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    const res = await fetch(url);
    const pokemon = await res.json();
    pokeCache[id] = pokemon;
    displayPopup(pokemon);
  } else {
    displayPopup(pokeCache[id]);
  }
};

const displayPopup = (pokemon) => {
  const htmlString = `
    <div class="popup">
        <button id="closeBtn" onclick="closePopup()">Close</button>

        <div class="card">
            <img class="card-image" src="${pokemon.sprites.front_default}" />
            <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
            <p class="card-subtitle">Type: ${pokemon.types
              .map((type) => type.type.name)
              .join(", ")}</p>
            <p><small>Height:</small> ${
              pokemon.height
            } | <small>Weight:</small> ${
    pokemon.weight
  } | <small>Type: </small>${pokemon.types
    .map((type) => type.type.name)
    .join(", ")}</p>
        </div>
    </div>
  `;
  pokedex.innerHTML = htmlString + pokedex.innerHTML;
};

const closePopup = () => {
  const popup = document.querySelector(".popup");
  popup.parentElement.removeChild(popup);
};

fetchPokemon();

searchBtn.addEventListener("click", () => {
  fetchPokemon(pokemonInput.value);
  pokemonInput.value = "";
});
