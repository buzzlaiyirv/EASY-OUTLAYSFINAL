document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('newcat-form');
    const input = document.getElementById('input-cat');
    const categoriesGrid = document.getElementById('tipos-cat');

    // Cargar categorías guardadas del almacenamiento local al cargar la página
    const savedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    savedCategories.forEach(categoryName => {
        addCategoryToUI(categoryName);
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const categoryName = input.value.trim();
        if (categoryName !== '') {
            fetch('/guardar_categoria', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ categoryName })
            })
            .then(response => response.json())
            .then(data => {
                addCategoryToUI(data.categoryName);
                saveCategoryLocally(data.categoryName);
                input.value = '';
            })
            .catch(error => console.error('Error:', error));
        }
    });

    function addCategoryToUI(categoryName) {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');
        categoryItem.innerHTML = `
            <div class="row my-2">
                <div class="col-8 col-sm-10">
                    <div class="input-group">
                        <input type="text" class="form-control" value="${categoryName}" readonly>
                    </div>
                </div>
                <div class="col-4 col-sm-2 d-flex justify-content-end">
                    <button class="btn btn-primary btn-sm me-2 edit-btn">Editar</button>
                    <button class="btn btn-danger btn-sm delete-btn">Borrar</button>
                </div>
            </div>
        `;
        categoriesGrid.appendChild(categoryItem);
    }

    function saveCategoryLocally(categoryName) {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories.push(categoryName);
        localStorage.setItem('categories', JSON.stringify(categories));
    }

    categoriesGrid.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            event.target.closest('.category-item').remove();
            // Aquí también deberías eliminar la categoría del almacenamiento local si lo deseas
        } else if (event.target.classList.contains('edit-btn')) {
            const categoryInput = event.target.closest('.category-item').querySelector('input');
            categoryInput.removeAttribute('readonly');
            categoryInput.focus();
        }
    });

    categoriesGrid.addEventListener('blur', function (event) {
        if (event.target.tagName === 'INPUT') {
            event.target.setAttribute('readonly', true);
        }
    }, true);
});