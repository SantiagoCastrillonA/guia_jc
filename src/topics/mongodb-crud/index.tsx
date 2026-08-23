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

const SLUG = 'mongodb-crud';

/** Sesión 13 del cronograma — MongoDB y el CRUD. */
export default function MongodbCrud() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. El problema: los datos se pierden">
        <p>
          Tu API de Express guarda los productos en un array. Reinicias el servidor y desaparecen.
          Una base de datos es el lugar donde los datos <strong>sobreviven</strong> al reinicio, al
          apagón y al despliegue.
        </p>
        <Compare
          bien={{
            titulo: 'Base de datos',
            items: [
              'Los datos siguen ahí después de reiniciar',
              'Varios servidores pueden leer los mismos datos',
              'Se puede buscar, filtrar y ordenar de forma eficiente',
              'Se puede respaldar',
            ],
          }}
          mal={{
            titulo: 'Un array en memoria',
            items: [
              'Se borra al reiniciar',
              'Vive solo dentro de ese proceso',
              'Buscar entre miles es lento',
              'No hay respaldo posible',
            ],
          }}
        />
      </Lesson>

      <Lesson title="2. Qué es MongoDB">
        <p>
          MongoDB guarda <strong>documentos</strong> que se parecen mucho a objetos de JavaScript.
          No hay tablas con columnas fijas: cada documento lleva sus propios campos.
        </p>

        <Figure
          label="Diagrama: base de datos, colección y documento"
          caption="La base de datos contiene colecciones; una colección contiene documentos. Un documento es prácticamente un objeto de JavaScript con un _id."
        >
          <svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="10" width="620" height="170" rx="10" fill="var(--color-text)" opacity="0.04" />
            <text x="16" y="32" fontSize="11" letterSpacing="1.2" fill="var(--color-accent-text)">
              BASE DE DATOS · mi_negocio
            </text>
            <rect x="16" y="44" width="588" height="120" rx="8" fill="var(--color-text)" opacity="0.05" />
            <text x="32" y="66" fontSize="11" letterSpacing="1.2" fill="var(--color-accent-text)" opacity="0.85">
              COLECCIÓN · productos
            </text>
            {[0, 1].map((i) => (
              <g key={i}>
                <rect x={32 + i * 288} y="78" width="272" height="72" rx="6" fill="var(--color-text)" opacity="0.07" />
                <text
                  x={46 + i * 288}
                  y="100"
                  fontSize="12"
                  fontFamily="ui-monospace, monospace"
                  fill="var(--color-text)"
                  opacity="0.85"
                >
                  {'{ _id: ObjectId("...' + (i === 0 ? '4f1' : '9c2') + '"),'}
                </text>
                <text
                  x={46 + i * 288}
                  y="120"
                  fontSize="12"
                  fontFamily="ui-monospace, monospace"
                  fill="var(--color-text)"
                  opacity="0.85"
                >
                  {i === 0 ? '  nombre: "Café 250g",' : '  nombre: "Café 500g",'}
                </text>
                <text
                  x={46 + i * 288}
                  y="140"
                  fontSize="12"
                  fontFamily="ui-monospace, monospace"
                  fill="var(--color-text)"
                  opacity="0.85"
                >
                  {i === 0 ? '  precio: 18000 }' : '  precio: 32000 }'}
                </text>
              </g>
            ))}
          </svg>
        </Figure>

        <RefTable
          cabeceras={['Concepto', 'Equivale a', 'En tu proyecto']}
          filas={[
            ['Base de datos', 'Todo el proyecto', <code key="a">mi_negocio</code>],
            ['Colección', 'Una tabla', <code key="b">productos</code>, ],
            ['Documento', 'Una fila', 'Un producto'],
            ['Campo', 'Una columna', <code key="c">precio</code>],
            [<code key="d">_id</code>, 'La llave primaria', 'Lo genera Mongo solo'],
          ]}
        />
      </Lesson>

      <Lesson title="3. Las cuatro operaciones: CRUD">
        <RefTable
          cabeceras={['Letra', 'Operación', 'En Mongo']}
          filas={[
            ['C', 'Create — crear', <code key="a">insertOne(...)</code>],
            ['R', 'Read — leer', <code key="b">find(...)</code> ],
            ['U', 'Update — actualizar', <code key="c">updateOne(...)</code>],
            ['D', 'Delete — borrar', <code key="d">deleteOne(...)</code>],
          ]}
        />
        <Terminal
          titulo="En mongosh"
          lineas={[
            '// crear',
            'db.productos.insertOne({ nombre: "Café 250g", precio: 18000, stock: 12 })',
            '',
            '// leer todos, y leer con filtro',
            'db.productos.find()',
            'db.productos.find({ precio: { $lt: 20000 } })',
            '',
            '// actualizar',
            'db.productos.updateOne({ nombre: "Café 250g" }, { $set: { precio: 19000 } })',
            '',
            '// borrar',
            'db.productos.deleteOne({ nombre: "Café 250g" })',
          ]}
        />
        <Callout tipo="ojo">
          Fíjate en el <code>$set</code> del update. Sin él, Mongo{' '}
          <strong>reemplaza el documento entero</strong> por lo que le pasaste: perderías todos los
          campos que no mencionaste. Es de los errores más caros de la sesión.
        </Callout>
      </Lesson>

      <Lesson title="4. Filtros y operadores">
        <RefTable
          cabeceras={['Operador', 'Significa', 'Ejemplo']}
          filas={[
            [<code key="a">$lt</code>, 'menor que', <code key="b">{'{ precio: { $lt: 20000 } }'}</code>],
            [<code key="c">$gte</code>, 'mayor o igual', <code key="d">{'{ stock: { $gte: 1 } }'}</code>],
            [<code key="e">$in</code>, 'está en la lista', <code key="f">{'{ categoria: { $in: ["café", "té"] } }'}</code>],
            [<code key="g">$ne</code>, 'distinto de', <code key="h">{'{ activo: { $ne: false } }'}</code>],
          ]}
        />
        <Callout>
          Un objeto vacío <code>{'{}'}</code> como filtro significa «todos». Y eso vale también
          para <code>deleteMany({})</code>… que borra la colección completa. Cuidado con ese.
        </Callout>
      </Lesson>

      <Lesson title="5. Conectar Mongo con tu API, paso a paso">
        <Steps>
          <Step title="Ten Mongo corriendo">
            Instalado en tu máquina, o una base gratuita en MongoDB Atlas. En los dos casos vas a
            terminar con una <strong>cadena de conexión</strong>.
          </Step>
          <Step title="Instala el driver">
            <Terminal lineas={['$ npm install mongodb']} />
          </Step>
          <Step title="Conéctate una sola vez, al arrancar">
            <Terminal
              lineas={[
                "const { MongoClient } = require('mongodb');",
                "const cliente = new MongoClient('mongodb://127.0.0.1:27017');",
                'await cliente.connect();',
                "const db = cliente.db('mi_negocio');",
              ]}
            />
            Conectarse en cada petición es lento y termina agotando las conexiones.
          </Step>
          <Step title="Usa la colección en tus rutas">
            <Terminal
              lineas={[
                "app.get('/productos', async (req, res) => {",
                "  const productos = await db.collection('productos').find().toArray();",
                '  res.json(productos);',
                '});',
              ]}
            />
            Todo lo de la base de datos es asíncrono: <code>async</code> y <code>await</code>, como
            en la sesión 10.
          </Step>
          <Step title="La cadena de conexión nunca va al repositorio">
            Va en un archivo <code>.env</code> que está en el <code>.gitignore</code>. Si sube al
            repo, cualquiera entra a tu base de datos.
          </Step>
        </Steps>
      </Lesson>

      <Exercises>
        <Quiz
          id="por-que-bd"
          index={1}
          title="¿Para qué una base de datos?"
          options={[
            { id: 'a', label: 'Para que los datos sobrevivan al reinicio del servidor' },
            { id: 'b', label: 'Para que la página cargue más rápido' },
            { id: 'c', label: 'Para poder usar CSS' },
            { id: 'd', label: 'Para tener más rutas en Express' },
          ]}
          answer="a"
          explanation="Un array vive dentro del proceso: al reiniciar se borra. La base de datos guarda en disco y sobrevive."
        />

        <MatchPairs
          id="empareja-mongo"
          index={2}
          title="Empareja los conceptos"
          pairs={[
            { id: 'db', izquierda: 'Base de datos', derecha: 'Todo el proyecto: mi_negocio' },
            { id: 'col', izquierda: 'Colección', derecha: 'Un grupo de documentos: productos' },
            { id: 'doc', izquierda: 'Documento', derecha: 'Un producto concreto' },
            { id: 'id', izquierda: '_id', derecha: 'El identificador único que genera Mongo' },
          ]}
          explanation="Base de datos → colecciones → documentos. Si vienes de SQL: colección es tabla y documento es fila."
        />

        <TrueFalse
          id="esquema-fijo"
          index={3}
          title="Documentos flexibles"
          statement="Todos los documentos de una colección tienen que tener exactamente los mismos campos."
          answer={false}
          explanation="Falso: Mongo no lo exige. Es cómodo al principio y peligroso después — por eso en la próxima sesión llega Mongoose, que sí te deja imponer una forma."
        />

        <MatchPairs
          id="empareja-crud"
          index={4}
          title="Empareja la operación con el método"
          pairs={[
            { id: 'c', izquierda: 'Create', derecha: 'insertOne()' },
            { id: 'r', izquierda: 'Read', derecha: 'find()' },
            { id: 'u', izquierda: 'Update', derecha: 'updateOne()' },
            { id: 'd', izquierda: 'Delete', derecha: 'deleteOne()' },
          ]}
          explanation="CRUD: crear, leer, actualizar y borrar. Son las mismas cuatro cosas que hacen GET, POST, PUT y DELETE en tu API."
        />

        <FillBlank
          id="insert"
          index={5}
          title="Crea un documento"
          code={'db.productos.___({ nombre: "Café 250g", precio: 18000 })'}
          options={['insertOne', 'find', 'updateOne', 'createOne']}
          answer="insertOne"
          explanation="insertOne para uno, insertMany para varios. Mongo le agrega el _id solo."
        />

        <Quiz
          id="set-en-update"
          index={6}
          title="El $set del update"
          prompt="¿Qué pasa si actualizas sin $set: updateOne({ nombre: 'Café' }, { precio: 19000 })?"
          options={[
            { id: 'a', label: 'Reemplaza el documento entero y se pierden los demás campos' },
            { id: 'b', label: 'Actualiza solo el precio' },
            { id: 'c', label: 'No hace nada' },
            { id: 'd', label: 'Crea un documento nuevo' },
          ]}
          answer="a"
          explanation="Sin $set le estás pasando el documento completo de reemplazo: nombre, stock y todo lo demás desaparecen. Con $set solo tocas los campos que nombraste."
        />

        <FillBlank
          id="filtro-menor"
          index={7}
          title="Filtra por precio"
          prompt="Todos los productos que cuesten menos de 20000."
          code={'db.productos.find({ precio: { ___: 20000 } })'}
          options={['$lt', '$gt', '$eq', '$in']}
          answer="$lt"
          explanation="$lt es «less than». Sus vecinos: $lte (menor o igual), $gt (mayor) y $gte (mayor o igual)."
        />

        <PredictOutput
          id="find-vacio"
          index={8}
          title="¿Cuántos devuelve?"
          prompt="La colección tiene 7 productos. ¿Cuántos documentos devuelve esta consulta? (escribe el número)"
          code={'db.productos.find({})'}
          answers={['7']}
          explanation="Los 7. Un filtro vacío significa «todos». Y por lo mismo, deleteMany({}) borra la colección completa: mucho cuidado con ese."
        />

        <TrueFalse
          id="delete-many-vacio"
          index={9}
          title="El comando peligroso"
          statement="db.productos.deleteMany({}) borra todos los documentos de la colección."
          answer={true}
          explanation="Verdadero, y sin preguntar. Antes de correr un deleteMany, revisa dos veces el filtro."
        />

        <Quiz
          id="async-mongo"
          index={10}
          title="Las consultas son asíncronas"
          prompt="¿Por qué las operaciones de Mongo llevan await?"
          options={[
            { id: 'a', label: 'Porque hablan con otro proceso y se demoran: no son instantáneas' },
            { id: 'b', label: 'Porque JavaScript lo exige en todas las funciones' },
            { id: 'c', label: 'Para que el código se vea ordenado' },
            { id: 'd', label: 'Porque Mongo está en la nube siempre' },
          ]}
          answer="a"
          explanation="Es lo mismo que el fetch de la sesión 10: una operación que toma tiempo y no debe congelar el servidor mientras responde."
        />

        <FillBlank
          id="to-array"
          index={11}
          title="Convertir el resultado"
          prompt="find() devuelve un cursor, no una lista lista para usar."
          code={"const productos = await db.collection('productos').find().___();"}
          options={['toArray', 'toJSON', 'toList', 'get']}
          answer="toArray"
          explanation="El cursor es un puntero que va trayendo resultados. toArray() los materializa en un array de JavaScript que puedes devolver con res.json()."
        />

        <OrderSteps
          id="orden-conexion"
          index={12}
          title="Ordena la conexión"
          steps={[
            { id: 'install', text: 'npm install mongodb' },
            { id: 'client', text: 'Crear el MongoClient con la cadena de conexión' },
            { id: 'connect', text: 'await cliente.connect()' },
            { id: 'db', text: "const db = cliente.db('mi_negocio')" },
            { id: 'rutas', text: 'Usar db.collection(...) dentro de las rutas' },
          ]}
          explanation="La conexión se hace una vez, al arrancar el servidor, no en cada petición."
        />

        <Quiz
          id="conexion-por-peticion"
          index={13}
          title="¿Conectarse en cada petición?"
          prompt="¿Por qué está mal abrir la conexión dentro de cada ruta?"
          options={[
            { id: 'a', label: 'Porque es lento y agota las conexiones disponibles' },
            { id: 'b', label: 'Porque Mongo no lo permite' },
            { id: 'c', label: 'Porque borraría los datos' },
            { id: 'd', label: 'No está mal, es lo recomendado' },
          ]}
          answer="a"
          explanation="Abrir una conexión cuesta tiempo. El driver mantiene un pool: te conectas una vez y todas las rutas lo reutilizan."
        />

        <Quiz
          id="cadena-conexion-env"
          index={14}
          title="La cadena de conexión"
          prompt="Tu cadena incluye usuario y contraseña de la base. ¿Dónde va?"
          options={[
            { id: 'a', label: 'En un archivo .env que está en el .gitignore' },
            { id: 'b', label: 'Directamente en servidor.js' },
            { id: 'c', label: 'En el README, para no olvidarla' },
            { id: 'd', label: 'En un comentario del código' },
          ]}
          answer="a"
          explanation="Es una credencial. Si sube al repositorio, cualquiera entra a tu base — y recuerda que borrarla después no la quita del historial de Git."
        />

        <MultiSelect
          id="cuando-mongo"
          index={15}
          title="Datos que van a la base"
          prompt="En tu emprendimiento, marca lo que tiene sentido guardar en Mongo."
          options={[
            { id: 'productos', label: 'El catálogo de productos' },
            { id: 'usuarios', label: 'Los usuarios registrados' },
            { id: 'pedidos', label: 'Los pedidos que hagan' },
            { id: 'css', label: 'Los estilos de la página' },
            { id: 'logo', label: 'El archivo del logo' },
          ]}
          answers={['productos', 'usuarios', 'pedidos']}
          explanation="A la base van los datos que cambian y que hay que consultar. El CSS y las imágenes son archivos: van en el proyecto o en un servicio de archivos."
        />

        <Quiz
          id="objectid"
          index={16}
          title="El _id de Mongo"
          prompt="¿Qué tiene de especial el _id?"
          options={[
            { id: 'a', label: 'Lo genera Mongo, es único, y no es un número sino un ObjectId' },
            { id: 'b', label: 'Es un número que empieza en 1 y va subiendo' },
            { id: 'c', label: 'Lo tienes que escribir tú en cada documento' },
            { id: 'd', label: 'Se puede repetir entre documentos' },
          ]}
          answer="a"
          explanation="Es un identificador de 24 caracteres. Para buscar por él hay que envolverlo: new ObjectId(req.params.id), o la comparación falla."
        />

        <TrueFalse
          id="mongosh"
          index={17}
          title="mongosh"
          statement="mongosh es una consola donde puedes probar consultas sin escribir código de servidor."
          answer={true}
          explanation="Verdadero, y es la mejor forma de aprender: pruebas el filtro ahí, ves el resultado, y solo entonces lo llevas a tu API."
        />

        <Quiz
          id="update-vs-replace"
          index={18}
          title="Actualizar solo el stock"
          prompt="Quieres bajar el stock de un producto sin tocar nada más."
          options={[
            { id: 'a', label: "updateOne({ _id: id }, { $set: { stock: 11 } })" },
            { id: 'b', label: "updateOne({ _id: id }, { stock: 11 })" },
            { id: 'c', label: "insertOne({ stock: 11 })" },
            { id: 'd', label: "find({ stock: 11 })" },
          ]}
          answer="a"
          explanation="Con $set solo cambia ese campo. La segunda reemplazaría el documento y te quedarías con un producto sin nombre ni precio."
        />

        <OrderSteps
          id="orden-crud-api"
          index={19}
          title="Ordena una ruta que crea un producto"
          steps={[
            { id: 'ruta', text: "app.post('/productos', async (req, res) => {" },
            { id: 'valida', text: '  si faltan nombre o precio → responder 400' },
            { id: 'insert', text: "  const r = await db.collection('productos').insertOne(req.body);" },
            { id: 'responde', text: '  res.status(201).json({ _id: r.insertedId, ...req.body });' },
            { id: 'cierra', text: '});' },
          ]}
          explanation="Validar antes de insertar. Si no validas, la base se llena de documentos incompletos y el problema aparece semanas después."
        />

        <MultiSelect
          id="errores-mongo"
          index={20}
          title="Errores típicos"
          prompt="Marca los problemas reales de esta sesión."
          options={[
            { id: 'set', label: 'Actualizar sin $set y perder campos' },
            { id: 'await', label: 'Olvidar el await y recibir una promesa en vez de datos' },
            { id: 'toarray', label: 'Devolver el cursor de find() sin toArray()' },
            { id: 'objectid', label: 'Comparar el _id con un texto sin convertirlo a ObjectId' },
            { id: 'css', label: 'No haber puesto box-sizing: border-box' },
          ]}
          answers={['set', 'await', 'toarray', 'objectid']}
          explanation="Los cuatro primeros son de base de datos. El box-sizing es de CSS: en el backend no hay cajas que dimensionar."
        />
      </Exercises>
    </TopicPage>
  );
}
