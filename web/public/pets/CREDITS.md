# Créditos dos sprites de pet

Os bichos não vêm do gerador de personagem LPC (ele não tem animais). Cada folha
aqui tem autor e licença própria, listados abaixo.

## raposa.png

De **tapatilorenzo**, do pacote "[LPC] bears, deer, lions and more"
(`lpc_animals_2022_v1.1`), publicado em:

https://opengameart.org/content/lpc-bears-deer-lions-and-more

Licença **CC-BY 4.0**. O autor declara que as partes que não derivam do trabalho
do Sevarihk podem ser usadas como CC0, sem exigir atribuição, mas o crédito fica
aqui de qualquer forma.

## cachorro.png (shiba)

Do mesmo pacote acima, porém **adaptado de arte do Sevarihk**, então a atribuição
é obrigatória: crédito a **Sevarihk** e a **tapatilorenzo**, sob **CC-BY 4.0**.

## gato.png

De **bluecarrot16**, "[LPC] Cats and Dogs", publicado em:

http://opengameart.org/content/lpc-cats-and-dogs

Licenças **CC-BY 3.0 / CC-BY-SA 3.0 / GPL 3.0 / GPL 2.0 / OGA-BY 3.0**. A
atribuição pede o crédito ao autor e o link para a página acima, que estão aqui.
A folha tem 4 cores de gato; o preto é o quarto bloco de colunas.

## cobra.png

De **Calciumtrice**, "Animated Snake", publicado em:

https://lpc.opengameart.org/content/animated-snake

Licença **CC-BY 3.0**.

## Layout das folhas

Não existe padrão único entre elas, e é por isso que cada pet guarda a própria
spec de quadro no catálogo (tamanho do quadro, linha e coluna). A linha é
escolhida olhando o resultado: de frente o animal achata, de perfil ele lê
melhor e fica virado para o herói.

| arquivo      | folha   | quadro | grade | quadro usado             |
| ------------ | ------- | ------ | ----- | ------------------------ |
| raposa.png   | 256x256 | 64px   | 4x4   | linha 1, col 0 (perfil)  |
| cobra.png    | 320x160 | 32px   | 10x5  | linha 0, col 0           |
| cachorro.png | 384x192 | 48px   | 8x4   | linha 0, col 0 (frente)  |
| gato.png     | 512x256 | 32px   | 16x8  | linha 0, col 12 (perfil) |

Aviso para quem for adicionar bicho novo: nem toda folha de animal fecha numa
grade. A folha do lobo do LPC (Redshrike), por exemplo, tem os quadros de perfil
empacotados de forma irregular (uma faixa de 28px, outra de 137px, repetindo a
cada 192px), e não dá pra fatiar em quadro fixo sem recortar a arte na mão.
Vale medir a folha antes de escolher o bicho.
