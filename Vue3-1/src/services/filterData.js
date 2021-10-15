let filters = (data, filter) => filter === 'All' ? true : filter.toLowerCase() === data.toLowerCase();

let transformDate = (date) => {
    var datearray = date.split("/");
    var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
    return newdate;
}

let filterDate = (date, filter) => {
    const today = new Date();
    const dataDate = new Date(transformDate(date));

    if (filter.toLowerCase() === 'All'.toLowerCase()) {
        return true;
    }
    if (filter.toLowerCase() === 'Today'.toLowerCase()) {
        if (today.getDate() === dataDate.getDate()) {
            return true;
        }
        return false;
    }
    if (filter.toLowerCase() === 'Yesterday'.toLowerCase()) {
        if (
            dataDate.getDate() === today.getDate() - 1
            && dataDate.getMonth() === today.getMonth()
            && dataDate.getFullYear() === today.getFullYear()
        ) {
            return true;
        }
        return false;
        
    }
    if (filter.toLowerCase() === 'Month to date'.toLowerCase()) {
        if (
            dataDate.getMonth() === today.getMonth() 
            && dataDate.getFullYear() === today.getFullYear()
        ) {
            return true;
        }
        return false;
    }
    if (filter.toLowerCase() === 'Last month'.toLowerCase()) {
        if (
            dataDate.getMonth() === today.getMonth() - 1 
            && dataDate.getFullYear() === today.getFullYear()
        ) {
            return true;
        }
        return false;
    }
    if (filter.toLowerCase() === 'Year to date'.toLowerCase()) {
        if (dataDate.getFullYear() === today.getFullYear()) {
            return true;
        }
        return false;
    }
    if (filter.toLowerCase() === 'Last year'.toLowerCase()) {
        if (dataDate.getFullYear() === today.getFullYear() - 1) {
            return true;
        }
        return false;
    }
    return false;
}

let filterData = (data , applyedFilters) => {
    let filteredData = data
        .filter(item => filters(item.form, applyedFilters.form))
        .filter(item => filters(item.form_type , applyedFilters.form_type))
        .filter(item => filters(item.recommendation , applyedFilters.recommendation))
        .filter(item => filters(item.status , applyedFilters.status))
        .filter(item => filterDate(item.date , applyedFilters.date));
    
    return filteredData;
}


export default filterData;