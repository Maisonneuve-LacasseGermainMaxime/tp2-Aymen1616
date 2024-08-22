class Exercice {
    constructor(exercicesInfos, conteneur, app) {
        const { id, type, duree, description, date, difficulte } = exercicesInfos;
        this.conteneur = conteneur;
        this.app = app;

        this.id = id;
        this.type = type;
        this.duree = duree;
        this.description = description;
        this.date = date;
        this.difficulte = difficulte;

        this.gabaritExercices = document.querySelector("template#exercice");
        this.injecterHTML();
    }

    injecterHTML() {
        let clone = this.gabaritExercices.content.cloneNode(true);

        this.conteneur.append(clone);
        this.elementHTML = this.conteneur.lastElementChild;
console.log(this.id);

        this.elementHTML.id = this.id;
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{date}}/g, this.date);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{id}}/g, this.id);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{duree}}/g, this.duree);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{type}}/g, this.type);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{description}}/g, this.description);
        this.elementHTML.innerHTML = this.elementHTML.innerHTML.replaceAll(/{{difficulte}}/g, this.difficulte);

        this.elementHTML.addEventListener("click", this.onClic.bind(this));
    }

    onClic(evenement) {
        const declencheur = evenement.target;
        // const bouton = declencheur.closest("[data-action='supprimer']");
        const exercice = declencheur.closest(".exercice");
       

        // if (bouton !== null) {
        //     //Supprime
        //     const id = tache.id;
         //this.app.recupererUn(this.id);
console.log("ici", this.id);

        // } else {
            history.pushState({}, "", `/detail/${this.id}`);
            this.app.router.miseAJourURL();
        // }
    }
}

export default Exercice;
