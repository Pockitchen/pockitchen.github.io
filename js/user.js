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

  function openModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  }

  function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

  // Função para visualizar a foto do usuário antes de fazer o upload
  function previewPhoto(event) {
    var input = event.target;
    var reader = new FileReader();

    reader.onload = function () {
      var img = document.getElementById("user-photo");
      img.src = reader.result;
    };

    reader.readAsDataURL(input.files[0]);
  }

  // Função para remover a foto do usuário
  function removePhoto() {
    var img = document.getElementById("user-photo");
    img.src = "#"; // Define a imagem para uma imagem vazia

    var input = document.getElementById("photo");
    input.value = ""; // Limpa o valor do campo de upload de foto
  }

  
  document.getElementById("editForm").addEventListener("submit", function (event) {
    event.preventDefault();

   
    // Por exemplo, para obter o valor do nome e da bio:
    var name = document.getElementById("name").value;
    var bio = document.getElementById("bio").value;

    
    closeModal();
  });