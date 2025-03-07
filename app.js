const express = require("express");
const path = require('path');
const mysql2 = require("mysql2");

let conexion = mysql2.createConnection({
    host : "localhost",
    database : "easy2",
    user : "root",
    password : "270406"
})


const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");


app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//------------------------------------------------------------------------------------

//CONSULTA SI ES GASTO O INGRESO 
app.post("/fetch_data", function(req, res){
    const type = req.body.type;
    let sql = '';

    if (type === 'Gasto') {
        sql = 'SELECT * FROM gastos';
    } else if (type === 'Ingreso') {
        sql = 'SELECT * FROM ingreso';
    } else if(type === 'Todos') {
        sql = 'SELECT DISTINCT * ingreso JOIN gastos';  //XD XD XD 
    }

    conexion.query(sql, (err, results) => {
        if (err) throw err;
 

        results.forEach(row => {
            if (row.fecha_g) {
                row.fecha_g = formatDate(row.fecha_g);
            }
            if (row.fecha_in) {
                row.fecha_in = formatDate(row.fecha_in);
            }
        });

        let ingresos = [];
        let gastos = [];

        if (type === 'Todos' || type === 'Ingreso') {
            ingresos = results.filter(row => row.desc_in !== undefined);
        }

        if (type === 'Todos' || type === 'Gasto') {
            gastos = results.filter(row => row.desc_g !== undefined);
        }

        // Renderizar la vista con los datos de ingresos y gastos
        res.render("balance", { ingresos, gastos });
    });
});

// Función para formatear la fecha al formato deseado (9/8/2024)
function formatDate(date) {
    const formattedDate = new Date(date).toLocaleDateString("es-MX" );
    return formattedDate;
}
//------------------------------------------------------------------------------------


app.get("/", function(req, res){
    res.render("index");
});

app.get("/balance", function(req, res){
    const userId = req.query.userId;

    // Consultar ingresos y gastos de la base de datos
    const getIngresos = 'SELECT * FROM ingreso';
    const getGastos = 'SELECT * FROM gastos';

    conexion.query(getIngresos, (errorIngresos, resultadosIngresos) => {
        if (errorIngresos) {
            console.error('Error al obtener ingresos:', errorIngresos);
            res.status(500).send('Error al obtener ingresos.');
            return;
        }

        conexion.query(getGastos, (errorGastos, resultadosGastos) => {
            if (errorGastos) {
                console.error('Error al obtener gastos:', errorGastos);
                res.status(500).send('Error al obtener gastos.');
                return;
            }


            resultadosIngresos.forEach(ingreso => {
                ingreso.fecha_in = new Date(ingreso.fecha_in).toLocaleDateString();
            });

            resultadosGastos.forEach(gasto => {
                gasto.fecha_g = new Date(gasto.fecha_g).toLocaleDateString();
            });

            // Obtener el total de operaciones
            const totalOperaciones = resultadosIngresos.length + resultadosGastos.length;

            // Renderizar la vista con los datos de ingresos, gastos y el total de operaciones
            res.render("balance", { 
                userId: userId,
                ingresos: resultadosIngresos,
                gastos: resultadosGastos,
                totalOperaciones: totalOperaciones // Pasar el total de operaciones al renderizado
            });
        });
    });
});


app.get("/categorias", function(req, res){
    res.render("categorias");
});

