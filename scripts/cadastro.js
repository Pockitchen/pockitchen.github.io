const telefone = document.getElementById('telefone');
const emailInput = document.getElementById('email');
const senha1Input = document.getElementById('senha1');
const senha2Input = document.getElementById('senha2');
const cadastrarBtn = document.getElementById('entrar');

cadastrarBtn.addEventListener('click', function() {
  if (emailInput.value.trim() === '' ||
      telefone.value.trim() === '' ||
      senha1Input.value.trim() === '' ||
      senha2Input.value.trim() === '') {
    alert('Por favor, preencha todos os campos para se cadastrar.'); // se há um input sem preencher
  } else if (!validarEmail(emailInput.value)) { // se o email é válido
    alert("Insira um e-mail válido."); 
  } else if (senha1Input.value !== senha2Input.value) { // se as senhas não coincidem
    alert('As senhas não coincidem. Por favor, digite as senhas novamente.');
  } else if (!validarSenha(senha1Input.value)) { // se o email é válido
    alert("Insira uma senha válida."); 
  } else {
    // realizar o cadastro aqui
    console.log('Cadastro realizado com sucesso!');
  }
});

function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validarSenha(senha) {
  return senha.length >= 8;
}

telefone.addEventListener('input', function(e) {
  let valor = e.target.value;
  valor = valor.replace(/\D/g, ''); // remove todos os caracteres não numéricos
  valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2'); // adiciona os parênteses
  valor = valor.replace(/(\d{5})(\d)/, '$1-$2'); // adiciona o traço
  e.target.value = valor;
});