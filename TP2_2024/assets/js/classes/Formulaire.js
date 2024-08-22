class FormulaireTache {
    constructor(app) {
        this.app = app;
        this.formulaireHTML = document.querySelector("form");
        this.formulaireHTML.addEventListener("submit", this.onSoumettre.bind(this));
    }

    async onSoumettre(evenement) {
        evenement.preventDefault();

        if (this.formulaireHTML.checkValidity()) {
            const body = {
                type: this.formulaireHTML.type.value,
                date: this.formulaireHTML.date.value,
                duree: this.formulaireHTML.duree.value,
                description: this.formulaireHTML.description.value,
                difficulte: this.formulaireHTML.difficulte.value,
            };

            const config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            };

            const reponse = await fetch("http://localhost:80/api/exercices/ajouterUn.php", config);
            const message = await reponse.json();
            console.log(message);
            //Rediriger vers la liste après
            history.pushState({}, "", "/liste");
            this.app.router.miseAJourURL();
        }
    }
}

export default FormulaireTache;
