const express = require('express');
const router = express.Router();
const ClienteController = require('../controller/ClientController');
const ServicesController = require('../controller/ServicesController');
const ControleController = require('../controller/ControleController');
const ServicosExecutadosController = require('../controller/ServicosExecutadoController');
const OsCOntroller = require('../controller/OsController');

//Rotas Cliente
router.get('/clientes', ClienteController.getAllClients); // Busca todos os CLientes
router.get('/clientes/pendentes', ClienteController.getPendingClients); // Busca Clientes Pendentes
router.get('/clientes/delete/:id', ClienteController.deleteClient); // Deleta Cliente
router.get('/clientes/update/:id/:nome/:telefone/:endereco', ClienteController.updateClient); // Atualiza os dados do CLiente
router.get('/clientes/add/:nome/:telefone/:endereco', ClienteController.insertCLients); // Adciona um novo Cliente

//Rotas Servicos 
router.get('/servicos', ServicesController.getServices);
router.get('/servicos/delete/:id', ServicesController.deleteService);
router.get(`/servicos/update/:id/:nome/:valor`, ServicesController.updateService);
router.get(`/servicos/add/:nome/:valor`, ServicesController.insertService);

//Rotas de Controle
router.get("/controle", ControleController.getControle);
router.get('/controle/porcliente/:id_cliente/:dataInicio/:dataFim', ControleController.getControlePorCliente);
router.get('/controle/pornotaPendentes/:id_cliente/:dataInicio/:dataFim', ControleController.getControlePorNotaPendente);
router.post('/controle/add', ControleController.InsertControle);
router.get("/controle/totalcliente/:id", ControleController.TotalClientes);
router.get(`/controle/delete/:id`, ControleController.deleteControle);

// Rotas para Serviços Executados
router.get('/servicos-executados', ServicosExecutadosController.getServicosExecutados);
router.post('/servicos-executados', ServicosExecutadosController.insertServicosExecutados);

//Rotas de OSs
router.get('/getpdfs/:id_cliente/:dataInicio/:dataFim', OsCOntroller.GeneratePdf);
router.post('/os/marcarPG', OsCOntroller.UpdateOsPg);


module.exports = router;