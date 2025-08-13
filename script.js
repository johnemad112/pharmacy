
function filterCategory(category) {
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'inline-block';
        } else {
            product.style.display = 'none';
        }
    });
}

document.getElementById('searchBar').addEventListener('keyup', function() {
    const term = this.value.toLowerCase();
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        product.style.display = title.includes(term) ? 'inline-block' : 'none';
    });
});
