let formatter = (data) => {
        
    for(let item of data) {
        item.form_type = item.form.form_type;
        item.form = item.form.name;
    }

    return data;
}

export default formatter;