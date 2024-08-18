class App {
    static #instance;

    //Permet d'accéder à l'instance de la classe de n'importe où dans le code en utilisant App.instance
    static get instance() {
        return App.#instance;
    }

    constructor() {
        if (App.#instance) {
            return App.#instance;
        } else {
            App.#instance = this;
        }
    }
}

export default App;
