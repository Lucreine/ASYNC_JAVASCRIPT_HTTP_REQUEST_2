document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    try {
        const books = await searchBooks(query);
        displayResults(books);
    } catch (error) {
        alert('Error fetching books');
    }
});

function displayResults(books) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.innerHTML = `
            <img src="${book.volumeInfo.imageLinks?.thumbnail}" alt="${book.volumeInfo.title}">
            <h3>${book.volumeInfo.title}</h3>
            <p>Authors: ${book.volumeInfo.authors?.join(', ')}</p>
            <p>Publisher: ${book.volumeInfo.publishedDate}</p>
            <button onclick="addToFavorites('${book.id}')">Ajouter aux favorites</button>
        `;
        resultsDiv.appendChild(bookDiv);
    });
}

function addToFavorites(bookId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(bookId)) {
        favorites.push(bookId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}

function removeFromFavorites(bookId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== bookId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

async function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesDiv = document.getElementById('favorites');
    favoritesDiv.innerHTML = '';
    for (const bookId of favorites) {
        const book = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`).then(res => res.json());
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.innerHTML = `
            <img src="${book.volumeInfo.imageLinks?.thumbnail}" alt="${book.volumeInfo.title}">
            <h3>${book.volumeInfo.title}</h3>
            <p>Authors: ${book.volumeInfo.authors?.join(', ')}</p>
            <p>Publisher: ${book.volumeInfo.publishedDate}</p>
            <button onclick="removeFromFavorites('${bookId}')">Supprimer de mes favorites</button>
        `;
        favoritesDiv.appendChild(bookDiv);
    }
}

displayFavorites();
