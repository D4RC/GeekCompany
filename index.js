//Estado de la app
const store = new Vuex.Store({
    state: {
        criterios: [
            {
                criterio: 'Duración (en meses)',
                tipo: 'Cuantitativo',
                ponderacion: 20,
                mejor_calif: 'menor' 
            },
            {
                criterio: 'Valor presente neto',
                tipo: 'Cuantitativo',
                ponderacion: 20,
                mejor_calif: 'mayor'
            },
            {
                criterio: 'Período de recuperación de la inversión (en meses)',
                tipo: 'Cuantitativo',
                ponderacion: 20,
                mejor_calif: 'menor'
            },
            {
                criterio: 'Riesgo',
                tipo: 'Cualitativo',
                ponderacion: 20,
                mejor_calif: 'menor'
            },
            {
                criterio: 'Generación de tecnología propia',
                tipo: 'Cualitativo',
                ponderacion: 20,
                mejor_calif: 'mayor'
            }
        ]
    },
    mutations: {
        addCriterio: (state, nuevo) => {
            state.criterios.push(nuevo);
        }
    }
})

//Componente Inicial de Criterios
let Tabla = {
    
    computed: { //Métodos reactivos
        criterios() {
            return store.state.criterios
        },
        total() {
            return this.criterios.map(criterio=>criterio.ponderacion).reduce((a,b)=>a+b,0);
        }
    },
    template:`
        <table class="table is-striped">
            <thead>
                <tr>
                    <th>Criterio</th>
                    <th>Tipo</th>
                    <th>Ponderación</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(criterio,i) in criterios" :key="i">
                    <td> {{ criterio.criterio }} </td>
                    <td>
                        <span 
                            class="tag"
                            v-bind:class="{'is-primary':(criterio.tipo==='Cualitativo'), 'is-info':(criterio.tipo==='Cuantitativo')}"
                        > {{ criterio.tipo }} </span>
        
                    </td>
                    <td>
                        <div class="control">
                            <input class="input" type="number" v-model.number="criterio.ponderacion">
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                <td>
                    <!--
                    <button class="button is-light">
                        <span class="icon">
                            <i class="fas fa-plus-circle"></i>
                        </span>
                        <span>Añadir criterio</span>
                    </button>
                    -->
                </td>
                <th>Total</th>
                <th>
                    <div class="field">
                        <div class="control has-icons-right">
                            <input class="input" type="number" :value="this.total" readonly v-bind:class="{'is-danger':(this.total>100)}">
                            <span v-if="this.total>100" class="icon is-small is-right">
                                <i class="fas fa-exclamation-triangle"></i>
                            </span>
                        </div>
                        <p v-if="this.total>100" class="help is-danger">La suma excede el 100%</p>
                    </div>
                </th>
                </tr>
            </tfoot>
        </table>
    `
};

//Componente para añadir nuevos criterios
let PanelAgregar = {
    data() { //Estado local del componente
        return {
            nuevo: {
                criterio: '',
                tipo: '',
                ponderacion: 20,
                mejor_calif: ''
            }
        }
    },
    methods: {
        Agregar: function(){
            store.commit('addCriterio', Object.assign({}, this.nuevo))
        }
    },
    template: `
    <div class="box">
        <div>
            <form>
                <div class="field has-text-left">
                    <label class="label">Nuevo criterio</label>
                    <div class="control">
                        <input class="input" type="text" v-model="nuevo.criterio">
                    </div>
                </div>
                <br>
                <div class="columns">
                    <div class="column is-1">
                    </div>
                    <div class="column">
                        <div class="field">
                            <div class="control">
                                <label class="radio">
                                    <input type="radio" name="Tipo" value="Cuantitativo" v-model="nuevo.tipo">
                                    Cuantitativo (El criterio acepta valores numéricos)
                                </label>
                            </div>
                            <div class="control">
                                <label class="radio">
                                    <input type="radio" name="Tipo" value="Cualitativo" v-model="nuevo.tipo">
                                    Cualitativo (Se elige una de las categorias establecidas)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <div class="field has-text-left">
                    <label class="label">Mejor calificación es otorgada al valor</label>
                    <div class="control">
                        <div class="select">
                            <select v-model="nuevo.mejor_calif">
                                <option>Menor</option>
                                <option>Mayor</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>

        <br>
        <a class="button is-link is-fullwidth" v-on:click="Agregar">Añadir</a>
    </div>`
}

//Vista principal
let principal = {
    components: {
        'tabla': Tabla,
        'agregar': PanelAgregar
    },
    data() {
        return {
            mostrar: false
        }
    },
    template: `
    <div>
        <!--
        <section class="hero is-dark is-bold">
            <div class="hero-body">
              <div class="container">
                <h1 class="title">
                  Establecimiento de criterios
                </h1>
                <h2 class="subtitle"></h2>
              </div>
            </div>
        </section>
        -->


        <section class="section">
        <div class="container">
            <tabla></tabla>
            <a class="button" v-on:click="mostrar=true">
                <span class="icon">
                    <i class="fas fa-plus-circle"></i>
                </span>
                <span>Añadir criterio</span>
            </a>
        </div>
        
        <div class="modal is-active"
            v-show="mostrar"
            @close="mostrar=false"
        >
            <div class="modal-background" v-on:click="mostrar=false"></div>
            <div class="modal-content">
                <agregar></agregar>
            </div>
            <button class="modal-close is-large"
            @click="mostrar=false"></button>
        </div>
        </section>
    </div>
    `
}

//Direcciones
const routes = [
    {path: '/', component: principal}
]

const router = new VueRouter({
    routes
})

//Constructor de la app
var app = new Vue({
    router
}).$mount('#app')
