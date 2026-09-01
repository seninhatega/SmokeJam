import { supabase } from "./supabase.js";

const brandsGrid = document.getElementById("brands-grid");


async function carregarMarcas() {

    try {

        const { data, error } = await supabase
            .from("brands")
            .select("id, name, active")
            .eq("active", true)
            .order("id", {
                ascending: true
            });


        if (error) {
            throw error;
        }


        brandsGrid.innerHTML = "";


        if (!data || data.length === 0) {

            brandsGrid.innerHTML = `
                <p>
                    Nenhuma marca disponível.
                </p>
            `;

            return;
        }


        data.forEach(marca => {

            const card = document.createElement("a");

            card.href =
                `pages/modelos.html?brand_id=${marca.id}`;

            card.className = "pod-card";


            card.innerHTML = `

                <div class="pod-card__image-wrapper">

                    <img
                        src="assets/images/review-pod-ignite.webp"
                        class="pod-card__image"
                        alt="${marca.name}"
                    >

                </div>


                <div class="pod-card__content">

                    <h3 class="pod-card__title">
                        ${marca.name}
                    </h3>


                    <span class="pod-card__action">
                        Escolher modelos
                    </span>

                </div>

            `;


            brandsGrid.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Erro ao carregar marcas:",
            error
        );


        brandsGrid.innerHTML = `
            <p>
                Não foi possível carregar as marcas.
            </p>
        `;

    }

}


carregarMarcas();