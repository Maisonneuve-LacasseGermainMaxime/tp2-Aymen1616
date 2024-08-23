import ToastModale from "../components/ToastModale.js";

class Formulaire {
    /**
     * Initialise une instance de la classe Formulaire.
     * @param {App} app - Instance de la classe App pour accéder aux méthodes et propriétés de l'application.
     */
    constructor(app) {
        this.app = app; // Référence à l'instance de l'application
        this.formulaireHTML = document.querySelector("form"); // Sélection du formulaire HTML
        this.submitButton = this.formulaireHTML.querySelector("#submit"); // Sélection du bouton de soumission

        // Ajout des gestionnaires d'événements pour le formulaire
        this.formulaireHTML.addEventListener("submit", this.onSoumettre.bind(this));
        this.formulaireHTML.addEventListener("input", this.onInput.bind(this));
    }

    /**
     * Active ou désactive le bouton de soumission en fonction de la validité du formulaire.
     */
    onInput() {
        // Vérifie si le formulaire est valide
        if (this.formulaireHTML.checkValidity()) {
            // Active le bouton de soumission si le formulaire est valide
            this.submitButton.classList.remove("disabled");
            this.submitButton.disabled = false;
        } else {
            // Désactive le bouton de soumission si le formulaire est invalide
            this.submitButton.classList.add("disabled");
            this.submitButton.disabled = true;
        }
    }

    /**
     * Gère la soumission du formulaire. Envoie les données du formulaire à l'API et gère la réponse.
     * @param {Event} evenement - L'événement de soumission du formulaire.
     */
    async onSoumettre(evenement) {
        evenement.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire

        // Vérifie si le formulaire est valide avant d'envoyer les données
        if (this.formulaireHTML.checkValidity()) {
            // Récupère les données du formulaire
            const body = {
                type: this.formulaireHTML.type.value,
                date: this.formulaireHTML.date.value,
                duree: this.formulaireHTML.duree.value,
                description: this.formulaireHTML.description.value,
                difficulte: this.formulaireHTML.difficulte.value,
            };

            // Configuration de la requête POST pour l'API
            const config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body), // Convertit les données en JSON
            };

            // Envoie la requête POST à l'API pour ajouter un nouvel exercice
            this.formulaireHTML.querySelector("#submit").classList.remove("disabled");
            const reponse = await fetch("http://localhost:80/api/exercices/ajouterUn.php", config);
            const message = await reponse.json(); // Récupère la réponse JSON de l'API

            // Vérifie et applique le mode sombre en cas de changement
            this.app.checkMode();

            // Affiche une notification toast avec le message de l'API
            new ToastModale(message.message);

            // Redirige l'utilisateur vers la liste des exercices après la soumission
            history.pushState({}, "", "/liste");
            this.app.router.miseAJourURL(); // Met à jour l'URL et l'état de l'application
        }
    }
}

export default Formulaire;
