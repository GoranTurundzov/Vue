let formCall = async () => {
    let call = await fetch('./forms.json');
    let data = await call.json();
    return data;   
}

export default formCall;