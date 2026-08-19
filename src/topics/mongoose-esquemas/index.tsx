import { Exercises, Lesson, TopicPage } from '../../components/TopicPage';
import {
  FillBlank,
  MatchPairs,
  MultiSelect,
  OrderSteps,
  PredictOutput,
  Quiz,
  TrueFalse,
} from '../../components/exercises';
import { Callout, Compare, Figure, RefTable, Step, Steps, Terminal } from '../../components/visuals';

const SLUG = 'mongoose-esquemas';

/** Sesión 14 del cronograma — Mongoose: esquemas y validaciones. */
export default function MongooseEsquemas() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. El problema de la libertad total">
        <p>
          Mongo acepta lo que le mandes. Eso suena cómodo hasta que abres la colección y encuentras
          esto:
        </p>
        <Terminal
          lineas={[
            '{ nombre: "Café 250g", precio: 18000 }',
            '{ nombre: "Café 500g", precio: "32000" }      // precio como texto',
            '{ Nombre: "Té verde", precio: 15000 }         // Nombre con mayúscula',
            '{ nombre: "Chocolate" }                        // sin precio',
          ]}
        />
        <p>
          Cuatro documentos, cuatro formas distintas. Cualquier cálculo sobre esa colección va a
          fallar de manera impredecible. <strong>Mongoose</strong> pone la regla que Mongo no exige.
        </p>
      </Lesson>

      <Lesson title="2. El esquema: la forma del documento">
        <Terminal
          titulo="modelos/Producto.js"
          lineas={[
            "const mongoose = require('mongoose');",
            '',
            'const productoSchema = new mongoose.Schema({',
            '  nombre:  { type: String, required: true, trim: true, maxlength: 80 },',
            '  precio:  { type: Number, required: true, min: 0 },',
            '  stock:   { type: Number, default: 0, min: 0 },',
            "  categoria: { type: String, enum: ['café', 'té', 'accesorio'] },",
            '  activo:  { type: Boolean, default: true },',
            '}, { timestamps: true });',
            '',
            "module.exports = mongoose.model('Producto', productoSchema);",
          ]}
        />
        <RefTable
          cabeceras={['Opción', 'Qué hace']}
          filas={[
            [<code key="a">type</code>, 'El tipo esperado: String, Number, Boolean, Date'],
            [<code key="b">required</code>, 'Sin ese campo, no se guarda'],
            [<code key="c">default</code>, 'Valor si no se envía'],
            [<code key="d">min / max</code>, 'Rango permitido para números'],
            [<code key="e">enum</code>, 'Solo estos valores'],
            [<code key="f">trim</code>, 'Quita los espacios sobrantes del texto'],
            [<code key="g">timestamps</code>, 'Agrega createdAt y updatedAt solo'],
          ]}
        />
        <Callout>
          El esquema es un contrato: lo que no cumple, no entra. Y la validación ocurre{' '}
          <strong>antes</strong> de tocar la base, así que los datos malos nunca llegan a guardarse.
        </Callout>
      </Lesson>

      <Lesson title="3. Modelo: el objeto con el que trabajas">
        <p>
          <code>mongoose.model('Producto', productoSchema)</code> devuelve un modelo. A partir de
          ahí las consultas se leen casi como español:
        </p>
        <Terminal
          lineas={[
            '// crear',
            'const nuevo = await Producto.create({ nombre: "Café 250g", precio: 18000 });',
            '',
            '// leer',
            'const todos = await Producto.find();',
            'const baratos = await Producto.find({ precio: { $lt: 20000 } });',
            'const uno = await Producto.findById(id);',
            '',
            '// actualizar y borrar',
            'await Producto.findByIdAndUpdate(id, { precio: 19000 }, { new: true });',
            'await Producto.findByIdAndDelete(id);',
          ]}
        />
        <Callout tipo="ojo">
          El <code>{'{ new: true }'}</code> del update no es un detalle: sin él, Mongoose te
          devuelve el documento <em>como estaba antes</em> del cambio, y vas a jurar que la
          actualización no funcionó.
        </Callout>
      </Lesson>

      <Lesson title="4. Validar en dos capas">
        <Compare
          bien={{
            titulo: 'Validación en el esquema',
            items: [
              'Vale para todo el proyecto',
              'No se puede saltar por accidente',
              'Devuelve un ValidationError con el detalle',
              'Es la red de seguridad final',
            ],
          }}
          mal={{
            titulo: 'Solo validar en el frontend',
            items: [
              'Se salta con Thunder Client o con la consola',
              'No protege la base de datos',
              'Sirve para avisarle al usuario, no para proteger',
              'Nunca confíes en lo que llega del cliente',
            ],
          }}
        />
        <Terminal
          lineas={[
            "app.post('/productos', async (req, res) => {",
            '  try {',
            '    const producto = await Producto.create(req.body);',
            '    res.status(201).json(producto);',
            '  } catch (error) {',
            "    if (error.name === 'ValidationError') {",
            '      return res.status(400).json({ error: error.message });',
            '    }',
            "    res.status(500).json({ error: 'Error del servidor' });",
            '  }',
            '});',
          ]}
        />
        <Callout>
          Fíjate en los códigos: <strong>400</strong> cuando el cliente mandó algo mal,{' '}
          <strong>500</strong> cuando se rompió algo tuyo. Devolver siempre 500 esconde la
          diferencia y hace imposible depurar desde el frontend.
        </Callout>
      </Lesson>

      <Lesson title="5. Relaciones entre colecciones">
        <p>
          Un pedido pertenece a un usuario. En Mongoose eso se guarda como una{' '}
          <strong>referencia</strong>: el <code>_id</code> del otro documento.
        </p>
        <Terminal
          lineas={[
            'const pedidoSchema = new mongoose.Schema({',
            "  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },",
            '  total: { type: Number, required: true },',
            '});',
            '',
            '// traer el pedido con los datos del usuario incluidos',
            "const pedidos = await Pedido.find().populate('usuario');",
          ]}
        />

        <Figure
          label="Diagrama: un pedido referencia a un usuario por su id"
          caption="populate() cambia el id por el documento completo al momento de consultar. En la base solo se guarda la referencia."
        >
          <svg viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="24" width="250" height="90" rx="8" fill="var(--color-text)" opacity="0.06" />
            <text x="16" y="46" fontSize="11" letterSpacing="1.2" fill="var(--color-accent)">
              PEDIDO
            </text>
            <text x="16" y="72" fontSize="12.5" fontFamily="ui-monospace, monospace" fill="var(--color-text)" opacity="0.85">
              usuario: ObjectId("64f…")
            </text>
            <text x="16" y="94" fontSize="12.5" fontFamily="ui-monospace, monospace" fill="var(--color-text)" opacity="0.85">
              total: 54000
            </text>

            <line x1="262" y1="68" x2="368" y2="68" stroke="var(--color-accent)" strokeWidth="1.2" />
            <path d="M375 68 l-8 -4.5 l0 9 z" fill="var(--color-accent)" />
            <text x="278" y="58" fontSize="11" fill="var(--color-accent)" fontFamily="ui-monospace, monospace">
              populate
            </text>

            <rect x="382" y="24" width="250" height="90" rx="8" fill="var(--color-text)" opacity="0.06" />
            <text x="398" y="46" fontSize="11" letterSpacing="1.2" fill="var(--color-accent)">
              USUARIO
            </text>
            <text x="398" y="72" fontSize="12.5" fontFamily="ui-monospace, monospace" fill="var(--color-text)" opacity="0.85">
              _id: ObjectId("64f…")
            </text>
            <text x="398" y="94" fontSize="12.5" fontFamily="ui-monospace, monospace" fill="var(--color-text)" opacity="0.85">
              nombre: "Ana"
            </text>
          </svg>
        </Figure>
      </Lesson>

      <Lesson title="6. Organiza el proyecto">
        <Steps>
          <Step title="Una carpeta por responsabilidad">
            <Terminal
              lineas={[
                'backend/',
                '├── servidor.js        # arranque y middleware',
                '├── modelos/',
                '│   ├── Producto.js',
                '│   └── Usuario.js',
                '├── rutas/',
                '│   └── productos.js',
                '└── .env               # cadena de conexión (nunca al repo)',
              ]}
            />
          </Step>
          <Step title="Un archivo por modelo">
            Cada modelo exporta su <code>mongoose.model(...)</code> y se importa donde haga falta.
            Con todo en un solo archivo, a la tercera semana no encuentras nada.
          </Step>
          <Step title="Conecta una vez, al arrancar">
            <Terminal lineas={['await mongoose.connect(process.env.MONGO_URL);']} />
          </Step>
        </Steps>
      </Lesson>

      <Exercises>
        <Quiz
          id="que-es-mongoose"
          index={1}
          title="¿Qué agrega Mongoose?"
          options={[
            { id: 'a', label: 'Una capa sobre Mongo que define la forma de los documentos y valida antes de guardar' },
            { id: 'b', label: 'Una base de datos distinta' },
            { id: 'c', label: 'Un servidor web' },
            { id: 'd', label: 'Un editor visual de datos' },
          ]}
          answer="a"
          explanation="Mongo sigue siendo la base. Mongoose pone el contrato: qué campos hay, de qué tipo y qué es obligatorio."
        />

        <MatchPairs
          id="empareja-opciones"
          index={2}
          title="Empareja la opción del esquema"
          pairs={[
            { id: 'required', izquierda: <code>required: true</code>, derecha: 'Sin ese campo no se guarda' },
            { id: 'default', izquierda: <code>default: 0</code>, derecha: 'Valor si no lo envían' },
            { id: 'enum', izquierda: <code>enum: [...]</code>, derecha: 'Solo se aceptan esos valores' },
            { id: 'trim', izquierda: <code>trim: true</code>, derecha: 'Quita espacios sobrantes del texto' },
            { id: 'ts', izquierda: <code>timestamps</code>, derecha: 'Agrega createdAt y updatedAt' },
          ]}
          explanation="Con estas cinco opciones cubres casi todas las validaciones de tu proyecto."
        />

        <FillBlank
          id="campo-obligatorio"
          index={3}
          title="Campo obligatorio"
          prompt="El nombre no puede faltar."
          code={'nombre: { type: String, ___: true }'}
          options={['required', 'unique', 'default', 'min']}
          answer="required"
          explanation="required: true rechaza el documento si el campo no viene. Si además no se puede repetir, se agrega unique: true."
        />

        <TrueFalse
          id="valida-antes"
          index={4}
          title="Cuándo valida"
          statement="Mongoose valida después de guardar en la base, y borra el documento si estaba mal."
          answer={false}
          explanation="Falso. Valida ANTES: si no cumple, lanza un ValidationError y no toca la base. El dato malo nunca llega a guardarse."
        />

        <Quiz
          id="new-true"
          index={5}
          title="El { new: true }"
          prompt="Haces findByIdAndUpdate y el objeto que recibes tiene el precio viejo. ¿Por qué?"
          options={[
            { id: 'a', label: 'Falta la opción { new: true }: por defecto devuelve el documento anterior' },
            { id: 'b', label: 'La actualización no se guardó' },
            { id: 'c', label: 'El id está mal' },
            { id: 'd', label: 'Hay que reiniciar Mongo' },
          ]}
          answer="a"
          explanation="El cambio sí se guardó: solo que Mongoose devuelve por defecto la versión previa. Con { new: true } te entrega la actualizada."
        />

        <Quiz
          id="codigo-validacion"
          index={6}
          title="¿Qué código devuelves?"
          prompt="El cliente mandó un producto sin precio y Mongoose lanzó ValidationError."
          options={[
            { id: '400', label: '400, porque la petición venía mal armada' },
            { id: '500', label: '500, porque hubo una excepción' },
            { id: '404', label: '404, porque el producto no existe' },
            { id: '201', label: '201, y guardarlo igual' },
          ]}
          answer="400"
          explanation="El error es del cliente: le faltó un campo. Los 500 son para cuando se rompe algo del lado del servidor."
        />

        <MultiSelect
          id="donde-validar"
          index={7}
          title="¿Dónde se valida?"
          prompt="Marca las afirmaciones correctas."
          options={[
            { id: 'front', label: 'En el frontend, para avisarle al usuario rápido' },
            { id: 'back', label: 'En el backend, porque el frontend se puede saltar' },
            { id: 'esquema', label: 'En el esquema, como última red de seguridad' },
            { id: 'solo', label: 'Con validar en el frontend es suficiente' },
          ]}
          answers={['front', 'back', 'esquema']}
          explanation="Las tres primeras. Cualquiera puede mandar una petición con Thunder Client saltándose tu formulario: nunca confíes en lo que llega del cliente."
        />

        <FillBlank
          id="crear-modelo"
          index={8}
          title="Exporta el modelo"
          code={"module.exports = mongoose.___('Producto', productoSchema);"}
          options={['model', 'schema', 'create', 'collection']}
          answer="model"
          explanation="mongoose.model(nombre, esquema) crea el modelo. Mongo va a guardar en la colección «productos»: en plural y minúscula, lo hace solo."
        />

        <PredictOutput
          id="default-stock"
          index={9}
          title="El valor por defecto"
          prompt="El esquema tiene stock con default: 0. Creas un producto sin enviar stock. ¿Qué valor queda guardado?"
          code={'await Producto.create({ nombre: "Té verde", precio: 15000 });'}
          answers={['0']}
          explanation="0, el default. Sin esa opción quedaría undefined y cualquier suma con ese campo daría NaN."
        />

        <Quiz
          id="enum"
          index={10}
          title="El enum"
          prompt="categoria tiene enum: ['café', 'té', 'accesorio']. Intentas guardar categoria: 'ropa'."
          options={[
            { id: 'a', label: 'Lanza un ValidationError y no guarda' },
            { id: 'b', label: 'Lo guarda igual' },
            { id: 'c', label: 'Lo cambia a la primera opción de la lista' },
            { id: 'd', label: 'Lo guarda como null' },
          ]}
          answer="a"
          explanation="enum limita los valores aceptados. Sirve para estados y categorías: evita que aparezcan «pendiente», «Pendiente» y «PENDIENTE» en la misma colección."
        />

        <Quiz
          id="populate"
          index={11}
          title="¿Qué hace populate?"
          options={[
            { id: 'a', label: 'Cambia el id de la referencia por el documento completo al consultar' },
            { id: 'b', label: 'Llena la base de datos con datos de prueba' },
            { id: 'c', label: 'Copia el usuario dentro del pedido en la base' },
            { id: 'd', label: 'Crea un índice' },
          ]}
          answer="a"
          explanation="En la base solo se guarda el id. populate hace la búsqueda extra al consultar y te entrega el objeto completo."
        />

        <FillBlank
          id="referencia"
          index={12}
          title="Referencia a otro modelo"
          code={"usuario: { type: mongoose.Schema.Types.ObjectId, ___: 'Usuario' }"}
          options={['ref', 'model', 'link', 'from']}
          answer="ref"
          explanation="ref le dice a Mongoose en qué modelo buscar cuando hagas populate."
        />

        <TrueFalse
          id="timestamps"
          index={13}
          title="createdAt y updatedAt"
          statement="Con { timestamps: true } Mongoose agrega y mantiene solo las fechas de creación y actualización."
          answer={true}
          explanation="Verdadero. Es gratis y te salva después, cuando quieras ordenar por «los más recientes» o auditar cuándo cambió algo."
        />

        <OrderSteps
          id="orden-modelo"
          index={14}
          title="Ordena la creación de un modelo"
          steps={[
            { id: 'require', text: "const mongoose = require('mongoose');" },
            { id: 'schema', text: 'Definir el Schema con sus campos y validaciones' },
            { id: 'model', text: "Crear el modelo con mongoose.model('Producto', schema)" },
            { id: 'export', text: 'Exportarlo con module.exports' },
            { id: 'usar', text: 'Importarlo en las rutas y usar Producto.create(...)' },
          ]}
          explanation="Un archivo por modelo, dentro de modelos/. Cuando el proyecto crezca vas a agradecer esa separación."
        />

        <Quiz
          id="try-catch"
          index={15}
          title="¿Por qué el try/catch?"
          prompt="Envuelves Producto.create en un try/catch. ¿Para qué?"
          options={[
            { id: 'a', label: 'Para atrapar el ValidationError y responder 400 en vez de tumbar el servidor' },
            { id: 'b', label: 'Para que la consulta sea más rápida' },
            { id: 'c', label: 'Porque Mongoose lo exige' },
            { id: 'd', label: 'Para guardar dos veces por si acaso' },
          ]}
          answer="a"
          explanation="Sin try/catch, un error dentro de una función async se convierte en una promesa rechazada que puede tumbar el proceso. Con él respondes un mensaje claro."
        />

        <MultiSelect
          id="esquema-usuario"
          index={16}
          title="El esquema de Usuario"
          prompt="Vas a guardar usuarios. Marca las decisiones correctas."
          options={[
            { id: 'unique', label: 'El correo con unique: true' },
            { id: 'hash', label: 'Guardar el hash de la contraseña, nunca la contraseña' },
            { id: 'required', label: 'Nombre y correo con required: true' },
            { id: 'rol', label: 'Un campo rol con enum: ["estudiante", "admin"]' },
            { id: 'plana', label: 'Guardar la contraseña tal cual para poder recuperarla' },
          ]}
          answers={['unique', 'hash', 'required', 'rol']}
          explanation="Jamás se guarda una contraseña en texto plano. Se guarda su hash, que no se puede revertir: por eso los sistemas serios te dejan restablecerla, no recuperarla."
        />

        <Quiz
          id="select-false"
          index={17}
          title="Ocultar un campo sensible"
          prompt="No quieres que la contraseña salga en las consultas por accidente."
          options={[
            { id: 'a', label: 'password: { type: String, select: false }' },
            { id: 'b', label: 'password: { type: String, hidden: true }' },
            { id: 'c', label: 'No guardarla' },
            { id: 'd', label: 'Borrarla a mano en cada respuesta' },
          ]}
          answer="a"
          explanation="select: false la deja fuera de las consultas por defecto. Cuando la necesites para comparar, la pides explícitamente."
        />

        <TrueFalse
          id="mongo-sigue"
          index={18}
          title="Mongo sigue debajo"
          statement="Usando Mongoose ya no se puede escribir una consulta con operadores como $lt."
          answer={false}
          explanation="Falso. Mongoose pasa los filtros a Mongo: Producto.find({ precio: { $lt: 20000 } }) funciona igual. Es una capa encima, no un reemplazo."
        />

        <Quiz
          id="estructura-carpetas"
          index={19}
          title="Organización del backend"
          prompt="¿Por qué separar en modelos/ y rutas/ en vez de un solo archivo?"
          options={[
            { id: 'a', label: 'Porque cada archivo tiene una responsabilidad y se encuentra rápido cuando el proyecto crece' },
            { id: 'b', label: 'Porque Express lo exige' },
            { id: 'c', label: 'Porque hace la API más rápida' },
            { id: 'd', label: 'Para que pese menos' },
          ]}
          answer="a"
          explanation="No cambia el rendimiento: cambia tu capacidad de encontrar y modificar cosas dentro de tres semanas. Y la del compañero que revise tu código."
        />

        <MultiSelect
          id="checklist-mongoose"
          index={20}
          title="Checklist del modelo"
          prompt="Antes de dar por terminado un modelo, revisa que…"
          options={[
            { id: 'tipos', label: 'Cada campo tenga su type' },
            { id: 'req', label: 'Los campos obligatorios estén marcados con required' },
            { id: 'def', label: 'Los opcionales tengan un default razonable' },
            { id: 'ts', label: 'Tenga timestamps' },
            { id: 'probado', label: 'Hayas probado que rechaza un documento inválido' },
          ]}
          answers={['tipos', 'req', 'def', 'ts', 'probado']}
          explanation="Las cinco. Probar el caso inválido es la más olvidada y la que de verdad demuestra que la validación funciona."
        />
      </Exercises>
    </TopicPage>
  );
}
