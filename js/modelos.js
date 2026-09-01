import { supabase } from "./supabase.js";


// ======================================================
// ELEMENTOS DO HTML
// ======================================================

const modelsGrid =
    document.getElementById("models-grid");

const flavorModal =
    document.getElementById("flavor-modal");

const closeFlavorModal =
    document.getElementById("close-flavor-modal");

const flavorForm =
    document.getElementById("flavor-form");

const flavorsGrid =
    document.getElementById("flavors-grid");

const flavorCounter =
    document.getElementById("flavor-counter");

const flavorModalProduct =
    document.getElementById("flavor-modal-product");


// ======================================================
// PEGAR BRAND_ID DA URL
// ======================================================

const params =
    new URLSearchParams(window.location.search);

const brandId =
    params.get("brand_id");


console.log("Brand ID:", brandId);


// ======================================================
// VARIÁVEL DO MODELO ATUAL
// ======================================================

let modeloSelecionado = null;


// ======================================================
// CARREGAR MODELOS
// ======================================================

async function carregarModelos() {

    // ------------------------------------------
    // VERIFICAR ELEMENTO
    // ------------------------------------------

    if (!modelsGrid) {

        console.error(
            "Elemento #models-grid não encontrado."
        );

        return;
    }


    // ------------------------------------------
    // VERIFICAR BRAND ID
    // ------------------------------------------

    if (!brandId) {

        modelsGrid.innerHTML = `
            <p>
                Nenhuma marca foi selecionada.
            </p>
        `;

        return;
    }


    try {

        console.log(
            "Buscando modelos da marca:",
            brandId
        );


        // --------------------------------------
        // CONSULTA AO SUPABASE
        // --------------------------------------

        const { data, error } = await supabase

            .from("products")

            .select(`
                id,
                brand_id,
                name,
                active
            `)

            .eq(
                "brand_id",
                Number(brandId)
            )

            .eq(
                "active",
                true
            )

            .order("id", {
                ascending: true
            });


        // --------------------------------------
        // VERIFICAR ERRO
        // --------------------------------------

        if (error) {

            console.error(
                "Erro do Supabase:",
                error
            );

            throw error;
        }


        console.log(
            "Modelos encontrados:",
            data
        );


        // --------------------------------------
        // LIMPAR LOADING
        // --------------------------------------

        modelsGrid.innerHTML = "";


        // --------------------------------------
        // NENHUM MODELO
        // --------------------------------------

        if (!data || data.length === 0) {

            modelsGrid.innerHTML = `
                <p>
                    Nenhum modelo disponível
                    para esta marca.
                </p>
            `;

            return;
        }


        // --------------------------------------
        // CRIAR CARDS
        // --------------------------------------

        data.forEach(modelo => {

            const card =
                document.createElement("button");


            // Tipo do botão

            card.type = "button";


            // Classes

            card.className =
                "pod-card model-card";


            // ID do produto

            card.dataset.productId =
                modelo.id;


            // Nome do produto

            card.dataset.productName =
                modelo.name;


            // ----------------------------------
            // CONTEÚDO DO CARD
            // ----------------------------------

            card.innerHTML = `

                <div class="pod-card__content">

                    <h3 class="pod-card__title">
                        ${modelo.name}
                    </h3>

                    <span class="pod-card__action">
                        Escolher modelo
                    </span>

                </div>

            `;


            // ----------------------------------
            // CLIQUE NO MODELO
            // ----------------------------------

            card.addEventListener(
                "click",
                () => {

                    abrirModalSabores(
                        modelo.id,
                        modelo.name
                    );

                }
            );


            // ----------------------------------
            // ADICIONAR À PÁGINA
            // ----------------------------------

            modelsGrid.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Não foi possível carregar os modelos:",
            error
        );


        modelsGrid.innerHTML = `
            <p>
                Não foi possível carregar os modelos.
            </p>
        `;

    }

}


// ======================================================
// ABRIR MODAL DE SABORES
// ======================================================

async function abrirModalSabores(
    productId,
    productName
) {

    console.log(
        "Modelo selecionado:",
        productId,
        productName
    );


    // ------------------------------------------
    // SALVAR MODELO ATUAL
    // ------------------------------------------

    modeloSelecionado = {

        id: productId,

        name: productName

    };


    // ------------------------------------------
    // ALTERAR TEXTO DO MODAL
    // ------------------------------------------

    if (flavorModalProduct) {

        flavorModalProduct.textContent =
            `Sabores disponíveis para ${productName}.`;

    }


    // ------------------------------------------
    // LIMPAR SABORES ANTERIORES
    // ------------------------------------------

    if (flavorsGrid) {

        flavorsGrid.innerHTML = `
            <p>
                Carregando sabores...
            </p>
        `;

    }


    // ------------------------------------------
    // RESETAR CONTADOR
    // ------------------------------------------

    atualizarContador();


    // ------------------------------------------
    // ABRIR MODAL
    // ------------------------------------------

    if (flavorModal) {

        flavorModal.classList.add(
            "is-open"
        );


        flavorModal.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    // ------------------------------------------
    // BUSCAR SABORES
    // ------------------------------------------

    await carregarSabores(productId);

}


// ======================================================
// CARREGAR SABORES
// ======================================================

async function carregarSabores(productId) {

    if (!flavorsGrid) {

        console.error(
            "Elemento #flavors-grid não encontrado."
        );

        return;
    }


    try {

        console.log(
            "Buscando sabores do produto:",
            productId
        );


        // --------------------------------------
        // CONSULTAR PRODUCT_FLAVORS
        // --------------------------------------

        const { data, error } = await supabase

            .from("product_flavors")

            .select(`
                flavor_id,
                flavors (
                    id,
                    name,
                    value,
                    active,
                    sort_order
                )
            `)

            .eq(
                "product_id",
                productId
            );


        // --------------------------------------
        // VERIFICAR ERRO
        // --------------------------------------

        if (error) {

            console.error(
                "Erro ao buscar sabores:",
                error
            );

            throw error;
        }


        console.log(
            "Sabores encontrados:",
            data
        );


        // --------------------------------------
        // LIMPAR LOADING
        // --------------------------------------

        flavorsGrid.innerHTML = "";


        // --------------------------------------
        // NENHUM SABOR
        // --------------------------------------

        if (!data || data.length === 0) {

            flavorsGrid.innerHTML = `
                <p>
                    Nenhum sabor disponível
                    para este modelo.
                </p>
            `;

            return;
        }


        // --------------------------------------
        // CRIAR CARDS
        // --------------------------------------

        data.forEach(item => {

            const sabor =
                item.flavors;


            // Se não encontrou o sabor

            if (!sabor) {
                return;
            }


            // Se sabor está inativo

            if (!sabor.active) {
                return;
            }


            // ----------------------------------
            // LABEL
            // ----------------------------------

            const card =
                document.createElement("label");


            card.className =
                "pod-card flavor-card";


            // ----------------------------------
            // HTML
            // ----------------------------------

            card.innerHTML = `

                <input
                    type="checkbox"
                    name="flavor"
                    value="${sabor.id}"
                    data-flavor-name="${sabor.name}"
                    hidden
                >

                <div class="pod-card__content">

                    <h3 class="pod-card__title">
                        ${sabor.name}
                    </h3>

                    <span class="pod-card__action">
                        Selecionar
                    </span>

                </div>

            `;


            // ----------------------------------
            // INPUT
            // ----------------------------------

            const input =
                card.querySelector(
                    'input[name="flavor"]'
                );


            // ----------------------------------
            // SELEÇÃO
            // ----------------------------------

            input.addEventListener(
                "change",
                () => {

                    card.classList.toggle(
                        "is-selected",
                        input.checked
                    );


                    atualizarContador();

                }
            );


            // ----------------------------------
            // ADICIONAR CARD
            // ----------------------------------

            flavorsGrid.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Não foi possível carregar os sabores:",
            error
        );


        flavorsGrid.innerHTML = `
            <p>
                Não foi possível carregar
                os sabores.
            </p>
        `;

    }

}


// ======================================================
// CONTADOR
// ======================================================

function atualizarContador() {

    if (!flavorForm || !flavorCounter) {
        return;
    }


    const selecionados =
        flavorForm.querySelectorAll(
            'input[name="flavor"]:checked'
        );


    const quantidade =
        selecionados.length;


    if (quantidade === 0) {

        flavorCounter.textContent =
            "0 sabores selecionados";

    }

    else if (quantidade === 1) {

        flavorCounter.textContent =
            "1 sabor selecionado";

    }

    else {

        flavorCounter.textContent =
            `${quantidade} sabores selecionados`;

    }

}


// ======================================================
// FECHAR MODAL
// ======================================================

function fecharModal() {

    if (!flavorModal) {
        return;
    }


    flavorModal.classList.remove(
        "is-open"
    );


    flavorModal.setAttribute(
        "aria-hidden",
        "true"
    );


    // Limpar seleção

    if (flavorForm) {

        flavorForm.reset();

    }


    // Remover estado visual

    if (flavorsGrid) {

        const cards =
            flavorsGrid.querySelectorAll(
                ".flavor-card"
            );


        cards.forEach(card => {

            card.classList.remove(
                "is-selected"
            );

        });

    }


    atualizarContador();

}


// ======================================================
// BOTÃO FECHAR
// ======================================================

if (closeFlavorModal) {

    closeFlavorModal.addEventListener(
        "click",
        fecharModal
    );

}


// ======================================================
// FECHAR CLICANDO NO OVERLAY
// ======================================================

const modalOverlay =
    document.querySelector(
        "[data-close-modal]"
    );


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        fecharModal
    );

}


// ======================================================
// FECHAR COM ESC
// ======================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            flavorModal &&
            flavorModal.classList.contains(
                "is-open"
            )
        ) {

            fecharModal();

        }

    }
);


