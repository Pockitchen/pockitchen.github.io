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