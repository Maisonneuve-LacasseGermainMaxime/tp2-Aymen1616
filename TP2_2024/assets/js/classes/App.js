import Router from "./Router.js";
import Formulaire from "./Formulaire.js";
import Exercice from "./Exercice.js";
import ToastModale from "../components/ToastModale.js";

class App {
    #exercices; // Stocke la liste des exercices
    #formulaire; // Instance du formulaire pour ajouter ou modifier des exercices
    #router; // Instance du routeur pour la gestion de l'historique et des vues

    constructor() {
        // Initialisation des propriétés privées et des éléments de l'interface
        this.#exercices = [];
        this.#formulaire;

        // Sélection des éléments HTML pour les différents panneaux
        this.darkModeNav = document.querySelector("[data-action='dark-mode']");
        this.panneauListeHTML = document.querySelector("[data-panneau='liste']");
        this.panneauDetailHTML = document.querySelector("[data-panneau='detail']");
        this.panneauFormulaireHTML = document.querySelector("[data-panneau='formulaire']");
        this.listeExercicesHTML = this.panneauListeHTML.querySelector('[data-liste-exercices]');

        // Gestionnaire d'événements pour le changement de mode sombre
        this.darkModeNav.addEventListener("click", this.switchMode.bind(this));

        // Initialisation du routeur et du formulaire
        this.router = new Router(this);
        this.#formulaire = new Formulaire(this);

        // Gestionnaire d'événements pour le bouton de suppression dans le panneau de détail
        this.panneauDetailHTML.addEventListener("click", this.onDetailButtonClick.bind(this));

        // Vérifie et applique le mode sombre lors de l'initialisation
        this.checkMode();
        // localStorage.clear(); // Commenté pour éviter d'effacer localStorage au démarrage
    }

    /**
     * Change le mode sombre en fonction du bouton cliqué et met à jour le stockage local.
     * @param {Event} evenement - L'événement de clic sur le bouton de changement de mode.
     */
    switchMode(evenement) {
        const bouton = evenement.target.closest("[data-mode]");
        if (bouton !== null) {
            const mode = bouton.dataset.mode;
            document.body.dataset.mode = mode;
            localStorage.setItem("todo-dark-mode", mode);
            this.checkMode();
        }
    }

    /**
     * Vérifie et applique le mode sombre stocké dans localStorage.
     */
    checkMode() {
        const selectedMode = localStorage.getItem("todo-dark-mode") || "light";
        document.body.dataset.mode = selectedMode;
        const boutons = this.darkModeNav.querySelectorAll("[data-mode]");
        boutons.forEach(function (bouton) {
            bouton.classList.toggle("invisible", bouton.dataset.mode == selectedMode);
        });
    }

    /**
     * Récupère tous les exercices depuis l'API et met à jour l'affichage de la liste.
     */
    async recupererTout() {
        const reponse = await fetch("http://localhost:80/api/exercices/lireTout.php");
        const exercices = await reponse.json();

        this.#exercices = [];
        this.listeExercicesHTML.innerHTML = "";

        exercices.forEach((exercice) => {
            this.#exercices.push(exercice);
            new Exercice(exercice, this.listeExercicesHTML, this);
        });
    }

    /**
     * Récupère les détails d'un exercice spécifique depuis l'API et met à jour l'affichage du panneau de détail.
     * @param {number} id - L'identifiant de l'exercice à récupérer.
     */
    async recupererUn(id) {
        const reponse = await fetch(`http://localhost:80/api/exercices/lireUn.php?id=${id}`);
        const exercice = await reponse.json();
        const exercicesInfos = exercice[0];
        const { type, duree, description, date, difficulte } = exercicesInfos;

        this.panneauDetailHTML.querySelector("[data-type]").textContent = type;
        this.panneauDetailHTML.querySelector("[data-duree]").textContent = duree;
        this.panneauDetailHTML.querySelector("[data-date]").textContent = date;
        this.panneauDetailHTML.querySelector("[data-description]").textContent = description;
        this.panneauDetailHTML.querySelector("[data-difficulte]").textContent = difficulte;
    }

    /**
     * Supprime un exercice spécifique via l'API, met à jour la liste et affiche un message toast.
     * @param {number} id - L'identifiant de l'exercice à supprimer.
     */
    async supprimer(id) {
        try {
            // Supprimer un exercice
            const reponse = await fetch(`http://localhost:80/api/exercices/supprimerUn.php?id=${id}`);
            const exercice = await reponse.json();
            // Rediriger vers la liste des exercices
            history.pushState({}, "", "/afficher");
            this.recupererTout();
            this.afficherListe();

            // Afficher un toast pour indiquer que l'exercice a été supprimé
            new ToastModale("L'exercice a été supprimé");
        } catch (error) {
            new ToastModale(error.message);
        }
    }

    /**
     * Gère le clic sur le bouton de suppression dans le panneau de détail.
     * @param {Event} e - L'événement de clic sur le bouton.
     */
    onDetailButtonClick(e) {
        const button = e.target.closest("#supprimer");
        if (button) {
            const id = button.dataset.id;
            this.supprimer(id);
        }
    }

    /**
     * Cache tous les panneaux (liste, détail, formulaire).
     */
    #cacherTout() {
        this.panneauListeHTML.classList.add("invisible");
        this.panneauDetailHTML.classList.add("invisible");
        this.panneauFormulaireHTML.classList.add("invisible");
    }

    /**
     * Affiche le panneau de liste des exercices et récupère les exercices depuis l'API.
     */
    afficherListe() {
        this.#cacherTout();
        this.panneauListeHTML.classList.remove("invisible");
        this.recupererTout();
        this.checkMode();
    }

    /**
     * Affiche le panneau de détail pour un exercice spécifique et récupère ses détails depuis l'API.
     * @param {number} id - L'identifiant de l'exercice à afficher.
     */
    afficherDetail(id) {
        this.#cacherTout();
        this.panneauDetailHTML.classList.remove("invisible");
        this.recupererUn(id);
        this.checkMode(); 

        // Mettre à jour le bouton de suppression avec l'ID de l'exercice
        const boutonSupprimer = this.panneauDetailHTML.querySelector("#supprimer");
        boutonSupprimer.dataset.id = id;
    }

    /**
     * Affiche le formulaire pour ajouter ou modifier un exercice.
     */
    afficherFormulaire() {
        this.#cacherTout();
        this.panneauFormulaireHTML.classList.remove("invisible");
        this.checkMode();
    }
}

export default App;
