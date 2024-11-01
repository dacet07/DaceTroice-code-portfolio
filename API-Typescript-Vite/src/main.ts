import $ from "jquery";
import sum from "./utils/sum";
import extractEpisodeNumbers from "./utils/functions";

console.log("Ready for coding");
console.log("Body jQuery node:", $("body"));
console.log("Body javascript node:", document.querySelector("body"));
console.log("2 + 3 =", sum(2, 3));

let filteredCount: number;
let totalFilteredPages: number;
let isFiltered: boolean = false;
let isSorted: boolean = false;
let filterName: string = "";
let sortType: "name" | "status" | "species" = "name";

interface OriginLocation {
  name: string;
  url: string;
}

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: OriginLocation;
  location: OriginLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

let pageNumber = 1;
const LAST_PAGE = 42;

const characterList = $("#characterList");
const beginButton = $("#beginButton");
const prevButton = $("#prevButton");
const nextButton = $("#nextButton");
const endButton = $("#endButton");
const pageNumberSpan = $("#pageNumber");

function defaultSettings(): void {
  pageNumber = 1;
  pageNumberSpan.text(`${pageNumber} of ${LAST_PAGE}`);
  $("#clearFilterBtn").css("display", "none");
  $("#filterInput").val("");
  $("#infoLine").text("");
  isFiltered = false;
  beginButton.removeClass("nav__button_disabled");
  nextButton.removeClass("nav__button_disabled");
  prevButton.removeClass("nav__button_disabled");
  endButton.removeClass("nav__button_disabled");
}

//get characters
async function getCharacters(page: number): Promise<Character[]> {
  const apiUrl = `https://rickandmortyapi.com/api/character?page=${page}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch characters");
    }
    const data = await response.json(); // Iegūst datus no atbildes
    return data.results; // Atgriež tikai varoņu masīvu
  } catch (error) {
    console.error("Error fetching characters:", error);
    throw error;
  }
}

//push all characters in array for sorting
async function arrayOfAllCharacters(): Promise<Character[]> {
  const arrayOfAll: Character[] = [];
  for (let i = 1; i <= LAST_PAGE; i++) {
    const characters = await getCharacters(i);
    arrayOfAll.push(...characters);
  }
  return arrayOfAll;
}

//sort characters
async function sortCharacters(
  sortBy: "name" | "status" | "species"
): Promise<Character[]> {
  const characters = await arrayOfAllCharacters();
  characters.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  return characters;
}

//create a list element
const createCharacterElement = (character: Character) => {
  const episodeNumbers = extractEpisodeNumbers(character.episode).join(", ");
  return $(`
  <li class="character" data-id="${character.id}">
    <span class="character__container">
    <img class="character__img" src="${character.image}" alt="${character.name} image" title="${character.name} image">
    </span>
    <span class="character__container">
    <h2 class="character__name">${character.name}</h2>
    <p class="character__status">Status: ${character.status}</p>
    <p class="character__species">Species: ${character.species}</p>
    <p class="character__detailed">Type: ${character.type}</p>
    <p class="character__detailed">Gender: ${character.gender}</p>
    <p class="character__detailed">Origin: ${character.origin.name}</p>
    <p class="character__detailed">Location: ${character.location.name}</p>
    <p class="character__detailed">Episode: ${episodeNumbers}</p> 
    </span>
    
    <hr class="character__line>
  </li>
`);
};

//output characters in html
async function renderCharacters(page: number): Promise<void> {
  let characters: Character[];

  if (!characterList) {
    console.error("Character list element not found");
    return;
  }

  characterList.empty();
  characters = await getCharacters(page);

  characters.forEach((character) => {
    const li = createCharacterElement(character);
    characterList.append(li);
  });
}

//output sorted characters in html
async function renderSortedCharacters(
  sortBy: "name" | "status" | "species"
): Promise<void> {
  let characters: Character[];
  const start = (pageNumber - 1) * 20;
  const end = start + 20;

  if (!characterList) {
    console.error("Character list element not found");
    return;
  }

  characterList.empty();
  characters = await sortCharacters(sortBy);

  characters.slice(start, end).forEach((character) => {
    const li = createCharacterElement(character);
    characterList.append(li);
  });

  $("#infoLine").text(`Sorted by ${sortType}`);
}

async function filterCharacters(
  filter: string,
  page: number
): Promise<Character[]> {
  const apiUrl = `https://rickandmortyapi.com/api/character?page=${page}&${filter}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch characters");
    }
    const data = await response.json();
    totalFilteredPages = data.info.pages;
    filteredCount = data.info.count;
    return data.results;
  } catch (error) {
    console.error("Error fetching characters:", error);
    throw error;
  }
}

async function renderFiltered(filter: string, page: number): Promise<void> {
  if (!characterList) {
    console.error("Character list element not found");
    return;
  }

  characterList.empty();
  const characters = await filterCharacters(filter, page);

  characters.forEach((character) => {
    const li = createCharacterElement(character);
    characterList.append(li);
  });
}

