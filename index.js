var restify = require('restify');
var builder = require('botbuilder');
var server  = restify.createServer();
var logger  = require('winston');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const assistant = new AssistantV1({
    username: '17a55a12-414e-46ec-9966-71c139651f7b',
    password: 'wEQOJerSLqaI',
    url: 'https://gateway.watsonplatform.net/assistant/api',
    version: '2018-02-16',
  });

var conector = new builder.ChatConnector({
    appid:process.env.MICROSOFT_APP_ID,
    appPassword:process.env.MICROSOFT_APP_PASSWORD
})

server.post('/api/messages', conector.listen());
server.get('/api/messages', conector.listen());

var bot = new builder.UniversalBot(conector, function (session){
    logger.log('info', '[Chatbot] Mensagem enviada pelo usuario: ', session.message.text);
    const params = {
        input: { "text":session.message.text },
        //workspace_id: 'eaa92a38-ad1a-4bd4-af09-57ee9c67132d',
        workspace_id:'84b209ad-9d5c-4bc6-bece-e4ca24986d9d'
    };
    assistant.message(params, (err, response) => {
        if (err)  session.send(err);
        
        logger.log('info', '[Chatbot] resposta: ', response.output.text.toString());
        session.send(response.output.text);
    });
  
})

server.listen(process.env.port || process.env.PORT || 3979, function(){
    console.log('%s listening to %s',server.name, server.url)
})