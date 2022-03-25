const URL = "https://pokeapi.co/api/v2";
const pokedex = document.getElementById("pokedex");

// GET THE TYPE OF THE POKEMON
const showValue = async (btn) => {
  try {
    const urls = [];
    const res = await fetch(`${URL}/type/${btn.value}`);

    if (res.status === 200) {
      const data = await res.json();
      for (item of data.pokemon) {
        urls.push(item.pokemon.url);
      }
      return urls;
    }
  } catch (error) {
    console.error(error);
  }
};

// GET THE POKEMON DATA
const fetchingData = async (urls) => {
  try {
    const promises = [];
    let urlsArr = [];
    if (urls) {
      urlsArr = urls;
    } else {
      for (let i = 1; i <= 500; i++) {
        urlsArr.push(`${URL}/pokemon/${i}`);
      }
    }

    for (url of urlsArr) {
      const result = await fetch(url);
      const data = await result.json();
      promises.push(data);
    }

    showPoke(promises);
  } catch (error) {
    console.error(error);
  }
};

// GET ALL THE BUTTON WITH ID "btn-types"
const btnTypes = document.querySelectorAll("#btn-types");
btnTypes.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const urls = await showValue(btn);
    fetchingData(urls);
  });
});

window.onload = fetchingData();

// DISPLAY THE POKEMON IN THE BROWSER
const showPoke = async (promises) => {
  let poke = [];
  const pokemons = await promises.map((pokemon) => ({
    id: pokemon?.id,
    name: pokemon?.name,
    img: pokemon?.sprites["front_default"],
    height: pokemon?.height,
    weight: pokemon?.weight,
    type: pokemon?.types.map((type) => type.type.name).join(", "),
  }));
  poke = pokemons;

  pokeHTMLString = await poke
    .map(
      (pokemon) => `
      <li class="bg-white font-jura rounded-xl text-center card-shadow">
        <div class="flex flex-col justify-center items-center tracking-widest relative">
          <div class="w-64">
            <img src="${pokemon?.img}" class="block w-full"/>
            <div id="overlay" class="absolute top-0 left-0 w-full h-full custom-overlay text-white rounded-xl flex flex-col items-center justify-center opacity-0">
              <div class="uppercase text-2xl font-bold my-3.5 mt-9">#${pokemon?.id} ${pokemon?.name}</div>
              <p class="text-base font-medium my-2">WEIGHT: ${pokemon?.weight}kg | HEIGHT: ${pokemon?.height}m</p>
              <p class="text-base font-medium uppercase">Type: ${pokemon?.type}</p>
              <p class="text-2xl font-semibold my-3.5 text-custom-mustard">P 2, 500.00</p>
              <div class="bg-custom-blue w-full h-14 flex text center justify-center place-items-center rounded-b-xl">
                <button id="add-cart" class="tracking-widest text-lg">ADD TO CART</button>
              </div>
            </div>
          </div>
        </div>
      </li>`
    )
    .join("");

  pokedex.innerHTML = pokeHTMLString;
};
