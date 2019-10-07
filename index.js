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
        ],
        proyectos: [
            {
                identificador: 'A',
                descripcion: '',
                costo: ''
            },
            {
                identificador: 'B',
                descripcion: '',
                costo: ''
            },
            {
                identificador: 'C',
                descripcion: '',
                costo: ''
            },
            {
                identificador: 'D',
                descripcion: '',
                costo: ''
            }
        ],
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
                ponderacion: 0,
                mejor_calif: ''
            }
        }
    },
    methods: {
        Agregar: function(){
            store.commit('addCriterio', Object.assign({}, this.nuevo))

            //Reiniciar 
            this.nuevo.criterio=''
            this.nuevo.tipo=''
            this.nuevo.mejor_calif=''

            //Emitiendo a componente:principal
            this.$emit('no-mostrar')
        }
    },
    template: `
    <div class="box">
        <div>
            <form id="formAg" v-on:submit.prevent="Agregar">
                <div class="field has-text-left">
                    <label class="label">Nuevo criterio</label>
                    <div class="control">
                        <input class="input" type="text" v-model="nuevo.criterio" required>
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
                                    <input type="radio" name="Tipo" value="Cuantitativo" v-model="nuevo.tipo" required>
                                    Cuantitativo (El criterio acepta valores numéricos)
                                </label>
                            </div>
                            <div class="control">
                                <label class="radio">
                                    <input type="radio" name="Tipo" value="Cualitativo" v-model="nuevo.tipo" required>
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
                            <select v-model="nuevo.mejor_calif" required>
                                <option>Menor</option>
                                <option>Mayor</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>

        <br>
        <button type="submit" form="formAg" class="button is-link is-fullwidth">Añadir</button>
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
                <agregar v-on:no-mostrar="mostrar=false"></agregar>
            </div>
            <button class="modal-close is-large"
            @click="mostrar=false"></button>
        </div>
        </section>
    </div>
    `
}

let estructura = {
    data() {
        return {
            Scriterios: {},
            edicion: true,
            priority: false
        }
    },
    created() {
        this.Scriterios = this.estructura();
        console.log(this.Scriterios)
    },
    methods: {
        proyectos() {
            var l=store.state.proyectos.map(criterio=>criterio.identificador)
            console.log(l)
            return l
        },
        estructura() {
            return store.state.criterios.map((criterio)=>{
                var fila = {}
                fila['nombre'] = criterio.criterio;
                fila['ponderacion'] = criterio.ponderacion;
                fila['tipo'] = (criterio.tipo==='Cuantitativo')? true:false;
                fila['orden'] = (criterio.mejor_calif==='mayor')? true:false;
            
                var columnas = store.state.proyectos.map((proyecto, i)=>{
                    var columna = {}
                    columna['indice'] = i;
                    columna['valor'] = null;
                    columna['prioridad'] = null;
                    return columna
                })
                fila['proyectos'] = columnas;
                return fila;
            })
        },
        ordenar(x) {
            //Considerando[omitiendo] una previa conversión cuantitativa de los valores cualitativos
            if(x.orden) 
                x.proyectos.sort((a,b)=>{return a.valor-b.valor});
            else 
                x.proyectos.sort((a,b)=>{return b.valor-a.valor});
        },
        prioridad(x) {
            //Asignación de prioridad basada en ordenamiento
            x.proyectos.map((proyecto,i)=> {
                proyecto.prioridad = 2*i + 1;
            })
            
            //Restricción a criterios empatados
            x.proyectos.forEach((proyecto,i) => {
                if(i!==0)
                    if(proyecto.valor===x.proyectos[i-1].valor)
                        proyecto.prioridad=x.proyectos[i-1].prioridad;
            });
            
            //Restructuración del orden indexado
            x.proyectos.sort((a,b)=>{return a.indice-b.indice});
        },
        calcular() {
            this.edicion=false
            this.Scriterios.map((criterio)=>{
                this.ordenar(criterio)
            })
            
            this.Scriterios.map((criterio)=>{
                this.prioridad(criterio)
            })
            this.priority=true
        },
        suma(x) {
            var suma=[]
            var cantidad_proyectos = x[0].proyectos.length;
            for(let i=0; i<cantidad_proyectos; i++) 
                suma[i]=x.map(criterio=>criterio.proyectos[i].prioridad*criterio.ponderacion/100).reduce((a,b)=>a+b,0);
            return suma;
        }
    },
    template: `
    <div>
    <table>
        <thead>
            <tr>
                <th>Criterio</th>
                <th v-for="(proyecto,i) in proyectos()" :key="i"> {{ proyecto }} </th>
            </tr>
        </thead>
        <tbody v-if="edicion">
            <tr v-for="(criterio,i) in Scriterios" :key="i">
                <td> {{ criterio.nombre }} </td>
                <td v-for="(proyecto,j) in criterio.proyectos" :key="j">
                    <input v-if="criterio.tipo" type="number" v-model.number="proyecto.valor">
                    <select v-else v-model.number="proyecto.valor">
                        <option value="1">Muy bajo</option>
                        <option value="2">Bajo</option>
                        <option value="3">Moderado</option>
                        <option value="4">Alto</option>
                        <option value="5">Muy alto</option>
                    </select>
                </td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr v-for="(criterio,i) in Scriterios" :key="i">
                <td> {{ criterio.nombre }} </td>
                <td v-for="proyecto in criterio.proyectos" :key="proyecto.indice">
                    <span v-if="priority"> {{ proyecto.prioridad }} </span>
                    <span v-else> {{proyecto.valor }} </span>
                </td>
            </tr>
            <tr>
                <td></td>
                <td v-for="(suma,i) in suma(Scriterios)" :key="i">
                    {{ suma }}
                </td>
            </tr>
        </tbody>
    </table>
    
    <button @click="calcular">Calcular</button>
    </div>
    `
}


//Direcciones
const routes = [
    {path: '/', component: principal},
    {path: '/s', component: estructura}
]

const router = new VueRouter({
    routes
})

//Constructor de la app
var app = new Vue({
    router
}).$mount('#app')

