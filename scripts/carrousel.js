// Função para buscar os dados da API e criar os indicadores e slides do carrossel
        function fetchRecipes() {
            fetch('https://raw.githubusercontent.com/danielcta/receitasAPI/main/pockitchen-receitas/recipes.json')
                .then(response => response.json())
                .then(data => {
                    const carouselIndicators = document.querySelector('.carousel-indicators');
                    const carouselInner = document.querySelector('.carousel-inner');

                    data.forEach((recipe, index) => {
                        const indicatorClass = index === 0 ? 'active' : '';
                        const slideClass = index === 0 ? 'carousel-item active' : 'carousel-item';

                        // Crie os indicadores dos slides
                        const indicator = document.createElement('li');
                        indicator.setAttribute('data-target', '#carouselExampleIndicators');
                        indicator.setAttribute('data-slide-to', index);
                        indicator.className = indicatorClass;
                        carouselIndicators.appendChild(indicator);

                        // Crie os slides das receitas
                        const slide = document.createElement('div');
                        slide.className = slideClass;
                        slide.innerHTML = `
                            <img class="d-block w-100" src="${recipe.image}" alt="${recipe.name}">
                            <div class="carousel-caption">
                                <h3>${recipe.name}</h3>
                            </div>
                        `;
                        carouselInner.appendChild(slide);
                    });
                })
                .catch(error => console.error('Erro ao buscar os dados da API:', error));
        }

        // Chame a função para buscar os dados e criar os indicadores e slides quando a página carregar
        document.addEventListener('DOMContentLoaded', fetchRecipes);