// ======================================================
// CONFIRMAR SABORES
// ======================================================

if (flavorForm) {

    flavorForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            // ----------------------------------
            // VERIFICAR MODELO
            // ----------------------------------

            if (!modeloSelecionado) {

                console.error(
                    "Nenhum modelo foi selecionado."
                );

                return;

            }


            // ----------------------------------
            // PEGAR SABORES
            // ----------------------------------

            const selecionados =
                Array.from(
                    flavorForm.querySelectorAll(
                        'input[name="flavor"]:checked'
                    )
                );


            // ----------------------------------
            // NENHUM SABOR
            // ----------------------------------

            if (
                selecionados.length === 0
            ) {

                alert(
                    "Selecione pelo menos um sabor."
                );

                return;

            }


            // ----------------------------------
            // TRANSFORMAR EM OBJETO
            // ----------------------------------

            const sabores =
                selecionados.map(input => ({

                    id:
                        input.value,

                    name:
                        input.dataset.flavorName

                }));


            // ----------------------------------
            // DADOS DA ESCOLHA
            // ----------------------------------

            const escolha = {

                brand_id:
                    Number(brandId),

                product: {

                    id:
                        modeloSelecionado.id,

                    name:
                        modeloSelecionado.name

                },

                flavors:
                    sabores

            };


            // ----------------------------------
            // SALVAR
            // ----------------------------------

            sessionStorage.setItem(
                "productSelection",
                JSON.stringify(escolha)
            );


            // ----------------------------------
            // DEBUG
            // ----------------------------------

            console.log(
                "Escolha salva:",
                escolha
            );


            // ----------------------------------
            // FECHAR
            // ----------------------------------

            fecharModal();

        }
    );

}


// ======================================================
// INICIAR PÁGINA
// ======================================================

carregarModelos();