app.get('/editar-operacion/:id', (req, res) => {
    const id = req.params.id;

    // Consultar las categorías, tipos de ingresos y tipos de gastos
    const categoriasQuery = 'SELECT nombre_catG FROM cat_gasto'; // Ajustar según tu tabla de categorías
    const tiposIngresosQuery = 'SELECT desc_tI FROM tipo_ingreso';
    const tiposGastosQuery = 'SELECT desc_tG FROM tipo_gasto';

    conexion.query(categoriasQuery, (err, categoriasResults) => {
        if (err) {
            console.error('Error al consultar las categorías:', err);
            return res.status(500).send('Error del servidor');
        }
        conexion.query(tiposIngresosQuery, (err, tiposIngresosResults) => {
            if (err) {
                console.error('Error al consultar los tipos de ingresos:', err);
                return res.status(500).send('Error del servidor');
            }
            conexion.query(tiposGastosQuery, (err, tiposGastosResults) => {
                if (err) {
                    console.error('Error al consultar los tipos de gastos:', err);
                    return res.status(500).send('Error del servidor');
                }
                
                // Consultar la operación por ID
                const checkQuery = 'SELECT id_g AS id, "Gasto" AS tipo FROM gastos WHERE id_g = ? UNION SELECT id_in AS id, "Ingreso" AS tipo FROM ingreso WHERE id_in = ?';
                conexion.query(checkQuery, [id, id], (error, results) => {
                    if (error) {
                        console.error('Error al verificar la operación:', error);
                        return res.status(500).send('Error del servidor');
                    }

                    if (results.length === 0) {
                        return res.status(404).send('Operación no encontrada.');
                    }

                    const operacion = results[0];
                    const tipo = operacion.tipo;

                    const table = tipo === 'Gasto' ? 'gastos' : 'ingreso';
                    const idField = tipo === 'Gasto' ? 'id_g' : 'id_in';

                    const query = `SELECT * FROM ${table} WHERE ${idField} = ?`;
                    conexion.query(query, [id], (error, operacionResults) => {
                        if (error) {
                            console.error(`Error al obtener la ${tipo}:`, error);
                            return res.status(500).send('Error del servidor');
                        }

                        if (operacionResults.length === 0) {
                            return res.status(404).send('Operación no encontrada.');
                        }

                        const operacionData = operacionResults[0];

                        res.render('edit_op', {
                            operacion: operacionData,
                            categorias: categoriasResults,
                            tiposIngresos: tiposIngresosResults,
                            tiposGastos: tiposGastosResults,
                            tipo
                        });
                    });
                });
            });
        });
    });
});

app.get("/editar_cat", function(req, res){
    res.render("editar_cat");
});

app.get("/operaciones", function(req, res){
    res.render("operaciones");
});

