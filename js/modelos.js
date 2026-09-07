import { supabase } from "./supabase.js";


// ======================================================
// ELEMENTOS DO HTML
// ======================================================

const modelsGrid = document.getElementById("models-grid");

const flavorModal = document.getElementById("flavor-modal");

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
// MARCA SELECIONADA
// ======================================================

const params = new URLSearchParams(
    window.location.search
);

const brandId = params.get("brand_id");


// ======================================================
// MODELO SELECIONADO
// ======================================================

let modeloSelecionado = null;


// ======================================================
// VERIFICAÇÃO INICIAL
// ======================================================

console.log("=================================");
console.log("PÁGINA DE MODELOS");
console.log("Brand ID:", brandId);
console.log("Models Grid:", modelsGrid);
console.log("Flavor Modal:", flavorModal);
console.log("Flavors Grid:", flavorsGrid);
console.log("=================================");


// ======================================================
// CARREGAR MODELOS
// ======================================================

async function carregarModelos() {

    // --------------------------------------------------
    // VERIFICAR GRID
    // --------------------------------------------------

    if (!modelsGrid) {

        console.error(
            "ERRO: #models-grid não foi encontrado."
        );

        return;
    }


    // --------------------------------------------------
    // VERIFICAR BRAND ID
    // --------------------------------------------------

    if (!brandId) {

        modelsGrid.innerHTML = `
            <p>
                Nenhuma marca foi selecionada.
            </p>
        `;

        console.error(
            "ERRO: nenhum brand_id foi encontrado na URL."
        );

        return;
    }


    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    modelsGrid.innerHTML = `
        <p>
            Carregando modelos...
        </p>
    `;


    try {

        console.log(
            "Buscando modelos da marca:",
            brandId
        );


        // --------------------------------------------------
        // BUSCAR MODELOS
        // --------------------------------------------------

        const {
            data,
            error
        } = await supabase

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

            .order(
                "id",
                {
                    ascending: true
                }
            );


        // --------------------------------------------------
        // ERRO
        // --------------------------------------------------

        if (error) {

            console.error(
                "Erro do Supabase ao buscar modelos:",
                error
            );

            throw error;
        }


        console.log(
            "Modelos encontrados:",
            data
        );


        // --------------------------------------------------
        // LIMPAR GRID
        // --------------------------------------------------

        modelsGrid.innerHTML = "";


        // --------------------------------------------------
        // NENHUM MODELO
        // --------------------------------------------------

        if (
            !data ||
            data.length === 0
        ) {

            modelsGrid.innerHTML = `
                <p>
                    Nenhum modelo disponível
                    para esta marca.
                </p>
            `;

            return;
        }


        // --------------------------------------------------
        // CRIAR CARDS
        // --------------------------------------------------

        data.forEach(
            modelo => {

                const card =
                    document.createElement("button");


                // --------------------------------------------------
                // TIPO
                // --------------------------------------------------

                card.type = "button";


                // --------------------------------------------------
                // CLASSE
                // --------------------------------------------------

                card.className =
                    "pod-card model-card";


                // --------------------------------------------------
                // IDs
                // --------------------------------------------------

                card.dataset.productId =
                    modelo.id;


                card.dataset.productName =
                    modelo.name;


                // --------------------------------------------------
                // HTML DO CARD
                // --------------------------------------------------

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


                // --------------------------------------------------
                // CLIQUE
                // --------------------------------------------------

                card.addEventListener(
                    "click",
                    function () {

                        console.log(
                            "Modelo clicado:",
                            modelo.id,
                            modelo.name
                        );


                        abrirModalSabores(
                            modelo.id,
                            modelo.name
                        );

                    }
                );


                // --------------------------------------------------
                // ADICIONAR
                // --------------------------------------------------

                modelsGrid.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Não foi possível carregar os modelos:",
            error
        );


        modelsGrid.innerHTML = `
            <p>
                Não foi possível carregar
                os modelos.
            </p>
        `;

    }

}


// ======================================================
// ABRIR MODAL
// ======================================================

async function abrirModalSabores(
    productId,
    productName
) {

    console.log(
        "Abrindo modal:",
        productId,
        productName
    );


    // --------------------------------------------------
    // SALVAR MODELO
    // --------------------------------------------------

    modeloSelecionado = {

        id: productId,

        name: productName

    };


    // --------------------------------------------------
    // NOME DO MODELO NO MODAL
    // --------------------------------------------------

    if (flavorModalProduct) {

        flavorModalProduct.textContent =
            `Sabores disponíveis para ${productName}.`;

    }


    // --------------------------------------------------
    // LIMPAR SABORES ANTERIORES
    // --------------------------------------------------

    if (flavorsGrid) {

        flavorsGrid.innerHTML = `
            <p>
                Carregando sabores...
            </p>
        `;

    }


    // --------------------------------------------------
    // RESETAR CONTADOR
    // --------------------------------------------------

    atualizarContador();


    // --------------------------------------------------
    // ABRIR MODAL
    // --------------------------------------------------

    if (flavorModal) {

        flavorModal.classList.add(
            "is-open"
        );

        flavorModal.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    // --------------------------------------------------
    // BUSCAR SABORES
    // --------------------------------------------------

    await carregarSabores(
        productId
    );

}


// ======================================================
// BUSCAR SABORES
// ======================================================

async function carregarSabores(
    productId
) {

    if (!flavorsGrid) {

        console.error(
            "ERRO: #flavors-grid não existe."
        );

        return;
    }


    try {

        console.log(
            "Buscando relações do produto:",
            productId
        );


        // ==================================================
        // PRIMEIRO PASSO
        // Buscar os IDs dos sabores
        // ==================================================

        const {
            data: relacionamentos,
            error: relacionamentoError
        } = await supabase

            .from("product_flavors")

            .select(
                "product_id, flavor_id"
            )

            .eq(
                "product_id",
                productId
            );


        // --------------------------------------------------
        // VERIFICAR ERRO
        // --------------------------------------------------

        if (relacionamentoError) {

            console.error(
                "Erro em product_flavors:",
                relacionamentoError
            );

            throw relacionamentoError;
        }


        console.log(
            "Relacionamentos encontrados:",
            relacionamentos
        );


        // --------------------------------------------------
        // NENHUMA RELAÇÃO
        // --------------------------------------------------

        if (
            !relacionamentos ||
            relacionamentos.length === 0
        ) {

            flavorsGrid.innerHTML = `
                <p>
                    Nenhum sabor disponível
                    para este modelo.
                </p>
            `;

            return;
        }


        // ==================================================
        // PEGAR OS IDs
        // ==================================================

        const flavorIds =
            relacionamentos.map(
                item => item.flavor_id
            );


        console.log(
            "IDs dos sabores:",
            flavorIds
        );


        // ==================================================
        // SEGUNDO PASSO
        // Buscar sabores na tabela flavors
        // ==================================================

        const {
            data: sabores,
            error: saboresError
        } = await supabase

            .from("flavors")

            .select(`
                id,
                name,
                value,
                active,
                sort_order
            `)

            .in(
                "id",
                flavorIds
            )

            .order(
                "sort_order",
                {
                    ascending: true
                }
            );


        // --------------------------------------------------
        // VERIFICAR ERRO
        // --------------------------------------------------

        if (saboresError) {

            console.error(
                "Erro na tabela flavors:",
                saboresError
            );

            throw saboresError;
        }


        console.log(
            "Sabores encontrados:",
            sabores
        );


        // --------------------------------------------------
        // LIMPAR
        // --------------------------------------------------

        flavorsGrid.innerHTML = "";


        // --------------------------------------------------
        // NENHUM SABOR
        // --------------------------------------------------

        if (
            !sabores ||
            sabores.length === 0
        ) {

            flavorsGrid.innerHTML = `
                <p>
                    Nenhum sabor disponível
                    para este modelo.
                </p>
            `;

            return;
        }


        // ==================================================
        // CRIAR CARDS
        // ==================================================

        sabores.forEach(
            sabor => {

                // --------------------------------------------------
                // LABEL
                // --------------------------------------------------

                const card =
                    document.createElement("label");


                card.className =
                    "pod-card flavor-card";


                // --------------------------------------------------
                // HTML
                // --------------------------------------------------

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


                // --------------------------------------------------
                // INPUT
                // --------------------------------------------------

                const input =
                    card.querySelector(
                        'input[name="flavor"]'
                    );


                // --------------------------------------------------
                // SELEÇÃO
                // --------------------------------------------------

                input.addEventListener(
                    "change",
                    function () {

                        card.classList.toggle(
                            "is-selected",
                            input.checked
                        );


                        atualizarContador();

                    }
                );


                // --------------------------------------------------
                // ADICIONAR
                // --------------------------------------------------

                flavorsGrid.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Erro ao carregar sabores:",
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
// ATUALIZAR CONTADOR
// ======================================================

function atualizarContador() {

    if (
        !flavorForm ||
        !flavorCounter
    ) {

        return;

    }


    const selecionados =
        flavorForm.querySelectorAll(
            'input[name="flavor"]:checked'
        );


    const quantidade =
        selecionados.length;


    if (
        quantidade === 0
    ) {

        flavorCounter.textContent =
            "0 sabores selecionados";

    }

    else if (
        quantidade === 1
    ) {

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

}


// ======================================================
// BOTÃO X
// ======================================================

if (closeFlavorModal) {

    closeFlavorModal.addEventListener(
        "click",
        fecharModal
    );

}


// ======================================================
// OVERLAY
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
// ESC
// ======================================================

document.addEventListener(
    "keydown",
    function (event) {

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
        function (event) {

            event.preventDefault();


            // --------------------------------------------------
            // VERIFICAR MODELO
            // --------------------------------------------------

            if (!modeloSelecionado) {

                console.error(
                    "Nenhum modelo selecionado."
                );

                return;

            }


            // --------------------------------------------------
            // SABORES SELECIONADOS
            // --------------------------------------------------

            const selecionados =
                Array.from(
                    flavorForm.querySelectorAll(
                        'input[name="flavor"]:checked'
                    )
                );


            // --------------------------------------------------
            // NENHUM SABOR
            // --------------------------------------------------

            if (
                selecionados.length === 0
            ) {

                alert(
                    "Selecione pelo menos um sabor."
                );

                return;

            }


            // --------------------------------------------------
            // CRIAR ARRAY
            // --------------------------------------------------

            const sabores =
                selecionados.map(
                    input => ({

                        id:
                            Number(
                                input.value
                            ),

                        name:
                            input.dataset.flavorName

                    })
                );


            // --------------------------------------------------
            // OBJETO FINAL
            // --------------------------------------------------

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


            // --------------------------------------------------
            // SALVAR
            // --------------------------------------------------

            sessionStorage.setItem(
                "productSelection",
                JSON.stringify(
                    escolha
                )
            );


            // --------------------------------------------------
            // CONSOLE
            // --------------------------------------------------

            console.log(
                "================================="
            );

            console.log(
                "ESCOLHA FINAL:"
            );

            console.log(
                escolha
            );

            console.log(
                "================================="
            );


            // --------------------------------------------------
            // FECHAR
            // --------------------------------------------------

            fecharModal();

        }
    );

}


// ======================================================
// INICIAR
// ======================================================

carregarModelos();
