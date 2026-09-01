import { supabase } from "./supabase.js";


// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

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


// ==========================================
// PEGAR MARCA DA URL
// ==========================================

const params = new URLSearchParams(
    window.location.search
);

const brandId = params.get("brand_id");

console.log("ID da marca:", brandId);


// ==========================================
// CARREGAR MODELOS
// ==========================================

async function carregarModelos() {

    if (!brandId) {

        modelsGrid.innerHTML = `
            <p>
                Nenhuma marca foi selecionada.
            </p>
        `;

        return;
    }


    try {

        const { data, error } = await supabase
            .from("products")
            .select(`
                id,
                brand_id,
                name,
                active
            `)
            .eq("brand_id", Number(brandId))
            .eq("active", true)
            .order("id", {
                ascending: true
            });


        if (error) {
            throw error;
        }


        console.log(
            "Modelos encontrados:",
            data
        );


        modelsGrid.innerHTML = "";


        if (!data || data.length === 0) {

            modelsGrid.innerHTML = `
                <p>
                    Nenhum modelo disponível
                    para esta marca.
                </p>
            `;

            return;
        }


        // ==================================
        // CRIAR CARDS
        // ==================================

        data.forEach(modelo => {

            const card =
                document.createElement("button");


            card.type = "button";

            card.className =
                "pod-card model-card";


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


            // Guardar ID do produto

            card.dataset.productId =
                modelo.id;


            // Guardar nome do produto

            card.dataset.productName =
                modelo.name;


            // Clique no modelo

            card.addEventListener(
                "click",
                () => {

                    abrirModalSabores(
                        modelo.id,
                        modelo.name
                    );

                }
            );


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


// ==========================================
// ABRIR MODAL
// ==========================================

async function abrirModalSabores(
    productId,
    productName
) {

    console.log(
        "Modelo selecionado:",
        productId,
        productName
    );


    // Atualizar nome no modal

    flavorModalProduct.textContent =
        `Sabores disponíveis para ${productName}.`;


    // Abrir modal

    flavorModal.classList.add("is-open");

    flavorModal.setAttribute(
        "aria-hidden",
        "false"
    );


    // Mostrar carregamento

    flavorsGrid.innerHTML = `
        <p>
            Carregando sabores...
        </p>
    `;


    // Resetar contador

    atualizarContador();


    // Buscar sabores

    await carregarSabores(productId);

}


// ==========================================
// CARREGAR SABORES DO MODELO
// ==========================================

async function carregarSabores(productId) {

    try {

        /*
         * product_flavors conecta:
         *
         * product_id
         *      ↓
         * flavor_id
         *
         * Depois buscamos os dados
         * na tabela flavors.
         */

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


        if (error) {
            throw error;
        }


        console.log(
            "Sabores encontrados:",
            data
        );


        flavorsGrid.innerHTML = "";


        if (!data || data.length === 0) {

            flavorsGrid.innerHTML = `
                <p>
                    Nenhum sabor disponível
                    para este modelo.
                </p>
            `;

            return;
        }


        // ==================================
        // CRIAR CARDS DOS SABORES
        // ==================================

        data.forEach(item => {

            const sabor = item.flavors;


            if (!sabor || !sabor.active) {
                return;
            }


            const label =
                document.createElement("label");


            label.className =
                "pod-card flavor-card";


            label.innerHTML = `

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


            const input =
                label.querySelector(
                    'input[name="flavor"]'
                );


            // ==================================
            // SELEÇÃO
            // ==================================

            input.addEventListener(
                "change",
                () => {

                    label.classList.toggle(
                        "is-selected",
                        input.checked
                    );


                    atualizarContador();

                }
            );


            flavorsGrid.appendChild(label);

        });


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


// ==========================================
// CONTADOR DE SABORES
// ==========================================

function atualizarContador() {

    if (!flavorForm) {
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

    } else if (quantidade === 1) {

        flavorCounter.textContent =
            "1 sabor selecionado";

    } else {

        flavorCounter.textContent =
            `${quantidade} sabores selecionados`;

    }

}


// ==========================================
// FECHAR MODAL
// ==========================================

function fecharModal() {

    flavorModal.classList.remove(
        "is-open"
    );

    flavorModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


// Botão X

if (closeFlavorModal) {

    closeFlavorModal.addEventListener(
        "click",
        fecharModal
    );

}


// Clicar fora do modal

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


// Tecla ESC

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            flavorModal.classList.contains(
                "is-open"
            )
        ) {

            fecharModal();

        }

    }
);


// ==========================================
// CONFIRMAR SABORES
// ==========================================

if (flavorForm) {

    flavorForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const selecionados =
                Array.from(
                    flavorForm.querySelectorAll(
                        'input[name="flavor"]:checked'
                    )
                );


            if (selecionados.length === 0) {

                alert(
                    "Selecione pelo menos um sabor."
                );

                return;

            }


            const sabores =
                selecionados.map(input => ({
                    id: input.value,
                    name:
                        input.dataset.flavorName
                }));


            console.log(
                "Sabores selecionados:",
                sabores
            );


            sessionStorage.setItem(
                "selectedFlavors",
                JSON.stringify(sabores)
            );


            fecharModal();

        }
    );

}


// ==========================================
// INICIAR
// ==========================================

carregarModelos();
