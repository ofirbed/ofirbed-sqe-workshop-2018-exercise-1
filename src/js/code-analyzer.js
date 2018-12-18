import * as esprima from 'esprima';

var inputCode;


const functions = new Map();
functions.set('FunctionDeclaration',handleFunction);
functions.set('VariableDeclaration',handleVariableMultiDec);
functions.set('VariableDeclarator',handleVariableDec);
functions.set('ExpressionStatement',handleExprStatement);
functions.set('WhileStatement',handleWhile);
functions.set('BlockStatement',handleBlockStatement);
functions.set('IfStatement',handleIfStatement);
//functions.set('IfStatement',handleElseIfStatement);
functions.set('ReturnStatement',handleReturnStatement);
functions.set('ForStatement',handleForStatement);


var array =[];



function handleForStatement(parsedCode) {
    array.push(CreateForDataObject(parsedCode));
    analyze(parsedCode.body);

}

function handleReturnStatement(parsedCode) {
    array.push(CreateReturnDataObject(parsedCode));

}


function handleElseIfStatement(parsedCode) {
    array.push(CreateElseIfDataObject(parsedCode));
    analyze(parsedCode.consequent);
    if(parsedCode.alternate!==null) {
        if (parsedCode.alternate.type === 'IfStatement')
            handleElseIfStatement(parsedCode.alternate);
        else
            analyze(parsedCode.alternate);
    }

}

function handleIfStatement(parsedCode) {
    array.push(CreateIfDataObject(parsedCode));
    analyze(parsedCode.consequent);
    if(parsedCode.alternate!==undefined && parsedCode.alternate!==null) {
        if (parsedCode.alternate.type === 'IfStatement')
            handleElseIfStatement(parsedCode.alternate);
        else
            analyze(parsedCode.alternate);
    }


}

function handleBlockStatement(parsedCode){
    parsedCode.body.map(curr => analyze(curr));

}


function handleWhile(parsedCode){
    array.push(CreateWhileDataObject(parsedCode));
    analyze(parsedCode.body);

}




function handleExprStatement(parsedCode){
    array.push(CreateExprStatmentObject(parsedCode.expression));

}





function handleVariableDec(parsedCode) {
    array.push(CreateVarDecDataObject(parsedCode));

}


function handleVariableMultiDec(parsedCode) {
    parsedCode.declarations.map(curr => analyze(curr));

}


function handleFunction(parsedCode) {
    array.push(CreateFunctionDataObject(parsedCode));
    parsedCode.params.map(curr => array.push({line:1,type:'VariableDeclaration',name:curr.name}));

    analyze(parsedCode.body);

}

function startaAnalyze(a,b){
    inputCode=b;
    array=[];
    return analyze(a);
}

function analyze(parsedCode) {
    let func= functions.get(parsedCode.type);
    func(parsedCode);
    return array;


}




function getElementbyNumber(obj,col_number){
    switch (col_number) {
    case 1: return obj.line;
    case 2: return obj.type;
    case 3: return obj.name;
    case 4: return obj.condition;
    default: return obj.value;
    }
}

const parseCode = (codeToParse) => {
    inputCode = codeToParse;
    let parsedCode = esprima.parseScript(codeToParse,{loc: true, range: true});
    startaAnalyze(parsedCode.body[0],inputCode);
    return array;
};



function CreateFunctionDataObject(funcParsed) {
    var obj = {};
    obj.line = funcParsed.loc.start.line;
    obj.type = funcParsed.type;
    obj.name = funcParsed.id.name;
    return obj;
}

function CreateVarDecDataObject(VarDec) {
    var obj = {};
    obj.line = VarDec.id.loc.start.line;
    obj.type = VarDec.type;
    obj.name = VarDec.id.name;
    if(VarDec.init !== null) {
        let lRange = VarDec.init.range[0];
        let rRange = VarDec.init.range[1];
        obj.value = inputCode.substring(lRange, rRange);
    }
    return obj;
}

function CreateExprStatmentObject(exprS) {
    var obj = {};
    obj.line = exprS.loc.start.line;
    obj.type = exprS.type;
    obj.name = exprS.left.name;
    let lRange = exprS.right.range[0];
    let rRange = exprS.right.range[1];
    obj.value = inputCode.substring(lRange,rRange);
    return obj;
}

function CreateWhileDataObject(whileS) {
    var obj = {};
    obj.line = whileS.loc.start.line;
    obj.type = whileS.type;
    let lRange = whileS.test.range[0];
    let rRange = whileS.test.range[1];
    obj.condition = inputCode.substring(lRange,rRange);
    return obj;
}

function CreateIfDataObject(ifS) {
    var obj = {};
    obj.line = ifS.loc.start.line;
    obj.type = ifS.type;
    let lRange = ifS.test.range[0];
    let rRange = ifS.test.range[1];
    obj.condition = inputCode.substring(lRange,rRange);
    return obj;
}

function CreateElseIfDataObject(elseIfS) {
    var obj = {};
    obj.line = elseIfS.loc.start.line;
    obj.type = 'Else If Statement';
    let lRange = elseIfS.test.range[0];
    let rRange = elseIfS.test.range[1];
    obj.condition = inputCode.substring(lRange,rRange);
    return obj;
}

function CreateReturnDataObject(retS) {
    var obj = {};
    obj.line = retS.loc.start.line;
    obj.type = retS.type;
    let lRange = retS.argument.range[0];
    let rRange = retS.argument.range[1];
    obj.value = inputCode.substring(lRange,rRange);
    return obj;
}

function CreateForDataObject(ForS) {
    var obj = {};
    obj.line = ForS.loc.start.line;
    obj.type = ForS.type;
    let lRange = ForS.init.range[0];
    let rRange = ForS.update.range[1];
    obj.condition = inputCode.substring(lRange,rRange);
    return obj;
}





export {parseCode,CreateVarDecDataObject,CreateFunctionDataObject,getElementbyNumber,analyze,startaAnalyze};
