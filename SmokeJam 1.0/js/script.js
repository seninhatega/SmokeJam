document.addEventListener("DOMContentLoaded", () => {
    const lockButton = document.querySelector(".header__lock");
    const podCards = document.querySelectorAll(".pod-card");
    const podTitle = document.querySelector("#pod-title");
    const podImage = document.querySelector("#pod-image");
    const flavorForm = document.querySelector("#flavor-form");

    /*
     * =========================
     * ÁREA DE ACESSO
     * =========================
     */

    if (lockButton) {
        lockButton.addEventListener("click", () => {
            console.log(
                "Área de acesso disponível em uma futura atualização."
            );
        });
    }

    /*
     * =========================
     * SELEÇÃO DA pod
     * =========================
     */

    podCards.forEach((card) => {
        card.addEventListener("click", () => {
            const pod = card.dataset.pod;

            if (pod) {
                sessionStorage.setItem("selectedpod", pod);
            }
        });
    });

    /*
     * =========================
     * DADOS DAS podS
     * =========================
     */

    const pods = {
        margherita: {
            name: "Margherita",
            image: "assets/images/pod-margherita.jpg"
        },

        calabresa: {
            name: "Calabresa",
            image: "assets/images/pod-calabresa.jpg"
        },

        "frango-catupiry": {
            name: "Frango com Catupiry",
            image: "assets/images/pod-frango-catupiry.jpg"
        },

        portuguesa: {
            name: "Portuguesa",
            image: "assets/images/pod-portuguesa.jpg"
        },

        "quatro-queijos": {
            name: "Quatro Queijos",
            image: "assets/images/pod-quatro-queijos.jpg"
        },

        pepperoni: {
            name: "Pepperoni",
            image: "assets/images/pod-pepperoni.jpg"
        }
    };

    /*
     * =========================
     * IDENTIFICAÇÃO DA PÁGINA
     * =========================
     */

    const urlParams = new URLSearchParams(window.location.search);
    const selectedpod = urlParams.get("pod");

    if (podTitle && podImage) {
        const pod = pods[selectedpod];

        if (pod) {
            podTitle.textContent = pod.name;
            podImage.src = pod.image;
            podImage.alt = `pod ${pod.name}`;
        } else {
            podTitle.textContent = "Escolha sua pod";
            podImage.alt = "pod em destaque";
        }
    }

    /*
     * =========================
     * SELEÇÃO DOS SABORES
     * =========================
     */

    if (flavorForm) {
        const flavorInputs = flavorForm.querySelectorAll(
            'input[name="flavor"]'
        );

        flavorInputs.forEach((input) => {
            input.addEventListener("change", () => {
                const card = input.closest(".pod-card");

                if (!card) {
                    return;
                }

                if (input.checked) {
                    card.style.borderColor = "var(--color-green)";
                } else {
                    card.style.borderColor = "var(--color-surface)";
                }
            });
        });

        /*
         * =========================
         * CONFIRMAÇÃO
         * =========================
         */

        flavorForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const selectedFlavors = Array.from(
                flavorForm.querySelectorAll(
                    'input[name="flavor"]:checked'
                )
            ).map((input) => input.value);

            if (selectedFlavors.length === 0) {
                console.log("Nenhum sabor selecionado.");
                return;
            }

            const orderData = {
                pod: selectedpod,
                flavors: selectedFlavors
            };

            sessionStorage.setItem(
                "podOrder",
                JSON.stringify(orderData)
            );

            console.log("Pedido preparado:", orderData);
        });
    }
});