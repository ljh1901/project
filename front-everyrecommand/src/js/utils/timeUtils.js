class utils{
    static formatTs(ts, type){
    // const [tsYm, tsHs] = ts.split('T);
    const tsFormat = ts.split('T');
    const tsYm = tsFormat[0];
    const tsHs = tsFormat[1].substring(0, 8)
    const tsYmHs = tsYm + '\t' + tsHs;

    if(type == 'tsYm'){
        return tsYm;
    }
    if(type == 'tsHs'){
        return tsHs;
    }
    return tsYmHs;
}

    static getToday(type){
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth()+1;
        const date = now.getDate();
        const hour = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2,'0');
        const seconds = String(now.getSeconds()).padStart(2,'0');
        
        switch (type) {
            case 'YYYYMMDD':
                return `${year}${month}${date}`;
            case 'MMDD':
                return month+date;
            case 'YYYYMM':
                return year+month;
        }
    }
}
export {utils};