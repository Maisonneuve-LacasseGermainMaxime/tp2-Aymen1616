import Router from "./Router.js";
import Formulaire from "./Formulaire.js";
import Exercice from "./Exercice.js";
import ToastModale from "../components/ToastModale.js";


class App {
    #exercices;
    #formulaire;
    #router;
    static #instance;

    //Permet d'accéder à l'instance de la classe de n'importe où dans le code en utilisant App.instance
    // static get instance() {
    //     return App.#instance;
    // }
    constructor() {
        // if (App.#instance) {
        //     return App.#instance;
        // } else {
        //     App.#instance = this;
        // }

        this.#exercices = [];
        this.#formulaire;

        // this.darkModeNav = document.querySelector("[data-action='dark-mode']");
        this.panneauListeHTML = document.querySelector("[data-panneau='liste']");
        this.panneauDetailHTML = document.querySelector("[data-panneau='detail']");
        this.panneauFormulaireHTML = document.querySelector("[data-panneau='formulaire']");
        this.listeExercicesHTML = this.panneauListeHTML.querySelector('[data-liste-exercices]');

        // this.darkModeNav.addEventListener("click", this.switchMode.bind(this));

        this.router = new Router(this);
        this.#formulaire = new Formulaire(this);

        // this.checkMode();
        // localStorage.clear();
    }
    // switchMode(evenement) {
    //     const bouton = evenement.target.closest("[data-mode]");
    //     if (bouton !== null) {
    //         const mode = bouton.dataset.mode;
    //         document.body.dataset.mode = mode;
    //         localStorage.setItem("todo-dark-mode", mode);
    //         this.checkMode();
    //     }
    // }
    // checkMode() {
    //     const selectedMode = localStorage.getItem("todo-dark-mode") || "light";
    //     document.body.dataset.mode = selectedMode;
    //     const boutons = this.darkModeNav.querySelectorAll("[data-mode]");
    //     boutons.forEach(function (bouton) {
    //         bouton.classList.toggle("invisible", bouton.dataset.mode == selectedMode);
    //     });
    // }

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

    async supprimer(id) {
        //Supprimer un exercice
        const reponse = await fetch(`http://localhost:80/api/exercices/supprimerUn.php?id=${id}`);
        const exercice = await reponse.json();
        //Rediriger
        history.pushState({}, "", "/");
        this.recupererTout();

        //Afficher un toast
        new ToastModale("L'exercice a été supprimée");
    }

    #cacherTout() {
        this.panneauListeHTML.classList.add("invisible");
        this.panneauDetailHTML.classList.add("invisible");
        this.panneauFormulaireHTML.classList.add("invisible");
    }

    afficherListe() {
        this.#cacherTout();
        this.panneauListeHTML.classList.remove("invisible");
        this.recupererTout();
    }

    afficherDetail(id) {
        console.log(id);
        //Récupérer le détail de l'exercice avec Fetch et le id
        console.log("panneauDetail");
        this.#cacherTout();
        this.panneauDetailHTML.classList.remove("invisible");
        //Récupérer le détail d'une tâche avec Fetch et le id
        this.recupererUn(id);
    }

    afficherFormulaire() {
        console.log("afficherFormulaire");
        this.#cacherTout();
        this.panneauFormulaireHTML.classList.remove("invisible");
        //Afficher le formulaire
    }
}

export default App;

