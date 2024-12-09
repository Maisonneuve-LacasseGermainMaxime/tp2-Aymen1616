class Exercice {
    /**
     * Initialise une instance de la classe Exercice.
     * @param {Object} exercicesInfos - Informations sur l'exercice (id, type, duree, description, date, difficulte).
     * @param {Element} conteneur - Élément HTML où l'exercice sera ajouté.
     * @param {App} app - Instance de la classe App pour accéder aux méthodes et propriétés de l'application.
     */
    constructor(exercicesInfos, conteneur, app) {
        // Destructuration des informations de l'exercice
        const { id, type, duree, description, date, difficulte } = exercicesInfos;
        this.conteneur = conteneur; // Élément HTML pour ajouter l'exercice
        this.app = app; // Référence à l'instance de l'application

        // Propriétés de l'exercice
        this.id = id;
        this.type = type;
        this.duree = duree;
        this.description = description;
        this.date = date;
        this.difficulte = difficulte;

        // Sélection du template HTML pour l'exercice
        this.gabaritExercices = document.querySelector("template#exercice");
        
        // Injecte le HTML de l'exercice dans le conteneur
        this.injecterHTML();
    }

    /**
     * Injecte le HTML de l'exercice dans le conteneur.
     * Remplace les placeholders dans le template par les informations de l'exercice.
     */
    injecterHTML() {
        // Clone le contenu du template
        let clone = this.gabaritExercices.content.cloneNode(true);

        // Ajoute le clone au conteneur
        this.conteneur.append(clone);
        
        // Sélectionne le dernier enfant ajouté (le clone de l'exercice)
        this.elementHTML = this.conteneur.lastElementChild;

        // Remplace les placeholders dans le HTML par les données de l'exercice
        this.elementHTML.id = this.id;
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{date}}/g, this.date);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{id}}/g, this.id);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{duree}}/g, this.duree);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{type}}/g, this.type);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{description}}/g, this.description);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{difficulte}}/g, this.difficulte);

        // Ajoute un gestionnaire d'événements pour le clic sur l'exercice
        this.elementHTML.addEventListener("click", this.onClic.bind(this));
    }

    /**
     * Gère le clic sur l'exercice. Met à jour l'URL et l'état de l'application.
     * @param {Event} evenement - L'événement de clic sur l'exercice.
     */
    onClic(evenement) {
        // Trouve l'élément le plus proche avec la classe "exercice" pour s'assurer qu'on a cliqué sur le bon élément
        const declencheur = evenement.target;
        const exercice = declencheur.closest(".exercice");

        // Met à jour l'historique de navigation pour afficher les détails de l'exercice
        history.pushState({}, "", `/detail/${this.id}`);

        // Vérifie le mode (sombre ou clair) après avoir mis à jour l'URL
        this.app.checkMode();

        // Met à jour l'état de l'application avec la nouvelle URL
        this.app.router.miseAJourURL();
    }
}

export default Exercice;
