/*              RECUPERAÇÃO DE DADOS DE OBJETOS                                */
module.exports.recuperarObjetos = (application, request, response) =>
{
    const txconsulta = request.query.txconsulta === undefined ? '' : request.query.txconsulta;

    const adcionais =
            {
                limit: request.query.limit,
                offset: request.query.offset,
                txconsulta: '%' + txconsulta + '%'
            };

    const connection = application.config.dbConnection;
    const ObjetosDAO = new application.app.models.ObjetosDAO(connection);

    let callback = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro na recuperação de objetos: ', error);
        } else
        {
            response.send(JSON.stringify(
                    {
                        total: results.rowCount,
                        rows: results.rows
                    }
            ));
        }
    };

    ObjetosDAO.buscaIntervalo(adcionais, callback);
};

/*              RECUPERAÇÃO DE OBJETOS                             */
module.exports.administrar = (application, request, response) =>
{
    const connection = application.config.dbConnection;
    let TiposObjetosDAO = new application.app.models.TiposObjetosDAO(connection);

    let callback = (error, results) =>
    {
        if (error)
            response.send(error);
        else
        {
            let dados =
                    {
                        tiposObjetos: results.rows
                    };
            response.render('admin/objetos', {dados: dados});
        }
    }
    ;

    TiposObjetosDAO.buscarTodos(callback);
};
/*              CADASTRO DE OBJETOS                                */
module.exports.inserir = (application, request, response) =>
{
    let dados = request.body;
    const connection = application.config.dbConnection;
    let ObjetosDAO = new application.app.models.ObjetosDAO(connection);

    let callbackVerificacao = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro na verificação do objeto: ', error);
        } else
        {
            if (results.rowCount === 0)
                ObjetosDAO.inserir([dados.descricao, dados.ativo, dados.tipo_objeto], callbackInsercao);
            else
                response.send({status: 'alert', title: 'Erro!', msg: 'Objeto já existe no banco.'});
        }
    };

    let callbackInsercao = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro no cadastro de objeto: ', error);
        } else
            response.send({status: 'success', title: 'Sucesso!', msg: 'Objeto cadastrado com sucesso!'});
    };

    ObjetosDAO.buscar(dados.descricao, callbackVerificacao);
};
/*              ATUALIZAÇÃO DE OBJETOS                            */
module.exports.atualizar = (application, request, response) =>
{
    const dados = request.body;
    const connection = application.config.dbConnection;
    const ObjetosDAO = new application.app.models.ObjetosDAO(connection);

    const callback = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro ao atualizar objeto: ', error);
        } else
            response.send({status: 'success', title: 'Sucesso!', msg: 'Objeto ' + dados.descricao + ' atualizado com sucesso!'});
    };
    ObjetosDAO.atualizar([dados.id, dados.descricao, dados.ativo, dados.tipo_objeto], callback);
};