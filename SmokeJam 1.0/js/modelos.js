import { supabase } from "./supabase.js";

const modelsGrid = document.getElementById("models-grid");


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

    // Verifica se existe uma marca na URL

    if (!brandId) {

        console.error(
            "Nenhum brand_id foi encontrado na URL."
        );

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


        // --------------------------------------
        // VERIFICAR ERRO
        // --------------------------------------

        if (error) {

            console.error(
                "Erro retornado pelo Supabase:",
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
// INICIAR
// ==========================================

carregarModelos();