document.addEventListener('DOMContentLoaded', function(){
    const pictureInput = document.querySelector('.picture__input')
    const containerImagens = document.getElementById('container-imagens')
    const maxImagens = 40

    carregarImagensSalvas()

    pictureInput.addEventListener('change', function(event){
        const files = event.target.files
        if (files && files[0]) {
            adicionarImagem(files[0])
        }
    })

    function adicionarImagem(file) {
        if (containerImagens.children.length >= maxImagens) {
            window.alert('Número máximo de imagens atingido!')
            pictureInput.disabled = true
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e){
            const novaImagemContainer = document.createElement('div') // Container para imagem e botão
            novaImagemContainer.classList.add('imagem-container')

            const novaImagem = document.createElement('img')
            novaImagem.src = e.target.result
            novaImagem.classList.add('imagem-galeria')
            novaImagemContainer.appendChild(novaImagem)

            const botaoExcluir = document.createElement('button')
            botaoExcluir.textContent = 'Excluir'
            botaoExcluir.classList.add('botao-excluir')
            botaoExcluir.addEventListener('click', function() {
                excluirImagem(novaImagemContainer, e.target.result)
            })
            novaImagemContainer.appendChild(botaoExcluir)

            containerImagens.appendChild(novaImagemContainer)
            salvarImagemLocalmente(e.target.result)
        };
        reader.readAsDataURL(file)
    }

    function excluirImagem(imagemContainer, imagemDataURL) {
        containerImagens.removeChild(imagemContainer)
        removerImagemLocalmente(imagemDataURL)

        if (containerImagens.children.length < maxImagens) {
            pictureInput.disabled = false
        }
    }

    function salvarImagemLocalmente(imagemDataURL) {
        let imagens = JSON.parse(localStorage.getItem('imagens')) || []
        imagens.push(imagemDataURL);
        localStorage.setItem('imagens', JSON.stringify(imagens))
    }

    function removerImagemLocalmente(imagemDataURL) {
        let imagens = JSON.parse(localStorage.getItem('imagens')) || []
        imagens = imagens.filter(img => img !== imagemDataURL)
        localStorage.setItem('imagens', JSON.stringify(imagens))
    }

    function carregarImagensSalvas() {
        const imagensSalvas = JSON.parse(localStorage.getItem('imagens')) || []
        imagensSalvas.forEach(function(imagem){
            const novaImagemContainer = document.createElement('div')
            novaImagemContainer.classList.add('imagem-container')

            const novaImagem = document.createElement('img')
            novaImagem.src = imagem;
            novaImagem.classList.add('imagem-galeria')
            novaImagemContainer.appendChild(novaImagem)

            const botaoExcluir = document.createElement('button')
            botaoExcluir.textContent = 'Excluir'
            botaoExcluir.classList.add('botao-excluir')
            botaoExcluir.addEventListener('click', function() {
                excluirImagem(novaImagemContainer, imagem)
            });
            novaImagemContainer.appendChild(botaoExcluir)

            containerImagens.appendChild(novaImagemContainer)
        });

        if (containerImagens.children.length >= maxImagens) {
            pictureInput.disabled = true
        }
    }
})