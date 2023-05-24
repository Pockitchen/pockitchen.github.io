document.getElementById("entrar").addEventListener("click", validarFormulario);

function validarFormulario(event) {
  event.preventDefault();
  
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const senha1Input = document.getElementById('senha1');
  const senha2Input = document.getElementById('senha2');

  if (camposVazios([nomeInput, emailInput, senha1Input, senha2Input])) {
    alert('Por favor, preencha todos os campos para se cadastrar.');
  } else if (!validarEmail(emailInput.value)) {
    alert('Por favor, insira um endereço de email válido.');
  } else if (senha1Input.value !== senha2Input.value) {
    alert('As senhas não coincidem. Por favor, digite as senhas novamente.');
  } else if (senha1Input.value.length < 8) {
    alert('A senha deve ter pelo menos 8 caracteres.');
  } else {
    realizarCadastro();
  }
}

function camposVazios(inputs) {
  return inputs.some(input => input.value.trim() === '');
}

function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function realizarCadastro() {
  // Coloque aqui a lógica para realizar o cadastro
  console.log('Cadastro realizado com sucesso!');
}

// Desativar o clique no botão "CONTINUE COM GOOGLE"
const googleButton = document.getElementById("google");
googleButton.addEventListener("click", function(event) {
  event.preventDefault();
});
