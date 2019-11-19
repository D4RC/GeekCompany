//Estado de la app
const store = new Vuex.Store({
    state: {
        criterios: [
            {
                criterio: 'Duración (en meses)',
                tipo: 'Cuantitativo',
                ponderacion: 20,
                mejor_calif: 'Menor',
                eliminable: false 
            },
            {
                criterio: 'Valor presente neto',
                tipo: 'Cuantitativo',
                ponderacion: 20,
                mejor_calif: 'Mayor',
                eliminable: false 
            },
            {
                criterio: 'Período de recuperación de la inversión (en meses)',
                tipo: 'Cuantitativo',
                ponderacion: 20,
                mejor_calif: 'Menor',
                eliminable: false 
            },
            {
                criterio: 'Riesgo',
                tipo: 'Cualitativo',
                ponderacion: 20,
                mejor_calif: 'Menor',
                eliminable: false 
            },
            {
                criterio: 'Generación de tecnología propia',
                tipo: 'Cualitativo',
                ponderacion: 20,
                mejor_calif: 'Mayor',
                eliminable: false 
            }
        ],
        proyectos: [
            {
                identificador: 'A',
                descripcion: '',
                costo: 30000,
                prioridad: null
            },
            {
                identificador: 'B',
                descripcion: '',
                costo: 30000,
                prioridad: null
            },
            {
                identificador: 'C',
                descripcion: '',
                costo: 10000,
                prioridad: null
            },
            {
                identificador: 'D',
                descripcion: '',
                costo: 60000,
                prioridad: null
            }
        ],
    },
    mutations: {
        addCriterio: (state, nuevo) => {
            state.criterios.push(nuevo);
        },
        determinarPrioridad: (state, orden) => {
            orden.map((el,i)=>{
                state.proyectos[el.index].prioridad=i+1;
            })
            console.log(state.proyectos);
        },
        addProyecto:(state, nuevo)=>{
            state.proyectos.push(nuevo);
        }
    }
})

