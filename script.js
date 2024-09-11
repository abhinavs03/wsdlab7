let books = [];
let currentPage = 1;
const booksPerPage = 5;

document.getElementById('fetch-books').addEventListener('click', function() {
    showLoadingIndicator(true);
    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            books = data;
            displayBooks();
            showLoadingIndicator(false);
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            document.getElementById('book-list').innerHTML = '<p class="error">Error fetching books. Please try again later.</p>';
            showLoadingIndicator(false);
        });
});

document.getElementById('filter-title').addEventListener('input', displayBooks);
document.getElementById('filter-author').addEventListener('input', displayBooks);
document.getElementById('sort-title').addEventListener('click', () => sortBooks('title'));
document.getElementById('sort-year').addEventListener('click', () => sortBooks('year'));

function displayBooks() {
    const filteredBooks = books
        .filter(book => book.title.toLowerCase().includes(document.getElementById('filter-title').value.toLowerCase()))
        .filter(book => book.author.toLowerCase().includes(document.getElementById('filter-author').value.toLowerCase()));

    const paginatedBooks = paginate(filteredBooks, currentPage, booksPerPage);

    let output = '';
    paginatedBooks.forEach(book => {
        output += `
            <div class="book-container">
                <div class="book-title">${book.title}</div>
                <div class="book-author">by ${book.author}</div>
                <div class="book-year">Published: ${book.year}</div>
            </div>`;
    });
    document.getElementById('book-list').innerHTML = output;
    displayPaginationControls(filteredBooks.length);
}

function sortBooks(criteria) {
    books.sort((a, b) => a[criteria].localeCompare(b[criteria]));
    displayBooks();
}

function paginate(array, page, itemsPerPage) {
    return array.slice((page - 1) * itemsPerPage, page * itemsPerPage);
}

function displayPaginationControls(totalItems) {
    const totalPages = Math.ceil(totalItems / booksPerPage);
    let controls = '';
    for (let i = 1; i <= totalPages; i++) {
        controls += `<button onclick="changePage(${i})">${i}</button>`;
    }
    document.getElementById('pagination-controls').innerHTML = controls;
}

function changePage(page) {
    currentPage = page;
    displayBooks();
}

function showLoadingIndicator(show) {
    document.getElementById('loading-indicator').style.display = show ? 'block' : 'none';
}
