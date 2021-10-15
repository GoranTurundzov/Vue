import formCall from './FormsJsonService';

let formTypes = async () => {
    let data = await formCall();
    let formNameArray = [];
    for (let form of data) {
        delete form.id;
        formNameArray.push(form);
    }
    return formNameArray;
}

export default formTypes;