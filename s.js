var criterios = [
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
];

var proyectos = [
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
];

 
/*
    1 Crear estructura de datos
    [{ 
        tipo:  bool     1-Cuantitativo  0-Cualitativo
        orden: bool     1-Mejor mayor   0-Mejor menor
        proyectos: [
            {
                indice: int             //Representa el orden alfabético
                valor: indeterminado    //Se llenará manualmente en la interfaz por el usuario 
                prioridad: int          
            },
            {},..,{hasta proyecto n}
        ]
    },{},...,{hasta criterio n}]

    2 Ordenamiento de los arreglos de proyectos por valor
    3 Cálculo y asignación de prioridad
    4 Manejo de empates
    5 Regresar al orden por índice
*/


//Estructura de datos
var arrCriterios = criterios.map((criterio)=>{
    var fila = {}
    fila['tipo'] = (criterio.tipo==='Cuantitativo')? true:false;
    fila['orden'] = (criterio.mejor_calif==='mayor')? true:false;

    var columnas = proyectos.map((proyecto, i)=>{
        var columna = {}
        columna['indice'] = i;
        columna['valor'] = null;
        columna['prioridad'] = null;
        return columna
    })
    fila['proyectos'] = columnas;
    return fila;
})

//Ordenamiento basado en el valor
    //@param x = una fila de la matriz de criterios/proyectos
function ordenar(x) {
    //Considerando[omitiendo] una previa conversión cuantitativa de los valores cualitativos
    if(x.orden) 
        x.proyectos.sort((a,b)=>{return a.valor-b.valor});
    else 
        x.proyectos.sort((a,b)=>{return b.valor-a.valor});
};

//Calculo de prioridad
    //@param x = una fila de la matriz de criterios/proyectos
function prioridad(x) {
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
}