async function applyFilter(filterType: string): Promise<void> {
  
  const filterInput = $("#filterInput").val();
  const filter = `${filterType}=${filterInput}`;

  await renderFiltered(filter, pageNumber);

  isFiltered = true;
  pageNumberSpan.text(`1 of ${totalFilteredPages}`);
  $("#infoLine").text(`Find ${filteredCount} characters`);
  $("#clearFilterBtn").css("display", "inline-block");
  if (totalFilteredPages === 1) {
    beginButton.addClass("nav__button_disabled");
    prevButton.addClass("nav__button_disabled");
    nextButton.addClass("nav__button_disabled");
    endButton.addClass("nav__button_disabled");
  } else {
    beginButton.removeClass("nav__button_disabled");
    prevButton.removeClass("nav__button_disabled");
    nextButton.removeClass("nav__button_disabled");
    endButton.removeClass("nav__button_disabled");
  }
}

$(() => {
  defaultSettings();
  renderCharacters(pageNumber);
  pageNumberSpan.text(`${pageNumber} of ${LAST_PAGE}`);

  //view character details
  characterList.on("click", ".character__name", function () {
    const $currentDetails = $(this)
      .closest(".character")
      .find(".character__detailed");
    const $currentImage = $(this).closest(".character").find(".character__img");
    const isCurrentlyVisible = $currentDetails.css("display") !== "none";
    $(".character__detailed").css("display", "none");
    $(".character__img").css("width", "100px");
    if (!isCurrentlyVisible) {
      $currentDetails.css("display", "block");
      $currentImage.css("width", "250px");
    }
  });

  //sort by name
  $("#sortByName").on("click", async function () {
    defaultSettings();
    isSorted = true;
    sortType = "name";
    await renderSortedCharacters(sortType);
  });

  //sort by status
  $("#sortByStatus").on("click", async function () {
    defaultSettings();
    pageNumber = 1;
    isSorted = true;
    sortType = "status";
    await renderSortedCharacters(sortType);
  });

  //sort by species
  $("#sortBySpecies").on("click", async function () {
    defaultSettings();
    pageNumber = 1;
    isSorted = true;
    sortType = "species";
    await renderSortedCharacters(sortType);
  });

  //filter by name
  $("#filterByName").on("click", async function () {
    pageNumber = 1;
    filterName = "name";
    await applyFilter(filterName);
  });

  //filter by status
  $("#filterByStatus").on("click", async function () {
    pageNumber = 1;
    filterName = "status";
    await applyFilter(filterName);
  });

  //filter by species
  $("#filterBySpecies").on("click", async function () {
    pageNumber = 1;
    filterName = "species";
    await applyFilter(filterName);
  });

  //clear filter
  $("#clearFilterBtn").on("click", async function () {
    defaultSettings();
    await renderCharacters(pageNumber);
  });

  //begin button click
  beginButton.on("click", async function () {
    pageNumber = 1;
    if (!isFiltered) {
      if (!isSorted) {
        await renderCharacters(pageNumber);
      } else {
        await renderSortedCharacters(sortType);
      }
      pageNumberSpan.text(`${pageNumber} of ${LAST_PAGE}`);
    } else {
      await applyFilter(filterName);
      pageNumberSpan.text(`${pageNumber} of ${totalFilteredPages}`);
    }
  });

  //prev button click
  prevButton.on("click", async function () {
    pageNumber--;
    if (!isFiltered) {
      if (pageNumber < 1) pageNumber = LAST_PAGE;
      if (!isSorted) {
        await renderCharacters(pageNumber);
      } else {
        await renderSortedCharacters(sortType);
      }
      pageNumberSpan.text(`${pageNumber} of ${LAST_PAGE}`);
    } else {
      if (pageNumber < 1) pageNumber = totalFilteredPages;
      await applyFilter(filterName);
      pageNumberSpan.text(`${pageNumber} of ${totalFilteredPages}`);
    }
  });
  //next button click
  nextButton.on("click", async function () {
    pageNumber++;
    if (!isFiltered) {
      if (pageNumber > LAST_PAGE) pageNumber = 1;
      if (!isSorted) {
        await renderCharacters(pageNumber);
      } else {
        await renderSortedCharacters(sortType);
      }
      pageNumberSpan.text(`${pageNumber} of ${LAST_PAGE}`);
    } else {
      if (pageNumber > totalFilteredPages) pageNumber = 1;
      await applyFilter(filterName);
      pageNumberSpan.text(`${pageNumber} of ${totalFilteredPages}`);
    }
  });
  //end button click
  endButton.on("click", async function () {
    if (!isFiltered) {
      pageNumber = LAST_PAGE;
      if (!isSorted) {
        await renderCharacters(pageNumber);
      } else {
        await renderSortedCharacters(sortType);
      }
      pageNumberSpan.text(`${pageNumber} of ${LAST_PAGE}`);
    } else {
      pageNumber = totalFilteredPages;
      await applyFilter(filterName);
      pageNumberSpan.text(`${pageNumber} of ${totalFilteredPages}`);
    }
  });
});
