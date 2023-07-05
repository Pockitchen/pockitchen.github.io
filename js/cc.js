document.addEventListener('DOMContentLoaded', function() {
    var hamburger = document.querySelector('.hamburger-menu');
    var sideMenu = document.querySelector('.side-menu');
    
    hamburger.addEventListener('click', function() {
      sideMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', function(event) {
      var target = event.target;
      
      if (!target.closest('.navbar-menu') && !target.closest('.side-menu')) {
        sideMenu.classList.remove('active');
      }
    });
  });

  function mascara(o,f){
    v_obj=o
    v_fun=f
    setTimeout("execmascara()",1)
}
function execmascara(){
    v_obj.value=v_fun(v_obj.value)
}
function mtel(v){
    v=v.replace(/\D/g,""); //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v=v.replace(/(\d)(\d{4})$/,"$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
    return v;
}
function id( el ){
	return document.getElementById( el );
}
window.onload = function(){
	id('telefone').onkeyup = function(){
		mascara( this, mtel );
	}
}
  

document.addEventListener('DOMContentLoaded', function() {
    // Obtém o botão de adicionar restrição
    const addRestrictionButton = document.getElementById("btn_restricoes");
  
    // Adiciona o evento de clique ao botão de adicionar restrição
    addRestrictionButton.addEventListener("click", function(event) {
      event.preventDefault(); // Evita o comportamento padrão do envio do formulário
      addRestriction(event); // Chama a função addRestriction passando o evento como parâmetro
    });
  
    // Função para adicionar uma restrição alimentar à lista
    function addRestriction(event) {
      const input = document.getElementById("in_restricoes");
      const restriction = input.value;
  
      if (restriction) {
        const listItem = document.createElement("span");
        listItem.classList.add("restriction-item");
        listItem.innerText = restriction;
  
        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.innerText = "-";
        removeButton.addEventListener("click", removeRestriction);
  
        listItem.appendChild(removeButton);
  
        const restrictionList = document.getElementById("ingredient-list");
        restrictionList.appendChild(listItem);
  
        input.value = ""; // Limpa o campo de entrada após adicionar a restrição
      }
    }
  
    // Função para remover uma restrição alimentar da lista
    function removeRestriction() {
      const listItem = this.parentNode;
      const restrictionList = document.getElementById("ingredient-list");
      restrictionList.removeChild(listItem);
    }
  });



    // Função para carregar os estados na lista de seleção
    function carregarEstados() {
      $.ajax({
        url: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          // Limpar a lista de estados
          $('#estado').empty();
          $('#estado').append('<option value="">Selecione um estado</option>');

          // Adicionar cada estado à lista de seleção
          for (var i = 0; i < data.length; i++) {
            $('#estado').append('<option value="' + data[i].id + '">' + data[i].nome + '</option>');
          }
        }
      });
    }

    function carregarEstados() {
      fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => response.json())
        .then(data => {
          const estadoSelect = document.getElementById('estado');
          estadoSelect.innerHTML = '<option value="">Selecione um estado</option>';

          data.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.id;
            option.textContent = estado.nome;
            estadoSelect.appendChild(option);
          });
        })
        .catch(error => console.error(error));
    }

    // Função para carregar as cidades do estado selecionado
    function carregarCidades() {
      const estadoId = document.getElementById('estado').value;
      const cidadeSelect = document.getElementById('cidade');

      if (estadoId !== '') {
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`)
          .then(response => response.json())
          .then(data => {
            cidadeSelect.innerHTML = '<option value="">Selecione uma cidade</option>';

            data.forEach(cidade => {
              const option = document.createElement('option');
              option.value = cidade.id;
              option.textContent = cidade.nome;
              cidadeSelect.appendChild(option);
            });
          })
          .catch(error => console.error(error));
      } else {
        cidadeSelect.innerHTML = '<option value="">Selecione um estado primeiro</option>';
      }
    }

    // Carregar os estados ao carregar a página
    document.addEventListener('DOMContentLoaded', () => {
      carregarEstados();
    });