app.get("/registro", function(req, res){
    res.render("registro");
});
app.get("/reporte", function(req, res) {
    const userId = req.query.userId;

    const getIngresos = 'SELECT nombre_catG, SUM(cant_in) AS total_ingreso FROM ingreso GROUP BY nombre_catG ORDER BY total_ingreso DESC';
    const getGastos = 'SELECT nombre_catG, SUM(cant_g) AS total_gasto FROM gastos GROUP BY nombre_catG ORDER BY total_gasto DESC';
    const getMesMayorIngreso = 'SELECT MONTHNAME(fecha_in) AS mes, SUM(cant_in) AS total_ingreso FROM ingreso GROUP BY MONTHNAME(fecha_in) ORDER BY total_ingreso DESC LIMIT 1';
    const getMesMayorGasto = 'SELECT MONTHNAME(fecha_g) AS mes, SUM(cant_g) AS total_gasto FROM gastos GROUP BY MONTHNAME(fecha_g) ORDER BY total_gasto DESC LIMIT 1';
    const getCategoriasIngresos = 'SELECT DISTINCT nombre_catG FROM ingreso';
    const getCategoriasGastos = 'SELECT DISTINCT nombre_catG FROM gastos';
    const getFechasIngresos = 'SELECT DATE_FORMAT(fecha_in, "%Y-%m") AS fecha, SUM(cant_in) AS total_ingreso FROM ingreso GROUP BY fecha';
    const getFechasGastos = 'SELECT DATE_FORMAT(fecha_g, "%Y-%m") AS fecha, SUM(cant_g) AS total_gasto FROM gastos GROUP BY fecha';

    conexion.query(getIngresos, (errorIngresos, resultadoIngresos) => {
        if (errorIngresos) {
            console.error('Error al obtener ingresos:', errorIngresos);
            res.status(500).send('Error al obtener ingresos.');
            return;
        }

        conexion.query(getGastos, (errorGastos, resultadoGastos) => {
            if (errorGastos) {
                console.error('Error al obtener gastos:', errorGastos);
                res.status(500).send('Error al obtener gastos.');
                return;
            }

            conexion.query(getMesMayorIngreso, (errorMesIngreso, resultadoMesIngreso) => {
                if (errorMesIngreso) {
                    console.error('Error al obtener el mes con mayor ingreso:', errorMesIngreso);
                    res.status(500).send('Error al obtener el mes con mayor ingreso.');
                    return;
                }

                conexion.query(getMesMayorGasto, (errorMesGasto, resultadoMesGasto) => {
                    if (errorMesGasto) {
                        console.error('Error al obtener el mes con mayor gasto:', errorMesGasto);
                        res.status(500).send('Error al obtener el mes con mayor gasto.');
                        return;
                    }

                    conexion.query(getCategoriasIngresos, (errorCategoriasIngresos, resultadoCategoriasIngresos) => {
                        if (errorCategoriasIngresos) {
                            console.error('Error al obtener las categorías de ingresos:', errorCategoriasIngresos);
                            res.status(500).send('Error al obtener las categorías de ingresos.');
                            return;
                        }

                        conexion.query(getCategoriasGastos, (errorCategoriasGastos, resultadoCategoriasGastos) => {
                            if (errorCategoriasGastos) {
                                console.error('Error al obtener las categorías de gastos:', errorCategoriasGastos);
                                res.status(500).send('Error al obtener las categorías de gastos.');
                                return;
                            }

                            conexion.query(getFechasIngresos, (errorFechasIngresos, resultadoFechasIngresos) => {
                                if (errorFechasIngresos) {
                                    console.error('Error al obtener las fechas de ingresos:', errorFechasIngresos);
                                    res.status(500).send('Error al obtener las fechas de ingresos.');
                                    return;
                                }

                                conexion.query(getFechasGastos, (errorFechasGastos, resultadoFechasGastos) => {
                                    if (errorFechasGastos) {
                                        console.error('Error al obtener las fechas de gastos:', errorFechasGastos);
                                        res.status(500).send('Error al obtener las fechas de gastos.');
                                        return;
                                    }

                                    const categoriasUtilizadas = [...new Set([...resultadoCategoriasIngresos.map(cat => cat.nombre_catG), ...resultadoCategoriasGastos.map(cat => cat.nombre_catG)])];

                                    const ingresosPorCategoria = {};
                                    resultadoIngresos.forEach(ingreso => {
                                        ingresosPorCategoria[ingreso.nombre_catG] = ingreso.total_ingreso;
                                    });

                                    const gastosPorCategoria = {};
                                    resultadoGastos.forEach(gasto => {
                                        gastosPorCategoria[gasto.nombre_catG] = gasto.total_gasto;
                                    });

                                    const balancePorCategoria = {};
                                    categoriasUtilizadas.forEach(categoria => {
                                        const ingreso = ingresosPorCategoria[categoria] || 0;
                                        const gasto = gastosPorCategoria[categoria] || 0;
                                        balancePorCategoria[categoria] = ingreso - gasto;
                                    });

                                    const totalOperaciones = resultadoIngresos.length + resultadoGastos.length;

                                    const fechasOperaciones = [...new Set([...resultadoFechasIngresos.map(fecha => fecha.fecha), ...resultadoFechasGastos.map(fecha => fecha.fecha)])];
                                    
                                    const ingresosPorMes = {};
                                    resultadoFechasIngresos.forEach(fecha => {
                                        ingresosPorMes[fecha.fecha] = fecha.total_ingreso;
                                    });

                                    const gastosPorMes = {};
                                    resultadoFechasGastos.forEach(fecha => {
                                        gastosPorMes[fecha.fecha] = fecha.total_gasto;
                                    });

                                    const balancePorMes = {};
                                    fechasOperaciones.forEach(fecha => {
                                        const ingreso = ingresosPorMes[fecha] || 0;
                                        const gasto = gastosPorMes[fecha] || 0;
                                        balancePorMes[fecha] = ingreso - gasto;
                                    });

                                    res.render("reporte", { 
                                        userId: userId,
                                        categoriasUtilizadas: categoriasUtilizadas,
                                        ingresosPorCategoria: ingresosPorCategoria,
                                        gastosPorCategoria: gastosPorCategoria,
                                        balancePorCategoria: balancePorCategoria,
                                        totalOperaciones: totalOperaciones,
                                        fechasOperaciones: fechasOperaciones,
                                        ingresosPorMes: ingresosPorMes,
                                        gastosPorMes: gastosPorMes,
                                        balancePorMes: balancePorMes,
                                        categoriaMayorIngreso: resultadoIngresos.length > 0 ? resultadoIngresos[0].nombre_catG : "No existen ingresos, por favor inserte al menos uno",
                                        montoMayorIngreso: resultadoIngresos.length > 0 ? resultadoIngresos[0].total_ingreso : "0",
                                        categoriaMayorGasto: resultadoGastos.length > 0 ? resultadoGastos[0].nombre_catG : "No existen gastos, por favor inserte al menos uno",
                                        montoMayorGasto: resultadoGastos.length > 0 ? resultadoGastos[0].total_gasto : "0",
                                        mesMayorIngreso: resultadoMesIngreso.length > 0 ? resultadoMesIngreso[0].mes : "No existen ingresos, por favor inserte al menos uno",
                                        montoMesMayorIngreso: resultadoMesIngreso.length > 0 ? resultadoMesIngreso[0].total_ingreso : "0",
                                        mesMayorGasto: resultadoMesGasto.length > 0 ? resultadoMesGasto[0].mes : "No existen gastos, por favor inserte al menos uno",
                                        montoMesMayorGasto: resultadoMesGasto.length > 0 ? resultadoMesGasto[0].total_gasto : "0"
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});



app.post('/update-operation', (req, res) => {
    const id = req.params.id;
    const { descripcion, monto, tipo, categoria, fecha, tipoGI } = req.body;

    let query = '';
    let values = [];

    if(tipo === 'Gasto'){
        query = 'UPDATE gastos SET cant_g = ?, fecha_g = ?, desc_g = ?, desc_tG = ?, nombre_catG = ? WHERE id_g = ?', [monto, fecha, categoria, tipoGI, descripcion, id];
        values = [monto, fecha, categoria, tipoGI, descripcion];
    }else{
        query = "UPDATE ingreso SET cant_in = ?, fecha_in = ?, desc_in = ?, desc_tI = ?, nombre_catG = ? WHERE id_in = ? ";
          values = [monto, fecha, categoria, tipoGI, descripcion];

    }

    if(query !== ''){
        conexion.query(query, values, (error, results) =>{
            if(error){
                console.error("Error al actualizar la operación", error);
                res.json({success : false, error});
            }
        })
    }else{
        actualizarBalance((error) =>{
            if(error){
                console.error("Error al actualizar el balance: ", error);
                res.json({success : false, error});
            }else{
                res.json({success:true, tipo,monto});
            }
        })
    }
});




app.get('/eliminar-operacion/:id', (req, res) => {
    const id = req.params.id;

    // Verificar si la operación es un gasto
    conexion.query('SELECT * FROM gastos WHERE id_g = ?', [id], (error, gastoResults) => {
        if (error) {
            console.error('Error al verificar el gasto:', error);
            return res.status(500).send('Error del servidor');
        }

        if (gastoResults.length > 0) {
            conexion.query('DELETE FROM gastos WHERE id_g = ?', [id], (error) => {
                if (error) {
                    console.error('Error al eliminar el gasto:', error);
                    return res.status(500).send('Error del servidor');
                }
                return res.redirect('/balance');
            });
        } else {
            // Verificar si la operación es un ingreso
            conexion.query('SELECT * FROM ingreso WHERE id_in = ?', [id], (error, ingresoResults) => {
                if (error) {
                    console.error('Error al verificar el ingreso:', error);
                    return res.status(500).send('Error del servidor');
                }

                if (ingresoResults.length > 0) {
                    conexion.query('DELETE FROM ingreso WHERE id_in = ?', [id], (error) => {
                        if (error) {
                            console.error('Error al eliminar el ingreso:', error);
                            return res.status(500).send('Error del servidor');
                        }
                        return res.redirect('/balance');
                    });
                } else {
                    return res.status(404).send('Operación no encontrada.');
                }
            });
        }
    });
});






//INGRESAR NUEVO USUARIO
app.post("/validar", function (req, res) {
    const { nombreU, email, contra } = req.body;

    const registrar = 'INSERT INTO usuario (nombre_u, contra_u, correo_u) VALUES (?, ?, ?)';

    conexion.query(registrar, [nombreU, contra, email], (error, results) => {
        if (error) {
            throw(error);
        } else {
            const userId = results.insertId;
            res.redirect(`/balance?userId=${userId}`);
        }
    });
});

//VALIDAR LA EXISTENCIA DEL USUARIO
app.post("/login", function(req,res){
    const { usuario, contraseña } = req.body;

    const verificarUsuario = 'SELECT id_u FROM usuario WHERE nombre_u = ? AND contra_u = ? ';

    conexion.query(verificarUsuario, [usuario, contraseña], (error, resultados) => {
        if(error){
            throw(error);
        }else if (resultados.length > 0) {
            const userId = resultados[0].id_u;
            res.redirect(`/balance?userId=${userId}`);
        } else {
            res.status(401).send("NO SE ENCONTRO EL USUARIO :(");
        }
    });
});

 //GUARDAR LA CATEGROIRA EN LA BASE DE DATOS
app.post("/guardar_categoria", function(req, res){
    const categoryName = req.body.categoryName;

    const insertarCategoria = 'INSERT INTO cat_gasto (nombre_catG) VALUES (?)';

    conexion.query(insertarCategoria, [categoryName], (error, resultados) =>{
        if(error){
            throw error;
        } else{
            const categoryId = resultados.insertId;
            res.json({ id_catG: categoryId, categoryName });
        }
    });
});


app.post('/guardar_operacion', (req, res) => {
    const { descripcion, monto, tipo, categoria, fecha, tipoGI } = req.body;

    let query = '';
    let values = [];

    if (tipo === 'Gasto') {
        query = 'INSERT INTO gastos (cant_g, fecha_g, nombre_catG, desc_tG, desc_g) VALUES (?, ?, ?, ?, ?)';
        values = [monto, fecha, categoria, tipoGI, descripcion];
    } else {
        query = 'INSERT INTO ingreso (cant_in, desc_in, fecha_in, desc_tI, nombre_catG) VALUES (?, ?, ?, ?, ?)';
        values = [monto, descripcion, fecha, tipoGI, categoria];
    }

    if (query !== '') {
        conexion.query(query, values, (error, results) => {
            if (error) {
                console.error('Error al guardar la operación en la base de datos:', error);
                res.json({ success: false, error });
            } else {
                // Actualizar el balance
                actualizarBalance((error) => {
                    if (error) {
                        console.error('Error al actualizar el balance:', error);
                        res.json({ success: false, error });
                    } else {
                        res.json({ success: true, tipo, monto });
                    }
                });
            }
        });
    } else {
        res.json({ success: false, error: 'Tipo de operación no válido.' });
    }
});


function actualizarBalance(callback) {
    const getIngresos = 'SELECT SUM(cant_in) AS totalIngresos FROM ingreso';
    const getGastos = 'SELECT SUM(cant_g) AS totalGastos FROM gastos';

    conexion.query(getIngresos, (errorIngresos, resultadosIngresos) => {
        if (errorIngresos) {
            callback(errorIngresos);
            return;
        }

        const totalIngresos = resultadosIngresos[0].totalIngresos || 0;

        conexion.query(getGastos, (errorGastos, resultadosGastos) => {
            if (errorGastos) {
                callback(errorGastos);
                return;
            }

            const totalGastos = resultadosGastos[0].totalGastos || 0;
            const resultado_b = totalIngresos - totalGastos;

            // Insertar o actualizar el balance en la tabla de balance
            const actualizarBalance = 'UPDATE balance SET resultado_b = ?, cant_in = ?, cant_g = ? WHERE id_b = 4';
            conexion.query(actualizarBalance, [resultado_b, totalIngresos, totalGastos], (error, results) => {
                if (error) {
                    callback(error);
                } else {
                    callback(null);
                }
            });
        });
    });
}


const tipo_ingreso = 'SELECT desc_tI FROM tipo_ingreso ';
conexion.query(tipo_ingreso, (error, resultados) => {
    if (error) {
        console.error('Error al obtener tipos de ingresos:', error);
    } else {
        app.locals.tiposIngresos = resultados.map(resultado => resultado.desc_tI);
    }
});

// Obtener tipos de gastos disponibles
const tipo_gasto = 'SELECT desc_tG FROM tipo_gasto';
conexion.query(tipo_gasto, (error, resultados) => {
    if (error) {
        console.error('Error al obtener tipos de gastos:', error);
    } else {
        app.locals.tiposGastos = resultados.map(resultado => resultado.desc_tG);
    }
});



//CAMBIAR DE NOMBRE UNA CATEGORIA Y PASRLA A LA BASE DE DATOS
app.post("/actualizar_categoria", function(req, res){
    const { oldCategoryName, newCategoryName } = req.body;

    const actualizarCategoria = 'UPDATE cat_gasto SET nombre_catG = ? WHERE nombre_catG = ?';

    conexion.query(actualizarCategoria, [newCategoryName, oldCategoryName], (error, resultados) => {
        if(error){
            console.error('Error al actualizar la categoría:', error);
            res.json({ success: false, error });
        } else{
            res.json({ success: true });
        }
    });
});


//ELIMINAR LA CATEGORIA TANTO DEL FRONT COMO DEL BACK
app.post("/eliminar_categoria", function(req, res){
    const categoryName = req.body.categoryName;

    const eliminarCategoria = 'DELETE FROM cat_gasto WHERE nombre_catG = ?';

    conexion.query(eliminarCategoria, [categoryName], (error, resultados) => {
        if (error) {
            console.error('Error al eliminar la categoría:', error);
            res.json({ success: false, error });
        } else {
            res.json({ success: true });
        }
    });
});

app.get("/obtener_categorias", function(req, res){
    const obtenerCategorias = 'SELECT nombre_catG FROM cat_gasto';

    conexion.query(obtenerCategorias, (error, resultados) => {
        if (error) {
            console.error('Error al obtener las categorías:', error);
            res.status(500).send('Error al obtener las categorías.');
        } else {
            const categorias = resultados.map(resultado => resultado.nombre_catG);
            res.json(categorias);
        }
    });
});


//CONSULTA DE FECHA
app.post("/fetch_data_by_category", function(req, res){
    const categoria = req.body.category;

    const query = `
        SELECT * FROM gastos WHERE nombre_catG = ? 
        UNION 
        SELECT * FROM ingreso WHERE nombre_catG = ?
    `;

    conexion.query(query, [categoria, categoria], (error, resultados) => {
        if (error) {
            console.error('Error al obtener los datos para la categoría:', error);
            res.status(500).send('Error al obtener los datos para la categoría.');
        } else {
            // Convertir las fechas al formato deseado
            resultados.forEach(row => {
                if (row.fecha_g) {
                    row.fecha_g = formatDate(row.fecha_g);
                }
                if (row.fecha_in) {
                    row.fecha_in = formatDate(row.fecha_in);
                }
            });

            res.render("balance", { ingresos: [], gastos: resultados });
        }
    });
});


app.post("/fetch_data_from_date", function(req, res){
    const fromDate = req.body.fromDate;
    let sql = 'SELECT * FROM gastos WHERE fecha_g >= ? UNION SELECT * FROM ingreso WHERE fecha_in >= ?';

    conexion.query(sql, [fromDate, fromDate], (err, results) => {
        if (err) throw err;

        // Convertir las fechas al formato deseado
        results.forEach(row => {
            if (row.fecha_g) {
                row.fecha_g = formatDate(row.fecha_g);
            }
            if (row.fecha_in) {
                row.fecha_in = formatDate(row.fecha_in);
            }
        });

        let ingresos = [];
        let gastos = [];

        // Filtrar ingresos y gastos
        ingresos = results.filter(row => row.desc_in !== undefined);
        gastos = results.filter(row => row.desc_g !== undefined);

        // Renderizar la vista con los datos de ingresos y gastos
        res.render("balance", { ingresos, gastos });
    });
});

app.listen(3000, function(){
    console.log("El servidor es http://localhost:3000");
});