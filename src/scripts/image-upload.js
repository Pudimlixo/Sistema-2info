import { acess } from './bd.js';

document.addEventListener('DOMContentLoaded', function () {
    const pictureInputs = document.querySelectorAll('.picture__input');
    const containerImagens = document.getElementById('container-imagens');
    const loginOverlay = document.getElementById('login-overlay');
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const loginSubmit = document.getElementById('login-submit');
    let usuarioLogado = null;

    pictureInputs.forEach(pictureInput => {
        pictureInput.addEventListener('change', function (event) {
            loginOverlay.style.display = 'flex';
            pictureInput.files = event.target.files;
        });
    });

    loginSubmit.addEventListener('click', function () {
        const username = loginUsername.value;
        const password = loginPassword.value;

        const user = acess.find(u => u.login === username && u.senha === password);

        if (user) {
            loginOverlay.style.display = 'none';
            usuarioLogado = username;

            pictureInputs.forEach(pictureInput => {
                if (pictureInput.files && pictureInput.files[0]) {
                    adicionarImagem(pictureInput.files[0], pictureInput);
                    pictureInput.files = null;
                }
            });
        } else {
            window.alert('Credenciais inválidas.');
        }
    });

    function adicionarImagem(file, pictureInput) {
        const card = pictureInput.closest('.card');
        if (card && card.dataset.aluno === usuarioLogado) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imagemContainer = document.createElement('div');
                imagemContainer.style.position = 'relative';

                const novaImagem = document.createElement('img');
                novaImagem.src = e.target.result;
                novaImagem.classList.add('imagem-galeria');
                imagemContainer.appendChild(novaImagem);

                const botaoExcluir = document.createElement('button');
                botaoExcluir.textContent = 'Excluir';
                botaoExcluir.classList.add('botao-excluir');
                botaoExcluir.style.position = 'absolute';
                botaoExcluir.style.top = '10px';
                botaoExcluir.style.right = '10px';
                botaoExcluir.addEventListener('click', function () {
                    excluirImagem(card, e.target.result);
                });
                imagemContainer.appendChild(botaoExcluir);

                card.innerHTML = '';
                card.appendChild(imagemContainer);

                pictureInput.disabled = true;

                salvarImagemLocalmente(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            window.alert('Você não tem permissão para adicionar imagens neste card.');
            pictureInput.value = '';
        }
    }

    function excluirImagem(card, imagemDataURL) {
        // Remove o card atual
        card.remove();

        // Recria o card com o input de upload
        const novoCard = document.createElement('div');
        novoCard.classList.add('card');
        novoCard.dataset.aluno = usuarioLogado;

        const novoInput = document.createElement('label');
        novoInput.classList.add('picture');
        novoInput.tabIndex = 0;

        const inputArquivo = document.createElement('input');
        inputArquivo.type = 'file';
        inputArquivo.accept = 'image/*';
        inputArquivo.classList.add('picture__input');
        inputArquivo.addEventListener('change', function (event) {
            loginOverlay.style.display = 'flex';
            inputArquivo.files = event.target.files;
        });

        const spanImagem = document.createElement('span');
        spanImagem.classList.add('picture__image');
        spanImagem.textContent = `Escolher imagem de ${usuarioLogado}`;

        novoInput.appendChild(inputArquivo);
        novoInput.appendChild(spanImagem);
        novoCard.appendChild(novoInput);

        containerImagens.appendChild(novoCard);

        // Atualiza a lista de pictureInputs
        pictureInputs = document.querySelectorAll('.picture__input');

        // Remove a imagem do armazenamento local
        removerImagemLocalmente(imagemDataURL);
    }

    function salvarImagemLocalmente(imagemDataURL) {
        let imagens = JSON.parse(localStorage.getItem(usuarioLogado)) || [];
        imagens.push(imagemDataURL);
        localStorage.setItem(usuarioLogado, JSON.stringify(imagens));
    }

    function removerImagemLocalmente(imagemDataURL) {
        let imagens = JSON.parse(localStorage.getItem(usuarioLogado)) || [];
        imagens = imagens.filter(img => img !== imagemDataURL);
        localStorage.setItem(usuarioLogado, JSON.stringify(imagens));
    }

    function carregarImagensSalvas() {
        const imagensSalvas = JSON.parse(localStorage.getItem(usuarioLogado)) || [];
        imagensSalvas.forEach(function (imagem) {
            const card = document.querySelector(`.card[data-aluno="${usuarioLogado}"]`);
            if (card) {
                const imagemContainer = document.createElement('div');
                imagemContainer.style.position = 'relative';

                const novaImagem = document.createElement('img');
                novaImagem.src = imagem;
                novaImagem.classList.add('imagem-galeria');
                imagemContainer.appendChild(novaImagem);

                const botaoExcluir = document.createElement('button');
                botaoExcluir.textContent = 'Excluir';
                botaoExcluir.classList.add('botao-excluir');
                botaoExcluir.style.position = 'absolute';
                botaoExcluir.style.top = '10px';
                botaoExcluir.style.right = '10px';
                botaoExcluir.addEventListener('click', function () {
                    excluirImagem(card, imagem);
                });
                imagemContainer.appendChild(botaoExcluir);

                card.innerHTML = '';
                card.appendChild(imagemContainer);

                const pictureInput = pictureInputs.find(input => input.closest('.card') === card);
                if (pictureInput) {
                    pictureInput.disabled = true;
                }
            }
        });
    }
});