//Componente para añadir nuevos criterios
let PanelAgregar = {
    data() { //Estado local del componente
        return {
            nuevo: {
                criterio: '',
                tipo: '',
                ponderacion: 0,
                mejor_calif: '',
                eliminable: true
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

//Componente Inicial de Criterios
let Tabla = {
    data() {
        return {
            mostrar: false
        }
    },
    components: {
        'agregar': PanelAgregar
    },
    computed: { //Métodos reactivos
        criterios() {
            return store.state.criterios
        },
        total() {
            return this.criterios.map(criterio=>criterio.ponderacion).reduce((a,b)=>a+b,0);
        }
    },
    methods: {
        eliminar(i) {
            store.state.criterios.splice(i,1);
        }
    },
    template:`
    <div>
        <table class="table is-striped">
            <thead>
                <tr>
                    <th>Criterio</th>
                    <th>Tipo</th>
                    <th>Ponderación</th>
                </tr>
            </thead>
            <tbody name="list" is="transition-group">
                <tr v-for="(criterio,i) in criterios" :key="criterio.criterio">
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
                        <div v-if="criterio.eliminable"><button @click="eliminar(i)">Eliminar</button></div>
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

        <a class="button" v-on:click="mostrar=true">
            <span class="icon">
                <i class="fas fa-plus-circle"></i>
            </span>
            <span>Añadir criterio</span>
        </a>
        <router-link class="button" to="/proyectos">Siguiente</router-link>
    </div>
    `
};


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
        <section class="hero is-dark is-bold">
            <div class="hero-body">
              <div class="container">
                <h1 class="title">
                  Selección estrategica de proyectos
                </h1>
                <h2 class="subtitle">{{this.$route.name}}</h2>
              </div>
            </div>

            <div class="hero-foot">
                <nav class="tabs">
                  <div class="container">
                    <ul>
                        <li><router-link to="/criterios">Criterios</router-link></li>
                        <li><router-link to="/proyectos">Proyectos</router-link></li>
                        <li><router-link to="/datos">Datos</router-link></li>
                        <li><router-link to="/orden">Presupuesto</router-link></li>
                      </ul>
                  </div>
                </nav>
            </div>
        </section>

        <section class="section">
        <div class="container">
            <router-view></router-view>
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
    },
    methods: {
        proyectos() {
            var l=store.state.proyectos.map(criterio=>criterio.identificador)
            return l
        },
        estructura() {
            return store.state.criterios.map((criterio)=>{
                var fila = {}
                fila['nombre'] = criterio.criterio;
                fila['ponderacion'] = criterio.ponderacion;
                fila['tipo'] = (criterio.tipo==='Cuantitativo')? true:false;
                fila['orden'] = (criterio.mejor_calif==='Mayor')? true:false;
            
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
            this.prioridad_final();
        },
        suma(x) {
            var suma=[]
            var cantidad_proyectos = x[0].proyectos.length;
            for(let i=0; i<cantidad_proyectos; i++) 
                suma[i]=x.map(criterio=>criterio.proyectos[i].prioridad*criterio.ponderacion/100).reduce((a,b)=>a+b,0);
            return suma;
        },
        prioridad_final() { //Hace el commit de la prioridad del proyecto en el estado
            var mapa = this.suma(this.Scriterios).map(function(el,i) {
                return {index: i, value: el};
            })
            mapa.sort((a,b)=>{
                if(a.value<b.value) {return 1;}
                if(a.value>b.value) {return -1;}
                return 0;
            });
            store.commit('determinarPrioridad',mapa)
        }
    },
    template: `
    <div class="container">  
    <table class="table is-striped">
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
                    {{ suma.toFixed(2) }}
                </td>
            </tr>
        </tbody>
    </table>
    
    <button @click="calcular">Calcular</button>
    </div>
    `
}

let proyectosOrdenados = {
    data() {
        return {
            presupuesto: 0,
            viables: []
        }
    },
    computed: {
        proyectosPorPrioridad() {
            return store.state.proyectos.sort((a,b)=>{return a.prioridad-b.prioridad})
        }
    },
    methods: {
         calcularViables() {
            var pr = store.state.proyectos.sort((a,b)=>{return a.prioridad-b.prioridad});
            this.viables=[];
            var auxp = this.presupuesto;
            for(let i=0; i<pr.length; i++)
            {
                if(pr[i].costo<=auxp) {
                    this.viables.push(pr[i]);
                    auxp-=pr[i].costo;
                }
            }
            if(this.viables.length==0)
            {
                this.viables.push({identificador: 'El presupuesto no alcanza para ningún proyecto'})
            }
        }
    },
    template:`
    <div class="container">
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Presupuesto de inversión</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <input class="input" type="number" v-model="presupuesto" v-on:change="calcularViables()">
                    </div>
                </div>
            </div>
        </div>

        <div class="columns">
            <div class="column is-half">
                <table class="table is-striped">
                    <thead>
                        <tr>
                            <th>Prioridad</th>
                            <th>Proyecto</th>
                            <th>Costo</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="proyecto in proyectosPorPrioridad">
                            <td>{{proyecto.prioridad}}</td>
                            <td>{{proyecto.identificador}}</td>
                            <td>{{proyecto.costo}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="columns">
            <div class="column is-3">
                <p class="label">Proyectos prioritarios ejecutables con el presupuesto de inversión</p>
            </div>
            <div class="column is-narrow">
                <ul v-for="proyecto in viables">
                    <li>{{proyecto.identificador}}</li>
                </ul>
            </div>
            <div class="column">
            </div>
        </div>
    </div>`
}

let nuevoProyecto={
    data(){
        return {
            nuevo: {
                identificador: '',
                costo: null,
                descripcion: '',
                prioridad: null
            }
        }
    },
    methods: {
        Agregar: function(){
            store.commit('addProyecto', Object.assign({}, this.nuevo))

            //Reiniciar 
            this.nuevo.identificador=''
            this.nuevo.costo=0
            this.nuevo.descripcion=''
        },
        eliminar: function(x) {
            store.state.proyectos.splice(x,1);
        }
    },
    computed: {
      Proyectos() {
            console.log(store.state.proyectos);
            return store.state.proyectos; 
        }  
    },
    template: `
    <div class="container">
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Identificador</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control is-expanded">
                        <input class="input" v-model="nuevo.identificador" type="text" placeholder="Identificador del proyecto">
                    </p>
                </div>
            </div>
        </div>

         <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Costo</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control is-expanded">
                        <input v-model.number="nuevo.costo" class="input" type="number" placeholder="Costo del proyecto">
                    </p>
                </div>
            </div>
        </div>

         <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Descripción</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <textarea class="textarea" v-model="nuevo.descripcion" placeholder="Descripción del proyecto"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <div class="field is-horizontal">
            <div class="field-label">
                <!-- Left empty for spacing -->
        </div>
            <div class="field-body">
                <div class="field">
            <div class="control">
                <button @click="Agregar" class="button is-primary">
                    Añadir proyecto
                </button>
            </div>
            </div>
            </div>
        </div>

        <div class="field is-horizontal">
            <div class="field-label">
               <label class="label">Proyectos registrados</label>
             </div>
            <div class="field-body">
                <div class="field">
                    <div class="control box">
                        <div v-for="(pr,i) in Proyectos">   
                            {{pr.identificador}}
                            <input type="number" v-model="pr.costo"></input>
                            <button @click="eliminar(i)">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </div>
    </div>
    `
}

//Direcciones
const routes = [
    {
        path: '/index',
        name: 'index',
        component: principal,
        children: [
            {
                path: '/criterios',
                component: Tabla,
                name: 'Establecimiento de criterios'
            },
            {
                path: '/proyectos',
                component: nuevoProyecto,
                name: 'Registro de proyectos'
            },
            {
                path: '/datos',
                component: estructura,
                name: 'Asignación de valores por proyecto y criterio'
            },
            {
                path: '/orden',
                component: proyectosOrdenados,
                name: 'Ánalisis de costos'
            }
        ]
    },
    {path: '/', component: principal},
    {path: '/s', component: estructura},
    {path: '/a', component: proyectosOrdenados},
    {path: '/np', component: nuevoProyecto}
]

const router = new VueRouter({
    routes
})

//Constructor de la app
var app = new Vue({
    router
}).$mount('#app')