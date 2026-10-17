function formatTs(ts, type){
    // const [tsYm, tsHs] = ts.split('T);
    const tsFormat = ts.split('T');
    const tsYm = tsFormat[0];
    const tsHs = tsFormat[1].substring(0,(tsFormat[1].indexOf('Z')-1));
    const tsYmHs = tsYm + '\t' + tsHs;

    if(type == 'tsYm'){
        return tsYm;
    }
    if(type == 'tsHs'){
        return tsHs;
    }
    return tsYmHs;
}
export {formatTs};